import {observer} from "mobx-react";
import {useStores} from "../hooks/useStores";
import React, {Fragment} from "react";
import {Voice} from "./Voice";

export const Voices = observer(() => {

    const { stateStore: state } = useStores();

    if (!state.voices) return null;

    return (
        <Fragment>
            {state.voices.map(
                (voice, i) => <Voice key={i} voice={voice}/>
            )}
            {state.voiceAvailable &&
            <div>
                <button type="button" onClick={() => state.addVoice()}>add note</button>
            </div>}
        </Fragment>
    );

});
