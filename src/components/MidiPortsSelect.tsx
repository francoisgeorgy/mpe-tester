import React, {FormEvent} from 'react';
import {observer} from "mobx-react";
import {useStores} from '../hooks/useStores'
import "./MidiPortsSelect.css";


export const MidiPortsSelect = observer(() => {

    // console.log("MidiPortsSelect.render");

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
            <div className="port-wrapper">
                <span>MIDI Out:</span>
                <select onChange={handleOutSelection} value={midi.outputInUseId}>
                    <option value="">select MIDI output...</option>
                    {Object.entries(midi.outputs).map(([id, port]) => <option key={id} value={port.id}>{port.name}</option>)}
                </select>
            </div>

            <div>
                Channel:
                <select value={midi.channel} onChange={(e) => midi.setChannel(parseInt(e.target.value,10))}>
                    <option value={0}>1</option>
                    <option value={1}>2</option>
                    <option value={2}>3</option>
                    <option value={3}>4</option>
                    <option value={4}>5</option>
                    <option value={5}>6</option>
                    <option value={6}>7</option>
                    <option value={7}>8</option>
                    <option value={8}>9</option>
                    <option value={9}>10</option>
                    <option value={10}>11</option>
                    <option value={11}>12</option>
                    <option value={12}>13</option>
                    <option value={13}>14</option>
                    <option value={14}>15</option>
                    <option value={15}>16</option>
                </select>
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
        e.preventDefault();
        const v = (e.target as HTMLSelectElement).value;
        midi.useOutput(v);
    }

});
