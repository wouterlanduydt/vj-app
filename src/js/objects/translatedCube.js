const THREE = require(`three`);

export default class TranslatedCube {

  constructor() {
    this.mesh = new THREE.Object3D();

    const geometry = new THREE.BoxGeometry(1, 1, 1, 10, 10, 10);
    geometry.applyMatrix(new THREE.Matrix4().makeTranslation(4, 0, 0));
    const material = new THREE.MeshLambertMaterial({color: `red`});
    this.ball = new THREE.Mesh(geometry, material);
    this.mesh.add(this.ball);
  }
}
