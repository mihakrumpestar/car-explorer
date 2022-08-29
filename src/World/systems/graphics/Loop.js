import { Clock } from './../../../../../vendor/build/three/three.module.js';

const clock = new Clock();

class Loop {
  constructor(Ammo, camera, scene, renderer) {
    this.TRANSFORM_AUX = new Ammo.btTransform();
    this.camera = camera;
    this.scene = scene;
    this.renderer = renderer;
    this.updatables = [];
    this.postCamera;
  }

  addUpdatables(object) {
    this.updatables.push(object);
  }

  removeUpdatable(object) {
    this.updatables.pop(object);
  }

  start() {
    this.renderer.setAnimationLoop(() => {
      // tell every animated object to tick forward one frame
      this.tick();
  
      // render a frame
      this.renderer.render(this.scene, this.camera);
    });
  }
  
  stop() {
    this.renderer.setAnimationLoop(null);
  }
  
  tick() {
    // only call the getDelta function once per frame!
    const delta = clock.getDelta();
      
    // update all objects
    for (const object of this.updatables) {
      ( async () => {
        object.tick(delta, this.TRANSFORM_AUX);
      })();
    }

    // move camera last to avoid jitters
    if (this.postCamera) this.postCamera.tick(delta, this.TRANSFORM_AUX);
  }
}

export { Loop }