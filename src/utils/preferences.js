import store from "storejs";
import {CHAN_PRESS} from "../stores/StateStore";

export const LOCAL_STORAGE_KEY = "studiocode.mpe-tester-1.preferences";

export const DAY_THEME = 'day';
export const NIGHT_THEME = 'night';
export const DEFAULT_THEME = DAY_THEME;

let preferences = {
    theme: DEFAULT_THEME,
    midi_channel: 1,
    input_id: null,      // web midi port ID
    output_id: null,     // web midi port ID
    bend_select: "48",
    bend_custom: "",
    timbre_cc: 74,   // must be number
    z_cc_type: CHAN_PRESS,
    master_channel: 1
};

export function loadPreferences() {
    const s = store.get(LOCAL_STORAGE_KEY);
    if (s) preferences = Object.assign(preferences, preferences, JSON.parse(s));
    return preferences;
}

export function savePreferences(options = {}) {
    loadPreferences();
    Object.assign(preferences, preferences, options);
    store(LOCAL_STORAGE_KEY, JSON.stringify(preferences));
}
