import {observer} from "mobx-react";
import {useStores} from "../hooks/useStores";
import React, {useState} from "react";
import {CC} from "../utils/midiCCs";

export const Trackpad = observer(() => {

    const { midiStore: midi } = useStores();
    const [x, setX] = useState(63);
    const [y, setY] = useState(63);

    const updateValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        const v: number = parseInt(e.target.value, 10);             //TODO: check that v != NaN
    };

    return (
        <div className="trackpad">
            <svg id="pad" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
                <path d="M 0 50 L 100 50" stroke="#aaa" stroke-width="1px" vector-effect="non-scaling-stroke" />
                <path d="M 50 0 L 50 100" stroke="#aaa" stroke-width="1px" vector-effect="non-scaling-stroke" />
                <path d="M 0 0 L 100 100" stroke="#777" stroke-width="1px" vector-effect="non-scaling-stroke" />
                <path d="M 0 100 L 100 0" stroke="#777" stroke-width="1px" vector-effect="non-scaling-stroke" />
                <path d="M 25 0 L 25 100" stroke="#555" stroke-width="1px" vector-effect="non-scaling-stroke" />
                <path d="M 75 0 L 75 100" stroke="#555" stroke-width="1px" vector-effect="non-scaling-stroke" />
                <path d="M 0 25 L 100 25" stroke="#555" stroke-width="1px" vector-effect="non-scaling-stroke" />
                <path d="M 0 75 L 100 75" stroke="#555" stroke-width="1px" vector-effect="non-scaling-stroke" />
                <circle id="dot" cx="50" cy="50" r="5"  fill-opacity="0.66" />
                <rect id="pad-zone" x="0" y="0" width="100" height="100" stroke-width="0" fill="#333" fill-opacity="0.25"></rect>
            </svg>
        </div>
    );

});
