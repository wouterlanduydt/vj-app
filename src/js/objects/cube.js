const THREE = require(`three`);

export default class Cube {

  constructor() {
    this.mesh = new THREE.Object3D();

    const geometry = new THREE.BoxGeometry(1, 1, 1, 5, 5, 5);
    const material = new THREE.MeshBasicMaterial({color: 0xffffff, wireframe: true});
    this.cube = new THREE.Mesh(geometry, material);
    this.mesh.add(this.cube);
  }

}
