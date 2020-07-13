import {observer} from "mobx-react";
import {useStores} from "../hooks/useStores";
import React, {useState} from "react";
import {CC11, CHAN_PRESS, ChannelProps, POLY_PRESS, PressureProps, VoiceProps} from "../stores/StateStore";
import {noteNumber} from "../utils/midiMaths";

export const Pressure = observer(({voice}: VoiceProps) => {

    const { midiStore: midi, stateStore: state } = useStores();
    const [value, setValue] = useState(100);

    const updateValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        const v: number = parseInt(e.target.value, 10);             //TODO: check that v != NaN
        setValue(v);
        switch (state.pressureController) {
            case CHAN_PRESS:
                midi.channelPressure(v, voice.channel);
                break;
            case POLY_PRESS:
                midi.polyPressure(noteNumber(voice.drone.note, voice.drone.octave), v, voice.channel);
                break;
            case CC11:
                midi.sendCC(11, v, voice.channel);
                break;
            default:
                console.warn("invalid pressureController value", state.pressureController);
        }
    };

    const reset = () =>  {
        const v = 63;
        setValue(v);
        switch (state.pressureController) { //FIXME: factorise this code
            case CHAN_PRESS:
                midi.channelPressure(v, voice.channel);
                break;
            case POLY_PRESS:
                midi.polyPressure(noteNumber(voice.drone.note, voice.drone.octave), v, voice.channel);
                break;
            case CC11:
                midi.sendCC(11, v, voice.channel);
                break;
            default:
                console.warn("invalid pressureController value", state.pressureController);
        }
    };

    return (
        <div className="pressure">
            <div className="row">
                <h2 onClick={reset} className="pointer" title="click to set value to 63 (middle)">Pressure</h2>
                <div>
                    {value}
                </div>
            </div>
            <div>
                <div className="row row-center">
                    {/*<div className="fg">*/}
                        <input type="range" min="0" max="127" value={value} onChange={updateValue}/>
                    {/*</div>*/}
                </div>
            </div>
        </div>
    );

});
