import { objectPropertiesglTF } from './objectPropertiesglTF.js';
import { objectPropertiesNode } from './objectPropertiesNode.js';

class objectPropertiesCoin extends objectPropertiesNode {   // objectPropertiesglTF

    constructor(properties) {
        super(properties)

        this.sound = new audio();
        this.value = 5;
    } 
    
    onContact(world, objectType) { 
        switch (objectType) {
            case "vehicle":
                console.log("vehicle flag detected");
                let score = document.getElementById('score').firstElementChild;
                score.innerHTML = String(+score.innerHTML + this.value).padStart(10);
                localStorage.setItem("score", score.innerHTML);
                this.removeFromWorld(world);
                this.sound.removeCoin();
                return true; // return true to delete this from collisionHandler
                break;
        }
    }
}

export { objectPropertiesCoin };



class audio {
    constructor() {
        this.soundUnclock = new Howl({
            src: ['./../../../../../assets/audio/coin/coin_unclock.wav'],
            volume: 0.5,
        });

    }

    removeCoin() {
        this.soundUnclock.play();
    }
 
}
