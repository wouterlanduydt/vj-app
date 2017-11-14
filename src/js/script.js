import Cube from './objects/Cube';
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

const cameraPos = {z: 0};
const cameraMaxPos = {z: 1000};

const cubeProps = {width: 10, height: 10, depth: 10};
const cubeRotation = {x: 0, y: 0, z: 0};

const cubeMaxProps = {width: 800, height: 800, depth: 800};
const cubeMaxRotation = {x: 0.3, y: 0.3, z: 0.3};

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

    // CAMERA Z CONTROLS
    if (message.data[0] === 188 && message.data[1] === 9) {
      cameraPos.z = mapRange(message.data[2], 0, 127, 0, cameraMaxPos.z);
    }

    // CUBE PROPS
    if (message.data[0] === 188 && message.data[1] === 6) {
      cubeProps.width = mapRange(message.data[2], 0, 127, 10, cubeMaxProps.width);
    }
    if (message.data[0] === 188 && message.data[1] === 7) {
      cubeProps.height = mapRange(message.data[2], 0, 127, 10, cubeMaxProps.height);
    }
    if (message.data[0] === 188 && message.data[1] === 8) {
      cubeProps.depth = mapRange(message.data[2], 0, 127, 10, cubeMaxProps.depth);
    }

    // CUBE ROTATION
    if (message.data[0] === 188 && message.data[1] === 2) {
      cubeRotation.x = mapRange(message.data[2], 0, 127, 0, cubeMaxRotation.x);
    }
    if (message.data[0] === 188 && message.data[1] === 3) {
      cubeRotation.y = mapRange(message.data[2], 0, 127, 0, cubeMaxRotation.y);
    }
    if (message.data[0] === 188 && message.data[1] === 4) {
      cubeRotation.z = mapRange(message.data[2], 0, 127, 0, cubeMaxRotation.z);
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
  cube.mesh.rotation.x += cubeRotation.x;
  cube.mesh.rotation.y += cubeRotation.y;
  cube.mesh.rotation.z += cubeRotation.z;

  cube.mesh.scale.x = cubeProps.width;
  cube.mesh.scale.y = cubeProps.height;
  cube.mesh.scale.z = cubeProps.depth;
};

const loop = () => {
  camera.position.z = cameraPos.z;
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
