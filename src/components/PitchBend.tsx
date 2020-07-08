import {observer} from "mobx-react";
import {useStores} from "../hooks/useStores";
import React, {FormEvent, useState} from "react";

export const PitchBend = observer(() => {

    // console.log("PitchBend.render");

    const { midiStore: midi } = useStores();

    const [bendSelect, setBendSelect] = useState("48");
    const [bendCustom, setBendCustom] = useState("");
    const [bend, setBend] = useState(0);

    // if (!midi.interface) {
    //     return null;
    // }
    // const midi_ok = true;

    let range;
    if (bendSelect === "custom") {
        range = parseInt(bendCustom, 10);
    } else {
        range = parseInt(bendSelect, 10);
    }

    let semi = (range*2) / 16383 * bend;

    return (
        <div className="pitch-bend">
            <h2>Pitch Bend</h2>
            <div>
                <label>Pitch bend range:</label>
                <select value={bendSelect} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setBendSelect(e.target.value)}>
                    <option value="2">+/- 2</option>
                    <option value="3">+/- 3</option>
                    <option value="12">+/- 12</option>
                    <option value="24">+/- 24</option>
                    <option value="48">+/- 48</option>
                    <option value="custom">custom</option>
                </select>
                {bendSelect === "custom" &&
                <input type="text" value={bendCustom} placeholder="enter custom pitch bend value"
                       onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBendCustom(e.target.value)} className="space-right" />}
            </div>
            <div>
                <input type="range" min="-8192" max="8191" value={bend} list="ticks" onChange={(e)=>setBend(parseInt(e.target.value, 10))}/>
                <datalist id="ticks">
                    <option value="-8192"></option>
                    <option value="0"></option>
                    <option value="8191"></option>
                </datalist>
                <div>
                    Bend range: {range}
                </div>
                <div>
                    Bend position: {bend}
                </div>
                <div>
                    Bend in semitones according to range: {semi.toFixed(2)}
                </div>
            </div>
        </div>
    );

    //-------------------------------------------------------------------------

    /*
        function handleInSelection(e: FormEvent<HTMLSelectElement>) {
            e.preventDefault();
            const v = (e.target as HTMLSelectElement).value;
            midi.useInput(v);
        }
    */

    function handleOutSelection(e: FormEvent<HTMLSelectElement>) {
        // e.preventDefault();
        // const v = (e.target as HTMLSelectElement).value;
        // midi.useOutput(v);
    }

});
