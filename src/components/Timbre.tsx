import {observer} from "mobx-react";
import {useStores} from "../hooks/useStores";
import React, {useState} from "react";
import {ChannelProps} from "../stores/StateStore";

export const Timbre = observer(({channel}: ChannelProps) => {

    const { midiStore: midi, stateStore: state } = useStores();
    const [value, setValue] = useState(0);

    const updateValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        const v: number = parseInt(e.target.value, 10);             //TODO: check that v != NaN
        setValue(v);
        midi.sendCC(state.timbreCC, v, channel);
    };

    return (
        <div className="timbre">
            <div className="row">
                <h2>Timbre</h2>
                <div>
                    {value}
                </div>
            </div>
            <div className="row row-center">
                {/*<div className="fg">*/}
                    <input type="range" min="0" max="127" value={value} onChange={updateValue}/>
                {/*</div>*/}
            </div>
        </div>
    );

});
