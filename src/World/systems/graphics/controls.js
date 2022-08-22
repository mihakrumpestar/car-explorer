import { OrbitControls } from './../../../../../vendor/examples/jsm/controls/OrbitControls.js';

function createControls(camera, canvas) {
  const controls = new OrbitControls(camera, canvas);
    
  // damping and auto rotation require
  // the controls to be updated each frame

  // this.controls.autoRotate = true;
  controls.enableDamping = true;
  controls.maxPolarAngle = Math.PI/2;  // set to horiton, so camera can't go lover when in orbit mode

  //controls.tick = () => controls.update();

  return controls;
}

export { createControls };