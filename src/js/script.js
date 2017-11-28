import Cube from './objects/Cube';
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

let audio,
  source,
  context,
  analyser,
  fbcArray;

const freqArray = [];

let cube;

let selectedVisual;

const cameraPos = {z: 0},
  cameraMaxPos = {z: 1000};

const cubeProps = {width: 10, height: 10, depth: 10},
  cubeRotation = {x: 0, y: 0, z: 0};

const cubeMaxProps = {width: 800, height: 800, depth: 800},
  cubeMaxRotation = {x: 0.3, y: 0.3, z: 0.3};

const init = () => {
  configureMidiControlls();
  configureAudio();
  createScene();
  loop();
};

const configureAudio = () => {
  // Create HTML audio element (needs to collect mic input)
  audio = new Audio();
  audio.src = `../assets/audio/thewayudo.mp3`;
  audio.controls = true;
  audio.autoplay = true;
  audio.className = `mic`;
  document.getElementById(`audio`).appendChild(audio);

  // MIC CODE
  // const mic = document.querySelector(`.mic`);
  //
  // const constraints = window.constraints = {
  //   audio: true,
  //   video: false
  // };
  //
  // navigator.mediaDevices.getUserMedia(constraints).
  //   then(handleSuccess).catch(handleError);
  //
  // function handleSuccess(stream) {
  //   const audioTracks = stream.getAudioTracks();
  //   console.log(`Got stream with constraints:`, constraints);
  //   console.log(`Using audio device: ${  audioTracks[0].label}`);
  //   stream.oninactive = function() {
  //     console.log(`Stream ended`);
  //   };
  //   window.stream = stream; // make variable available to browser console
  //   mic.srcObject = stream;
  // }
  //
  // function handleError(error) {
  //   console.log(`navigator.getUserMedia error: `, error);
  // }

  context = new AudioContext();
  analyser = context.createAnalyser();
  source = context.createMediaElementSource(audio);
  source.connect(analyser);
  analyser.connect(context.destination);

  audioLooper();
};

const audioLooper = () => {
  requestAnimationFrame(audioLooper);
  fbcArray = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(fbcArray);

  const differentFreqs = 3;
  for (let i = 0;i < differentFreqs;i ++) {
    freqArray[i] = fbcArray[i];
    console.log(freqArray);
  }
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
      selectedVisual = visualFromMessage;
      removeAllObjects(scene);
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
    console.log(`[VISUAL 2]`);
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

  renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  });
  renderer.setSize(WIDTH, HEIGHT);

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

const updateCube = () => {
  cube.mesh.rotation.x += cubeRotation.x;
  cube.mesh.rotation.y += cubeRotation.y;
  cube.mesh.rotation.z += cubeRotation.z;

  cube.mesh.scale.x = freqArray[0];
  cube.mesh.scale.y = freqArray[0];
  cube.mesh.scale.z = freqArray[0];
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
