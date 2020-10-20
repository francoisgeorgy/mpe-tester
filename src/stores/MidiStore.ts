import {decorate, observable} from "mobx";
import {
    MIDI_VOICE_CHANNEL_PRESSURE,
    MIDI_VOICE_CONTROL_CHANGE,
    MIDI_VOICE_NOTE_OFF,
    MIDI_VOICE_NOTE_ON,
    MIDI_VOICE_PITCH_BEND_CHANGE, MIDI_VOICE_POLYPHONIC_KEY_PRESSURE,
    OutMessage
} from "../utils/midi";
import {loadPreferences, savePreferences} from "../utils/preferences";

/*
    Notes: the state of the connection (closed, open) is not tracked (observed).
*/

// export interface PortListener {
//     consume: (message: any) => void
// }

export const PORT_INPUT = "input";
export const PORT_OUTPUT = "output";

type PortListener = (message: WebMidi.MIDIMessageEvent) => void;

export interface Port {
    id: string;
    name: string;
    connection: WebMidi.MIDIPortConnectionState;
    // type: MIDIPortType
    // inUse: boolean,             // true if a listener has been added
    // listeners?: PortListener[]      // callback called for each new MIDIMessageEvent
}

export interface Ports {
    [id: string]: Port
}

type InterfaceSubscriber = (info: any) => void;

class MidiStore {

    // private rootStore = null;   // used?
    interface : any = null;
    inputs: Ports = {};
    outputs: Ports = {};
    inputInUseId = "";
    outputInUseId = "";
    // inputInUse: WebMidi.MIDIInput = undefined;       // todo: really used?
    outputInUse: WebMidi.MIDIOutput | undefined;
    listeners: PortListener[] = [];

    constructor() {
        this.onStateChange = this.onStateChange.bind(this);     // very important
        this.onMidiMessage = this.onMidiMessage.bind(this);     // very important
        this.requestMidi(); //.then(r => console.log(r));
    }

    inputById(id: string): WebMidi.MIDIInput | null {
        if (!id) return null;
        for (let port of this.interface.inputs.values()) {
            if (port.id === id) {
                return port;
            }
        }
        return null;
    }

    outputById(id: string): WebMidi.MIDIOutput | null {
        if (!id) return null;
        for (let port of this.interface.outputs.values()) {
            if (port.id === id) {
                return port;
            }
        }
        return null;
    }

    send(messages: OutMessage) {
        if (!this.outputInUse) return;
        this.outputInUse.send(messages);
    }

    sendCC(controller: number, value: number, channel: number = 0): void {
        if (!this.outputInUse) return;
        this.outputInUse.send([
            MIDI_VOICE_CONTROL_CHANGE + channel,
            controller & 0x7f,
            value & 0x7f
        ]);
    }

    // channel is 0..15
    sendNRPN(MSB: number, LSB: number, value: number, channel: number = 0): void {
        // 1. select the NRPN
        this.sendCC(99, MSB, channel);
        this.sendCC(98, LSB, channel);

        // 2. set the NRPN value:
        this.sendCC( 6, 0, channel);        //TODO: get value MSB
        this.sendCC(38, value, channel);    //TODO: get value LSB

        // 3. si is recommended that the Null Function (RPN 7F,7F) should be sent immediately after a RPN or NRPN and its value are sent.
        this.sendCC(101, 127, channel);
        this.sendCC(100, 127, channel);
    }

    channelPressure(value: number, channel: number = 0): void {
        this.send([
            MIDI_VOICE_CHANNEL_PRESSURE + channel,
            value & 0x7f,
        ]);
    }

    polyPressure(note: number, value: number, channel: number = 0): void {
        this.send([
            MIDI_VOICE_POLYPHONIC_KEY_PRESSURE + channel,
            note & 0x7f,
            value & 0x7f,
        ]);
    }

    pitchBend(value: number, channel: number = 0): void {
        if (value < 0) value = value + 8192;
        const msb = (value & 0b0011111110000000) >> 7;
        const lsb = value & 0b0000000001111111;
        // return [
        //     MIDI_VOICE_PITCH_BEND_CHANGE + channel,
        //     lsb,
        //     msb
        // ];
        this.send([
            MIDI_VOICE_PITCH_BEND_CHANGE + channel,
            lsb,
            msb
        ]);
    }

    noteOn(note: number, velocity= 64, channel = 0) {
        this.send([
            MIDI_VOICE_NOTE_ON + channel,
            note & 0x7f,
            velocity & 0x7f
        ]);
    }

    noteOff(note: number, releaseVelocity = 64, channel = 0) {
        this.send([
            MIDI_VOICE_NOTE_OFF + channel,
            note & 0x7f,
            releaseVelocity & 0x7f
        ]);
    }

