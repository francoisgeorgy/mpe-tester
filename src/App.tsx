import React from 'react';
import {MidiPortsSelect} from "./components/MidiPortsSelect";
import {Voices} from "./components/Voices";
import { Config } from './components/Config';
import './App.css';
import "./inputRange.css";
import {Panic} from "./components/Panic";

function App() {

    return (
        <div className="app">

            <div className="header">
                <MidiPortsSelect/>
                <Panic/>
                <div className="about">
                    <span className="bold">MPE Tester {process.env.REACT_APP_VERSION}</span>
                    &nbsp;by&nbsp;<a href="https://studiocode.dev" target="_blank" rel="noopener noreferrer">StudioCode.dev</a>
                </div>
            </div>

            <div className="header border-bottom">
                <Config/>
            </div>

            <main>

                <Voices />

                <div className="help">
                    <h2>How to use this tool:</h2>
                    <ol>
                        <li>Select your connected MIDI device in the <span className="italic">MIDI output</span> list at the top.</li>
                        <li>Set <span className="italic">Master channel</span>, <span className="italic">Pitch Bend</span>, <span className="italic">Pressure</span> and <span className="italic">Timbre</span> according to your MIDI device configuration.</li>
                        <li>Select the note and octave you want to play to test this setup.</li>
                        <li>Click <span className="italic">PLAY</span></li>
                        <li>Move the <span className="italic">Pitch Bend</span>, <span className="italic">Pressure</span> and <span className="italic">Timbre</span> sliders. They must only affect the corresponding note.</li>
                        <li>Add other notes and repeat steps 4 and 5</li>
                    </ol>
                </div>
                <div className="help">
                    <h3>Pitch Bend:</h3>
                    <p>
                        Pitch bend is a 14 bits value with a range of 0..16383.
                        By convention, the middle value 8192 is defined as "no bend" and the range is displayed as −8192 to +8191
                        because it makes it easier for us humans to tell the difference between bend down and bend up.
                    </p>
                    <p>
                        A MIDI device always receives a value between 0 and 16383 and it will map this value to a number of semitones.
                        {/*It's this mapping that you configure with the "Pitch Bend" dropdown.*/}
                    </p>
                    <p>
                        The <span className="italic">Pitch Bend</span> dropdown must be set to the same Pitch Bend Range configured on your MIDI device.
                        So when you MIDI device bends 1 semitone, this tool will also display a bend of 1 semitone. Otherwise, what you read here may not correspond to what your hear.
                    </p>
                </div>
                <div className="help">
                    <h3>Timbre:</h3>
                    <p>
                        This tool calls the 3rd MPE dimension <span className="italic">Timbre</span>. This is an arbitrary choice and of course this 3rd dimension can be used
                        to control any parameter on your MIDI device (only limited by your device capabilities).
                    </p>
                </div>
                <div className="help">
                    <h2>MPE quick summary:</h2>
                    <ul>
                        <li>Each note gets its own MIDI Channel.</li>
                        <li>By default, Pitch Bend is set to of ±48 semitones for per-note bend and ±2 semitones for Master bend.</li>
                        <li>Aftertouch is sent using the Channel Pressure message.</li>
                        <li>A third dimension of per-note control may be expressed using CC #74. This 3rd dimension is often called <span className="italic">Timbre</span>.</li>
                    </ul>
                    <div>
                        The above summary is a bit simplified. For more information about MPE see <a
                        href="https://www.midi.org/articles-old/midi-polyphonic-expression-mpe" target="_blank" rel="noopener noreferrer">MIDI.org</a>.
                    </div>
                </div>
                <div className="help">
                    <h2>Limitations:</h2>
                    <ul>
                        <li>This tool does not yet offer Master Channel controls.</li>
                        <li>Middle C is set to C4 and is not yet configurable.</li>
                    </ul>
                </div>
            </main>
            <div className="footer">
                Feedback welcome. Please use <a href="https://github.com/francoisgeorgy/mpe-tester/issues" target="_blank" rel="noopener noreferrer">github</a> or <a href="https://twitter.com/francoisgeorgy" target="_blank" rel="noopener noreferrer">twitter</a>.
            </div>
        </div>
    );
}

export default App;
