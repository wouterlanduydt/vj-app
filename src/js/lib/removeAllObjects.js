export default function removeAllObjects(scene, camera)  {
  while (scene.children.length > 0) {
    scene.remove(scene.children[0]);
    camera.position.x = 0;
    camera.position.y = 0;
  }
}
