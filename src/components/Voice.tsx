import {observer} from "mobx-react";
import React from "react";
import {Drone} from "./Drone";
import {PitchBend} from "./PitchBend";
import {Timbre} from "./Timbre";
import {Pressure} from "./Pressure";
import {VoiceProps} from "../stores/StateStore";
import "./Voice.css";

/**
 * A voice is a Note and its controls (pressure, timbre, pitch bend)
 */
export const Voice = observer(({voice}: VoiceProps) => {

    function randomColor() {
        return Math.round(224 + Math.random() * 24);
    }

    const bg = `#${randomColor().toString(16)}${randomColor().toString(16)}${randomColor().toString(16)}`;

    return (
        <div className="voice" style={{"backgroundColor":bg}}>
            <div className="voice-drone">
                <Drone voice={voice}/>
            </div>
            <div className="voice-pitch-bend">
                <PitchBend channel={voice.channel}/>
            </div>
            <div className="voice-pressure">
                <Pressure voice={voice}/>
            </div>
            <div className="voice-timbre">
                <Timbre channel={voice.channel}/>
            </div>
        </div>
    );

});
