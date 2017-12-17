const THREE = require(`three`);

export default class Ball {

  constructor() {
    this.mesh = new THREE.Object3D();
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const material = new THREE.MeshPhongMaterial({color: 0x000000, shininess: 1});
    this.ball = new THREE.Mesh(geometry, material);

    this.direction = [
      Math.random(),
      Math.random(),
      Math.random()
    ];

    this.defaultMaterial = new THREE.MeshPhongMaterial({
      color: 0x000000,
      shininess: 1
    });

    this.standardMaterial = new THREE.MeshStandardMaterial({
      color: 0x000000,
      metalness: .4,
      roughness: .2
    });

    this.wireframeMaterial = new THREE.MeshPhongMaterial({
      color: 0x000000,
      transparent: true,
      opacity: .8,
      wireframe: true
    });

    this.mesh.add(this.ball);
  }

}
