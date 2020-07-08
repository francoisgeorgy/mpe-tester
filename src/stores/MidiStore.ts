import {decorate, observable} from "mobx";
import {MIDI_VOICE_CONTROL_CHANGE, OutMessage} from "../utils/midi";

// import {hs} from "../utils";

/*
    Notes: the state of the connection (closed, open) is not tracked (observed).
*/


// export interface PortListener {
//     consume: (message: any) => void
// }

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
    // subscribers: InterfaceSubscriber[];     // called when an input is set in use
    listeners: PortListener[] = [];

    constructor() {
        // console.log("MidiStore constructor");
        // this.rootStore = rootStore;
        // this.interface = null;
        // this.inputs = [];     //TODO: create array instead
        // this.outputs = [];
        this.onStateChange = this.onStateChange.bind(this);     // very important
        this.onMidiMessage = this.onMidiMessage.bind(this);     // very important
        this.requestMidi(); //.then(r => console.log(r));
    }

    autoSelect(name: RegExp) {

        //TODO: unselect if null?

        if (!name) return null;

        if (!this.inputInUseId) {
            for (let port of this.interface.inputs.values()) {
                if (port.name.match(name)) {
                    // console.log(`autoSelect input ${port.name} ${port.id}`);
                    this.useInput(port.id);
                    break;
                }
            }
        }

        if (!this.outputInUseId) {
            for (let port of this.interface.outputs.values()) {
                if (port.name.match(name)) {
                    // console.log(`autoSelect output ${port.name} ${port.id}`);
                    this.useOutput(port.id);
                    break;
                }
            }
        }
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

        // console.log("midi.outputById", id);

        if (!id) return null;
        for (let port of this.interface.outputs.values()) {
            if (port.id === id) {
                return port;
            }
        }
        return null;
    }

    /*
        subscribe(callback: InterfaceSubscriber) {
            this.subscribers.push(callback);
        }
    */


    send(messages: OutMessage) {
        if (!this.outputInUse) return;
        this.outputInUse.send(messages);
    }

    sendCC(controller: number, value: number, channel: number): void {

        // const port = this.outputById(this.outputInUseId);
        // if (!port) return;
        if (!this.outputInUse) return;

        // console.log("midi.sendCC", controller, value, channel);

        //TODO: validate parameters

        this.outputInUse.send([MIDI_VOICE_CONTROL_CHANGE + channel, controller, value]);
    }

    // channel is 0..15
    sendNRPN(MSB: number, LSB: number, value: number, channel: number): void {

        // console.log("midi.sendNRPN");

        //TODO: validate parameters

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


    connectInput(id: string) {
        for (let input of this.interface.inputs.values()) {
            if (input.id === id) {
                // console.log("MidiStore.connectInput", id);  //, input.onmidimessage);
                // this.inputInUse = input;
                if (!input.onmidimessage) {
                    input.onmidimessage = this.onMidiMessage;
                } else {
                    // console.log("MidiStore.connectInput: already connected", id);
                }
            }
        }
        // console.log("connect", id, this.inputs[id].onmidimessage);
        // if (this.inputs[id].) {)
    }


    // callListeners() {
    //
    // }

    // use this method when you need to more than one listener
    addListener(callback: PortListener) {
        // console.log("MidiStore.addListener");
        // this.connect(id);
        this.listeners.push(callback);
        // console.log("addListener listeners:", this.inputs[id].listeners);
    }

    useInput(id: string) {
        // console.log("MidiStore.useInput", id);
        this.inputInUseId = id;
        this.connectInput(id);
    }

/*
    useInput(id: string, callback?: PortListener) {
        console.log("useInput", id);
        this.inputInUseId = id;

        if (callback) {
            this.addListener(id, callback);
        }
    }
*/

    useOutput(id: string, callback: any = null) {
        // console.log("MidiStore.useOutput", id);
        this.outputInUseId = id;
        for (let port of this.interface.outputs.values()) {
            if (port.id === id) {
                this.outputInUse = port;
            }
        }
        // if (this.outputs.hasOwnProperty(id)) {
        //     if (exclusive) {
        //         //TODO: remove all others inUse inputs
        //     }
        //     this.outputs[id].inUse = true;
        // }
    }

    updateInputsOutputs() {

        // console.log("MidiStore.updateInputsOutputs", Object.keys(this.inputs));

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
                // console.warn("remove", id);

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
                // inUse: false,
                // listeners: []   //FIXME: set listeners as optional
            };
        }

    }

    onMidiMessage(message: WebMidi.MIDIMessageEvent) {
        // console.log("onMidiMessage is bound to", this);
        // if (message instanceof WebMidi.MIDIMessageEvent) {

        // let bytes = message.data;       // type is Uint8Array
        // let channel = bytes[0] & 0x0F;  // MIDI channel
        // // let type = bytes[0] & 0xF0;     // MIDI event type
        // let port = message.currentTarget;

        // @ts-ignore
        // console.log(message.type + " data: [" + hs(bytes) + "] channel: " + channel + " source: " + port.name, "#messages");

        // console.log(this.inputs);

/*
        Object.entries(this.inputs).forEach(
            ([id, port]) => {
                // console.log("call all listeners for port ", id)
                if (port.listeners) {
                    Object.values(port.listeners).forEach(
                        (listener: PortListener) => {
                            // console.log("call listener for port ", id);
                            listener(message);
                        }
                    );
                }
            }
        );
*/

/*
        for (let input of this.interface.inputs.values()) {    // midi interface list of inputs
            // console.log("check", id, input.id, input.type, input.name, input.state, input.connection);
            if (input.id === this.inputInUseId) {
                for (let listener of this.listeners) {
                    // console.log("call listener for port ", id);
                    listener(message);
                }
                break;
            }
        }
*/
        for (let listener of this.listeners) {
            // console.log("call listener for port ", id);
            listener(message);
        }

        // Object.entries(this.inputs).forEach(
        //     ([id, port]) => {
        //         // console.log("call all listeners for port ", id)
        //         if (port.listeners) {
        //             Object.values(port.listeners).forEach(
        //                 (listener: PortListener) => {
        //                     // console.log("call listener for port ", id);
        //                     listener(message);
        //                 }
        //             );
        //         }
        //     }
        // );

    }

    onStateChange(event: WebMidi.MIDIConnectionEvent) {
        // console.log("onStateChange is bound to", this);
        // console.log(`onStateChange: "${event.type}" event for ${event.port.id} ${event.port.type} ${event.port.name}, connection status is ${event.port.connection}`, "#state");

        this.updateInputsOutputs();

/*
        const p : WebMidi.MIDIPort = event.port;
        if (p.state === "connected") {
            // Handle the interface
            if (p.type === "input") {
                if (!(p as WebMidi.MIDIInput).onmidimessage) {
                    (p as WebMidi.MIDIInput).onmidimessage = this.onMidiMessage;
                    console.log(`${p.name} input listener added`, this.inputs);
                    // this.inputs.push(p);
                }
            }
        } else if (p.state === "disconnected") {
            // Handle the disconnection
            if (p.type === "input") {
                if ((p as WebMidi.MIDIInput).onmidimessage) {
                    // @ts-ignore
                    (p as WebMidi.MIDIInput).onmidimessage = null;
                    console.log(`${p.name} input listener removed`);
                }
            }
        } else {
            console.log(`${p.type} ${p.name} is in an unknown state: ${p.state}`);
        }
*/
        // listInputsAndOutputs();
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
    // setConnection: action,
    // ins: computed   //,
    // outs: computed
});

export default new MidiStore();