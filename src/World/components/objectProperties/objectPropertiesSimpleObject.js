import { Quaternion, Vector3 } from '../../../../vendor/build/three/three.module.js';
import objectHelper from './objectHelper/objectHelper.js';

class objectPropertiesSimpleObject {

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
        this.Ammo = properties.Ammo;

        this.STATE = { DISABLE_DEACTIVATION: 4 };
        this.FLAGS = { CF_KINEMATIC_OBJECT: 2 };
        this.margin = 0;    // how much will there be an offset between physics shape vs mesh

        // material for non-glTF objects, not in its final form
        this.materialRaw = _.cloneDeep(properties.materialRaw);
        this.material;

        // list of common object atributes (copy them, as we could use single position for multiple objects, and with references, they would all change)
        this.mass =         properties.mass        ? _.cloneDeep(properties.mass)      : 0;
        this.friction =     properties.friction    ? _.cloneDeep(properties.friction)  : 1;
        this.position =     properties.position    ? _.cloneDeep(properties.position)  : new Vector3(0, 0, 0);
        this.rotation =     properties.rotation    ? _.cloneDeep(properties.rotation)  : new Quaternion(0, 0, 0, 1);
        this.scale =        properties.scale       ? _.cloneDeep(properties.scale)     : new Vector3(1, 1, 1);
        this.movement =     properties.movement    ? _.cloneDeep(properties.movement)  : new Vector3(0, 0, 0);
        this.dimensions =   properties.dimensions  ? _.cloneDeep(properties.dimensions): new Vector3(1, 1, 1);

        // contains animations
        this.mixer;

        // primary 3 object definitions mesh = scene, body = physics, raycast = vehicle (combined bodies)
        this.mesh;
        this.shape;
        this.body;

        // make objects move staticly
        this.resultantImpulse;

        // collision groups (they tell what object can collide (will bump) and which not (can go though))
        this.collisionGroup = properties.collisionGroup;   // in what group body belongs
        this.collisionMask = properties.collisionMask;     // with what group body can collide

        // tells collisionHandler what the object is/represents (eg. a coin, a vehicle...)
        this.objectType = properties.objectType;

        // unique identifier
        this.uuid;
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


    setStaticMovement(movement) {
        let resultantImpulse;

        if (movement.x !== 0 || movement.y !== 0 || movement.z !== 0) {
            resultantImpulse = new Ammo.btVector3(movement.x, movement.y, movement.z);
            resultantImpulse.op_mul(20);
        }

        return resultantImpulse;
    }

    stopStaticMovement(resultantImpulse) {
        resultantImpulse = false;
    }

    setTick() {
        if (this.mass > 0) this.body.setActivationState(this.STATE.DISABLE_DEACTIVATION);
        //body.setCollisionFlags(this.FLAGS.CF_KINEMATIC_OBJECT);    // user can move it, but object isn't effected by other objects or gravity
        
        // Sync physics and graphics
        this.mesh.tick = (dt, TRANSFORM_AUX) => {
            if (this.mixer) this.mixer.update(dt);
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


    export() {
        return [this.collisionGroup, this.collisionMask, this.mesh, this.body, this.raycast];
    }


    removeFromWorld(world) {
        console.log(this.objectType, this.uiid, "removed from world");
        console.log(this.position);

        world.physicsWorld.removeRigidBody(this.body);  // deelte physics first, as it might take long time to do rest
        world.scene.remove(this.mesh);
        // world.loop.updatables.pop(this.mesh); // crashes collisionHandler
        if (this.raycast) world.physicsWorld.removeAction(this.raycast);
    }
}


export { objectPropertiesSimpleObject };
