import {observer} from "mobx-react";
import {useStores} from "../hooks/useStores";
import React from "react";

export const Timbre = observer(() => {

    const { midiStore: midi } = useStores();

    return (
        <div className="timbre">
            <h2>Timbre (Y)</h2>
        </div>
    );

});
