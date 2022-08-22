import { glTFPhysicsDefault } from "./glTFPhysicsDefault.js";
import { glTFLoader } from "./glTFLoader.js";

async function setupModel(Ammo, path, mass, position, rotation, scale, movement) {
  let data = await glTFLoader(path);

  console.log('Loaded new glTF model: ', data);

  let [mesh, body] = await glTFPhysicsDefault(Ammo, data, mass, position, rotation, scale, movement);

  console.log({mesh});
  console.log({body});

  return [mesh, body];
}

export { setupModel };