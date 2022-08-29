import { MeshPhysicalMaterial, Mesh, BoxGeometry, CylinderGeometry, SphereGeometry } from './../../../../../../vendor/build/three/three.module.js';

export default {
    createMaterial({materialRaw: materialRaw}) {
        const material = new MeshPhysicalMaterial( { color: materialRaw } );

        return material;
    },

    createShape({Ammo: Ammo, scale: scale, dimensions: dimensions, type: type}) {
        let shape;

        switch(type) {
            case "box":
                shape = new Ammo.btBoxShape(new Ammo.btVector3(dimensions.x * 0.5, dimensions.y * 0.5, dimensions.z * 0.5));
                break;
            case "cone":
                shape = new Ammo.btConeShape(dimensions.r, dimensions.h);
                break;
            case "cylinder":
                shape = new Ammo.btCylinderShape( new Ammo.btVector3(dimensions.r, dimensions.h * 0.5, dimensions.r));
                break;
            case "sphere":
                shape = new Ammo.btSphereShape(dimensions.r); // radius
                break;
            default:
                console.log("/// property 'type' was set wrong when creating a generic Shape ///");
        }

        if (scale) shape.setLocalScaling(new Ammo.btVector3(scale.x, scale.y, scale.z));

        return shape;
    },

    createMesh({scale: scale, position: position, rotationGeometry: rotationGeometry, rotationMesh: rotationMesh, dimensions: dimensions, material: material, type: type}) {
        let geometry;

        switch(type) {
            case "box":
                geometry = new BoxGeometry(dimensions.x, dimensions.y, dimensions.z, 1, 1, 1);
                break;
            case "cone":
                geometry = new CylinderGeometry(0, dimensions.r, dimensions.h, 20, 2);
                break;
            case "cylinder":
                geometry = new CylinderGeometry(dimensions.r, dimensions.r, dimensions.h, 24*2, 1); // radius, radius, height
                break;
            case "sphere":
                geometry = new SphereGeometry(dimensions.r, 20, 20);
                break;
            default:
                console.log("/// property 'type' was set wrong when creating a generic Mesh ///");
        }
        
        if (rotationGeometry) {
            geometry.rotateX(rotationGeometry.x);
            geometry.rotateY(rotationGeometry.y);
            geometry.rotateZ(rotationGeometry.z);
        }
        
        const mesh = this.createMeshFromGeometry({scale: scale, position: position, rotation: rotationMesh, geometry: geometry, material: material});

        return mesh;
    },

    createMeshFromGeometry({scale: scale, position: position, rotation: rotation, geometry: geometry, material: material}) {
        const mesh = new Mesh(geometry, material);
        this.applyAtributesToMesh({mesh: mesh, scale: scale, position: position, rotation: rotation});
    
        return mesh;
    },
    
    applyAtributesToMesh({mesh: mesh, scale: scale, position: position, rotation: rotation}) {
        if (scale) mesh.scale.set(scale.x, scale.y, scale.z);
        if (position) mesh.position.set(position.x, position.y, position.z);
        if (rotation) mesh.quaternion.set(rotation._x, rotation._y, rotation._z, rotation._w);

        applyShadow(mesh);
        if (mesh.material && mesh.material.map) mesh.material.map.anisotropy = 16;
    },
    

    createBody({Ammo: Ammo, mass: mass, friction: friction, shape: shape, mesh: mesh}) {
        const transform = new Ammo.btTransform();
        transform.setIdentity();

        if (mesh) {
            let position = _.cloneDeep(mesh.position);
            let rotation = _.cloneDeep(mesh.quaternion);
            transform.setOrigin(new Ammo.btVector3(position.x, position.y, position.z));
            transform.setRotation(new Ammo.btQuaternion(rotation._x, rotation._y, rotation._z, rotation._w));
        }

        const motionState = new Ammo.btDefaultMotionState(transform);

        const localInertia = new Ammo.btVector3(0, 0, 0);
        shape.calculateLocalInertia(mass, localInertia);

        const rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, shape, localInertia);
        const body = new Ammo.btRigidBody(rbInfo);

        body.setFriction(friction);
        // body.setRollingFriction(100);   // force that glues objects to other objects in close proximity (they do't need to be actualy touching)
        // body.setRestitution(0.9);   // objects become bouncy
        // body.setDamping(0.2, 0.2);   // no idea yet

        return body;
    },
}


function applyShadow(mesh) {
    if (mesh.type == "Mesh")  {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
    } else if (mesh.type == "Object3D") {
        mesh.children.forEach((meshChild) => {
            applyShadow(meshChild);
        });
    }
}