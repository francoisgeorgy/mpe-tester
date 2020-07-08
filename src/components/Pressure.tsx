import {observer} from "mobx-react";
import {useStores} from "../hooks/useStores";
import React from "react";

export const Pressure = observer(() => {

    const { midiStore: midi } = useStores();

    return (
        <div className="pressure">
            <h2>Pressure (Z)</h2>
        </div>
    );

});
