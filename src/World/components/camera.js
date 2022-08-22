import { Vector3, PerspectiveCamera } from './../../../vendor/build/three/three.module.js';

function createCamera() {
  const camera = new PerspectiveCamera(
    35, // fov = Field Of View
    1, // aspect ratio (dummy value)
    0.1, // near clipping plane
    1000, // far clipping plane
  );

  // move the camera back so we can view the scene
  camera.position.set(-10.84, 10.84, -95.1);
  camera.lookAt(new Vector3( 1.73, -100.70, -0.85 ));

  return camera;
}

export { createCamera };