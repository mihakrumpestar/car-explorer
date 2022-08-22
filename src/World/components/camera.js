import { Vector3, PerspectiveCamera } from './../../../vendor/build/three/three.module.js';

class createCamera {

  constructor() {
    
    this.camera = new PerspectiveCamera(
      35, // fov = Field Of View
      1, // aspect ratio (dummy value)
      0.1, // near clipping plane
      3000, // far clipping plane
    );

    // move the camera back so we can view the scene
    this.camera.position.set(-10.84, 10.84, -95.1);
    this.camera.lookAt(new Vector3( 1.73, -100.70, -0.85 ));

    this.vehicleMesh;
  }

  tick() {
    if (this.vehicleMesh) {
      this.camera.lookAt(vehicleMesh.position)
      /*
      chaseCamPivot.getWorldPosition(v)
      if (v.y < 1) {
          v.y = 1
      }
      */ 
      this.camera.position.lerpVectors(this.camera.position, 1, 0.05)
    }
  }
}

export { createCamera };