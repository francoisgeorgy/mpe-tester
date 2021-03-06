import {observer} from "mobx-react";
import {useStores} from "../hooks/useStores";
import React from "react";
import {NOTE_NAME_NO_OCTAVE} from "../utils/midiNotes";
import {noteNumber} from "../utils/midiMaths";
import {VoiceProps} from "../stores/StateStore";
import "./Drone.css";
import {MIDI_DEFAULT_NOTE_OFF_VELOCITY} from "../utils/midi";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlay, faStop} from "@fortawesome/free-solid-svg-icons";

export const Drone = observer(({voice}: VoiceProps) => {

    const { midiStore: midi } = useStores();

    const changeNote = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const v = parseInt(e.target.value, 10);
        if (!isNaN((v))) {
            if (voice.drone.playing) {
                midi.noteOff(noteNumber(voice.drone.note, voice.drone.octave), MIDI_DEFAULT_NOTE_OFF_VELOCITY, voice.channel);
                midi.noteOn(noteNumber(v, voice.drone.octave), voice.drone.velocity, voice.channel);
            }
            voice.drone.note = v;
        }
    };

    const changeOctave = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const v = parseInt(e.target.value, 10);
        if (!isNaN((v))) {
            if (voice.drone.playing) {
                midi.noteOff(noteNumber(voice.drone.note, voice.drone.octave), MIDI_DEFAULT_NOTE_OFF_VELOCITY, voice.channel);
                midi.noteOn(noteNumber(voice.drone.note, v), voice.drone.velocity, voice.channel);
            }
            voice.drone.octave = v;
        }
    };

    const changeVelocity = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const v = parseInt(e.target.value, 10);
        if (!isNaN((v))) {
            // if (voice.drone.playing) {
            //     midi.noteOff(noteNumber(voice.drone.note, voice.drone.octave), MIDI_DEFAULT_NOTE_OFF_VELOCITY, voice.channel);
            //     midi.noteOn(noteNumber(voice.drone.note, voice.drone.octave), v, voice.channel);
            // }
            voice.drone.velocity = v;
        }
    };

    const toggleDrone = () => {
        if (voice.drone.playing) {
            midi.noteOff(noteNumber(voice.drone.note, voice.drone.octave), MIDI_DEFAULT_NOTE_OFF_VELOCITY, voice.channel);
            voice.drone.playing = false;
        } else {
            midi.noteOn(noteNumber(voice.drone.note, voice.drone.octave), voice.drone.velocity, voice.channel);
            voice.drone.playing = true;
        }
    };

    return (
        <div className="drone">
            <div className="row">
                <label>Channel {voice.channel + 1}</label>
                {/*<div>*/}
                {/*    channel {voice.channel + 1}*/}
                {/*</div>*/}
            </div>
            <div className="drone-setup">
                <div>
                    <div className="drone-labels">
                        note, octave, velocity
                    </div>
                    <select value={voice.drone.note} onChange={changeNote}>
                        {NOTE_NAME_NO_OCTAVE.map((note, index) => <option value={index} key={index}>{note}</option>)}
                    </select>
                    <select value={voice.drone.octave} onChange={changeOctave}>
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
                    <select value={voice.drone.velocity} onChange={changeVelocity}>
                    {[...Array(128)].map((i,j)=>
                        <option key={j} value={j}>{j}</option>
                    )}
                    </select>
                </div>
                <div>
                    {/*<button type="button" className={`play-button ${voice.drone.playing ? "playing" : ""}`} onClick={toggleDrone}>{voice.drone.playing ? "STOP️" : "PLAY"}</button>*/}
                    {!voice.drone.playing && <button type="button" className="play-button not-playing" onClick={toggleDrone}><FontAwesomeIcon icon={faPlay} /></button>}
                    {voice.drone.playing && <button type="button" className="play-button playing" onClick={toggleDrone}><FontAwesomeIcon icon={faStop} /></button>}
                </div>

            </div>
        </div>
    );

});
