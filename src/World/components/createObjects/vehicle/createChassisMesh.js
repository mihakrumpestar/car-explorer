import { Mesh, BoxGeometry, MeshPhongMaterial } from './../../../../../vendor/build/three/three.module.js';


let materialDynamic = new MeshPhongMaterial( { color:0xfca400 } );
let materialStatic = new MeshPhongMaterial( { color:0x999999 } );
let materialInteractive = new MeshPhongMaterial( { color:0x990000 } );

function createChassisMesh(w, l, h) {
    var shape = new BoxGeometry(w, l, h, 1, 1, 1);
    var mesh = new Mesh(shape, materialInteractive);
    //scene.add(mesh);

    mesh.castShadow = true;
    mesh.receiveShadow = true;

    return mesh;
}

export { createChassisMesh }