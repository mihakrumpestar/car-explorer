import { createCamera } from './components/camera.js';
import { createLights } from './components/lights.js';
import { createScene } from './components/scene.js';
import { createObjects } from './components/createObjects/createObjects.js';

import { createRenderer } from './systems/graphics/renderer.js';
import { Resizer } from './systems/graphics/Resizer.js';
import { Loop } from './systems/graphics/Loop.js';
import { initPhysicsWorld } from './systems/physics/initPhysicsWorld.js';

import { createStats } from './systems/graphics/stats.js';
import { createGui } from './systems/graphics/gui.js';
import { joystickCreate } from '/src/World/systems/physics/vehicle/joystickCreate.js';

// These variables are module-scoped: we cannot access them from outside the module

// Ammo.js library in a variable
let Ammo;


// Graphisc variables
let camera;
let renderer;
var scene;
let loop;

let stats;
let gui;
let joystickControls;

let cameraSystem;

// Physics variables
let physicsWorld;

class World {
  constructor(container, AmmoImport) {
    // create all graphics
    Ammo = AmmoImport;
   
    renderer = createRenderer();
    scene = createScene();
    stats = createStats();

    container.append(renderer.domElement);
    container.appendChild(stats.domElement);
    
    cameraSystem = new createCamera(renderer.domElement);
    camera = cameraSystem.camera;

    const { ambientLight, mainLight } = createLights();

    scene.add(ambientLight, mainLight);
    scene.add(cameraSystem.chaseCam);
    
    const resizer = new Resizer(container, camera, renderer);

    // initialize physicsWorld
    physicsWorld = initPhysicsWorld(Ammo);
  
    // updating with the refrash rate of monitor
    loop = new Loop(Ammo, camera, scene, renderer);

    // to enable mouse movement and zoom + stats
    loop.updatables.push(stats, physicsWorld);
    loop.postCamera = cameraSystem;

    // crete gui
    gui = new createGui(loop);

    // mobile game controls
    if (createGui.checkPlatform()) {
      new joystickCreate();
    }
  }

  start() {
    loop.start();
  }
      
  stop() {
    loop.stop();
  }

  async init() {
    await this.initGraphics();
    await this.initPhysics();
  }

  async initGraphics() {
    let world = {scene, physicsWorld, loop}
    await createObjects(Ammo, world, cameraSystem);
  }

  async initPhysics() {
    // Physics configuration

  }
}

export { World };