import Cube from './objects/cube';
import mapRange from './lib/mapRange';

const THREE = require(`three`);

let scene,
  camera,
  fieldOfView,
  aspectRatio,
  HEIGHT,
  WIDTH,
  renderer,
  container;

let cube;

const cubeProps = {width: 10, height: 10, depth: 10};

const init = () => {
  configureMidiControlls();
  createScene();
  createCube();

  loop();
};

const configureMidiControlls = () => {
  if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess()
      .then(success, failure);
  }

  function success (midi) {
    const inputs = midi.inputs.values();

    for (let input = inputs.next();input && !input.done;input = inputs.next()) {
      input.value.onmidimessage = onMIDIMessage;
    }
  }

  function failure () {
    console.error(`No access to midi devices.`);
  }

  const onMIDIMessage = message => {
    console.log(message.data);

    if (message.data[0] === 188 && message.data[1] === 6) {
      cubeProps.width = mapRange(message.data[2], 0, 127, 10, 500);
    }
    if (message.data[0] === 188 && message.data[1] === 7) {
      cubeProps.height = mapRange(message.data[2], 0, 127, 10, 500);
    }
    if (message.data[0] === 188 && message.data[1] === 8) {
      cubeProps.depth = mapRange(message.data[2], 0, 127, 10, 500);
    }
  };
};

const createScene = () => {
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;

  scene = new THREE.Scene();
  aspectRatio = WIDTH / HEIGHT;
  fieldOfView = 60;
  camera = new THREE.PerspectiveCamera(
    fieldOfView,
    aspectRatio,
    1,
    10000
  );
  camera.position.set(0, 0, 1000);

  renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  });
  renderer.setSize(WIDTH, HEIGHT);

  container = document.getElementById(`scene`);
  container.appendChild(renderer.domElement);

  window.addEventListener(`resize`, handleWindowResize, false);
};

const createCube = () => {
  cube = new Cube();
  scene.add(cube.mesh);
};

const updateCube = () => {
  cube.mesh.rotation.x += 0.01;
  cube.mesh.rotation.y += 0.01;

  cube.mesh.scale.x = cubeProps.width;
  cube.mesh.scale.y = cubeProps.height;
  cube.mesh.scale.z = cubeProps.depth;
};

const loop = () => {
  renderer.render(scene, camera);
  updateCube();
  requestAnimationFrame(loop);
};

const handleWindowResize = () => {
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;
  renderer.setSize(WIDTH, HEIGHT);
  camera.aspect = WIDTH / HEIGHT;
  camera.updateProjectionMatrix();
};

init();
