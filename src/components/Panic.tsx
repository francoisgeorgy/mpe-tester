import {observer} from "mobx-react";
import {useStores} from "../hooks/useStores";
import React from "react";

export const Panic = observer(() => {

    function allNotesOff() {
        for (let i=0; i<128; i++) {
            for (let ch=0; ch<16; ch++) {
                midi.noteOff(i, 127, ch);
            }
        }
        if (state.voices) {
            state.voices.forEach((voice, i) => {
                if (voice.drone) {
                    voice.drone.playing = false;
                }
            });
        }
    }

    const { stateStore: state, midiStore: midi } = useStores();

    // if (!state.voices) return null;

    return (
        <div className="panic">
            <button type="button" onClick={allNotesOff}>ALL NOTES OFF</button>
        </div>
    );

});
