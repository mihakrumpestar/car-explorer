import { Vector3, CylinderGeometry, BoxGeometry, Mesh } from './../../../../vendor/build/three/three.module.js';
import { vehicleControl } from './../../systems/physics/vehicle/vehicleControl.js';
import { objectPropertiesSimpleObject } from './objectPropertiesSimpleObject.js';
import objectHelper from './objectHelper/objectHelper.js';

const STATE = { DISABLE_DEACTIVATION: 4 };
const FLAGS = { CF_KINEMATIC_OBJECT: 2 };

// Vehicle contants

let wheelAxisPositionBack = -1;
let wheelRadiusBack = 0.4;
let wheelWidthBack = 0.3;
let wheelHalfTrackBack = 1;
let wheelAxisHeightBack = 0.3;

let wheelAxisFrontPosition = 1.7;
let wheelHalfTrackFront = 1;
let wheelAxisHeightFront = 0.3;
let wheelRadiusFront = 0.35;
let wheelWidthFront = 0.2;

let friction = 1000;
let suspensionStiffness = 20.0;
let suspensionDamping = 2.3;
let suspensionCompression = 4.4;
let suspensionRestLength = 0.6;
let rollInfluence = 0.2;

let steeringIncrement = 0.04;
let steeringClamp = 0.5;
let maxEngineForce = 2000;
let maxBreakingForce = 100;

// Raycast Vehicle forces
let engineForce = 0;
let vehicleSteering = 0;
let breakingForce = 0;

// Wheels
let FRONT_LEFT = 0;
let FRONT_RIGHT = 1;
let BACK_LEFT = 2;
let BACK_RIGHT = 3;
/*
let wheelDirectionCS0 = new Ammo.btVector3(0, -1, 0);
let wheelAxleCS = new Ammo.btVector3(-1, 0, 0);
*/

let world;

class objectPropertiesVehicle extends objectPropertiesSimpleObject {

    constructor({AmmoImporter: AmmoImporter, worldImporter: worldImporter, mass: mass, friction: friction, position: position, rotation: rotation, scale: scale, movement: movement, dimensions: dimensions, materialRaw: materialRaw, path: path, collisionGroup: collisionGroup, collisionMask: collisionMask, contactFlag: contactFlag}) {
        super({AmmoImporter: AmmoImporter, mass: mass, friction: friction, position: position, rotation: rotation, scale: scale, movement: movement, dimensions: dimensions, materialRaw: materialRaw, path: path, collisionGroup: collisionGroup, collisionMask: collisionMask, contactFlag: contactFlag})
        world = worldImporter;

        vehicleControl();
        this.mesh = [];

        this.chassisMesh;
        this.wheelMeshes = [];

        this.tuning;
        this.raycast;   // vehicle

        this.wheelDirectionCS0 = new Ammo.btVector3(0, -1, 0);
        this.wheelAxleCS = new Ammo.btVector3(-1, 0, 0);

        this.objectType = "vehicle";
    }

    async vehicle() {
        this.material = await objectHelper.generic.createMaterial({materialRaw: this.materialRaw});
        
        this.shape = await objectHelper.generic.createShape({Ammo: Ammo, scale: this.scale, dimensions: this.dimensions, type: "box"});

        this.chassisMesh = await objectHelper.generic.createMesh({scale: this.scale, position: this.position, rotationMesh: this.rotation, dimensions: this.dimensions, material: this.material, type: "box"});
        
        
        this.body = await objectHelper.generic.createBody({Ammo: Ammo, mass: this.mass, friction: this.friction, shape: this.shape, mesh: this.chassisMesh});

        this.tuning = await objectHelper.vehicle.createTuning({Ammo: Ammo});
        this.raycast = await objectHelper.vehicle.createRaycast({Ammo: Ammo, world: world, body: this.body, tuning: this.tuning});

        this.addWheel(true, new Ammo.btVector3(wheelHalfTrackFront, wheelAxisHeightFront, wheelAxisFrontPosition), wheelRadiusFront, wheelWidthFront, FRONT_LEFT);
        this.addWheel(true, new Ammo.btVector3(-wheelHalfTrackFront, wheelAxisHeightFront, wheelAxisFrontPosition), wheelRadiusFront, wheelWidthFront, FRONT_RIGHT);
        this.addWheel(false, new Ammo.btVector3(-wheelHalfTrackBack, wheelAxisHeightBack, wheelAxisPositionBack), wheelRadiusBack, wheelWidthBack, BACK_LEFT);
        this.addWheel(false, new Ammo.btVector3(wheelHalfTrackBack, wheelAxisHeightBack, wheelAxisPositionBack), wheelRadiusBack, wheelWidthBack, BACK_RIGHT);

        // combine meshes gefore export
        this.mesh.push(this.chassisMesh, ...this.wheelMeshes);

        // animate
        this.setTick();

        return this;
    }

