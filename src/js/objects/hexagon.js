const THREE = require(`three`);

export default class Hexagon {

  constructor() {
    this.mesh = new THREE.Object3D();

    const geometry = new THREE.SphereGeometry(5, 6, 6);
    const material = new THREE.MeshLambertMaterial({color: `white`});
    this.hexagon = new THREE.Mesh(geometry, material);
    this.mesh.add(this.hexagon);
  }

}
