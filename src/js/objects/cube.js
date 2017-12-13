const THREE = require(`three`);

export default class Cube {

  constructor() {
    this.mesh = new THREE.Object3D();

    const geometry = new THREE.BoxGeometry(1, 1, 1, 10, 10, 10);
    const material = new THREE.MeshPhongMaterial({color: 0xff0000});
    material.needsUpdate = true;
    this.cube = new THREE.Mesh(geometry, material);
    this.cube.receiveShadow = true;
    this.mesh.add(this.cube);
  }

}