    addWheel(isFront, pos, radius, width, index) {
        let wheelInfo = this.raycast.addWheel(
                pos,
                this.wheelDirectionCS0,
                this.wheelAxleCS,
                suspensionRestLength,
                radius,
                this.tuning,
                isFront);

        wheelInfo.set_m_suspensionStiffness(suspensionStiffness);
        wheelInfo.set_m_wheelsDampingRelaxation(suspensionDamping);
        wheelInfo.set_m_wheelsDampingCompression(suspensionCompression);
        wheelInfo.set_m_frictionSlip(friction);
        wheelInfo.set_m_rollInfluence(rollInfluence);

        let rotationGeometry = new Vector3(0, 0, Math.PI / 2)
        let dimensions = {r: radius, h: width}
        let wheelMesh = objectHelper.generic.createMesh({scale: this.scale, dimensions: dimensions, rotationGeometry: rotationGeometry, material: this.material, type: "cylinder"});
        dimensions = new Vector3(width * 1.5, radius * 1.75, radius*0.25);
        wheelMesh.add(objectHelper.generic.createMesh({scale: this.scale, dimensions: dimensions, material: this.material, type: "box"}));
        wheelMesh.restitution = 0.25;

        dimensions = {r: radius, h: width};
        let wheelShape = objectHelper.generic.createShape({Ammo: Ammo, scale: this.scale, dimensions: dimensions, type: "cylinder"});
        let wheelBody = objectHelper.generic.createBody({Ammo: Ammo, mass: 1, friction: 1, shape: wheelShape, mesh: wheelMesh});

        this.wheelMeshes[index] = wheelMesh;
    }

