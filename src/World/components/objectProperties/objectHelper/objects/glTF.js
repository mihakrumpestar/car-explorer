import { AnimationMixer, Group, Vector3 } from './../../../../../../vendor/build/three/three.module.js';
import { glTFLoader } from "./glTFLoader.js";
import generic from './generic.js';

export default {
    async loadModel({path: path}) {
        const model = await glTFLoader({path: path});
        // console.log('Loaded new glTF model: ', this.model);

        return model;
    },

    createMesh({scale: scale, position: position, rotation: rotation, model: model}) {
        // get mesh out of data

        // model needs to have a root node to bind as mesh, or directly if used with objectProperties().nodeLoaderglTF()
        let mesh;
        if (model.scenes) {
            mesh = model.scenes[0].children[0];
        } else {
            mesh = model;
        }

        if (mesh.type != "Mesh") {
            console.log("\nOne of the meshes was exported as object! Loader can handle groups, but you might get strange results...\n");
        } 

        generic.applyAtributesToMesh({mesh: mesh, scale: scale, position: position, rotation: rotation});

        return mesh;
    },

    // put together using:  https://gitanswer.com/ammo-js-custom-shape-for-imported-3d-meshs-cplusplus-355235802
    //                      https://stackoverflow.com/questions/39441459/rigid-body-shape-in-bullet-ammo-js-from-a-mesh-in-three-js
    //                      https://stackoverflow.com/questions/59665854/ammo-js-custom-mesh-collision-with-sphere
    //                      https://discourse.threejs.org/t/how-to-add-ammo-js-physic-to-gltf-file/27539
    //                      https://qiita.com/yuichik-kusunoki/items/46922bfba8d388ff015f
    //                      https://qiita.com/yuichik-kusunoki/items/639a76e603ba91b00e93
    //                      https://github.com/THISISAGOODNAME/learn-ammojs/blob/master/Demo7-convex%20break.html
    //                      https://discourse.threejs.org/t/rigidbody-with-imported-obj-in-three-js-and-ammo-js-collision/15600/4
    //                      https://stackoverflow.com/questions/26229836/bullet-physics-library-switching-rigidbody-between-static-object-and-dynamic-obj
    //                      https://stackoverflow.com/questions/21975650/use-of-mass-in-bullet
    //                      https://www.coder.work/article/7738115

    createShape({Ammo: Ammo, mesh: mesh, scale: scale}) {

        // TODO normalize vertices and indixes, as they are not offseted by parent groups
        const {transform, shape} = traverseVerticesIndices(Ammo, mesh, scale);
        // we don't use transform

        return shape;
    },

    createMixer({mesh: mesh}) {
        return new AnimationMixer(mesh);
    },

    setAnimation({play: play, clip: clip, mixer: mixer}) {
        // animations

        //console.log(data.animations.length);
        if (play === true && clip.length === 1) {
            clip = clip[0]; 
            const action = mixer.clipAction(clip);
            action.play();
        } else if (play === true && typeof play === Number) {
            clip = clip[play];
            const action = mixer.clipAction(clip);
            action.play();
        }
    },
}

function createBtConvexHullShape(Ammo, vertices, indices, scale) {
    // btTriangleMesh does not rotate, but btConvexHullShape does !!!!!
    const shape = new Ammo.btConvexHullShape();
    if (scale) shape.setLocalScaling(new Ammo.btVector3(scale.x, scale.y, scale.z));

    //new ammo vectors
    let _vec3_1 = new Ammo.btVector3(0,0,0);
    let _vec3_2 = new Ammo.btVector3(0,0,0);
    let _vec3_3 = new Ammo.btVector3(0,0,0);

    for (let i = 0; i * 3 < indices.length; i++) {
        _vec3_1 = new Ammo.btVector3(vertices[indices[i * 3] * 3], vertices[indices[i * 3] * 3 + 1], vertices[indices[i * 3] * 3 + 2]);
        _vec3_2 = new Ammo.btVector3(vertices[indices[i * 3 + 1] * 3], vertices[indices[i * 3 + 1] * 3 + 1], vertices[indices[i * 3 + 1] * 3 + 2]);
        _vec3_3 = new Ammo.btVector3(vertices[indices[i * 3 + 2] * 3], vertices[indices[i * 3 + 2] * 3 + 1], vertices[indices[i * 3 + 2] * 3 + 2]);


        shape.addPoint(_vec3_1, true);
        shape.addPoint(_vec3_2, true);
        shape.addPoint(_vec3_3, true);
    }

    return shape;
}

/*
function addMeshes(mesh, group) {
    if (mesh.children.length == 0) {
        group.add(mesh);
    } else {
        mesh.children.forEach( (meshChild) => {
            const groupChild = new Group();
            group.add(groupChild);
            addMeshes(meshChild, groupChild);
        });
    }

    return group;
}
*/

function traverseVerticesIndices(Ammo, mesh, scale) {
    // let arrayVertices = new Float32Array();
    // let arrayIndices = new Uint16Array();

    if (mesh.geometry) {
        let vertices = mesh.geometry.attributes.position.array;
        let indices = mesh.geometry.index.array;

        const transform = new Ammo.btTransform();
        transform.setIdentity();
        transform.setOrigin(mesh.position);
        transform.setRotation(mesh.quaternion);

        const shape = createBtConvexHullShape(Ammo, vertices, indices, scale);

        return {transform, shape};
    } else if (mesh.type == "Object3D") {
        let transform = "filler";
        const shape = new Ammo.btCompoundShape();

        mesh.children.forEach((meshChild) => {
            const child = traverseVerticesIndices(Ammo, meshChild, scale);
            shape.addChildShape(child.transform, child.shape);
        });

        return {transform, shape};
    }

    console.log("Error, mesh.geometry does not exist in child!");
    return;
}
/*
function addIndices(mesh) {
    let array = new Uint16Array();

    if (mesh.geometry) {
        return mesh.geometry.index.array;
    } else {
        mesh.children.forEach( (meshChild) => {
            array = array.concat(addIndices(meshChild));
        });
    }


    return array;
}
*/



Float32Array.prototype.concat = function() {
	let bytesPerIndex = 4,
		buffers = Array.prototype.slice.call(arguments);
	
	// add self
	buffers.unshift(this);

	buffers = buffers.map(function (item) {
		if (item instanceof Float32Array) {
			return item.buffer;
		} else if (item instanceof ArrayBuffer) {
			if (item.byteLength / bytesPerIndex % 1 !== 0) {
				throw new Error('One of the ArrayBuffers is not from a Float32Array');	
			}
			return item;
		} else {
			throw new Error('You can only concat Float32Array, or ArrayBuffers');
		}
	});

	let concatenatedByteLength = buffers
		.map(function (a) {return a.byteLength;})
		.reduce(function (a,b) {return a + b;}, 0);

    let concatenatedArray = new Float32Array(concatenatedByteLength / bytesPerIndex);

    let offset = 0;
	buffers.forEach(function (buffer, index) {
		concatenatedArray.set(new Float32Array(buffer), offset);
		offset += buffer.byteLength / bytesPerIndex;
	});

	return concatenatedArray;
};

Uint16Array.prototype.concat = function(array2) {
    let arrayTemp = new Uint16Array(this.length + array2.length);

    this.forEach((element, index) => {
        arrayTemp[index] = element;
    });

    array2.forEach((element, index) => {
        arrayTemp[(this.length+index)] = element;
    });

    return arrayTemp;
}