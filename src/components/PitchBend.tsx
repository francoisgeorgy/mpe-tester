import {observer} from "mobx-react";
import {useStores} from "../hooks/useStores";
import React, {useState} from "react";
import {ChannelProps} from "../stores/StateStore";

export const PitchBend = observer(({channel}: ChannelProps) => {

    const { midiStore: midi, stateStore: state } = useStores();
    const [bend, setBend] = useState(0);
    const [bendActive, setBendActive] = useState(false);
    const [autoReset, setAutoReset] = useState(true);

/*
    useEffect(() => {
        const timer = setTimeout(() => {
            if (autoReset && !bendActive) resetBend();
        }, 500);
        return () => {
            clearTimeout(timer);
        };
    }, [bend, autoReset]);
*/

    const bendStart = () => {
        setBendActive(true);
    };

    const bendEnd = () => {
        setBendActive(false);
        if (autoReset) resetBend();
    };

    const updateBend = (e: React.ChangeEvent<HTMLInputElement>) => {
        const b: number = parseInt(e.target.value, 10);             //TODO: check that b != NaN
        setBend(b);
        midi.pitchBend(b + 8192, channel);
    };

    const resetBend = () => {
        setBend(0);
        midi.pitchBend(8192, channel);
    };

    const toggleAutoReset = () => {
        if (!autoReset) resetBend();
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
                    <button type="button" className="button-small" onClick={resetBend}>zero</button>
                </div>}
            </div>
            <div className="row row-center">
                <input type="range" min="-8192" max="8191" value={bend} onMouseDown={bendStart} onMouseUp={bendEnd} onChange={updateBend}/>
            </div>
        </div>
    );

});
