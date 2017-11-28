import Cube from './objects/Cube';
import Hexagon from './objects/Hexagon';
import Triangle from './objects/Triangle';
import Ball from './objects/Ball';
import mapRange from './lib/mapRange';
import removeAllObjects from './lib/removeAllObjects';
import getVisualFromMessage from './lib/getVisualFromMessage';

const THREE = require(`three`);

let scene,
  camera,
  fieldOfView,
  aspectRatio,
  HEIGHT,
  WIDTH,
  renderer,
  container;

let cube, hexagon, ball, triangle;

let selectedVisual;

// Development Mode
const cameraPos = {z: 30},
  cameraMaxPos = {z: 1000};

// Midi Mode
// const cameraPos = {z: 0},
//   cameraMaxPos = {z: 1000};

const ballRotation = {x: 0, y: 0, z: 0},
  hexagonRotation = {x: 0, y: 0, z: 0};

const ballMaxRotation = {x: 0.3, y: 0.3, z: 0.3},
  hexagonMaxRotation = {x: 0.3, y: 0.3, z: 0.3};

const cubeProps = {width: 10, height: 10, depth: 10},
  cubeRotation = {x: 0, y: 0, z: 0};

const cubeMaxProps = {width: 800, height: 800, depth: 800},
  cubeMaxRotation = {x: 0.3, y: 0.3, z: 0.3};

// Development Mode
const init = () => {
  configureMidiControlls();
  createScene();
  visualTwoCreate();
  selectedVisual = 2;
  loop();
};

// Midi Mode
// const init = () => {
//   configureMidiControlls();
//   createScene();
//   loop();
// };

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
    console.error(`Midi connection failed.`);
  }

  const onMIDIMessage = message => {
    console.log(`MIDI CONTROL: ${message.data}`);

    // CAMERA Z CONTROLS
    if (message.data[1] === 9) {
      cameraPos.z = mapRange(message.data[2], 0, 127, 0, cameraMaxPos.z);
    }

    const createFunctions = {
      1: visualOneCreate,
      2: visualTwoCreate,
      3: visualThreeCreate,
      4: visualFourCreate
    };

    const visualFromMessage = getVisualFromMessage(message, selectedVisual);

    if (visualFromMessage && selectedVisual !== visualFromMessage) {
      removeAllObjects(scene);
      selectedVisual = visualFromMessage;
      createFunctions[selectedVisual]();
    }

    visualControls(selectedVisual, message);
  };
};

const visualControls = (selectedVisual, message) => {
  const ctrlFilOne = message.data[1] === 6,
    ctrlFilTwo = message.data[1] === 7,
    ctrlFilThree = message.data[1] === 8,

    ctrlSldrOne = message.data[1] === 2,
    ctrlSldrTwo = message.data[1] === 3,
    ctrlSldrThree = message.data[1] === 4;

  if (selectedVisual === 1) {
    console.log(`[VISUAL 1]`);

    // CUBE PROPS
    if (ctrlFilOne) {
      cubeProps.width = mapRange(message.data[2], 0, 127, 10, cubeMaxProps.width);
    }
    if (ctrlFilTwo) {
      cubeProps.height = mapRange(message.data[2], 0, 127, 10, cubeMaxProps.height);
    }
    if (ctrlFilThree) {
      cubeProps.depth = mapRange(message.data[2], 0, 127, 10, cubeMaxProps.depth);
    }

    // CUBE ROTATION
    if (ctrlSldrOne) {
      cubeRotation.x = mapRange(message.data[2], 0, 127, 0, cubeMaxRotation.x);
    }
    if (ctrlSldrTwo) {
      cubeRotation.y = mapRange(message.data[2], 0, 127, 0, cubeMaxRotation.y);
    }
    if (ctrlSldrThree) {
      cubeRotation.z = mapRange(message.data[2], 0, 127, 0, cubeMaxRotation.z);
    }
  }

  if (selectedVisual === 2) {
    // CUBE ROTATION
    if (ctrlSldrOne) {
      ballRotation.y = mapRange(message.data[2], 0, 127, 0, ballMaxRotation.y);
    }
    if (ctrlSldrTwo) {
      hexagonRotation.y = mapRange(message.data[2], 0, 127, 0, hexagonMaxRotation.y);
    }
    if (ctrlSldrThree) {
      hexagonRotation.z = mapRange(message.data[2], 0, 127, 0, hexagonMaxRotation.z);
    }
  }

  if (selectedVisual === 3) {
    console.log(`[VISUAL 3]`);
  }

  if (selectedVisual === 4) {
    console.log(`[VISUAL 4]`);
  }

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
  const light = new THREE.PointLight(0xffffff, 2, 100, 5);
  light.position.set(3, 0, 15);
  light.castShadow = true;
  scene.add(light);

  // const pointLightHelper = new THREE.PointLightHelper(light, 1, 0xff0000);
  // scene.add(pointLightHelper);

  renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  });
  renderer.setSize(WIDTH, HEIGHT);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;

  container = document.getElementById(`scene`);
  container.appendChild(renderer.domElement);

  window.addEventListener(`resize`, handleWindowResize, false);
};

const visualOneCreate = () => {
  console.log(`[CREATE VISUAL 1]`);
  createCube();
};

const visualTwoCreate = () => {
  console.log(`[CREATE VISUAL 2]`);
  createHexagon();
  createBall();
  createTriangle();
};

const visualThreeCreate = () => {
  console.log(`[CREATE VISUAL 3]`);
};

const visualFourCreate = () => {
  console.log(`[CREATE VISUAL 4]`);
};

const createCube = () => {
  cube = new Cube();
  scene.add(cube.mesh);
};

const createHexagon = () => {
  hexagon = new Hexagon();
  hexagon.castShadow = true;
  hexagon.receiveShadow = true;

  scene.add(hexagon.mesh);
};

const createTriangle = () => {
  triangle = new Triangle();
  // triangle.castShadow = true;
  // triangle.receiveShadow = true;

  scene.add(triangle.mesh);
};

const createBall = () => {
  ball = new Ball();
  ball.castShadow = true;
  ball.receiveShadow = true;
  scene.add(ball.mesh);
};

const updateSceneOne = () => {
  cube.mesh.rotation.x += cubeRotation.x;
  cube.mesh.rotation.y += cubeRotation.y;
  cube.mesh.rotation.z += cubeRotation.z;

  cube.mesh.scale.x = cubeProps.width;
  cube.mesh.scale.y = cubeProps.height;
  cube.mesh.scale.z = cubeProps.depth;
};

const updateSceneTwo = () => {
  ball.mesh.rotation.y += ballRotation.y;

  hexagon.mesh.rotation.y += hexagonRotation.y;
  hexagon.mesh.rotation.z += hexagonRotation.z;
};

const updateSceneThree = () => {
  console.log(`scene three controls`);
};

const updateSceneFour = () => {
  console.log(`scene four controls`);
};

const loop = () => {
  camera.position.z = cameraPos.z;
  renderer.render(scene, camera);

  if (selectedVisual === 1) {
    updateSceneOne();
  }
  if (selectedVisual === 2) {
    updateSceneTwo();
  }
  if (selectedVisual === 3) {
    updateSceneThree();
  }
  if (selectedVisual === 4) {
    updateSceneFour();
  }

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
