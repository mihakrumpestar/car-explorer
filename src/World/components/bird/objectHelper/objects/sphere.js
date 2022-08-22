import { SphereGeometry } from './../../../../../../vendor/build/three/three.module.js';
import generic from './generic.js';

export default {
    createShape({Ammo: Ammo, scale: scale, dimensions: dimensions}) {
        const shape = new Ammo.btSphereShape(dimensions.r); // radius
        shape.setLocalScaling(new Ammo.btVector3(scale.x, scale.y, scale.z));

        return shape;
    },

    createMesh({scale: scale, position: position, rotation: rotation, dimensions: dimensions, material: material}) {
        const geometry = new SphereGeometry(dimensions.r, 20, 20);
        const mesh = generic.createMeshFromGeometry(scale, position, rotation, geometry, material);

        return mesh;
    },
}