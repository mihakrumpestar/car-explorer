import { BoxGeometry } from './../../../../../../vendor/build/three/three.module.js';
import generic from './generic.js';

export default {
    createShape({Ammo: Ammo, scale: scale, dimensions: dimensions}) {
        const shape = new Ammo.btBoxShape(new Ammo.btVector3(dimensions.x * 0.5, dimensions.y * 0.5, dimensions.z * 0.5));
        shape.setLocalScaling(new Ammo.btVector3(scale.x, scale.y, scale.z));

        return shape;
    },

    createMesh({scale: scale, position: position, rotation: rotation, dimensions: dimensions, material: material}) {
        const geometry = new BoxGeometry(dimensions.x, dimensions.y, dimensions.z, 1, 1, 1);
        const mesh = generic.createMeshFromGeometry({scale: scale, position: position, rotation: rotation, geometry: geometry, material: material});

        return mesh;
    },
}