    connectInput(id: string) {
        for (let input of this.interface.inputs.values()) {
            if (input.id === id) {
                if (!input.onmidimessage) {
                    input.onmidimessage = this.onMidiMessage;
                } else {
                    // console.log("MidiStore.connectInput: already connected", id);
                }
            }
        }
    }

    // use this method when you need to more than one listener
    addListener(callback: PortListener) {
        this.listeners.push(callback);
    }

    useInput(id: string) {
        this.inputInUseId = id;
        this.connectInput(id);
    }

    useOutput(port: WebMidi.MIDIOutput, callback: any = null) {
        this.outputInUseId = port.id;
        for (let p of this.interface.outputs.values()) {
            if (p.id === port.id) {
                this.outputInUse = port;
                savePreferences({output_id: port.id});
            }
        }
    }

    autoConnectOutput = (port: WebMidi.MIDIOutput) => {
        if (!port) {
            return;
        }
        const s = loadPreferences();
        if (port.id === s.output_id) {
            this.useOutput(port);
        }
    };

    updateInputsOutputs() {

        if (!this.interface) return;

        //
        // INPUTS
        //

        // Check for inputs to remove from the existing array (because they are no longer being reported by the MIDI back-end).
        for (let id of Object.keys(this.inputs)) {  // our array of inputs
            let remove = true;
            for (let input of this.interface.inputs.values()) {    // midi interface list of inputs
                // console.log("check", id, input.id, input.type, input.name, input.state, input.connection);
                if (input.id === id) {
                    remove = false;
                    break;
                }
            }
            if (remove) {
                //TODO: remove listeners
                delete(this.inputs[id]);
            }
        }

        // Inputs to add
        for (let input of this.interface.inputs.values()) {
            if (this.inputs.hasOwnProperty(input.id)) {
                // console.log("MidiStore.updateInputsOutputs input already added", input.id, input.type, input.name, input.state, input.connection, this.inputs[input.id].connection);
                // update
                this.inputs[input.id].connection = input.connection;
                continue;
            }
            // console.warn("MidiStore.updateInputsOutputs add input", input.id, input.type, input.name, input.state, input.connection);
            // this.inputs[input.id] = input;
            this.inputs[input.id] = {
                id: input.id,
                name: input.name,
                connection: input.connection,
                // inUse: false,
                // listeners: []
            };

        }

        //
        // OUTPUTS
        //
        for (let id of Object.keys(this.outputs)) {  // our array of outputs
            let remove = true;
            for (let output of this.interface.outputs.values()) {    // midi interface list of outputs
                // console.log("check", id, output.id, output.type, output.name, output.state, output.connection);
                if (output.id === id) {
                    remove = false;
                    break;
                }
            }
            if (remove) {
                // console.warn("remove", id);
                delete(this.outputs[id]);
            }
        }

        // outputs to add
        for (let output of this.interface.outputs.values()) {
            if (this.outputs.hasOwnProperty(output.id)) {
                // console.log("MidiStore.updateInputsOutputs output already added", output.id, output.type, output.name, output.state, output.connection, this.outputs[output.id].connection);
                continue;
            }
            // console.warn("MidiStore.updateInputsOutputs add output", output.id, output.type, output.name, output.state, output.connection);
            this.outputs[output.id] = {
                id: output.id,
                name: output.name,
                connection: output.connection,
            };

            this.autoConnectOutput(output);
        }

    }

    onMidiMessage(message: WebMidi.MIDIMessageEvent) {
        for (let listener of this.listeners) {
            listener(message);
        }
    }

    onStateChange(event: WebMidi.MIDIConnectionEvent) {
        this.updateInputsOutputs();
    }

    async requestMidi() {
        // console.log("requestMidi");
        if (navigator.requestMIDIAccess) {
            // console.log("requestMIDIAccess");
            // navigator.requestMIDIAccess({ sysex: true }).then(this.onMIDISuccess, () => this.onMIDIFailure);
            try {
                const o = await navigator.requestMIDIAccess({sysex: true});
                this.onMIDISuccess(o);
                // console.log("requestMIDIAccess done");
            } catch (e) {
                console.warn("requestMIDIAccess denied", e);
            }
        } else {
            console.warn("ERROR: navigator.requestMIDIAccess not supported", "#state");
        }
    }

    onMIDISuccess(midiAccess: WebMidi.MIDIAccess) {
        // console.log("onMIDISuccess", midiAccess);
        this.interface = midiAccess;
        this.updateInputsOutputs();
        this.interface.onstatechange = this.onStateChange;
    }

    onMIDIFailure(msg: any) {
        // console.log("onMIDIFailure" + msg);
    }

}

decorate(MidiStore, {
    interface: observable,
    inputs: observable,
    outputs: observable,
    inputInUseId: observable,
    outputInUseId: observable
});

export default new MidiStore();