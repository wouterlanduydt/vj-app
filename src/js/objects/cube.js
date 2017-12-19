const THREE = require(`three`);

export default class Cube {

  constructor() {
    this.mesh = new THREE.Object3D();

    const geometry = new THREE.BoxGeometry(2, 2, 2, 10, 10, 10);
    const material = new THREE.MeshPhongMaterial({color: 0x000000, shininess: 1});
    material.needsUpdate = true;
    this.cube = new THREE.Mesh(geometry, material);

    this.defaultMaterial = new THREE.MeshPhongMaterial({
      color: 0x000000,
      shininess: 1
    });


    this.wireframeMaterial = new THREE.MeshPhongMaterial({
      color: 0x000000,
      shininess: 1,
      wireframe: true
    });

    this.standardMaterial = new THREE.MeshStandardMaterial({
      metalness: 1,
      roughness: .5
    });

    this.cube.receiveShadow = true;
    this.mesh.add(this.cube);
  }

}
