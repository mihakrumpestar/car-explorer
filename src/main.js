import { World } from './World/World.js';

// create the main function
async function main(Ammo) {
  // Get a reference to the container element
  const container = document.querySelector('#scene-container');
  
  // create a new world
  const world = new World(container, Ammo);
  
  // complete async tasks
  await world.init();
  
  // start the animation loop
  world.start();
}
  
// call main to start the app
Ammo().then((Ammo) => {
  main(Ammo).catch((err) => {
    console.error(err);
  });
});