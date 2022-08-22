import { objectProperties } from './objectProperties.js';

class objectPropertiesCoin extends objectProperties {

    constructor({AmmoImporter: AmmoImporter, worldImporter: worldImporter, mass: mass, friction: friction, position: position, rotation: rotation, scale: scale, movement: movement, path: path, collisionGroup: collisionGroup, collisionMask: collisionMask, contactFlag: contactFlag}) {
        super({AmmoImporter: AmmoImporter, worldImporter: worldImporter, mass: mass, friction: friction, position: position, rotation: rotation, scale: scale, movement: movement, path: path, collisionGroup: collisionGroup, collisionMask: collisionMask, contactFlag: contactFlag})


    } 
    
    onContact(contactFlag) {
        switch (contactFlag) {
            case "vehicle":
                console.log("vehicle flag detected");
                this.removeFromWorld();
                break;
        }
    }
}

export { objectPropertiesCoin };


