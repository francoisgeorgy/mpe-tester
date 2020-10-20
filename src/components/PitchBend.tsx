import {observer} from "mobx-react";
import {useStores} from "../hooks/useStores";
import React, {useEffect, useState} from "react";
import {VoiceProps} from "../stores/StateStore";

export const PitchBend = observer(({voice}: VoiceProps) => {

    const { midiStore: midi, stateStore: state } = useStores();
    // const [bend, setBend] = useState(0);
    // const [bendActive, setBendActive] = useState(false);
    // const [autoReset, setAutoReset] = useState(true);

    const bendStart = () => {
        // setBendActive(true);
    };

    const bendEnd = () => {
        // setBendActive(false);
        if (state.bendAutoReset) resetBend();
    };

    const updateBend = (e: React.ChangeEvent<HTMLInputElement>) => {
        const b: number = parseInt(e.target.value, 10);             //TODO: check that b != NaN
        // setBend(b);
        voice.bend = b;
        midi.pitchBend(b + 8192, voice.channel);
    };

    const minBend = () => {
        voice.bend = -8192;
        midi.pitchBend(0, voice.channel);
    };

    const maxBend = () => {
        voice.bend = 8191;
        midi.pitchBend(8192 + 8191, voice.channel);
    };

    const resetBend = () => {
        // setBend(0);
        voice.bend = 0;
        midi.pitchBend(8192, voice.channel);
    };

/*
    const toggleAutoReset = () => {
        if (!autoReset) resetBend();
        setAutoReset(!autoReset);
    };
*/

    // useEffect(() => {
    //     if (state.bendAutoReset) resetBend();
    // }, [state.bendAutoReset, resetBend]);

    let semi = (state.bendRange * 2) / 16383 * voice.bend;

    return (
        <div className="pitch-bend">
            <div className="row">
                <h2>Pitch Bend</h2>
                <div>
                    controller: {voice.bend} ➜ device: {semi.toFixed(2)} semitones
                </div>
{/*
                <div className="fg fend row sm">
                    <input type="checkbox" value="1" defaultChecked={autoReset} onClick={toggleAutoReset}/>auto-return to 0
                </div>
*/}

                <div className="fg fend row">
                    <button type="button" className="button-small space-right-l" onClick={resetBend}>zero</button>
                    <button type="button" className="button-small" onClick={minBend}>min</button>
                    <button type="button" className="button-small" onClick={maxBend}>max</button>
                </div>
            </div>
            <div className="row row-center">
                <input type="range" min="-8192" max="8191" value={voice.bend} onMouseDown={bendStart} onMouseUp={bendEnd} onChange={updateBend}/>
            </div>
        </div>
    );

});
