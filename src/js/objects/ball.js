const THREE = require(`three`);

let texture, video;

export default class Ball {

  constructor() {
    this.mesh = new THREE.Object3D();

    video = document.getElementById(`video1`);

    texture = new THREE.VideoTexture(video);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.format = THREE.RGBFormat;
    texture.aspectRatio = 20;

    const parameters = {color: 0xffffff, map: texture};

    const geometry = new THREE.SphereGeometry(4, 32, 32);
    const material = new THREE.MeshLambertMaterial(parameters);
    this.hexagon = new THREE.Mesh(geometry, material);
    this.mesh.add(this.hexagon);
  }

}
