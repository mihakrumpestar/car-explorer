import { GLTFLoader } from '../../../../vendor/examples/jsm/loaders/GLTFLoader.js';

async function glTFLoader(path) {
    const loader = new GLTFLoader();
  
    const model = await loader.loadAsync(path);
  
    return model;
  }
  
  export { glTFLoader };