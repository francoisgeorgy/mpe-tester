import React, {Fragment} from 'react';
import {inject, observer} from "mobx-react";
import {portById} from "../utils/midi";
import "./MidiPortsSelect.css";
import {PORT_INPUT} from "./Midi";
import ErrorBanner from "./ErrorBanner";
import {detect} from "detect-browser";

class MidiPortsSelect extends React.Component {

    componentDidMount() {

        //TODO: remove browser detection and simply check if the MIDI API is available

        const browser = detect();

        if (browser) {
            switch (browser && browser.name) {
                case "chrome":
                    break;
                case "firefox":
                case "edge":
                default:
                    // console.warn("unsupported browser");
                    this.props.state.error = 2;
            }
        }

    }

    selectInputPort = (e) => {
        const port_id = e.target.value;
        // if (global.dev) console.log(`selectInputPort`, port_id);
        this.props.state.disconnectAllInputPorts();
        if (port_id) {
            this.props.state.connectPort(portById(port_id), this.props.messageType, this.props.onMidiInputEvent);
        }
        this.props.state.error = 0;
    };

    render() {

        const S = this.props.state;
        const ports = this.props.state.midi.ports;

        const midi_ok = S.hasInputEnabled();

        if (ports) {

            let selected_input = '';
            for (let [id, port] of Object.entries(ports)) {
                if (!selected_input && port && port.enabled && port.type === PORT_INPUT) selected_input = id;
            }

            return (
                <Fragment>
                    <ErrorBanner />
                    <div className={`ports-row ${midi_ok?'midi-ok':'midi-ko'}`}>
                        <div>
                            <span>MIDI input:</span>
                            <select onChange={this.selectInputPort} value={selected_input}>
                                <option value="">Select MIDI device...</option>
                            {
                                Object.keys(ports).map(port_id => {
                                    const port = ports[port_id];
                                    if (port && port.type === PORT_INPUT) {
                                        return <option key={port_id} value={port_id}>{port.name}</option>
                                    } else {
                                        return null;
                                    }
                                })
                            }
                            </select>
                        </div>
                    </div>
                </Fragment>
            );
        } else {
            // if (global.dev) console.log("Ports: this.props.state.midi.ports is null");
            return null;
        }
    }

}

export default inject('state')(observer(MidiPortsSelect));
