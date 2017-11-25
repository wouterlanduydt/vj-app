import Cube from './objects/Cube';
import mapRange from './lib/mapRange';
import removeAllObjects from './lib/removeAllObjects';

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

let selectedVisual;

const cameraPos = {z: 0};
const cameraMaxPos = {z: 1000};

const cubeProps = {width: 10, height: 10, depth: 10};
const cubeRotation = {x: 0, y: 0, z: 0};

const cubeMaxProps = {width: 800, height: 800, depth: 800};
const cubeMaxRotation = {x: 0.3, y: 0.3, z: 0.3};

const init = () => {
  configureMidiControlls();
  createScene();
  loop();
};

const configureMidiControlls = () => {
  if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess()
      .then(success, failure);
    console.log(`Midi connecting`);
  }

  function success (midi) {
    console.log(`Midi connection succesfull`);
    const inputs = midi.inputs.values();

    for (let input = inputs.next();input && !input.done;input = inputs.next()) {
      input.value.onmidimessage = onMIDIMessage;
    }
  }

  function failure () {
    console.error(`Midi connection failed.`);
  }

  const onMIDIMessage = message => {
    console.log(message.data);

    // CAMERA Z CONTROLS
    if (message.data[1] === 9) {
      cameraPos.z = mapRange(message.data[2], 0, 127, 0, cameraMaxPos.z);
    }

    const renderFunctions = {
      1: visualOneRender,
      2: visualTwoRender,
      3: visualThreeRender,
      4: visualFourRender
    };

    const visualFromMessage = getVisualFromMessage(message);
    if (visualFromMessage && selectedVisual !== visualFromMessage) {
      selectedVisual = visualFromMessage;
      removeAllObjects(scene);
      renderFunctions[selectedVisual]();
    }

    const sceneOnePressed = message.data[1] === 37 && message.data[2] === 127,
      sceneTwoPressed = message.data[1] === 38 && message.data[2] === 127,
      sceneThreePressed = message.data[1] === 39 && message.data[2] === 127,
      sceneFourPressed = message.data[1] === 34 && message.data[2] === 127;

    const getVisualFromMessage = () => {
      if (sceneOnePressed && selectedVisual !== 1) {
        return 1;
      }
      if (sceneTwoPressed && selectedVisual !== 2) {
        return 2;
      }
      if (sceneThreePressed && selectedVisual !== 3) {
        return 3;
      }
      if (sceneFourPressed && selectedVisual !== 4) {
        return 4;
      }
      return false;
    };

    visualControls(selectedVisual, message);

    // switch (selectedVisual) {
    // case 1:
    //   visualOneControls(message);
    //   break;
    // case 2:
    //   visualTwoControls(message);
    //   break;
    // case 3:
    //   visualThreeControls(message);
    //   break;
    // case 4:
    //   visualFourControls(message);
    //   break;
    // }
  };
};

const visualControls = (selectedVisual, message) => {
  const ctrlFilOne = message.data[1] === 6,
    ctrlFilTwo = message.data[1] === 7,
    ctrlFilThree = message.data[1] === 8,

    ctrlSldrOne = message.data[1] === 2,
    ctrlSldrTwo = message.data[1] === 3,
    ctrlSldrThree = message.data[1] === 4,

    filterMapValue = (message.data[2], 0, 127),
    sliderMapValue = (message.data[2], 0, 127);

  if (selectedVisual === 1) {
    console.log(`[VISUAL 1]`, message.data);
    // CUBE PROPS
    if (ctrlFilOne) {
      cubeProps.width = mapRange(filterMapValue, cubeProps.width, cubeMaxProps.width);
    }
    if (ctrlFilTwo) {
      cubeProps.height = mapRange(filterMapValue, cubeProps.height, cubeMaxProps.height);
    }
    if (ctrlFilThree) {
      cubeProps.depth = mapRange(filterMapValue, cubeProps.depth, cubeMaxProps.depth);
    }

    // CUBE ROTATION
    if (ctrlSldrOne) {
      cubeRotation.x = mapRange(sliderMapValue, cubeRotation.x, cubeMaxRotation.x);
    }
    if (ctrlSldrTwo) {
      cubeRotation.y = mapRange(sliderMapValue, cubeRotation.y, cubeMaxRotation.y);
    }
    if (ctrlSldrThree) {
      cubeRotation.z = mapRange(sliderMapValue, cubeRotation.z, cubeMaxRotation.z);
    }
  }

  if (selectedVisual === 2) {
    console.log(`[VISUAL 2]`, message.data);
  }

  if (selectedVisual === 3) {
    console.log(`[VISUAL 2]`, message.data);
  }

  if (selectedVisual === 4) {
    console.log(`[VISUAL 2]`, message.data);
  }

};

// // MIDI LOGIC FOR DIFFERENT SCENES
// const visualOneControls = message => {
//   console.log(`[VISUAL 1]`, message.data);
//
//   // CUBE PROPS
//   if (message.data[1] === 6) {
//     cubeProps.width = mapRange(message.data[2], 0, 127, 10, cubeMaxProps.width);
//   }
//   if (message.data[1] === 7) {
//     cubeProps.height = mapRange(message.data[2], 0, 127, 10, cubeMaxProps.height);
//   }
//   if (message.data[1] === 8) {
//     cubeProps.depth = mapRange(message.data[2], 0, 127, 10, cubeMaxProps.depth);
//   }
//
//   // CUBE ROTATION
//   if (message.data[1] === 2) {
//     cubeRotation.x = mapRange(message.data[2], 0, 127, 0, cubeMaxRotation.x);
//   }
//   if (message.data[1] === 3) {
//     cubeRotation.y = mapRange(message.data[2], 0, 127, 0, cubeMaxRotation.y);
//   }
//   if (message.data[1] === 4) {
//     cubeRotation.z = mapRange(message.data[2], 0, 127, 0, cubeMaxRotation.z);
//   }
// };
//
// const visualTwoControls = message => {
//   console.log(`[VISUAL 2]`, message.data);
// };
//
// const visualThreeControls = message => {
//   console.log(`[VISUAL 3]`, message.data);
// };
//
// const visualFourControls = message => {
//   console.log(`[VISUAL 4]`, message.data);
// };

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

const visualOneRender = () => {
  createCube();
};

const visualTwoRender = () => {
  console.log(`[RENDER VISUAL 2]`);
};

const visualThreeRender = () => {
  console.log(`[RENDER VISUAL 3]`);
};

const visualFourRender = () => {
  console.log(`[RENDER VISUAL 4]`);
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

  if (selectedVisual === 1) {
    updateCube();
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