    setTick() {
        let sound = new audio();
        let speedometer = document.getElementById('speedometer').firstElementChild;

        if (this.mass > 0) this.body.setActivationState(STATE.DISABLE_DEACTIVATION);
        //body.setCollisionFlags(FLAGS.CF_KINEMATIC_OBJECT);    // user can move it, but object isn't effected by other objects or gravity
        
        // Sync physics and graphics
        this.raycast.tick = (dt, TRANSFORM_AUX) => {
            if (this.mixer) this.mixer.update(dt);
            if (this.resultantImpulse) this.body.setLinearVelocity(this.resultantImpulse);

            let speed = this.raycast.getCurrentSpeedKmHour();

            speedometer.innerHTML = String((speed < 0 ? '(R) ' : '') + Math.abs(speed).toFixed(1) + ' km/h').padStart(19);
    
            breakingForce = 0;
            engineForce = 0;
    
            if (window.actions.acceleration) {
                if (speed < -1)
                    breakingForce = maxBreakingForce;
                else {
                    // limit max speed
                    if (speed > 30)
                        engineForce = maxEngineForce/10;
                    else
                        engineForce = maxEngineForce;
                    
                    sound.acceleratingF();
                }
            } else {
                // slow down if not accelerating
                if (speed > 0.01 || speed < -0.01) {
                    breakingForce = speed/5;
                }
            }
            if (window.actions.braking) {
                if (speed > 1) {
                    breakingForce = maxBreakingForce;
                    sound.breakingF();
                }
                else engineForce = -maxEngineForce / 2;
            }
            if (window.actions.left) {
                if (vehicleSteering < steeringClamp)
                    vehicleSteering += steeringIncrement;
            }
            else {
                if (window.actions.right) {
                    if (vehicleSteering > -steeringClamp)
                        vehicleSteering -= steeringIncrement;
                }
                else {
                    if (vehicleSteering < -steeringIncrement)
                        vehicleSteering += steeringIncrement;
                    else {
                        if (vehicleSteering > steeringIncrement)
                            vehicleSteering -= steeringIncrement;
                        else {
                            vehicleSteering = 0;
                        }
                    }
                }
            }
    
            this.raycast.applyEngineForce(engineForce, BACK_LEFT);
            this.raycast.applyEngineForce(engineForce, BACK_RIGHT);
    
            this.raycast.setBrake(breakingForce / 2, FRONT_LEFT);
            this.raycast.setBrake(breakingForce / 2, FRONT_RIGHT);
            this.raycast.setBrake(breakingForce, BACK_LEFT);
            this.raycast.setBrake(breakingForce, BACK_RIGHT);
    
            this.raycast.setSteeringValue(vehicleSteering, FRONT_LEFT);
            this.raycast.setSteeringValue(vehicleSteering, FRONT_RIGHT);
    
            if (this.mass > 0) {
                for (let i = 0; i < this.raycast.getNumWheels(); i++) {
                    this.raycast.updateWheelTransform(i, true);
                    let tm = this.raycast.getWheelTransformWS(i);
                    let p = tm.getOrigin();
                    let q = tm.getRotation();
                    this.wheelMeshes[i].position.set(p.x(), p.y(), p.z());
                    this.wheelMeshes[i].quaternion.set(q.x(), q.y(), q.z(), q.w());
                }
                
                let tm = this.raycast.getChassisWorldTransform();
                let p = tm.getOrigin();
                let q = tm.getRotation();
                this.chassisMesh.position.set(p.x(), p.y(), p.z());
                this.chassisMesh.quaternion.set(q.x(), q.y(), q.z(), q.w());
            }
        }
    }
}


export { objectPropertiesVehicle };

let startedAccelerating = false;
let startedBreaking = false;

class audio {
    constructor() {
        this.soundAccelerting = new Howl({
            src: ['./../../../../../assets/audio/car/car_accelerating.wav'],
            volume: 0.2,
            sprite: {
                startAccelerting: [0, 1500],
                continueAccelerting: [900, 950],
            }
        });

        this.soundBreaking = new Howl({
            src: ['./../../../../../assets/audio/car/car_breaking.wav'],
            sprite: {
                startBreaking: [500, 1500],
            }
        });


        startedAccelerating = false;
        startedBreaking = false;
        /*
        this.sound.on('end', function(){
            console.log('Finished!');
            startedAccelerating = false;
            console.log(startedAccelerating);
        });
        */
    }

    acceleratingF() {
        //console.log(startedAccelerating);
        if (!startedAccelerating) {
            startedAccelerating = !startedAccelerating;
            //console.log("Sound on accelerating");
            this.soundAccelerting.play('continueAccelerting');

            setTimeout(() => {
                //console.log('Finished!');
                startedAccelerating = false;
                //console.log(startedAccelerating);
             }, 50);
             
        }/* else if (this.continueAccelerating) {
            console.log("Sound continue");
            this.sound.play('continueAccelerting'); 
        }*/
    }

    breakingF() {
        //console.log(startedBreaking);
        if (!startedBreaking) {
            startedBreaking = !startedBreaking;
            //console.log("Sound on breaking");
            this.soundBreaking.play('startBreaking');

            setTimeout(() => {
                //console.log('Finished!');
                startedBreaking = false;
                //console.log(startedBreaking);
             }, 1000);
             
        }/* else if (this.continueAccelerating) {
            console.log("Sound continue");
            this.sound.play('continueAccelerting'); 
        }*/
    }
}