import { Quaternion, Vector3 } from './../../../../vendor/build/three/three.module.js';
import { objectPropertiesglTF } from '../objectProperties/objectPropertiesglTF.js';
import { objectPropertiesCoin } from '../objectProperties/objectPropertiesCoin.js';
import { objectPropertiesVehicle } from '../objectProperties/objectPropertiesVehicle.js';
import objectHelper from './../objectProperties/objectHelper/objectHelper.js'
import { objectPropertiesNode } from '../objectProperties/objectPropertiesNode.js';
import { objectPropertiesSimpleObject } from '../objectProperties/objectPropertiesSimpleObject.js';
import { vehicleControl } from '../../systems/physics/vehicle/vehicleControl.js';
import { objectPropertiesAgent } from '../objectProperties/objectPropertiesAgent.js';

let mass;
let friction;
let position;
let rotation;
let scale;
let movement;
let dimensions;
let materialRaw;

const colGroupVehicle = 1, colGroupCollision = 2, colGroupNonCollision = 4;

async function multiModelLoader(Ammo, world) {
    const ground = new Map();
    const foliage = new Map();
    const props = new Map();
    const coins = new Map();
    const vehicles = new Map();

    const promises = [];

    const rootNode = await objectHelper.glTF.loadModel({path: '/assets/models/made/world.glb'});
    const sceneObjects = rootNode.scene.children;
    console.log({rootNode});

    sceneObjects.forEach((sceneObject) => {
        promises.push((async () => {
            let object;

            // console.log({sceneObject});
            switch(sceneObject.userData.objectType) {
                case "ground":
                    // console.log("ground", sceneObject);
                    object = await new objectPropertiesNode({Ammo: Ammo, model: sceneObject, rootNode: rootNode, collisionGroup: colGroupCollision, collisionMask: colGroupNonCollision | colGroupCollision | colGroupVehicle}).nodeLoaderglTF();
                    object.mesh.restitution = 0.25;
                    ground.set(object.uuid, object);
                break;
                case "foliagee":
                    // console.log("foliage", sceneObject);
                    object = await new objectPropertiesNode({Ammo: Ammo, model: sceneObject, rootNode: rootNode, collisionGroup: colGroupCollision, collisionMask: colGroupCollision}).nodeLoaderglTF();
                    foliage.set(object.uuid, object);
                break;
                case "prop":
                    // console.log("prop", sceneObject);
                    object = await new objectPropertiesNode({Ammo: Ammo, model: sceneObject, rootNode: rootNode, collisionGroup: colGroupCollision, collisionMask: colGroupCollision | colGroupVehicle}).nodeLoaderglTF();
                    props.set(object.uuid, object);
                break;
                case "coin":
                    // console.log("coin", sceneObject);
                    object = await new objectPropertiesCoin({Ammo: Ammo, model: sceneObject, rootNode: rootNode, collisionGroup: colGroupCollision, collisionMask: colGroupCollision | colGroupVehicle}).nodeLoaderglTF();
                    coins.set(object.uuid, object);
                break;
                case "vehicle":
                    // console.log("vehicle", sceneObject);
                    object = await new objectPropertiesNode({Ammo: Ammo, model: sceneObject, rootNode: rootNode, collisionGroup: colGroupVehicle, collisionMask: colGroupCollision | colGroupVehicle}).nodeLoaderglTF();
                    vehicles.set(object.uuid, object);
                break;
                case "portfolio":
                    // console.log("portfolio", sceneObject);
                    object = await new objectPropertiesNode({Ammo: Ammo, model: sceneObject, rootNode: rootNode, collisionGroup: colGroupCollision, collisionMask: colGroupCollision | colGroupVehicle}).nodeLoaderglTF();
                    props.set(object.uuid, object);
                    console.log("portfolio", object);
                break;
                default:
                    // console.log(`Alert! Object with name ${sceneObject.name} and uuid ${sceneObject.uuid} does not match any defined object groups!`);
            }
        })());
    });

/*
    mass = 0;
    friction = 2;
    promises.push((async () => {
        const object = await new objectPropertiesglTF({Ammo: Ammo, mass: mass, friction: friction, path: '/assets/models/made/ground.glb', collisionGroup: colGroupCollision, collisionMask: colGroupNonCollision | colGroupCollision | colGroupVehicle, objectType: "ground"}).glTF();
        ground.set(object.uuid, object);
        console.log("ground exported -----------", object.uuid, object);
    })());


    /*

    // ground
    mass = 0;
    friction = 2;
    position = new Vector3(0, -0.5, 0)
    dimensions = new Vector3(200, 1, 200);
    materialRaw = 0xa66c4f;    // material color
    promises.push((async () => {
        const object = await new objectPropertiesSimpleObject({Ammo: Ammo, mass: mass, friction: friction, position: position, dimensions: dimensions, materialRaw: materialRaw, collisionGroup: colGroupCollision, collisionMask: colGroupCollision | colGroupVehicle | colGroupNonCollision, contactFlag: "ground"}).simpleObject("box");
        console.log(object);
        ground.set(object.uuid, object);
    })());
*/
    // ramp
    mass = 0;
    friction = 2;
    position = new Vector3(0, -1.5, 0)
    dimensions = new Vector3(8, 4, 10);
    rotation = new Quaternion(0, 0, 0, 1);
    rotation.setFromAxisAngle(new Vector3(1, 0, 0), -Math.PI / 18);
    materialRaw = 0xa66c4f;    // material color
    promises.push((async () => {
        const object = await new objectPropertiesSimpleObject({Ammo: Ammo, mass: mass, friction: friction, position: position, rotation: rotation, dimensions: dimensions, materialRaw: materialRaw, collisionGroup: colGroupCollision, collisionMask: colGroupCollision | colGroupVehicle, contactFlag: "ground"}).simpleObject("box");
        console.log(object);
        ground.set(object.uuid, object);
    })());


    // box wall
    let size = 0.75;
    mass = 10;
    friction = 1;
    dimensions = new Vector3(size, size, size);
    materialRaw = 0xa66c4f;    // material color
    let nw = 8;
    let nh = 6;
    for (let j = 0; j < nw; j++) {
        for (let i = 0; i < nh; i++) {
            promises.push((async () => {
                position = new Vector3(size * j - (size * (nw - 1)) / 2, size * i, 10);
                const object = await new objectPropertiesSimpleObject({Ammo: Ammo, mass: mass, friction: friction, position: position, dimensions: dimensions, materialRaw: materialRaw, collisionGroup: colGroupCollision, collisionMask: colGroupCollision | colGroupVehicle, objectType: "box"}).simpleObject("box");
                // console.log("Made a cube", object.uuid, object);
                props.set(object.uuid, object);
            })());
        }
    }
/*
    // cylinder
    mass = 100;
    position = { x: 4, y: 10, z: 10 };
    dimensions = { r: 5, h: 10 };
    rotation = undefined;
    materialRaw = 0xa66c4f;    // material color
    promises.push((async () => {
        const object = await new objectPropertiesSimpleObject({Ammo: Ammo, mass: mass, position: position, rotation: rotation, dimensions: dimensions, materialRaw: materialRaw, collisionGroup: colGroupCollision, collisionMask: colGroupCollision | colGroupVehicle, objectType: "cylinder"}).simpleObject("cylinder");
        props.set(object.uuid, object);
    })());

    mass = 100;
    position = { x: 4, y: 10, z: 10 };
    dimensions = { r: 5 };
    rotation = undefined;
    materialRaw = 0xa66c4f;    // material color
    promises.push((async () => {
        const object = await new objectPropertiesSimpleObject({Ammo: Ammo, mass: mass, position: position, rotation: rotation, dimensions: dimensions, materialRaw: materialRaw, collisionGroup: colGroupCollision, collisionMask: colGroupCollision | colGroupVehicle, objectType: "sphere"}).simpleObject("sphere");
        props.set(object.uuid, object);
    })());

    mass = 100;
    position = { x: 4, y: 10, z: 10 };
    dimensions = { r: 5 };
    rotation = undefined;
    materialRaw = 0xa66c4f;    // material color
    promises.push((async () => {
        const object = await new objectPropertiesSimpleObject({Ammo: Ammo, mass: mass, position: position, rotation: rotation, dimensions: dimensions, materialRaw: materialRaw, collisionGroup: colGroupCollision, collisionMask: colGroupCollision | colGroupVehicle, objectType: "cone"}).simpleObject("cone");
        props.set(object.uuid, object);
    })());

  */

    // vehicle
    mass = 800;
    position = new Vector3(0, 4, -20);
    dimensions = new Vector3(1.8, 0.6, 4);
    materialRaw = 0x990000;
    // const ZERO_QUATERNION = new Quaternion(0, 0, 0, 1);
    promises.push((async () => {
        const object = await new objectPropertiesVehicle({Ammo: Ammo, worldImporter: world, mass: mass, position: position, dimensions: dimensions, movement: movement, materialRaw: materialRaw, collisionGroup: colGroupVehicle, collisionMask: colGroupCollision | colGroupVehicle, objectType: "vehicle"}).vehicle();
        vehicles.set(object.uuid, object);
    })());

    await Promise.all(
        promises
    );

    const [ _, targetVehicle ] = Array.from(vehicles)[0];
    //console.log(targetVehicle);
    // agent
    mass = 50;
    friction = 3;
    position = new Vector3(2, 5, -20);
    dimensions = new Vector3(1, 1, 1);
    materialRaw = 0xee0f1c;
    promises.push((async () => {
        const object = await new objectPropertiesAgent({Ammo: Ammo, target: targetVehicle.chassisMesh, mass: mass, friction: friction, position: position, dimensions: dimensions, materialRaw: materialRaw, collisionGroup: colGroupCollision, collisionMask: colGroupCollision | colGroupVehicle, objectType: "box"}).simpleObject("box");
        props.set(object.uuid, object);
    })());


  
    // parrot
    console.log("parrot-------------")
    mass = 20;
    position = { x: 0, y: 10, z: -5 };
    movement = { x: 0, y: 0.01, z: 0.2 };
    scale = new Vector3(0.05, 0.05, 0.05);
    promises.push((async () => {
        const object = await new objectPropertiesglTF({Ammo: Ammo, mass: mass, position: position, scale: scale, movement: movement, path: '/assets/models/Parrot.glb', collisionGroup: colGroupCollision, collisionMask: colGroupCollision | colGroupVehicle, objectType: "parrot"}).glTF();
        props.set(object.uuid, object);
    })());

    /*
    mass = 50;
    friction = 3;
    position = { x: 0, y: 5, z: -7 };
    dimensions = new Vector3(1, 1, 1);
    materialRaw = 0xa66c4f;
    (async () => {
        const object = await new objectPropertiesSimpleObject({Ammo: Ammo, mass: mass, friction: friction, position: position, rotation: rotation, dimensions: dimensions, materialRaw: materialRaw, collisionGroup: colGroupNonCollision, collisionMask: colGroupCollision, objectType: "testCube"}).simpleObject("box");
        props.set(object.uuid, object);
    })();
    
/*
    // coins
    mass = 0;
    friction = 3;
    scale = { x: 0.01, y: 0.01, z: 0.01 };
    rotation = new Quaternion(0, 0, 0, 1);
    rotation.setFromAxisAngle(new Vector3(1, 0, 0), -Math.PI / 40);
    let positions = [
        new Vector3(6, 0.2, -7),
        new Vector3(5, 0.2, -7),
        new Vector3(4, 0.2, -7),
        new Vector3(-4, 0.2, -7),
        new Vector3(0, 0.2, -6),
        new Vector3(0, 0.2, -5),
        new Vector3(0, 0.2, -4),
        new Vector3(0, 0.2, -3),
    ];

    positions.forEach((position) => {
        promises.push((async () => {
            const object =  await new objectPropertiesCoin({Ammo: Ammo, mass: mass, friction: friction, position: position, scale: scale, rotation: rotation, path: '/assets/models/made/coin/coin.glb', collisionGroup: colGroupCollision, collisionMask: colGroupCollision | colGroupVehicle, objectType: "coin"}).glTF();
            coins.set(object.uuid, object);
        })());
    });
    
    
*/ /*
    mass = 200;
    friction = 3;
    position = new Vector3(4, 2, -4);
    promises.push((async () => {
        const object = await new objectPropertiesglTF({Ammo: Ammo, mass: mass, friction: friction, position: position, path: '/assets/models/made/desert/rocks/rock_11.glb', collisionGroup: colGroupCollision, collisionMask: colGroupCollision | colGroupVehicle, objectType: "rock"}).glTF();
        props.set(object.uuid, object);
        //console.log("out single", object.uuid, object);
    })());

    mass = 200;
    friction = 3;
    position = new Vector3(4.5, 2, -4);
    promises.push((async () => {
        const object = await new objectPropertiesglTF({Ammo: Ammo, mass: mass, friction: friction, position: position, path: '/assets/models/made/desert/rocks/rock_11.glb', collisionGroup: colGroupCollision, collisionMask: colGroupCollision | colGroupVehicle, objectType: "rock"}).glTF();
        props.set(object.uuid, object);
        //console.log("out sungle 2", object.uuid, object);
    })());

    mass = 200;
    friction = 1;
    position = new Vector3(7, 2, -4);
    promises.push((async () => {
        const object = await new objectPropertiesglTF({Ammo: Ammo, mass: mass, friction: friction, path: '/assets/models/made/rock_11_copy.glb', collisionGroup: colGroupCollision, collisionMask: colGroupCollision | colGroupVehicle, objectType: "rock"}).glTF();
        props.set(object.uuid, object);
        //console.log("the copy", object.uuid, object);
    })());
/*
    mass = 0;
    friction = 1;
    position = new Vector3(4.5, 2, -4);
    promises.push((async () => {
        const object = await new objectPropertiesglTF({Ammo: Ammo, mass: mass, friction: friction, position: position, path: '/assets/models/made/base.glb', collisionGroup: colGroupCollision, collisionMask: colGroupCollision | colGroupVehicle, objectType: "ground"}).glTF();
        ground.set(object.uuid, object);
        console.log("base", object.uuid, object);
    })());
/*
    mass = 0;
    friction = 3;
    position = new Vector3(30, -1, 5);
    promises.push((async () => {
        const object = await new objectPropertiesglTF({Ammo: Ammo, mass: mass, friction: friction, position: position, path: '/assets/models/made/desert/rocks/rock_14.glb', collisionGroup: colGroupCollision, collisionMask: colGroupCollision | colGroupVehicle, objectType: "rock"}).glTF();
        props.set(object.uuid, object);
    })());

    mass = 0;
    friction = 3;
    position = new Vector3(2, -1, 40);
    promises.push((async () => {
        const object = await new objectPropertiesglTF({Ammo: Ammo, mass: mass, friction: friction, position: position, path: '/assets/models/made/desert/rocks/rock_2.glb', collisionGroup: colGroupCollision, collisionMask: colGroupCollision | colGroupVehicle, objectType: "rock"}).glTF();
        props.set(object.uuid, object);
    })());

*/




    await Promise.all(
        promises
    ).then(() => {
        console.log("Loaded all", promises.length, "models!");

        // removing loading screen
        window.loadingScreenToggle(false);
    });

    new Set([...ground, ...foliage, ...props, ...coins, ...vehicles]).forEach(([uuid, object]) => {
        // console.log(object.objectType, uuid, object);
        addToWorld(world, ...object.export());
    });

    return {ground, foliage, props, coins, vehicles};
}
    
export { multiModelLoader };


function addToWorld(world, collisionGroup, collisionMask, mesh, body, raycast) {
    if (mesh)
        if (Array.isArray(mesh)) {
            world.scene.add(...mesh);
            if (typeof mesh[0].tick == 'function')
                world.loop.updatables.push(...mesh);
        } else {
            world.scene.add(mesh);
            if (typeof mesh.tick == 'function')
                world.loop.updatables.push(mesh);
        }
    if (body) {
        if (collisionGroup)
            world.physicsWorld.addRigidBody(body, collisionGroup, collisionMask);   // both collisionGroup and collisionMask have to be defined, to add collision grouping
        else
            world.physicsWorld.addRigidBody(body);
    }
    if (raycast) {
        world.physicsWorld.addAction(raycast);
        world.loop.updatables.push(raycast);
    };
}