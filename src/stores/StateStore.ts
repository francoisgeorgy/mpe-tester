import {decorate, observable} from "mobx";
// import {Midi} from "@tonaljs/tonal";

// App's main state
class StateStore {

    // TODO: move into instrument specific config file; define instrument variable
    defaultOctave = 2;  // for LinnStrument

    constructor() {
    } // constructor

    //-------------------------------------------------------------------------

} // class StateStore

decorate(StateStore, {
});

export default new StateStore();
