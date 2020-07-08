import {observer} from "mobx-react";
import {useStores} from "../hooks/useStores";
import React, {useState} from "react";
import {CC} from "../utils/midiCCs";

export const Timbre = observer(() => {

    const { midiStore: midi } = useStores();
    const [cc, setCC] = useState(74);
    const [value, setValue] = useState(0);

    const updateValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        const v: number = parseInt(e.target.value, 10);             //TODO: check that v != NaN
        setValue(v);
        midi.sendCC(cc, v);
    };



    return (
        <div className="timbre">
            <h2>Timbre (Y)</h2>
            <div>
                MPE specify CC74 by default. Another optiin may be CC11
            </div>
            <div>
                CC
                <select value={cc} onChange={e => setCC(parseInt(e.target.value))}>
                    {CC.map((name, number)=> <option value={number} key={number}>{number} {name}</option>)}
                </select>
                <div>
                    <input type="range" min="0" max="127" value={value} onChange={updateValue}/>
                </div>
                <div>
                    Value: {value}
                </div>
            </div>
        </div>
    );

});
