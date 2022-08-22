import { Cache } from '../../../../../../vendor/build/three/three.module.js';
import { GLTFLoader } from '../../../../../../vendor/examples/jsm/loaders/GLTFLoader.js';

async function glTFLoader({path: path}) {
  Cache.enabled = true;

  const loader = new GLTFLoader();
  
  const [model] = await Promise.all([
    loader.loadAsync(path),
  ]);
  
  return model;
}
  
export { glTFLoader };