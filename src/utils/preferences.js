import store from "storejs";

export const LOCAL_STORAGE_KEY = "studiocode.learnstrument.preferences";

export const DAY_THEME = 'day';
export const NIGHT_THEME = 'night';
export const DEFAULT_THEME = DAY_THEME;

let preferences = {
    theme: DEFAULT_THEME,
    midi_channel: 1,
    input_id: null,      // web midi port ID
    output_id: null      // web midi port ID
};

// TODO: preferred octave, preferred middle-C, preferred shape, colors, ...

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
