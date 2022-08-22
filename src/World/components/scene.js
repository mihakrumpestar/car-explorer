import { Color, Scene } from './../../../vendor/build/three/three.module.js';

function createScene() {
  const scene = new Scene();

  scene.background = new Color('skyblue');

  return scene;
}

export { createScene };