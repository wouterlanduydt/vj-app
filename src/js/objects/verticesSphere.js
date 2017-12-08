let video, texture;

const THREE = require(`three`);

export default class VerticesSphere {

  constructor() {
    const geom = new THREE.SphereGeometry(1, 10, 10);
    geom.applyMatrix(new THREE.Matrix4().makeRotationX(- Math.PI / 2));

    // important: by merging vertices we ensure the continuity of the waves
    geom.mergeVertices();

    // get the vertices
    const l = geom.vertices.length;

    // create an array to store new data associated to each vertex
    this.waves = [];

    for (let i = 0;i < l;i ++) {
      // get each vertex
      const v = geom.vertices[i];

      // store some data associated to it
      this.waves.push({y: v.y,
        x: v.x,
        z: v.z,
        // a random angle
        ang: Math.random() * Math.PI * 3,
        // a random distance
        amp: 1 + Math.random() * 2,
      });
    }

    video = document.getElementById(`video1`);

    texture = new THREE.VideoTexture(video);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.format = THREE.RGBFormat;
    texture.aspectRatio = 20;

    const mat = new THREE.MeshBasicMaterial({
      color: `cyan`,
      transparent: true,
      opacity: .8,
      map: texture
    });

    this.mesh = new THREE.Mesh(geom, mat);
    this.mesh.receiveShadow = true;
  }

  editVertices()  {
    const verts = this.mesh.geometry.vertices;
    const l = verts.length;

    for (let i = 0;i < l;i ++) {
      const v = verts[i];

      // get the data associated to it
      const vprops = this.waves[i];

      // update the position of the vertex
      v.x = vprops.x + Math.cos(vprops.ang) * vprops.amp;
      v.y = vprops.y + Math.sin(vprops.ang) * vprops.amp;

      // increment the angle for the next frame
      // vprops.ang += vprops.speed;
    }
    this.mesh.geometry.verticesNeedUpdate = true;
  }
}
