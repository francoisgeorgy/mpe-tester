import {observer} from "mobx-react";
import {useStores} from "../hooks/useStores";
import React, {FormEvent, useState} from "react";
import {NOTE_NAME_NO_OCTAVE} from "../utils/midiNotes";
import {noteNumber} from "../utils/midiMaths";

export const Drone = observer(() => {

    // console.log("PitchBend.render");

    const { midiStore: midi } = useStores();

    const [note, setNote] = useState(0);
    const [octave, setOctave] = useState(3);
    const [playing, setPlaying] = useState(false);

    const toggleDrone = () => {
        if (playing) {
            midi.noteOff(noteNumber(note, octave));
            setPlaying(false);
        } else {
            midi.noteOn(noteNumber(note, octave));
            setPlaying(true);
        }
    }

/*
    const send = (b:number) => {
        // if (midi) {
            midi.send([
                ...pitchBend(b + 8192, 0)
            ]);
        // }
    };
*/


    return (
        <div className="drone">
            <h2>Drone</h2>
            <div>
                You can play a drone note to help testing the MPE dimensions.
            </div>
            <div>
                <label>Note:</label>
                <select value={note} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNote(parseInt(e.target.value, 10))}>
                    {NOTE_NAME_NO_OCTAVE.map((note, index) => <option value={index} key={index}>{note}</option>)}
                </select>

                <label>Octave:</label>
                <select value={octave} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setOctave(parseInt(e.target.value, 10))}>
                    <option value={-1}>-1</option>
                    <option value={0}>0</option>
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                    <option value={5}>5</option>
                    <option value={6}>6</option>
                    <option value={7}>7</option>
                    <option value={8}>8</option>
                    <option value={9}>9</option>
                </select>

                <button type="button" onClick={toggleDrone}>{playing ? "STOP ⏹️" : "PLAY ▶"}</button>
            </div>
        </div>
    );

    //-------------------------------------------------------------------------

    /*
        function handleInSelection(e: FormEvent<HTMLSelectElement>) {
            e.preventDefault();
            const v = (e.target as HTMLSelectElement).value;
            midi.useInput(v);
        }
    */

    function handleOutSelection(e: FormEvent<HTMLSelectElement>) {
        // e.preventDefault();
        // const v = (e.target as HTMLSelectElement).value;
        // midi.useOutput(v);
    }

});
