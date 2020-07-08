import React from 'react';
import {MidiPortsSelect} from "./components/MidiPortsSelect";
import {Panel} from "./components/Panel";
import {PitchBend} from "./components/PitchBend";
import {Drone} from "./components/Drone";
import './App.css';
import {Timbre} from "./components/Timbre";
import {Pressure} from "./components/Pressure";
import {Trackpad} from "./components/Trackpad";

function App() {

    return (
        <div className="app">
            <header>
                <h1><strong>MPE Tester</strong> by <a href="https://studiocode.dev/" target="_blank" rel="noopener">StudioCode.dev</a></h1>
            </header>
            <main>
                <Panel title="MIDI" closed={true}>
                    <MidiPortsSelect/>
                </Panel>
                <Panel>
                    <Drone/>
                </Panel>
                <Panel>
                    <PitchBend/>
                </Panel>
                <Panel>
                    <Timbre/>
                </Panel>
                <Panel>
                    <Pressure/>
                </Panel>
{/*
                <Panel>
                    <Trackpad/>
                </Panel>
*/}
            </main>
        </div>
    );
}

export default App;
