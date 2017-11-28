const THREE = require(`three`);

export default class Triangle {

  constructor() {
    this.mesh = new THREE.Object3D();
    const geometry = new THREE.Geometry();
    const v1 = new THREE.Vector3(0, 0, 0);
    const v2 = new THREE.Vector3(0, 10, 0);
    const v3 = new THREE.Vector3(0, 10, 10);

    geometry.vertices.push(new THREE.Vector3(v1));
    geometry.vertices.push(new THREE.Vector3(v2));
    geometry.vertices.push(new THREE.Vector3(v3));

    const material = new THREE.MeshNormalMaterial({wireframe: true});
    geometry.applyMatrix(new THREE.Matrix4().makeTranslation(6, 5, 0));
    this.triangle = new THREE.Mesh(geometry, material);
    this.mesh.add(this.triangle);
  }

}
