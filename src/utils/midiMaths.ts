import {NOTE_NAME} from "./midiNotes";

const ROOTS = [
    0,  12,  24,
    36,  48,  60,
    72,  84,  96,
    108, 120
];

/**
 * C = 0
 * @param note with C=0
 * @param octave starts at -1
 */
export function noteNumber(note: number, octave: number) {
    console.log(`noteNumber(${note}, ${octave}) = ${note + (octave + 1) * 12}`);
    return note + (octave + 1) * 12;
}

export function num(noteName: string) {
    //TODO: if no octave, add octave 4 (arbitrary choice based on the choice we made to have middle C = C4)
    return NOTE_NAME.indexOf(noteName);
}

export function roots(key = 0): number[] {
    return key % 12 ? ROOTS.map(r => r + (key % 12)).filter(n => n < 128) : ROOTS;
}

export function intervals(semitones: number, key = 0): number[] {
    return roots(key).map(n => (n + semitones) % 132).filter(n => n < 128);     // 132 is the next multiple of 12 after 128
}

// returns true if note is a root in key key
export function isRoot(note: number, key = 0): boolean {
    return ((note - key) % 12) === 0;
}

// returns true if note is interval interval in key key
export function isInterval(note: number, interval: number, key = 0): boolean {
    return !isRoot(note - interval, key)
}

export function interval(note: number, key=0): number {
    // TODO: key
    return note % 12;
}

export function isDegree(note: number, degree: number, key = 0): boolean {
    // TODO: implement me
    // TODO: key
    return false;
}

export function degree(note: number, key=0): number {
    // TODO: implement me
    // TODO: key
    return -1;
}

export function names(notes: number[]): string[] {
    return [];
}
