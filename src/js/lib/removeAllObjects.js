export default function removeAllObjects(scene)  {
  for (let i = 0;i < scene.children.length;i ++) {
    scene.remove(scene.children[i]);
  }
}
