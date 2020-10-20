import {decorate, observable} from "mobx";
import {savePreferences} from "../utils/preferences";
import {
    MIDI_DEFAULT_NOTE, MIDI_DEFAULT_NOTE_NUMBER,
    MIDI_DEFAULT_OCTAVE,
    MIDI_DEFAULT_PRESSURE,
    MIDI_DEFAULT_TIMBRE,
    MIDI_MAX_NOTE_NUMBER
} from "../utils/midi";
import {noteNumber} from "../utils/midiMaths";

export const POLY_PRESS = "pp";
export const CHAN_PRESS = "cp";
export const CC11 = "cc11";

export type MIDINote = {
    note: number,
    octave: number
};

export type Drone = MIDINote & {
    playing: boolean
};

export interface ChannelProps {
    channel: number
}

export interface PressureProps {
    channel: number,
    note: number
}

export interface VoiceProps {
    voice: Voice
}

export type Voice = {
    channel: number,
    drone: Drone,
    pressure: number,
    timbre: number,
    bend: number
}

// App's main state
class StateStore {

    masterChannel = 0;
    voices: Voice[];
    nextAvailableChannel = 1;
    timbreCC = 74;
    bendSelect = "48";
    bendCustom = "";
    bendRange = 48;
    bendAutoReset = true;
    pressureController = CHAN_PRESS;
    // drones: MIDINote[];   // notes numbers

    nextInterval = 0;   // when adding drone notes, add with maj thirds

    constructor() {
        this.nextAvailableChannel = 1;
        this.voices = [];
        this.addVoice();
        // this.drones = [];
    } // constructor

    setBendRange(range: number) {
        this.bendRange = range;
    }

    setBendSelect(s: string) {
        this.bendSelect = s;
        if (s !== "custom") {
            const v: number = parseInt(s, 10);
            if (!isNaN(v)) {
                this.setBendRange(v);
            }
        }
        savePreferences({bend_select: s});
    }

    setBendCustom(s: string) {
        this.bendCustom = s;
        if (s) {
            const v: number = parseInt(s, 10);
            if (!isNaN(v)) {
                this.setBendRange(v);
                savePreferences({bend_custom: s});
            }
        }
    }

    // setBendRange(range: number) {
    //     this.bendRange = range;
    // }

    setTimbreCC(cc: number) {
        this.timbreCC = cc;
        savePreferences({timbre_cc: cc});
    }

    setPressureController(ctrl: string): void {
        this.pressureController = ctrl;
        savePreferences({z_cc_type: ctrl});
    }

    setMasterChannel(channel: number): void {
        if (channel === this.masterChannel) return;
        this.masterChannel = channel;
        let start = channel === 0 ? 1 : 14;
        let inc = channel === 0 ? 1 : -1;
        this.voices.forEach((voice, i) => {
            voice.channel = start;
            start += inc;
            if (channel === 0) {
                if (start > 15) start = 1;
            } else {
                if (start < 0) start = 14;
            }
        });
    }

    resetBend() {
        console.log("resetBend");
        this.voices.forEach((voice, i) => {
            voice.bend = 0;
        });
    }

    toggleBendAutoReset() {
        console.log("toggleBendAutoReset");
        this.bendAutoReset = !this.bendAutoReset;
        if (this.bendAutoReset) this.resetBend();
    }

    incChannel(): void {
        const c = this.nextAvailableChannel;
        if (this.masterChannel === 0) {
            this.nextAvailableChannel = c === 15 ? 1 : (c + 1);
        } else {
            this.nextAvailableChannel = c === 0 ? 14 : (c - 1);
        }
    }

    getDefaultDroneNote(): Drone {
        if (!this.voices || this.voices.length === 0) {
            return {
                note: MIDI_DEFAULT_NOTE,
                octave: MIDI_DEFAULT_OCTAVE,
                playing: false
            };
        } else {

            // intervals in thirds: 4 --> 3 --> 5 --> 4 --> 3 ...
            switch (this.nextInterval) {
                case 0 : this.nextInterval = 4; break;
                case 4 : this.nextInterval = 3; break;
                case 3 : this.nextInterval = 5; break;
                case 5 : this.nextInterval = 4; break;
            }

            const {note, octave} = this.voices[this.voices.length-1].drone;
            let t = noteNumber(note, octave) + this.nextInterval;
            if (t > MIDI_MAX_NOTE_NUMBER) {
                t = MIDI_DEFAULT_NOTE_NUMBER - 24;
            }

            return {
                note: t % 12,
                octave: Math.floor(t / 12) - 1,
                playing: false
            };
        }
    }

    addVoice(): void {
        this.voices.push({
            channel: this.nextAvailableChannel,
            drone: this.getDefaultDroneNote(),
            pressure: MIDI_DEFAULT_PRESSURE,
            timbre: MIDI_DEFAULT_TIMBRE,
            bend: 0
        });
        this.incChannel();
    }

/*
    get voiceAvailable() {
        return true;
    }
*/

    //-------------------------------------------------------------------------

} // class StateStore

decorate(StateStore, {
    masterChannel: observable,
    bendSelect: observable,
    bendCustom: observable,
    bendRange: observable,
    bendAutoReset: observable,
    timbreCC: observable,
    pressureController: observable,
    // drones: observable,
    voices: observable
    // voiceAvailable: computed
});

export default new StateStore();
