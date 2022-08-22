import {  } from '../../../../vendor/build/three/three.module.js';

let isFullscreen = false;

function createGui() {
    let controls;

    let fullscreenElement = document.getElementById("fullscreen");
    fullscreenElement.addEventListener("click", fullscreen);

    //controls.tick = () => controls.update();

    return controls;
}

export { createGui };

function fullscreen() {
    console.log("called")
    // element which needs to enter full-screen mode
    let element = document.getElementById("scene-container");

    // make the element go to full-screen mode
    if (!isFullscreen) {
        element.requestFullscreen();
    } else {
        document.exitFullscreen();
    }

    isFullscreen = !isFullscreen;
}