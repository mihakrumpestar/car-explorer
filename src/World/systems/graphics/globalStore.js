import { globalStoreSound } from "./globalStore/globalStoreSound.js";

class globalStore {

    constructor() {
        window.globalStore = this;

        this.globalStoreSound = new globalStoreSound();

    }

    getLocalStorage() {
        globalStoreVar = this;
        if (localStorage.getItem('globalStore'))
            globalStoreVar = JSON.parse(localStorage.getItem('globalStore'));
    }

    setLocalStorage() {
        localStorage.setItem('globalStore', JSON.stringify(this));
    }





}

export { globalStore };