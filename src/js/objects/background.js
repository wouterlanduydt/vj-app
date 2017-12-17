const THREE = require(`three`);

let video, texture;

export default class Background {

  constructor() {
    this.mesh = new THREE.Object3D();
    video = document.getElementById(`video1`);

    texture = new THREE.VideoTexture(video);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.format = THREE.RGBFormat;
    texture.aspectRatio = 30;

    const geometry = new THREE.SphereGeometry(30, 32, 32);
    const material = new THREE.MeshBasicMaterial({color: 0x000000, side: THREE.DoubleSide});
    this.background = new THREE.Mesh(geometry, material);

    this.defaultMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000,
      side: THREE.DoubleSide,
    });

    this.videoMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000,
      map: texture,
      side: THREE.DoubleSide
    });
    this.wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000,
      wireframe: true,
      side: THREE.DoubleSide
    });

    this.background.receiveShadow = true;
    this.mesh.add(this.background);
  }

}
