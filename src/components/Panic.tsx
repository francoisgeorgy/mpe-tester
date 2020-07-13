import {observer} from "mobx-react";
import {useStores} from "../hooks/useStores";
import React from "react";

export const Panic = observer(() => {

    function allNotesOff() {
        if (state.voices) {
            state.voices.forEach((voice, i) => {
                if (voice.drone) {
                    midi.noteOff(voice.drone.note, 127, voice.channel);
                    voice.drone.playing = false;
                }
            });
        }
    }

    function panic() {
        allNotesOff();
        for (let i=0; i<128; i++) {
            for (let ch=0; ch<16; ch++) {
                midi.noteOff(i, 127, ch);
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
            <button type="button" className={`${playing ? "playing" : ""}`} onClick={allNotesOff}>ALL NOTES OFF</button>
            <button type="button" onClick={panic}>PANIC</button>
        </div>
    );

});
