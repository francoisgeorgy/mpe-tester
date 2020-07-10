import {observer} from "mobx-react";
import {useStores} from "../hooks/useStores";
import React, {useState} from "react";
import {CC_SHORT} from "../utils/midiCCs";
import {CC11, CHAN_PRESS, POLY_PRESS} from "../stores/StateStore";

export const Config = observer(() => {

    function selectBendRange(e: React.ChangeEvent<HTMLSelectElement>) {
        const s = e.target.value;
        setBendSelect(s);
        if (s !== "custom") {
            const v: number = parseInt(s, 10);
            if (!isNaN(v)) {
                state.setBendRange(v);
            }
        }
    }

    function updateCustomBendRange(e: React.ChangeEvent<HTMLInputElement>) {
        const s = e.target.value;
        setBendCustom(s);
        if (s) {
            const v: number = parseInt(s, 10);
            if (!isNaN(v)) {
                state.setBendRange(v);
            }
        }
    }

    function selectPressureController(e: React.ChangeEvent<HTMLSelectElement>) {
        const s = e.target.value;
        state.setPressureController(s);
    }

    const { stateStore: state } = useStores();

    const [bendSelect, setBendSelect] = useState("48"); //FIXME: should be initialized with state.bendRange.toString
    const [bendCustom, setBendCustom] = useState("");
    // const [pressureCtrl, setPressureCtrl] = useState(state.pressureController);

    return (
        <div className="config">

            <div className="row">
                <label>Master channel:</label>
                <select value={state.masterChannel} onChange={(e) => state.setMasterChannel(parseInt(e.target.value,10))}>
                    <option value={0}>1</option>
                    <option value={15}>16</option>
                </select>
            </div>

            <div className="row">
                <label>Pitch Bend:</label>
                <select value={bendSelect} onChange={selectBendRange}>
                    <option value="2">+/- 2</option>
                    <option value="3">+/- 3</option>
                    <option value="12">+/- 12</option>
                    <option value="24">+/- 24</option>
                    <option value="48">+/- 48</option>
                    <option value="custom">custom</option>
                </select>
                {bendSelect === "custom" &&
                <input type="text" value={bendCustom} placeholder="custom" onChange={updateCustomBendRange} className="custom-range space-right" />}
                semitones
            </div>

            <div className="row">
                <label>Pressure:</label>
                <select value={state.pressureController} onChange={selectPressureController}>
                    <option value={CHAN_PRESS}>channel pressure</option>
                    <option value={POLY_PRESS}>poly pressure</option>
                    <option value={CC11}>CC 11</option>
                </select>
            </div>

            <div className="row">
                <label>Timbre:</label>
                <select value={state.timbreCC} onChange={e => state.setTimbreCC(parseInt(e.target.value))}>
                    {CC_SHORT.map((name, number)=> <option value={number} key={number}>CC {number} {name}</option>)}
                </select>
            </div>

{/*
                        <div>
                            <label>Master channel:</label>
                            <select value={this.state.master_channel} onChange={this.setMasterChannel}>
                                <option value="1">1</option>
                                <option value="16">16</option>
                            </select>
                        </div>
*/}

        </div>
    );

});
