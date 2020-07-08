import {observer} from "mobx-react";
import {useStores} from "../hooks/useStores";
import React, {useState} from "react";

export const Pressure = observer(() => {

    const { midiStore: midi } = useStores();
    const [value, setValue] = useState(0);

    return (
        <div className="pressure">
            <h2>Pressure (Z)</h2>
            <div>
                Pressure / Aftertouch is sent using the Channel Pressure message
            </div>
            <div>
{/*
                CC
                <select value={cc} onChange={e => setCC(parseInt(e.target.value))}>
                    {[...Array(128)].map((i,j)=> <option value={j} key={j}>{j}</option>)}
                </select>
*/}
                <div>
                    <input type="range" min="0" max="127" value={value} onChange={e => setValue(parseInt(e.target.value))}/>
                </div>
                <div>
                    Value: {value}
                </div>
            </div>
        </div>
    );

});
