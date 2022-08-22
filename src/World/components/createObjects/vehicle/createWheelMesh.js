import { CylinderGeometry, Mesh, BoxGeometry, MeshPhongMaterial } from './../../../../../vendor/build/three/three.module.js';


let materialDynamic = new MeshPhongMaterial( { color:0xfca400 } );
let materialStatic = new MeshPhongMaterial( { color:0x999999 } );
let materialInteractive = new MeshPhongMaterial( { color:0x990000 } );

function createWheelMesh(radius, width) {
    let t = new CylinderGeometry(radius, radius, width, 24, 1);
    t.rotateZ(Math.PI / 2);
    let mesh = new Mesh(t, materialInteractive);
    mesh.add(new Mesh(new BoxGeometry(width * 1.5, radius * 1.75, radius*.25, 1, 1, 1), materialInteractive));
    //scene.add(mesh);
    return mesh;
}

export { createWheelMesh }