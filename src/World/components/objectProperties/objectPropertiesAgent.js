import { Quaternion, Vector3 } from '../../../../vendor/build/three/three.module.js';
import objectHelper from './objectHelper/objectHelper.js';
import { objectPropertiesSimpleObject } from './objectPropertiesSimpleObject.js';

class objectPropertiesAgent extends objectPropertiesSimpleObject {

    /* Available properties to extract
        AmmoImporter
        mass
        friction
        position
        rotation
        scale
        movement
        dimensions
        materialRaw     // takes color as input
        path
        collisionGroup
        collisionMask
        contactFlag
    */

    constructor(properties) {
        super(properties);

        this.target = properties.target;
    }


    // objectName = [box, cone, cylinder, sphere]
    async simpleObject(objectName) {
        this.material = await objectHelper.generic.createMaterial({materialRaw: this.materialRaw});
        this.shape = await objectHelper.generic.createShape({Ammo: this.Ammo, scale: this.scale, dimensions: this.dimensions, type: objectName});
        this.shape.setMargin(this.margin);
        this.mesh = await objectHelper.generic.createMesh({scale: this.scale, position: this.position, rotationMesh: this.rotation, dimensions: this.dimensions, material: this.material, type: objectName});
        this.uuid = this.mesh.uuid;

        this.body = await objectHelper.generic.createBody({Ammo: this.Ammo, mass: this.mass, friction: this.friction, shape: this.shape, mesh: this.mesh});

        // animate
        this.resultantImpulse = this.setStaticMovement(this.movement);
        this.setTick();

        return this;
    }
    

    targetTrackingHandler() {
        // console.log(this.target.position);
        let power = 0.2;
        let offset = 3;

        this.movement = new Vector3(0, 0, 0);

        let targetPos = this.target.position;
        let agentPos = this.mesh.position;

        if (agentPos.x > targetPos.x+offset)
            this.movement.x = -power;

        if (agentPos.x < targetPos.x-offset)
            this.movement.x = power;

        if (agentPos.z > targetPos.z+offset)
            this.movement.z = -power;

        if (agentPos.z < targetPos.z-offset)
            this.movement.z = power;

        this.resultantImpulse = this.setStaticMovement(this.movement);
    }

    setTick() {
        if (this.mass > 0) this.body.setActivationState(this.STATE.DISABLE_DEACTIVATION);
        //body.setCollisionFlags(this.FLAGS.CF_KINEMATIC_OBJECT);    // user can move it, but object isn't effected by other objects or gravity
        
        // Sync physics and graphics
        this.mesh.tick = (dt, TRANSFORM_AUX) => {
            if (this.mixer) this.mixer.update(dt);
            this.targetTrackingHandler();
            if (this.resultantImpulse) this.body.setLinearVelocity(this.resultantImpulse);

            if (this.mass > 0) {
                let ms = this.body.getMotionState();
                if (ms) {
                    ms.getWorldTransform(TRANSFORM_AUX);
                    let p = TRANSFORM_AUX.getOrigin();
                    let q = TRANSFORM_AUX.getRotation();
                    this.mesh.position.set(p.x(), p.y(), p.z());
                    this.mesh.quaternion.set(q.x(), q.y(), q.z(), q.w());
                }
            }
        }
    }
}


export { objectPropertiesAgent };
