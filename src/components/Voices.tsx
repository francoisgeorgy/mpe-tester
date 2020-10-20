import {observer} from "mobx-react";
import {useStores} from "../hooks/useStores";
import React, {Fragment} from "react";
import {Voice} from "./Voice";

export const Voices = observer(() => {

    const { stateStore: state } = useStores();

    if (!state.voices) return null;

    const toggleAutoReset = () => {
       // if (!autoReset) resetBend();
        // setAutoReset(!autoReset);
        // state.bendAutoReset = !state.bendAutoReset;
        state.toggleBendAutoReset();
    };

    return (
        <Fragment>
            {state.voices.map(
                (voice, i) => <Voice key={i} voice={voice}/>
            )}
            <div className="voices-options">
                <div>
                    <button type="button" onClick={() => state.addVoice()}>Add note</button>
                </div>
                <div className="fg row">
                    <input type="checkbox" id="autoReset" value="1"
                           defaultChecked={state.bendAutoReset} className="pointer"
                           onClick={toggleAutoReset}/> <label htmlFor="autoReset" className="pointer">Pitch Bend automatically returns to 0</label>
                </div>
            </div>
        </Fragment>
    );

});
