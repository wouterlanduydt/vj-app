export default function removeAllObjects(scene)  {
  while (scene.children.length > 0) {
    console.log(scene.children.length);
    scene.remove(scene.children[0]);
  }
}
