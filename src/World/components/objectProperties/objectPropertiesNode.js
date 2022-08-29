import { Quaternion, Vector3 } from '../../../../vendor/build/three/three.module.js';
import objectHelper from './objectHelper/objectHelper.js';

class objectPropertiesNode {

    /* Available properties to extract
        Ammo
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
        this.rootNode = properties.rootNode;

        this.STATE = { DISABLE_DEACTIVATION: 4 };

        // material for non-glTF objects, not in its final form
        this.materialRaw = properties.materialRaw ? _.cloneDeep(properties.materialRaw): undefined;
        this.material;

        // list of common object atributes (copy them, as we could use single position for multiple objects, and with references, they would all change)
        this.mass =         properties.mass        ? _.cloneDeep(properties.mass)      : 0;
        this.friction =     properties.friction    ? _.cloneDeep(properties.friction)  : 1;
        this.position =     properties.position    ? _.cloneDeep(properties.position)  : new Vector3(0, 0, 0);
        this.movement =     properties.movement    ? _.cloneDeep(properties.movement)  : new Vector3(0, 0, 0);

        // contains model from rootNode
        this.model = properties.model;

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
        this.objectType = this.model.userData.objectType;

        // unique identifier
        this.uuid;
    }

    
    async nodeLoaderglTF() {
        this.mass = this.model.userData.mass;
        this.position = this.model.position;
        this.rotation = this.model.quaternion;
        this.scale = this.model.scale;
        this.movement = this.model.userData.movement ? this.model.userData.movement : new Vector3(0, 0, 0);


        this.mesh = await objectHelper.glTF.createMesh({model: this.model});
        this.uuid = this.mesh.uuid;

        this.position = _.cloneDeep(this.mesh.position);
        this.rotation = _.cloneDeep(this.mesh.quaternion);

        this.shape = await objectHelper.glTF.createShape({Ammo: this.Ammo, mesh: this.mesh});

        // set margine, as multinode glTF scene seems to overcalculate mesh
        this.shape.setMargin(-0.003);
        this.body = await objectHelper.generic.createBody({Ammo: this.Ammo, position: this.position, rotation: this.rotation, mass: this.mass, friction: this.friction, shape: this.shape, mesh: this.mesh});

        // animate
        const name = this.mesh.name;
        // get animation that matches mesh name +_Action, but you will have to make sure that that is done properly in blender
        const animation = this.rootNode.animations.filter(function (object) {
            return object.name == name + "_Action";
        });

        this.mixer = await objectHelper.glTF.createMixer({mesh: this.mesh});
        if (animation) await objectHelper.glTF.setAnimation({play: true, clip: animation, mixer: this.mixer});
        this.resultantImpulse = this.setStaticMovement(this.movement);
        this.setTick();

        return this;
    }


    setStaticMovement(movement) {
        let resultantImpulse;

        if (movement.x !== 0 || movement.y !== 0 || movement.z !== 0) {
            resultantImpulse = new this.Ammo.btVector3(movement.x, movement.y, movement.z);
            resultantImpulse.op_mul(20);

            // console.log("resultantImpulse set");
        }

        return resultantImpulse;
    }

    stopStaticMovement(resultantImpulse) {
        resultantImpulse = undefined;
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
        console.log(this.objectType, this.uuid, "removed from world");
        console.log(this.position);

        world.physicsWorld.removeRigidBody(this.body);  // deelte physics first, as it might take long time to do rest
        world.scene.remove(this.mesh);
        // world.loop.removeUpdatable(this.mesh); // crashes collisionHandler
        if (this.raycast) world.physicsWorld.removeAction(this.raycast);
    }

}


export { objectPropertiesNode };
