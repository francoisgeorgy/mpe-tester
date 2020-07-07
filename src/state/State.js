import {decorate, observable} from 'mobx';
import {PORT_INPUT, PORT_OUTPUT} from "../components/Midi";
import {portById} from "../utils/midi";
import {savePreferences} from "../utils/preferences";

class State {

    midi = {
        ports: {},
    };

    error = 0;  // 0 means no error

    addPort(port) {
        // eslint-disable-next-line
        if (this.midi.ports.hasOwnProperty(port.id) && this.midi.ports[port.id] !== null) {
            // already registered
            return false;
        }
        // if (global.dev) console.log('State.addPort', port.type, port.name, port.id);
        this.midi.ports[port.id] = {
            type: port.type,
            name: port.name,
            manufacturer: port.manufacturer,
            enabled: false
        };
        return true;
    }

    removePort(port_id) {
        // if (global.dev) console.log('State.removePort', port_id);
        this.midi.ports[port_id] = null;
    }

    removeAllPorts() {
        // if (global.dev) console.log('State.removeAllPorts');
        this.midi.ports = {};
    }

    enablePort(port_id) {
        if (this.midi.ports[port_id]) {
            this.midi.ports[port_id].enabled = true;
        }
    }

    disablePort(port_id) {
        if (this.midi.ports[port_id]) {
            this.midi.ports[port_id].enabled = false;
        }
    }

    /**
     *
     * @param port
     * @param messageType only used if port is input
     * @param onMidiInputEvent only used if port is input
     */
    connectPort(port, messageType = null, onMidiInputEvent = null) {
        // if (global.dev) console.log(`Midi.connectPort: ${port.type} ${port.id} ${port.name}`);
        if (port.type === PORT_INPUT) {
            if (port.hasListener(messageType, 'all', onMidiInputEvent)) {
                // if (global.dev) console.warn(`Midi.connectPort: ${port.id} ${port.name} : ${messageType} messages on all channels listener already connected`);
            } else {
                // if (global.dev) console.log(`Midi.connectPort: ${port.id} ${port.name} : add listener for ${messageType} messages on all channels`);
                port.addListener(messageType, 'all', onMidiInputEvent);
            }
        }
        // there is nothing else to do to "connect" an OUTPUT port.
        this.enablePort(port.id);
        savePreferences(port.type === PORT_INPUT ? {input_id: port.id} : {output_id: port.id});
    }

    disconnectPort(port, updatePreferences=false) {
        if (port) {     // port is probably already null
            // if (global.dev) console.log(`Midi.disconnectPort: ${port.type} ${port.id} ${port.name}`);
            if (port.type === PORT_INPUT) {
                if (port.removeListener) port.removeListener();
            }
            // there is nothing else to do to "connect" an OUTPUT port.
            this.disablePort(port.id);
            savePreferences(port.type === PORT_INPUT ? {input_id: null} : {output_id: null});
        }
    }

    disconnectAllInputPorts(updatePreferences=false) {
        for (const port_id of Object.keys(this.midi.ports)) {
            if (this.midi.ports[port_id].type === PORT_INPUT) {
                this.disconnectPort(portById(port_id));
            }
        }
    }

/*
    disconnectAllOutputPorts(updatePreferences=false) {
        for (const port_id of Object.keys(this.midi.ports)) {
            if (this.midi.ports[port_id].type === PORT_OUTPUT) {
                this.disconnectPort(portById(port_id));
            }
        }
    }
*/

    disconnectAllPorts(updatePreferences=false) {
        // if (global.dev) console.log('Midi.disconnectAllPorts');
        for (const port_id of Object.keys(this.midi.ports)) {
            this.disconnectPort(portById(port_id));
        }
    }

    /**
     * Returns true if at least one input is enabled
     */
    hasInputEnabled() {
        for (const port_id of Object.keys(this.midi.ports)) {
            if (this.midi.ports[port_id] && this.midi.ports[port_id].type === PORT_INPUT && this.midi.ports[port_id].enabled) return true;
        }
        return false;
    }

    /**
     * Returns true if at least one output is enabled
     */
    hasOutputEnabled() {
        for (const port_id of Object.keys(this.midi.ports)) {
            if (this.midi.ports[port_id] && this.midi.ports[port_id].type === PORT_OUTPUT && this.midi.ports[port_id].enabled) return true;
        }
        return false;
    }

    hasInputAndOutputEnabled() {
        return this.hasInputEnabled() && this.hasOutputEnabled();
    }

}

// https://mobx.js.org/best/decorators.html
decorate(State, {
    error: observable,
    midi: observable
});

export const state = new State();
