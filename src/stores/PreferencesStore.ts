import {decorate, observable} from "mobx";

type Preferences = {
}

class PreferencesStore {

    preferences: Preferences;

    constructor() {
        this.preferences = {
        }
    }

}

decorate(PreferencesStore, {
    preferences: observable
});

export default new PreferencesStore();
