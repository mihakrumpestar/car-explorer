import { Vector3 } from "/vendor/build/three/three.module.js";

/**
 * Takes a touch point and converts it to a vector that represents that
 * position in the 3d world
 */
const getPositionInScene = (element, clientX, clientY, camera, scale = 10) => {
  const relativeX = (clientX / window.innerWidth) * 2 - 1;
  const relativeY = -((clientY-element.offsetTop) / (window.innerHeight-element.offsetTop)) * 2 + 1;

  const inSceneTouchVector = new Vector3(relativeX, relativeY, 0)
    .unproject(camera)
    .sub(camera.position)
    .normalize()
    .multiplyScalar(scale)

  return camera.position.clone().add(inSceneTouchVector)
}

export default getPositionInScene
