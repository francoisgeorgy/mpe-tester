import React from 'react';
import {MidiPortsSelect} from "./components/MidiPortsSelect";
import {Panel} from "./components/Panel";
import './App.css';
import {PitchBend} from "./components/PitchBend";

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
                    <PitchBend/>
                </Panel>
            </main>
        </div>
    );
}

export default App;
