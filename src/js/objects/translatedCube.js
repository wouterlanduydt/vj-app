const THREE = require(`three`);

export default class TranslatedCube {

  constructor() {
    this.mesh = new THREE.Object3D();

    const geometry = new THREE.BoxGeometry(3, 3, 3, 10, 10, 10);
    geometry.applyMatrix(new THREE.Matrix4().makeTranslation(6, 0, 0));
    const material = new THREE.MeshNormalMaterial();
    this.ball = new THREE.Mesh(geometry, material);
    this.mesh.add(this.ball);
  }
}
