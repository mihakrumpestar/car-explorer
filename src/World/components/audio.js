import { AudioListener } from './../../../vendor/build/three/three.module.js';

function createAudio() {
    const listener = new AudioListener();

    return listener;
}

export { createAudio };
