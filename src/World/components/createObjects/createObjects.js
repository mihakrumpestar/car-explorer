import { multiModelLoader } from './multiModelLoader.js';
import { collisionHandler } from './../../systems/physics/collisionHandler.js'


async function createObjects(Ammo, world) {
    const models = await multiModelLoader(Ammo, world);

    const checkCollisions = new collisionHandler(world);
    
    models.coins.forEach((object1, key1) => {
        models.vehicles.forEach((object2, key1) => {
            checkCollisions.push(object1, object2);
        });
    });

    window.onkeydown= function(gfg){
        let space_bar = 32;
        let right_arrow = 39;
        
        if (gfg.keyCode === space_bar) {
            console.log(checkCollisions.list);
            console.log(models.coins);
        }
        if (gfg.keyCode === right_arrow) {
           alert("Welcome to GeeksForGeeks!");
        }
    };

    world.loop.updatables.push(checkCollisions);
}

export { createObjects }

