import React from 'react'
import MidiStore from "../stores/MidiStore";
import StateStore from "../stores/StateStore";
import PreferencesStore from "../stores/PreferencesStore";

export const storesContext = React.createContext({
    midiStore: MidiStore,
    stateStore: StateStore,
    preferencesStore: PreferencesStore,
});
