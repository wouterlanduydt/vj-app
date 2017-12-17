const THREE = require(`three`);

export default class VerticesSphere {

  constructor() {
    const geom = new THREE.SphereGeometry(1, 10, 10);
    geom.applyMatrix(new THREE.Matrix4().makeRotationX(- Math.PI / 2));

    geom.mergeVertices();

    const l = geom.vertices.length;

    this.parts = [];

    for (let i = 0;i < l;i ++) {
      const v = geom.vertices[i];

      this.parts.push({
        y: v.y,
        x: v.x,
        z: v.z,
        ang: Math.random(0.0, 3.0) * Math.PI * 3,
        amp: 1 + Math.random(0.0, 3.0) * 2,
      });
    }

    const mat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: .8,
    });

    this.defaultMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: .8
    });

    this.phongMaterial = new THREE.MeshPhongMaterial({
      color: 0x000000,
      shininess: 1
    });

    this.wireframeMaterial = new THREE.MeshPhongMaterial({
      color: 0x000000,
      shininess: 1,
      transparent: true,
      opacity: .8,
      wireframe: true
    });

    this.mesh = new THREE.Mesh(geom, mat);
    this.mesh.receiveShadow = true;
  }

  editVertices()  {
    const verts = this.mesh.geometry.vertices;
    const l = verts.length;

    for (let i = 0;i < l;i ++) {
      const v = verts[i];

      const vprops = this.parts[i];

      v.x = vprops.x + Math.cos(vprops.ang) * vprops.amp;
      v.y = vprops.y + Math.sin(vprops.ang) * vprops.amp;
      v.z = vprops.z + Math.sin(vprops.ang) * vprops.amp;
    }
    this.mesh.geometry.verticesNeedUpdate = true;
  }
}
