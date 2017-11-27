const THREE = require(`three`);

export default class Ball {

  constructor() {
    this.mesh = new THREE.Object3D();

    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const material = new THREE.MeshBasicMaterial({color: 0xffffff});
    this.ball = new THREE.Mesh(geometry, material);
    this.mesh.add(this.ball);
  }

}
