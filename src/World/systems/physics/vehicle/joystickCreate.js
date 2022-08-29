import { Scene, PerspectiveCamera, WebGLRenderer, SphereGeometry, MeshPhongMaterial, AmbientLight, Mesh } from "/vendor/build/three/three.module.js";
import { JoystickControls } from "./JoystickControls.js";
import { Resizer } from "/src/World/systems/graphics/Resizer.js";
import { vehicleControl } from "./vehicleControl.js";
/*
let geometry = new SphereGeometry(1, 36, 36)
let material = new MeshPhongMaterial({
  wireframe: true,
  color: 0xffffff,
});*/
let light = new AmbientLight(0xffffff)

class joystickCreate {

    constructor() {
        this.element = document.getElementById('tauch-controls');
        this.scene = new Scene();
        this.camera = new PerspectiveCamera(
          10, // fov = Field Of View
        );
        this.renderer = new WebGLRenderer({
          antialias: true,
          alpha: true,
        });

        this.pos = {
          x: 0,
          y: 0,
        }

        this.movementBefore = false;

        // this.target = new Mesh(geometry, material)
        this.joystickControls = new JoystickControls(this.element, this.camera, this.scene);
        this.setupScene();
    }

    setupScene = () => {
        this.element?.appendChild(this.renderer.domElement);

        // const gl = this.element.firstElementChild.getContext("webgl");
        
        this.camera.position.z = 5; // 5
      
        this.scene.add(this.camera, /* this.target, */ light);
      
        const resizer = new Resizer(this.element, this.camera, this.renderer);
        this.animate();
    }
      
    animate = () => {
        requestAnimationFrame(this.animate);
      
        this.joystickControls.update(movement => {
            if (movement) {
                this.movementBefore = true;
                console.log("movement");
                /*
                const sensitivity = 0.001
                this.target.position.x += movement.moveX * sensitivity
                this.target.position.y -= movement.moveY * sensitivity
                */
                // console.log(movement);

                if (-movement.moveY > 35) {
                  window.actions.acceleration = true;
                  // console.log("Accelerating");
                } else if (window.actions.acceleration) {
                  window.actions.acceleration = false;
                }
                
                if (movement.moveY > 35) {
                  // console.log("Breaking");
                  window.actions.braking = true;
                } else {
                  window.actions.braking = false;
                }

                if (movement.moveX < -35) {
                  // console.log("Left");
                  window.actions.left = true;
                } else {
                  window.actions.left = false;
                }

                if (movement.moveX > 35) {
                  // console.log("Right");
                  window.actions.right = true;
                } else {
                  window.actions.right = false;
                }
            } else if (this.movementBefore){
              window.actions.acceleration = false;
              window.actions.braking = false;
              window.actions.left = false;
              window.actions.right = false;
            }
        });
      
        this.renderer.render(this.scene, this.camera);
    }
}

export { joystickCreate };