import { CylinderGeometry } from '../../../../../../vendor/build/three/three.module.js';
import generic from './generic.js';

export default {
    createShape({Ammo: Ammo, scale: scale, dimensions: dimensions}) {
        const shape = new Ammo.btConeShape(dimensions.r, dimensions.h);
        shape.setLocalScaling(new Ammo.btVector3(scale.x, scale.y, scale.z));

        return shape;
    },

    createMesh({scale: scale, position: position, rotation: rotation, dimensions: dimensions, material: material}) {
        const geometry = new CylinderGeometry(0, dimensions.r, dimensions.h, 20, 2);
        const mesh = generic.createMeshFromGeometry(scale, position, rotation, geometry, material);

        return mesh;
    },
}