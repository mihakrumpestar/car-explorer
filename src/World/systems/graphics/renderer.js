import { WebGLRenderer, PCFSoftShadowMap, sRGBEncoding, NoToneMapping } from './../../../../../vendor/build/three/three.module.js';

function createRenderer() {
	// Detects webgl
  testWebGL();

  const renderer = new WebGLRenderer({ antialias: true });

  renderer.physicallyCorrectLights = true;

  renderer.setPixelRatio( window.devicePixelRatio );
  //renderer.gammaInput = true;
  //renderer.gammaOutput = true;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;

  renderer.outputEncoding = sRGBEncoding;
  renderer.toneMapping = NoToneMapping;

  return renderer;
}



export { createRenderer };




function testWebGL() {
  window.webgl = false;
  if (!window.WebGLRenderingContext) {
    // the browser doesn't even know what WebGL is
    document.getElementById('start-menu').innerHTML = "WebGL not supported.";
  } else {
    let canvas = document.createElement('canvas');
    let context = canvas.getContext("webgl");

    if (!context) {
      // browser supports WebGL but initialization failed.
      document.getElementById('start-menu').innerHTML = "Browser supports WebGL but initialization failed.";
    } else {
      document.getElementById('start-menu');
      window.webgl = true;
    }
  }
}
