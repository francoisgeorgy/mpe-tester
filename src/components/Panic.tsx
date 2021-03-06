import {observer} from "mobx-react";
import {useStores} from "../hooks/useStores";
import React from "react";
import {MIDI_DEFAULT_NOTE_OFF_VELOCITY} from "../utils/midi";
import {noteNumber} from "../utils/midiMaths";
import {faStop} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export const Panic = observer(() => {

    function allNotesOff() {
        if (state.voices) {
            state.voices.forEach((voice, i) => {
                if (voice.drone) {
                    midi.noteOff(noteNumber(voice.drone.note, voice.drone.octave), MIDI_DEFAULT_NOTE_OFF_VELOCITY, voice.channel);
                    voice.drone.playing = false;
                }
            });
        }
    }

    function panic() {
        allNotesOff();
        for (let i=0; i<128; i++) {
            for (let ch=0; ch<16; ch++) {
                midi.noteOff(i, MIDI_DEFAULT_NOTE_OFF_VELOCITY, ch);
            }
        }
    }

    const { stateStore: state, midiStore: midi } = useStores();

    // if (!state.voices) return null;

    let playing = false;
    for (const v of state.voices) {
        if (v.drone.playing) {
            playing = true;
            break;
        }
    }

    return (
        <div className="panic">
            <button type="button" className={`${playing ? "playing" : ""}`} onClick={allNotesOff} title="Stop drone notes"><FontAwesomeIcon icon={faStop} /></button>
            <button type="button" onClick={panic} title="Send NOTE OFF messages for ALL NOTES on ALL CHANNELS.">PANIC</button>
        </div>
    );

});
