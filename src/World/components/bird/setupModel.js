import { objectProperties } from '../bird/objectProperties.js';

async function setupModel(path, objectProperties) {

  await objectProperties.loadModel(path);
  await objectProperties.setAnimation(true);
  await objectProperties.createBody();
  await objectProperties.setStaticMovement();
  await objectProperties.setTick();

  return objectProperties.export();
}

export { setupModel };