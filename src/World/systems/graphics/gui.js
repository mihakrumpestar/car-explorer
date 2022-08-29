import {  } from '../../../../vendor/build/three/three.module.js';
import { globalStore } from './globalStore.js';

const scene_container = document.getElementById("scene-container");

let canvas;
const loadingScreen = document.getElementById("loadingScreen");


const start_menu = document.getElementById("start-menu");
    const play = document.getElementById("play");

const settings = document.getElementById("settings");
    const resume = document.getElementById("resume");
    const restart = document.getElementById("restart");

const in_game_ui = document.getElementById("in-game-ui");
    const tauch_controls = document.getElementById("tauch-controls");


const fullscreen = document.getElementById("fullscreen");
const settings_button = document.getElementById("settings-button");

class createGui {

    constructor(loop) {
        this.loop = loop;

        new globalStore();
        this.isFullscreen = false;
        this.isLoadingScreen = true;
        this.isRunning = false;

        // toggle loading screen
        this.loadingScreen();

        // toggle fullscrean
        this.fullscreen();

        // toggle start/stop game
        this.pauseGame();
    }


    pauseGame() {
        play.addEventListener("click", this.playGame);
        resume.addEventListener("click", this.playGame);
        restart.addEventListener("click", this.restartGame);
    
        settings_button.addEventListener("click", this.stopGame);
        window.addEventListener('keydown',function(e) {
            if (e.key === "Escape") { // escape key maps to keycode `27`
                this.stopGame();
            }
        });
    }

    playGame = () => {
        start_menu.style.visibility = "hidden";
        this.isRunning = true;
        this.loop.start();
        this.updateGui();
    }

    stopGame = () => {
        this.isRunning = false;
        this.loop.stop();
        this.updateGui();        
    }

    updateGui() {
        settings.style.visibility = !this.isRunning ? "visible": "hidden";
        settings_button.style.visibility = this.isRunning ? "visible": "hidden";
        in_game_ui.style.visibility = this.isRunning ? "visible": "hidden";

        canvas.forEach(element => {
            element.style.visibility = this.isRunning ? "visible": "hidden";
            element.style["pointer-events"] = this.isRunning ? 'auto': 'none';
        });
    }

    restartGame() {
        window.location.reload(false);
    }


    fullscreen() {
        fullscreen.addEventListener("click", fullscreenToggle);
    
        function fullscreenToggle() {
            // make the element go to full-screen mode
            if (!this.isFullscreen) {
                scene_container.requestFullscreen();
            } else {
                document.exitFullscreen();
            }
    
            this.isFullscreen = !this.isFullscreen;
        }
    }

    loadingScreen() {
        // elements to hide before loading screen dissapears
        canvas = document.querySelectorAll("canvas");
        canvas.forEach(element => {
            element.style.visibility = "hidden";
            element.style["pointer-events"] = 'none';
        });

        fullscreen.style.visibility = "hidden";
        settings_button.style.visibility = "hidden";

        // when called, loading screen will dissapear
        window.loadingScreenToggle = function () {
            // remove loading screen
            if (loadingScreen.classList.contains("is-active")) {
                loadingScreen.classList.remove("is-active");
                start_menu.style.visibility = "visible";
                fullscreen.style.visibility = "visible";
                settings_button.style.visibility = "visible";
            } 
            
            // loadingScreen.classList.add("is-active");
            this.isLoadingScreen = !this.isLoadingScreen;
        }
    }


    static checkPlatform() {
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ||
            (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.platform))) {
            console.log("Mobile platform");

            return true;
        }

        return false;
    }

}


export { createGui };


