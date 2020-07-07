import React, {Component, Fragment} from 'react';
import {state} from "./state/State";
import {Provider} from "mobx-react";
import {produce} from "immer";
import Midi from "./components/Midi";
import MidiPortsSelect from "./components/MidiPortsSelect";
import {
    savePreferences,
} from "./utils/preferences";
import './App.css';

class App extends Component {

    state = {
        bend_range: 48,
        bend_select: "48",
        bend_custom: "",
        master_channel: "1"
    };

    setBendRange = (e) => {
        const v = typeof e === "string" ? e : e.target.value;
        const n = v === "custom" ? parseInt(this.state.bend_custom, 10) : parseInt(v, 10);
        this.setState(produce(
            draft => {
                draft.bend_select = v;
                if (!isNaN(n)) {
                    // console.log("setBendRange invalid range", v, this.state.bend_custom);
                // } else {
                    draft.bend_range = n;
                }
            }
        ));
        savePreferences({bend_select: v});
        if (v === "custom") {
            if (!isNaN(n)) {
                savePreferences({bend_custom: n});
            }
        }
    };

    setBendCustom = (e) => {
        const v = e.target.value;
        const n = parseInt(v, 10);
        this.setState(produce(
            draft => {
                draft.bend_custom = v;
                if (isNaN(n)) {
                    // console.log("setBendCustom invalid range", v);
                } else {
                    draft.bend_range = n;
                }
            }
        ));
        savePreferences({bend_custom: v});
    };

    setMasterChannel = (e) => {
        this.setState({master_channel: e.target.value});
    };

    getBendInSemitones = (pitchBend) => {

        // min:        0
        // center:  8192
        // max:    16383

        // To map [min, max] to [-1, 1], while ensuring center 8192 is exactly 0,
        // we need to divide by different values depending on whether the pitch
        // bend is up or down, as up has 1 less possible value.

        const divider = pitchBend <= 8192 ? 8192 : (8192 - 1);
        const factor = (pitchBend - 8192) / divider;
        return factor * this.state.bend_range;
    };

/*
    componentDidMount() {
        const s = loadPreferences();
        //if (s.bend_range) this.setBendRange(s.bend_range.toString(10));
        this.setState({
            bend_select: s.bend_select,
            bend_custom: s.bend_custom,
            y_cc: s.y_cc,
            z_cc_type: s.z_cc_type
        });
        this.setBendRange(s.bend_select);
    }
*/

    render() {

        // const testBendSemis = this.getBendInSemitones(this.state.bend_test).toFixed(1);
        // const testBendOctaves = (testBendSemis / 12).toFixed(1);

/*
        let bend_range_invalid = false;
        if (this.state.bend_range === "custom") {
            if (isNaN(parseInt(this.state.bend_custom, 10))) {
                console.log("invalid bend range", this.state.bend_custom);
                bend_range_invalid = true;
            }
        }
*/

        return (
            <Provider state={state}>
                <div className={"warning-alpha"}>
                    Application under development. This is an alpha version.
                </div>
                <div className="app">
                    <Midi messageType={"midimessage"} onMidiInputEvent={this.handleMidiInputEvent}/>

                    <div className="header">
                        <MidiPortsSelect messageType={"midimessage"} onMidiInputEvent={this.handleMidiInputEvent} />
                        <div className="space-right">
                            <label>Pitch bend range:</label>
                            <select value={this.state.bend_select} onChange={this.setBendRange}>
                                <option value="2">+/- 2</option>
                                <option value="3">+/- 3</option>
                                <option value="12">+/- 12</option>
                                <option value="24">+/- 24</option>
                                <option value="48">+/- 48</option>
                                <option value="custom">custom</option>
                            </select>
                            {this.state.bend_select === "custom" &&
                            <input type="text" value={this.state.bend_custom} onChange={this.setBendCustom} size="3" className="space-right" />}
                        </div>
                        <div className="about">
                            <span className="bold">MPE Tester {process.env.REACT_APP_VERSION}</span>
                            &nbsp;by&nbsp;<a href="https://studiocode.dev" target="_blank" rel="noopener noreferrer">StudioCode.dev</a>
                        </div>
                    </div>

                    <div className="content row">
                    </div>

                </div>

            </Provider>
        );
    }

}

export default App;
