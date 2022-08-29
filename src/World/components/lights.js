import {
  AmbientLight,
  DirectionalLight,
  HemisphereLight,
} from './../../../vendor/build/three/three.module.js';

function createLights() {
  //const ambientLight = new AmbientLight('white', 2);

  // ambient light
  const ambientLight = new HemisphereLight(
    'white', // bright sky color
    'darkslategrey', // dim ground color
    2, // intensity 5
  );

  //ambientLight.color.setHSL(0.6, 0.6, 0.6);
  //ambientLight.groundColor.setHSL(0.1, 1, 0.4);
  ambientLight.position.set(0, 50, 0);

  const mainLight = new DirectionalLight('white', 5);
  //mainLight.color.setHSL(0.1, 1, 0.95);
  mainLight.position.set(10, 10, 10);
  mainLight.position.multiplyScalar( 100 );

  mainLight.castShadow = true;

  // to help: https://stackoverflow.com/questions/48938170/three-js-odd-striped-shadows
  mainLight.shadow.bias = -0.00001; // -0.00003; // best value -0.000007;
  mainLight.shadow.mapSize.set(1024*4, 1024*4);

  let d = 100; // 50

  mainLight.shadow.camera.left = -d;
  mainLight.shadow.camera.right = d;
  mainLight.shadow.camera.top = d;
  mainLight.shadow.camera.bottom = -d;
 // mainLight.shadow.camera.near = 9000;
  mainLight.shadow.camera.far = 13500; // 13500

  return { ambientLight, mainLight };
}

export { createLights };