import { glTFPhysicsDefault } from "./glTFPhysicsDefault.js";
import { glTFLoader } from "./glTFLoader.js";

async function setupModel(Ammo, path, mass, friction, position, rotation, scale, movement) {
  let data = await glTFLoader(path);

  console.log('Loaded new glTF model: ', data);

  let [mesh, body] = await glTFPhysicsDefault(Ammo, data, JSON.parse(JSON.stringify(mass)), JSON.parse(JSON.stringify(friction)), JSON.parse(JSON.stringify(position)), JSON.parse(JSON.stringify(rotation)), JSON.parse(JSON.stringify(scale)), JSON.parse(JSON.stringify(movement)));

  console.log({mesh});
  console.log({body});

  return [mesh, body];
}

export { setupModel };