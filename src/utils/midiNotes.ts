
// http://www.sengpielaudio.com/calculator-notenames.htm

// MIDI note numbers (midi files)
//
// Octave notation is given here in the international standard ISO system, formerly known as
// the ASA (Acoustical Society of America) or ANSI system. In this system, middle C (MIDI note number 60) is C4;
// octaves start with C, so the B just below (MIDI number 59) is B3.
// The lowest note of the normal modern piano is A0 (MIDI 21), though Boesendorfer Imperials go down to F0 or even C0.
// The highest note of the piano is C8 (MIDI 108).


export const MIDDLE_OCTAVE = 2;
export const MIDDLE_C = 36;     // C3 is better centered than C4 on the LinnStrument

export const NOTE_NAME_NO_OCTAVE = [    // index 0 must be 'C', like NOTE_NAME
    "C", // 0
    "C#", // 1
    "D", // 2
    "D#", // 3
    "E", // 4
    "F", // 5
    "F#", // 6
    "G", // 7
    "G#", // 8
    "A", // 9
    "A#", // 10
    "B", // 11
];

export const NOTE_NAME = [              // index 0 must be a 'C', like NOTE_NAME_NO_OCTAVE
    "C-1", // 0
    "C#-1", // 1
    "D-1", // 2
    "D#-1", // 3
    "E-1", // 4
    "F-1", // 5
    "F#-1", // 6
    "G-1", // 7
    "G#-1", // 8
    "A-1", // 9
    "A#-1", // 10
    "B-1", // 11
    "C0", // 12
    "C#0", // 13
    "D0", // 14
    "D#0", // 15
    "E0", // 16
    "F0", // 17
    "F#0", // 18
    "G0", // 19
    "G#0", // 20
    "A0", // 21
    "A#0", // 22
    "B0", // 23
    "C1", // 24
    "C#1", // 25
    "D1", // 26
    "D#1", // 27
    "E1", // 28
    "F1", // 29
    "F#1", // 30
    "G1", // 31
    "G#1", // 32
    "A1", // 33
    "A#1", // 34
    "B1", // 35
    "C2", // 36
    "C#2", // 37
    "D2", // 38
    "D#2", // 39
    "E2", // 40
    "F2", // 41
    "F#2", // 42
    "G2", // 43
    "G#2", // 44
    "A2", // 45
    "A#2", // 46
    "B2", // 47
    "C3", // 48
    "C#3", // 49
    "D3", // 50
    "D#3", // 51
    "E3", // 52
    "F3", // 53
    "F#3", // 54
    "G3", // 55
    "G#3", // 56
    "A3", // 57
    "A#3", // 58
    "B3", // 59
    "C4", // 60
    "C#4", // 61
    "D4", // 62
    "D#4", // 63
    "E4", // 64
    "F4", // 65
    "F#4", // 66
    "G4", // 67
    "G#4", // 68
    "A4", // 69
    "A#4", // 70
    "B4", // 71
    "C5", // 72
    "C#5", // 73
    "D5", // 74
    "D#5", // 75
    "E5", // 76
    "F5", // 77
    "F#5", // 78
    "G5", // 79
    "G#5", // 80
    "A5", // 81
    "A#5", // 82
    "B5", // 83
    "C6", // 84
    "C#6", // 85
    "D6", // 86
    "D#6", // 87
    "E6", // 88
    "F6", // 89
    "F#6", // 90
    "G6", // 91
    "G#6", // 92
    "A6", // 93
    "A#6", // 94
    "B6", // 95
    "C7", // 96
    "C#7", // 97
    "D7", // 98
    "D#7", // 99
    "E7", // 100
    "F7", // 101
    "F#7", // 102
    "G7", // 103
    "G#7", // 104
    "A7", // 105
    "A#7", // 106
    "B7", // 107
    "C8", // 108
    "C#8", // 109
    "D8", // 110
    "D#8", // 111
    "E8", // 112
    "F8", // 113
    "F#8", // 114
    "G8", // 115
    "G#8", // 116
    "A8", // 117
    "A#8", // 118
    "B8", // 119
    "C9", // 120
    "C#9", // 121
    "D9", // 122
    "D#9", // 123
    "E9", // 124
    "F9", // 125
    "F#9", // 126
    "G9" // 127
];


export function octave(note: number): number {
    return Math.floor(note / 12);
}

export function isAccidental(note: number): boolean {
    switch (note % 12) {
        case 1:
        case 3:
        case 6:
        case 8:
        case 10:
            return true;
        default:
            return false;
    }
}

/*
export function intervalName(semitones: number): string {
    switch (semitones) {
        case 0: return "1P";
        case 1: return "m2";
        case 2: return "M2";
        case 3: return "m3";
        case 4: return "M3";
        case 5: return "P4";
        case 6: return "d5";
        case 7: return "P5";
        case 8: return "m6";
        case 9: return "M6";
        case 10: return "m7";
        case 11: return "M7";
        case 12: return "P8";
        default: return "?";
    }
}
*/


export function intervalSemitones(interval: string): number {
    switch (interval) {
        case '1P': return 0;
        case '2m': return 1;
        case '2M': return 2;
        case '3m': return 3;
        case '3M': return 4;
        case '4P': return 5;
        case '5d': return 6;
        case '5P': return 7;
        case '6m': return 8;
        case '6M': return 9;
        case '7m': return 10;
        case '7M': return 11;
        case '8P': return 12;
        case '9m': return 13;
        case '9M': return 14;
        case '10m': return 15;
        case '10M': return 16;
        case '11P': return 17;
        case '12d': return 18;
        case '12P': return 19;
        case '13m': return 20;
        case '13M': return 21;
        case '14m': return 22;
        case '14M': return 23;
        case '15P': return 24;
        default: return 0;
    }
}

/*
function tuneFourth(col, row, col2, row2) {
    const dr = (row2 - row) * 5;    // tuning in fourth (5 semitones between each rows)
    const dc = col2 - col;          // 1 semitone between each column
    return dr + dc;
}

const FIRST_NOTE = 18;

for (let row = 7; row>=0; row--) {
    let r = '';
    for (let col = 0; col<25; col++) {
        let d = FIRST_NOTE + tuneFourth(0, 0, col, row);
        //r += `  ${col}.${row} ${d.toString().padStart(2)} ${NOTE_NAME[d].padEnd(4)}`
        r += `  ${d.toString().padStart(2)} ${NOTE_NAME[d].padEnd(4)}`
    }
    console.log(r);
}
*/

export function chordTypeShort(chordType: string): string {
    if (!chordType) return chordType;
    switch (chordType.toLowerCase()) {
        case "major": return "maj.";
        case "minor": return "min.";
        case "diminished": return "dim.";
        default: return chordType;
    }
}

