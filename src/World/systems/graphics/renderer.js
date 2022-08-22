import { WebGLRenderer } from './../../../../../vendor/build/three/three.module.js';

function createRenderer() {
	// Detects webgl
  testWebGL();

  const renderer = new WebGLRenderer({ antialias: true });

  renderer.physicallyCorrectLights = true;

  return renderer;
}



export { createRenderer };




function testWebGL() {
    if (!window.WebGLRenderingContext) {
    // the browser doesn't even know what WebGL is
    document.getElementById('container').innerHTML = "WebGL not supported.";
  } else {
    let canvas = document.createElement('canvas');
    let context = canvas.getContext("webgl");
    //document.element

    if (!context) {
      // browser supports WebGL but initialization failed.
      document.getElementById('container').innerHTML = "Browser supports WebGL but initialization failed.";
    } else {
      	document.getElementById('container').innerHTML = "";
    }
  }
}
