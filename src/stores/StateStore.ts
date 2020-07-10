import {computed, decorate, observable} from "mobx";

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

export interface VoiceProps {
    voice: Voice
}

export type Voice = {
    channel: number,
    drone: Drone
}

// App's main state
class StateStore {

    masterChannel = 0;
    voices: Voice[];
    nextAvailableChannel = 1;
    timbreCC = 74;
    bendRange = 48;
    pressureController = CHAN_PRESS;
    // drones: MIDINote[];   // notes numbers

    constructor() {
        this.nextAvailableChannel = 1;
        this.voices = [];
        this.addVoice();
        // this.drones = [];
    } // constructor

    setBendRange(range: number) {
        this.bendRange = range;
    }

    setTimbreCC(cc: number) {
        this.timbreCC = cc;
    }

    setPressureController(ctrl: string): void {
        this.pressureController = ctrl;
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
                note: 0,
                octave: 3,
                playing: false
            };
        } else {
            const {note, octave} = this.voices[this.voices.length-1].drone;
            if (octave >= 5) {
                return {note: note + 7, octave: 3, playing: false};
            } else {
                return {note, octave: octave + 1, playing: false};
            }
        }
    }

    addVoice(): void {
        this.voices.push({
            channel: this.nextAvailableChannel,
            drone: this.getDefaultDroneNote()
        });
        this.incChannel();
    }

    get voiceAvailable() {
        return true;
    }

    //-------------------------------------------------------------------------

} // class StateStore

decorate(StateStore, {
    masterChannel: observable,
    bendRange: observable,
    timbreCC: observable,
    pressureController: observable,
    // drones: observable,
    voices: observable,
    voiceAvailable: computed
});

export default new StateStore();
