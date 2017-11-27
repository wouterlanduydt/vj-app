const THREE = require(`three`);

export default class Hexagon {

  constructor() {
    this.mesh = new THREE.Object3D();

    const geometry = new THREE.SphereGeometry(10, 6, 6);
    const material = new THREE.MeshNormalMaterial({wireframe: true});
    this.hexagon = new THREE.Mesh(geometry, material);
    this.mesh.add(this.hexagon);
  }

}
