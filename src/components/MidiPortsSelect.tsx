import React, {FormEvent} from 'react';
import {observer} from "mobx-react";
import {useStores} from '../hooks/useStores'
import "./MidiPortsSelect.css";


export const MidiPortsSelect = observer(() => {

    // console.log("MidiPortsSelect.render");

    function handleOutSelection(e: FormEvent<HTMLSelectElement>) {
        e.preventDefault();
        const v = (e.target as HTMLSelectElement).value;
        // const p = midi.outputById(v);
        // if (p) midi.useOutput(p);
        midi.useOutputById(v);
    }

    // const { stateStore: state, midiStore: midi } = useStores();
    const { midiStore: midi } = useStores();

    if (!midi.interface) {
        return null;
    }

    // console.log("MidiPortsSelect: midi is ON");

    const midi_ok = true;

    // midi.autoSelect(/linnstrument/i);


    // @ts-ignore
    return (
        <div className={`ports-row ${midi_ok?'midi-ok':'midi-ko'}`}>
{/*
            <div>
                <span>In:</span>
                <select onChange={handleInSelection} value={midi.inputInUseId}>
                    <option value="">select MIDI input...</option>
                    {Object.entries(midi.inputs).map(([id, port]) => <option key={id} value={port.id}>{port.name}</option>)}
                </select>
            </div>
*/}
            <div className="config">
                <label>MIDI output:</label>
                <select onChange={handleOutSelection} value={midi.outputInUseId}>
                    <option value="">select MIDI output...</option>
                    {Object.entries(midi.outputs).map(([id, port]) => <option key={id} value={port.id}>{port.name}</option>)}
                </select>
            </div>

        </div>
    );

});
