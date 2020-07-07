import store from "storejs";

export const LOCAL_STORAGE_KEY = "studiocode.mpe-monitor.1.preferences";
export const DEFAULT_THEME = 'light';

export const BEND_DEFAULT = 8192;
export const Z_DEFAULT = 100;
export const Y_DEFAULT = 64;
export const DISPLAY_DATA = 0;
export const DISPLAY_GRAPH = 1;
export const POLY_PRESS = "pp";
export const CHAN_PRESS = "cp";
export const CC11 = "cc11";

let preferences = {
    theme: DEFAULT_THEME,
    send_pc: true,
    midi_channel: 1,
    input_id: null,      // web midi port ID
    output_id: null,     // web midi port ID
    bend_select: "24",
    bend_custom: "",
    y_cc: 74,   // must be number
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
