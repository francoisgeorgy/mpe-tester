
// Channel Voice Messages
import {nanoid} from "nanoid";

export const MIDI_VOICE_NOTE_ON = 0x90;
export const MIDI_VOICE_NOTE_OFF = 0x80;
export const MIDI_VOICE_POLYPHONIC_KEY_PRESSURE = 0xA0;
export const MIDI_VOICE_CONTROL_CHANGE = 0xB0;
export const MIDI_VOICE_PROGRAM_CHANGE = 0xC0;
export const MIDI_VOICE_CHANNEL_PRESSURE = 0xD0;
export const MIDI_VOICE_PITCH_BEND_CHANGE = 0xE0;

export const MIDI_MSG_TYPE: {[key: number]: string} = {
    [MIDI_VOICE_NOTE_ON]: "Note ON",
    [MIDI_VOICE_NOTE_OFF]: "Note Off",
    [MIDI_VOICE_POLYPHONIC_KEY_PRESSURE]: "Poly Key Press",
    [MIDI_VOICE_CONTROL_CHANGE]: "CC",
    [MIDI_VOICE_PROGRAM_CHANGE]: "PC",
    [MIDI_VOICE_CHANNEL_PRESSURE]: "Chan Press",
    [MIDI_VOICE_PITCH_BEND_CHANGE]: "Pitch Bend"
};

// Channel Mode Messages
// 'allsoundoff', // All Sound Off.
// 'resetallcontrollers', // Reset All Controllers.
// 'localcontroloff', // Local Control Off.
// 'localcontrolon', // Local Control On.
// 'allnotesoff', // All Notes Off.
// 'omnimodeoff', // Omni Mode Off.
// 'omnimodeon', // Omni Mode On.
// 'monomodeon', // Mono Mode On (Poly Off).
// 'polymodeon' // Poly Mode On (Mono Off)

export interface MidiMessage {
    id: string,
    channel: number,
    type: number,
    bytes: Uint8Array
    // time: number         //NOTE: timestamp is always 0 on Mac. (https://bugs.chromium.org/p/chromium/issues/detail?id=467442)
}

export function parseMidiMessage(message: WebMidi.MIDIMessageEvent): MidiMessage {

    //TODO: add a parameter to tell the method if we want a unique ID or not

    // console.log(message.timeStamp, message);

    let bytes = message.data;           // type is Uint8Array
    let channel = bytes[0] & 0x0F;      // MIDI channel
    let type = bytes[0] & 0xF0;         // MIDI event type
    // let port = message.currentTarget;

    return {
        id: nanoid(),   // mainly used for the React's key
        channel,
        type,
        bytes
        // time: message.timeStamp  NOTE: we could use performance.now() (https://developers.google.com/web/updates/2012/08/When-milliseconds-are-not-enough-performance-now)
    }
}

/*
    const m = [];
    m.push(CC(...))
    m.push({type:'CC', data1, data2, data3})
*/

export type OutMessage = number[];

export function CC(controller: number, value: number, channel: number): OutMessage {
    return [
        MIDI_VOICE_CONTROL_CHANGE + channel,
        controller,
        value
    ];
}

export function NRPM(MSB: number, LSB: number, value: number, channel: number): OutMessage {
    return [
        ...CC(99, MSB, channel),
        ...CC(99, MSB, channel),
        ...CC( 6, 0, channel),
        ...CC(38, value, channel),
        ...CC(101, 127, channel),
        ...CC(100, 127, channel)
    ];
}

export function pitchBend(value: number, channel: number): OutMessage {
    if (value < 0) value = value + 8192;
    const msb = (value & 0b0011111110000000) >> 7;
    const lsb = value & 0b0000000001111111;
    return [
        MIDI_VOICE_PITCH_BEND_CHANGE + channel,
        lsb,
        msb
    ];
}



