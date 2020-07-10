import {observer} from "mobx-react";
import {useStores} from "../hooks/useStores";
import React, {useEffect, useState} from "react";
import {ChannelProps} from "../stores/StateStore";

export const PitchBend = observer(({channel}: ChannelProps) => {

    const { midiStore: midi, stateStore: state } = useStores();
    const [bend, setBend] = useState(0);
    const [autoReset, setAutoReset] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (autoReset) setBend(0);
        }, 500);
        return () => {
            clearTimeout(timer);
        };
    }, [bend, autoReset]);

    const updateBend = (e: React.ChangeEvent<HTMLInputElement>) => {
        const b: number = parseInt(e.target.value, 10);             //TODO: check that b != NaN
        setBend(b);
        midi.pitchBend(b + 8192, channel);
    };

    const zero = () => {
        setBend(0);
        midi.pitchBend(0 + 8192, channel);
    };

    const toggleAutoReset = () => {
        setAutoReset(!autoReset);
    };

    let semi = (state.bendRange * 2) / 16383 * bend;

    return (
        <div className="pitch-bend">
            <div className="row">
                <h2>Pitch Bend</h2>
                <div>
                    controller: {bend} ➜ device: {semi.toFixed(2)} semitones
                </div>
                <div className="fg fend row sm">
                    <input type="checkbox" value="1" defaultChecked={autoReset} onClick={toggleAutoReset}/>auto-return to 0
                </div>
                {!autoReset &&
                <div className="row">
                    <button type="button" className="button-small" onClick={zero}>zero</button>
                </div>}
            </div>
            <div className="row row-center">
                <input type="range" min="-8192" max="8191" value={bend} onChange={updateBend}/>
            </div>
        </div>
    );

});
