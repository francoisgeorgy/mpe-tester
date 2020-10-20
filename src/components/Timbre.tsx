import {observer} from "mobx-react";
import {useStores} from "../hooks/useStores";
import React from "react";
import {VoiceProps} from "../stores/StateStore";

export const Timbre = observer(({voice}: VoiceProps) => {

    const { midiStore: midi, stateStore: state } = useStores();
    // const [value, setValue] = useState(63);

    const updateValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        const v: number = parseInt(e.target.value, 10);             //TODO: check that v != NaN
        // setValue(v);
        voice.timbre = v;
        midi.sendCC(state.timbreCC, v, voice.channel);
    };

    const reset = () =>  {
        // setValue(63);
        voice.timbre = 63;
        midi.sendCC(state.timbreCC, 63, voice.channel);
    };

    return (
        <div className="timbre">
            <div className="row">
                <h2 onClick={reset} className="pointer" title="click to set value to 63 (middle)">Timbre</h2>
                <div>
                    {voice.timbre}
                </div>
            </div>
            <div className="row row-center">
                {/*<div className="fg">*/}
                    <input type="range" min="0" max="127" value={voice.timbre} onChange={updateValue}/>
                {/*</div>*/}
            </div>
        </div>
    );

});
