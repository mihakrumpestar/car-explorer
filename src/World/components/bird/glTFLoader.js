import { GLTFLoader } from '../../../../vendor/examples/jsm/loaders/GLTFLoader.js';

async function glTFLoader(path) {
    const loader = new GLTFLoader();
  
    const [model] = await Promise.all([
      loader.loadAsync(path),
    ]);
  
    return model;
  }
  
  export { glTFLoader };