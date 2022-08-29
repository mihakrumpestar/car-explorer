import { Vector3, Object3D, PerspectiveCamera } from './../../../vendor/build/three/three.module.js';
import { createControls } from '/src/World/systems/graphics/controls.js';
import { vehicleControl } from '/src/World/systems/physics/vehicle/vehicleControl.js';

class createCamera {

  constructor(canvas) {
    
    this.camera = new PerspectiveCamera(
      35, // fov = Field Of View
      1, // aspect ratio (dummy value)
      0.1, // near clipping plane
      3000, // far clipping plane
    );

    // controls for when we are not going to be moving vehicle, will give us free rotation around vehicle
    this.controls = new createControls(this.camera, canvas);

    // move the camera back so we can view the scene
    this.camera.position.set(-10.84, 10.84, -95.1);
    this.camera.lookAt(new Vector3( 1.73, -100.70, -0.85 ));

    this.vehicleMesh; // mesh to follow
    this.chase = true; // set to follow 
    this.minCameraHeight = 12;


    this.newCameraPos = new Vector3();
    this.chaseCam = new Object3D();
    this.chaseCam.position.set(0, 0, 0);
    
    this.chaseCamPivot = new Object3D();
    this.chaseCamPivot.position.set(0, this.minCameraHeight, -40);
    
    this.chaseCam.add(this.chaseCamPivot);
  }

  addTarget(vehicleMesh) {
    this.vehicleMesh = vehicleMesh;
    this.vehicleMesh.add(this.chaseCam);
    this.controls.target = this.vehicleMesh.position;
    this.controls.update();
  }

  tick() {
    if (this.chase) {
      this.chaseCamPivot.getWorldPosition(this.newCameraPos);
      
      // min height of camera
      this.newCameraPos.y = this.minCameraHeight;

      if (window.actions.acceleration) {
        this.controls.enabled = false;
        this.camera.position.lerpVectors(this.camera.position, this.newCameraPos, 0.05);
      }
    }
    if (this.vehicleMesh) {
      this.camera.lookAt(this.vehicleMesh.position);
      
      // check if actions.acceleration is defined after false
      if (window.actions.acceleration == false || !window.actions.hasOwnProperty('acceleration')) {
        this.controls.target = this.vehicleMesh.position;
        this.controls.enabled = true;
        this.controls.update();
      }
    }
  }
}

export { createCamera };

/*

this.vehicleMesh.add(this.chaseCam);

    if (this.vehicleMesh && this.chase) {
      console.log("chasing")
      this.chaseCamPivot.getWorldPosition(this.newCameraPos);
      
      // min height of camera
      this.newCameraPos.y = this.minCameraHeight;

      this.camera.position.lerpVectors(this.camera.position, this.newCameraPos, 0.05);
    }
    
    if (this.actions.acceleration) {
      if (this.vehicleMesh) {
        this.camera.lookAt(this.vehicleMesh.position);
      }
    } else {
      //this.controls.update();
    }
  }


*/