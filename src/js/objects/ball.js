const THREE = require(`three`);

export default class Ball {

  constructor() {
    this.mesh = new THREE.Object3D();

    const geometry = new THREE.SphereGeometry(2, 32, 32);
    geometry.applyMatrix(new THREE.Matrix4().makeTranslation(6, 0, 0));
    const material = new THREE.MeshPhongMaterial({color: `cyan`});
    this.ball = new THREE.Mesh(geometry, material);
    this.mesh.add(this.ball);
  }

}
