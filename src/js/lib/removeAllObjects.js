export default function removeAllObjects(scene)  {
  while (scene.children.length > 0) {
    scene.remove(scene.children[0]);
  }
}
