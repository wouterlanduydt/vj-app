import Cube from './objects/cube';
import Background from './objects/background';
import VerticesSphere from './objects/verticesSphere';
import Ball from './objects/ball';
import mapRange from './lib/mapRange';
import getVisualFromMessage from './lib/getVisualFromMessage';
import rgbToHex from './lib/rgbToHex';
import removeAllObjects from './lib/removeAllObjects';
import OpenSimplexNoise from 'open-simplex-noise';

const THREE = require(`three`);

const strobeOneshot = document.querySelector(`.oneshoteffects-strobe`);
const fadeoutOneshot = document.querySelector(`.oneshoteffects-fadeout`);
const discoOneshot = document.querySelector(`.oneshoteffects-disco`);
const btnKeyboard = document.querySelector(`.btn-keyboard`);
const btnMidi = document.querySelector(`.btn-midi`);
const btns = document.querySelector(`.btn-box`);

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

let beatSensitivity = .2;

const noise = new OpenSimplexNoise();

const freqArray = [0, 0, 0, 0],
  freqArrayMapped = [0, 0, 0, 0];

let cubes = [];
let balls = [];

const cubeAmount = 100, ballAmount = 10;

let ball2;

let ballSpeed = .1;

let verticesSphere, verticesSphereRotated, background;
let sceneOneMaterial = `default`,
  sceneTwoMaterial = `default`,
  sceneThreeMaterial = `default`,
  backgroundMaterial = `default`,
  backgroundHex, backgroundLight;

let selectedVisual;

const color = {r: 255, g: 255, b: 255, max: 255},
  backgroundColor = {r: 0, g: 0, b: 0, max: 255};

const rotationValue = {x: 0, y: 0, z: 0},
  backgroundRotationValue = {y: 0},
  maxRotationValue = {x: 0.15, y: 0.15, z: 0.15},
  backgroundMaxRotationValue = {y: 0.15};

const cameraPos = {z: 30, min: 30, max: 5};

const init = () => {
  btnKeyboard.onclick = configureKeyboard;
  btnMidi.onclick = configureMidiControlls;
};

const removeWelcomeMessage = () => {
  const welcomeMessage = document.querySelector(`.welcome`);
  welcomeMessage.style.display = `none`;
};

const setup = () => {
  btns.style = `display: none;`;
  configureAudio();
  configureWebcam();
  createScene();
  loop();
  document.getElementById(`keyboardControl`).addEventListener(`click`, () => configureKeyboardControls());
};

const configureKeyboard = () => {
  removeWelcomeMessage();
  setup();
  window.onkeydown = keyboardEvents;
};

const keyboardEvents = e => {
  console.log(e.key);

  if (e.key === `1` || e.key === `2` || e.key === `3`) {
    const requestedVisual = e.key;
    if (requestedVisual !== selectedVisual) {
      removeAllObjects(scene, camera);
      cubes = [];
      balls = [];
    }
    switch (e.key) {
    case `1`:
      selectedVisual = 1;
      visualOneCreate();
      break;

    case `2`:
      selectedVisual = 2;
      visualTwoCreate();
      break;

    case `3`:
      selectedVisual = 3;
      visualThreeCreate();
      break;
    }
  }
};

const configureKeyboardControls = () => {
  document.getElementById(`inputs`).style.cssText = `display: block;`;
  removeAllObjects(scene, camera);
  selectedVisual = 1;
  visualOneCreate();

  let inputControls = false;

  const inputsGroupTitle = document.getElementById(`inputsGroupTitle`);
  inputsGroupTitle.addEventListener(`click`, function () {
    if (inputControls) {
      document.getElementById(`inputControls`).style.cssText = `display: none;`;
      inputControls = false;
    } else {
      document.getElementById(`inputControls`).style.cssText = `display: block;`;
      inputControls = true;
    }
  });

  const beatSensitivityControl = document.getElementById(`beatSensitivity`);
  beatSensitivityControl.addEventListener(`change`, function () {
    beatSensitivity = parseFloat(this.value);
  });
  const cameraControl = document.getElementById(`camera`);
  cameraControl.addEventListener(`change`, function () {
    cameraPos.z = parseFloat(this.value);
  });
  const rotationValueX = document.getElementById(`rotationValueX`);
  rotationValueX.addEventListener(`change`, function () {
    rotationValue.x = parseFloat(this.value);
  });
  const rotationValueY = document.getElementById(`rotationValueY`);
  rotationValueY.addEventListener(`change`, function () {
    rotationValue.y = parseFloat(this.value);
  });
  const rotationValueZ = document.getElementById(`rotationValueZ`);
  rotationValueZ.addEventListener(`change`, function () {
    rotationValue.z = parseFloat(this.value);
  });
  const redControl = document.getElementById(`redControl`);
  redControl.addEventListener(`change`, function () {
    color.r = parseFloat(this.value);
  });
  const greenControl = document.getElementById(`greenControl`);
  greenControl.addEventListener(`change`, function () {
    color.g = parseFloat(this.value);
  });
  const blueControl = document.getElementById(`blueControl`);
  blueControl.addEventListener(`change`, function () {
    color.b = parseFloat(this.value);
  });
  const redBackgroundControl = document.getElementById(`redBackgroundControl`);
  redBackgroundControl.addEventListener(`change`, function () {
    backgroundColor.r = parseFloat(this.value);
  });
  const greenBackgroundControl = document.getElementById(`greenBackgroundControl`);
  greenBackgroundControl.addEventListener(`change`, function () {
    backgroundColor.g = parseFloat(this.value);
  });
  const blueBackgroundControl = document.getElementById(`blueBackgroundControl`);
  blueBackgroundControl.addEventListener(`change`, function () {
    backgroundColor.b = parseFloat(this.value);
  });
  const sceneOneButton = document.getElementById(`sceneOneButton`);
  sceneOneButton.addEventListener(`click`, function () {
    if (selectedVisual !== 1) {
      removeAllObjects(scene, camera);
      cubes = [];
      balls = [];
      selectedVisual = 1;
      visualOneCreate();
    }
  });
  const sceneTwoButton = document.getElementById(`sceneTwoButton`);
  sceneTwoButton.addEventListener(`click`, function () {
    if (selectedVisual !== 2) {
      removeAllObjects(scene, camera);
      cubes = [];
      balls = [];
      selectedVisual = 2;
      visualTwoCreate();
    }
  });
  const sceneThreeButton = document.getElementById(`sceneThreeButton`);
  sceneThreeButton.addEventListener(`click`, function () {
    if (selectedVisual !== 3) {
      removeAllObjects(scene, camera);
      cubes = [];
      balls = [];
      selectedVisual = 3;
      visualThreeCreate();
    }
  });
  const sceneFourButton = document.getElementById(`sceneFourButton`);
  sceneFourButton.addEventListener(`click`, function () {
    if (selectedVisual !== 4) {
      removeAllObjects(scene, camera);
      cubes = [];
      balls = [];
      selectedVisual = 4;
      visualFourCreate();
    }
  });
  const materialDefaultButton = document.getElementById(`materialDefaultButton`);
  materialDefaultButton.addEventListener(`click`, function () {
    if (selectedVisual === 1) {
      visualOneChangeMaterial(`default`);
    } else if (selectedVisual === 2) {
      visualTwoChangeMaterial(`default`);
    } else if (selectedVisual === 3) {
      visualThreeChangeMaterial(`default`);
    }
  });
  const materialStandardButton = document.getElementById(`materialStandardButton`);
  materialStandardButton.addEventListener(`click`, function () {
    if (selectedVisual === 1) {
      visualOneChangeMaterial(`standard`);
    } else if (selectedVisual === 2) {
      visualTwoChangeMaterial(`standard`);
    } else if (selectedVisual === 3) {
      visualThreeChangeMaterial(`phong`);
    }
  });
  const materialWireframeButton = document.getElementById(`materialWireframeButton`);
  materialWireframeButton.addEventListener(`click`, function () {
    if (selectedVisual === 1) {
      visualOneChangeMaterial(`wireframe`);
    } else if (selectedVisual === 2) {
      visualTwoChangeMaterial(`wireframe`);
    } else if (selectedVisual === 3) {
      visualThreeChangeMaterial(`wireframe`);
    }
  });
  const backgroundRotationController = document.getElementById(`backgroundRotationController`);
  backgroundRotationController.addEventListener(`change`, function () {
    backgroundRotationValue.y = parseFloat(this.value);
  });
  const backgroundMaterialDefaultButton = document.getElementById(`backgroundMaterialDefaultButton`);
  backgroundMaterialDefaultButton.addEventListener(`click`, function () {
    backgroundChangeMaterial(`default`);
  });
  const backgroundMaterialWireframeButton = document.getElementById(`backgroundMaterialWireframeButton`);
  backgroundMaterialWireframeButton.addEventListener(`click`, function () {
    backgroundChangeMaterial(`wireframe`);
  });
};

const configureAudio = () => {
  audio = new Audio();
  audio.className = `mic`;
  audio.muted = true;
  document.getElementById(`audio`).appendChild(audio);

  // MIC CODE
  let sourceNode;

  const constraints = window.constraints = {
    audio: true,
    video: false
  };

  navigator.mediaDevices.getUserMedia(constraints).
    then(handleSuccess).catch(handleError);

  function handleSuccess(stream) {
    const audioTracks = stream.getAudioTracks();
    console.log(`Got stream with constraints:`, constraints);
    console.log(`Using audio device: ${audioTracks[0].label}`);
    stream.oninactive = function() {
      console.log(`Stream ended`);
    };
    window.stream = stream;
    sourceNode = context.createMediaStreamSource(stream);
    sourceNode.connect(analyser);
  }

  function handleError(error) {
    console.log(`navigator.getUserMedia error: `, error);
  }

  context = new AudioContext();
  analyser = context.createAnalyser();
  source = context.createMediaElementSource(audio);
  source.connect(analyser);
  analyser.connect(context.destination);

  fbcArray = new Uint8Array(analyser.frequencyBinCount);
};

const audioLooper = () => {
  analyser.getByteFrequencyData(fbcArray);

  const differentFreqs = 4;
  for (let i = 0;i < differentFreqs;i ++) {
    if (fbcArray[i] > 0) {
      freqArray[i] = fbcArray[i];
      freqArrayMapped[i] = mapRange(freqArray[i], 0, 255, - .5, 2);
    } else {
      freqArray[i] = 1;
    }
  }
};

const configureWebcam = () => {
  const constraints = window.constraints = {
    audio: false,
    video: true
  };

  navigator.mediaDevices.getUserMedia(constraints).
    then(handleSuccess).catch(handleError);

  function handleSuccess(stream) {
    const videoTracks = stream.getVideoTracks();
    console.log(`Got stream with constraints:`, constraints);
    console.log(`Using audio device: ${videoTracks[0].label}`);
    stream.oninactive = function() {
      console.log(`Stream ended`);
    };
    const video = document.getElementById(`video1`);
    video.src = window.URL.createObjectURL(stream);
  }

  function handleError(error) {
    console.log(`navigator.getUserMedia error: `, error);
  }
};

const configureMidiControlls = () => {
  setup();

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
    displayMidiFailedMessage();
  }

  const onMIDIMessage = message => {
    console.log(`MIDI CONTROL: ${message.data}`);

    // CAMERA Z CONTROLS
    if (message.data[1] === 9) {
      cameraPos.z = mapRange(message.data[2], 0, 127, cameraPos.min, cameraPos.max);
    }

    const createFunctions = {
      1: visualOneCreate,
      2: visualTwoCreate,
      3: visualThreeCreate
    };

    const visualFromMessage = getVisualFromMessage(message, selectedVisual);
    createOneShotEffect(message);

    if (visualFromMessage && selectedVisual !== visualFromMessage) {
      removeAllObjects(scene, camera);
      cubes = [];
      balls = [];
      selectedVisual = visualFromMessage;
      createFunctions[selectedVisual]();
    }

    midiVisualControls(selectedVisual, message);
  };
};

const displayMidiFailedMessage = () => {
  document.querySelector(`.nomidi`).style.display = `inline`;
};

const midiVisualControls = (selectedVisual, message) => {
  const ctrlFilOne = message.data[1] === 2,
    ctrlFilTwo = message.data[1] === 3,
    ctrlFilThree = message.data[1] === 4,
    ctrlFilFour = message.data[1] === 5,

    ctrlSldrOne = message.data[1] === 6,
    ctrlSldrTwo = message.data[1] === 7,
    ctrlSldrThree = message.data[1] === 8,

    keyLckOne = message.data[1] === 10,
    keyLckTwo = message.data[1] === 11,
    keyLckThree = message.data[1] === 12,

    bgCtrlFilOne = message.data[1] === 43,
    bgCtrlFilTwo = message.data[1] === 44,
    bgCtrlFilThree = message.data[1] === 45,
    bgCtrlFilFour = message.data[1] === 46,

    bgKeyLckOne = message.data[1] === 51,
    bgKeyLckTwo = message.data[1] === 52,
    bgKeyLckThree = message.data[1] === 53;

  // BACKGROUND
  if (bgCtrlFilOne) {
    backgroundColor.r = mapRange(message.data[2], 0, 127, 0, backgroundColor.max);
  }
  if (bgCtrlFilTwo) {
    backgroundColor.g = mapRange(message.data[2], 0, 127, 0, backgroundColor.max);
  }
  if (bgCtrlFilThree) {
    backgroundColor.b = mapRange(message.data[2], 0, 127, 0, backgroundColor.max);
  }
  if (bgCtrlFilFour) {
    backgroundRotationValue.y = mapRange(message.data[2], 0, 127, 0, backgroundMaxRotationValue.y);
  }

  if (bgKeyLckOne && message.data[2] === 127) {
    backgroundChangeMaterial(`default`);
  }
  if (bgKeyLckTwo && message.data[2] === 127) {
    backgroundChangeMaterial(`video`);
  }
  if (bgKeyLckThree && message.data[2] === 127) {
    backgroundChangeMaterial(`wireframe`);
  }

  // BEAT SENSITIVITY
  if (ctrlFilFour) {
    beatSensitivity = mapRange(message.data[2], 0, 127, 0, 1);
  }

  if (selectedVisual === 1) {
    // CUBE PROPS
    if (ctrlFilOne) {
      color.r = mapRange(message.data[2], 0, 127, 0, color.max);
    }
    if (ctrlFilTwo) {
      color.g = mapRange(message.data[2], 0, 127, 0, color.max);
    }
    if (ctrlFilThree) {
      color.b = mapRange(message.data[2], 0, 127, 0, color.max);
    }

    // CUBE ROTATION
    if (ctrlSldrOne) {
      rotationValue.x = mapRange(message.data[2], 0, 127, 0, maxRotationValue.x);
    }
    if (ctrlSldrTwo) {
      rotationValue.y = mapRange(message.data[2], 0, 127, 0, maxRotationValue.y);
    }
    if (ctrlSldrThree) {
      rotationValue.z = mapRange(message.data[2], 0, 127, 0, maxRotationValue.z);
    }

    if (keyLckOne && message.data[2] === 127) {
      visualOneChangeMaterial(`default`);
    }
    if (keyLckTwo && message.data[2] === 127) {
      visualOneChangeMaterial(`standard`);
    }
    if (keyLckThree && message.data[2] === 127) {
      visualOneChangeMaterial(`wireframe`);
    }
  }

  if (selectedVisual === 2) {
    // BALL PROPS
    if (ctrlFilOne) {
      color.r = mapRange(message.data[2], 0, 127, 0, color.max);
    }
    if (ctrlFilTwo) {
      color.g = mapRange(message.data[2], 0, 127, 0, color.max);
    }
    if (ctrlFilThree) {
      color.b = mapRange(message.data[2], 0, 127, 0, color.max);
    }

    if (keyLckOne && message.data[2] === 127) {
      visualTwoChangeMaterial(`default`);
    }
    if (keyLckTwo && message.data[2] === 127) {
      visualTwoChangeMaterial(`standard`);
    }
    if (keyLckThree && message.data[2] === 127) {
      visualTwoChangeMaterial(`wireframe`);
    }
  }

  if (selectedVisual === 3) {
    if (ctrlFilOne) {
      color.r = mapRange(message.data[2], 0, 127, 0, color.max);
    }
    if (ctrlFilTwo) {
      color.g = mapRange(message.data[2], 0, 127, 10, color.max);
    }
    if (ctrlFilThree) {
      color.b = mapRange(message.data[2], 0, 127, 10, color.max);
    }

    // CUBE ROTATION
    if (ctrlSldrOne) {
      rotationValue.x = mapRange(message.data[2], 0, 127, 0, maxRotationValue.x);
    }
    if (ctrlSldrTwo) {
      rotationValue.y = mapRange(message.data[2], 0, 127, 0, maxRotationValue.y);
    }
    if (ctrlSldrThree) {
      rotationValue.z = mapRange(message.data[2], 0, 127, 0, maxRotationValue.z);
    }

    if (keyLckOne && message.data[2] === 127) {
      visualThreeChangeMaterial(`default`);
    }
    if (keyLckTwo && message.data[2] === 127) {
      visualThreeChangeMaterial(`phong`);
    }
    if (keyLckThree && message.data[2] === 127) {
      visualThreeChangeMaterial(`wireframe`);
    }
  }

};

const createOneShotEffect = message => {
  const ctrlFxOne = message.data[1] === 14,
    ctrlFxTwo = message.data[1] === 15,
    ctrlFxThree = message.data[1] === 16;

  if (ctrlFxOne && message.data[2] === 127) {
    strobeOneshot.style.display = `inline`;
  }
  if (ctrlFxTwo && message.data[2] === 127) {
    fadeoutOneshot.style.display = `inline`;
  }
  if (ctrlFxThree && message.data[2] === 127) {
    discoOneshot.style.display = `inline`;
  }
  if ((ctrlFxOne || ctrlFxTwo || ctrlFxThree) && message.data[2] === 0) {
    strobeOneshot.style.display = `none`;
    fadeoutOneshot.style.display = `none`;
    discoOneshot.style.display = `none`;
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
  createBackground();
  createLight();
};

const createLight = () => {
  const light = new THREE.DirectionalLight(0xffffff, 1);
  backgroundLight = new THREE.DirectionalLight(0xffffff, 1.5);
  light.position.set(0, 0, 20);
  backgroundLight.position.set(5, 5, 20);
  light.castShadow = true;
  backgroundLight.castShadow = true;
  scene.add(light);
  scene.add(backgroundLight);
};

const createBackground = () => {

  if (selectedVisual) {
    removeWelcomeMessage();
  }

  background = new Background();
  backgroundChangeMaterial(backgroundMaterial);
  scene.add(background.mesh);
};

const updateBackground = () => {
  background.mesh.rotation.y += backgroundRotationValue.y;

  backgroundHex = rgbToHex(backgroundColor.r, backgroundColor.g, backgroundColor.b);
  background.background.material.color.setHex(backgroundHex);
  backgroundLight.color.setHex(backgroundHex);
};

const backgroundChangeMaterial = sceneMaterial => {
  if (sceneMaterial === `default`) {
    backgroundMaterial = `default`;
    background.background.material = background.defaultMaterial;
  } else if (sceneMaterial === `video`) {
    backgroundMaterial = `video`;
    background.background.material = background.videoMaterial;
  } else if (sceneMaterial === `wireframe`) {
    backgroundMaterial = `wireframe`;
    background.background.material = background.wireframeMaterial;
  }
};

const visualOneCreate = () => {
  console.log(`[CREATE VISUAL 1]`);
  createCubes();
  visualOneChangeMaterial(sceneOneMaterial);
  createLight();
  createBackground();
};

const updateVisualOne = () => {
  const hex = rgbToHex(color.r, color.g, color.b);

  for (let i = 0;i < cubeAmount;i ++) {
    cubes[i].mesh.rotation.x += rotationValue.x;
    cubes[i].mesh.rotation.y += rotationValue.y;
    cubes[i].mesh.rotation.z += rotationValue.z;

    cubes[i].mesh.scale.x = 1 + (freqArrayMapped[1] * beatSensitivity);
    cubes[i].mesh.scale.y = 1 + (freqArrayMapped[1] * beatSensitivity);
    cubes[i].mesh.scale.z = 1 + (freqArrayMapped[1] * beatSensitivity);

    cubes[i].mesh.children[0].material.color.setHex(hex);
  }
};

const visualOneChangeMaterial = sceneMaterial => {
  if (sceneMaterial === `default`) {
    sceneOneMaterial = `default`;
    for (let i = 0;i < cubeAmount;i ++) {
      cubes[i].mesh.children[0].material = cubes[i].defaultMaterial;
    }
  } else if (sceneMaterial === `standard`) {
    sceneOneMaterial = `standard`;
    for (let i = 0;i < cubeAmount;i ++) {
      cubes[i].mesh.children[0].material = cubes[i].standardMaterial;
    }
  } else if (sceneMaterial === `wireframe`) {
    sceneOneMaterial = `wireframe`;
    for (let i = 0;i < cubeAmount;i ++) {
      cubes[i].mesh.children[0].material = cubes[i].wireframeMaterial;
    }
  }
};

const visualTwoCreate = () => {
  console.log(`[CREATE VISUAL 2]`);
  createBall();
  visualTwoChangeMaterial(sceneTwoMaterial);
  createLight();
  createBackground();
};

const updateVisualTwo = () => {

  for (let i = 0;i < ballAmount;i ++) {
    balls[i].mesh.position.x += balls[i].direction[0] * ballSpeed;
    balls[i].mesh.position.y += balls[i].direction[1] * ballSpeed;
    balls[i].mesh.position.z += balls[i].direction[2] * ballSpeed;
  }

  for (let i = 0;i < ballAmount;i ++) {
    if (balls[i].mesh.position.x >= 15) {
      balls[i].direction[0] *= - 1;
    }
    else if (balls[i].mesh.position.x <= - 15) {
      balls[i].direction[0] *= - 1;
    }

    if (balls[i].mesh.position.y >= 10) {
      balls[i].direction[1] *= - 1;
    }
    else if (balls[i].mesh.position.y <= - 10) {
      balls[i].direction[1] *= - 1;
    }

    if (balls[i].mesh.position.z >= 12) {
      balls[i].direction[2] *= - 1;
    }
    else if (balls[i].mesh.position.z <= - 12) {
      balls[i].direction[2] *= - 1;
    }
  }

  const hex = rgbToHex(color.r, color.g, color.b);

  ballSpeed = (freqArrayMapped[0] * beatSensitivity);

  for (let i = 0;i < ballAmount;i ++) {
    balls[i].mesh.scale.x = 1 + (freqArrayMapped[1] * beatSensitivity);
    balls[i].mesh.scale.y = 1 + (freqArrayMapped[1] * beatSensitivity);
    balls[i].mesh.scale.z = 1 + (freqArrayMapped[1] * beatSensitivity);

    balls[i].ball.material.color.setHex(hex);
  }
};

const visualTwoChangeMaterial = sceneMaterial => {
  if (sceneMaterial === `default`) {
    sceneTwoMaterial = `default`;
    for (let i = 0;i < ballAmount;i ++) {
      balls[i].mesh.children[0].material = balls[i].defaultMaterial;
    }
  } else if (sceneMaterial === `standard`) {
    sceneTwoMaterial = `standard`;
    for (let i = 0;i < ballAmount;i ++) {
      balls[i].mesh.children[0].material = balls[i].standardMaterial;
    }
  } else if (sceneMaterial === `wireframe`) {
    sceneTwoMaterial = `wireframe`;
    for (let i = 0;i < ballAmount;i ++) {
      balls[i].mesh.children[0].material = balls[i].wireframeMaterial;
    }
  }
};

const visualThreeCreate = () => {
  console.log(`[CREATE VISUAL 3]`);
  createVerticesSphere();
  visualThreeChangeMaterial(sceneThreeMaterial);
  createLight();
  createBackground();
};

const updateVisualThree = () => {
  verticesSphere.editVertices();
  verticesSphereRotated.editVertices();

  verticesSphere.mesh.rotation.x += rotationValue.x;
  verticesSphere.mesh.rotation.y += rotationValue.y;
  verticesSphere.mesh.rotation.z += rotationValue.z;

  verticesSphere.mesh.scale.x = 1 + (freqArrayMapped[1] * beatSensitivity);
  verticesSphere.mesh.scale.y = 1 + (freqArrayMapped[1] * beatSensitivity);
  verticesSphere.mesh.scale.z = 1 + (freqArrayMapped[1] * beatSensitivity);

  verticesSphereRotated.mesh.rotation.x += rotationValue.x;
  verticesSphereRotated.mesh.rotation.y += rotationValue.y;
  verticesSphereRotated.mesh.rotation.z += rotationValue.z;

  verticesSphereRotated.mesh.scale.x = 1 + (freqArrayMapped[3] * beatSensitivity);
  verticesSphereRotated.mesh.scale.y = 1 + (freqArrayMapped[3] * beatSensitivity);
  verticesSphereRotated.mesh.scale.z = 1 + (freqArrayMapped[3] * beatSensitivity);

  const hex = rgbToHex(color.r, color.g, color.b);
  const hexVerticesRotated = rgbToHex(color.r * 1.5, color.g * 1.8, color.b * 1.2);
  verticesSphere.mesh.material.color.setHex(hex);
  verticesSphereRotated.mesh.material.color.setHex(hexVerticesRotated);
};

const visualThreeChangeMaterial = sceneMaterial => {
  if (sceneMaterial === `default`) {
    sceneThreeMaterial = `default`;
    verticesSphere.mesh.material = verticesSphere.defaultMaterial;
    verticesSphereRotated.mesh.material = verticesSphereRotated.defaultMaterial;
  } else if (sceneMaterial === `phong`) {
    sceneThreeMaterial = `phong`;
    verticesSphere.mesh.material = verticesSphere.phongMaterial;
    verticesSphereRotated.mesh.material = verticesSphereRotated.phongMaterial;
  } else if (sceneMaterial === `wireframe`) {
    sceneThreeMaterial = `wireframe`;
    verticesSphere.mesh.material = verticesSphere.wireframeMaterial;
    verticesSphereRotated.mesh.material = verticesSphereRotated.wireframeMaterial;
  }
};

const visualFourCreate = () => {
  console.log(`[CREATE VISUAL 4]`);
  const icosahedronGeometry2 = new THREE.IcosahedronGeometry(12, 3);
  const lambertMaterial2 = new THREE.MeshPhongMaterial({
    color: 0x00ffff,
  });
  ball2 = new THREE.Mesh(icosahedronGeometry2, lambertMaterial2);
  console.log(ball2);
  ball2.position.z = 0;
  scene.add(ball2);

  createLight();
  createBackground();
  updateVisualFour(ball2);
};

const updateVisualFour = mesh => {
  mesh.geometry.vertices.forEach(function(vertex) {
    const offset = mesh.geometry.parameters.radius;
    const time = Date.now();
    vertex.normalize();
    const distance = offset + noise.noise3D(
        vertex.x + time * 0.0008,
        vertex.y + time * 0.0005,
        vertex.z + time * 0.0007
    ) * (freqArrayMapped[1] * beatSensitivity * 5);
    vertex.multiplyScalar(distance);
  });

  const hex = rgbToHex(color.r, color.g, color.b);
  mesh.material.color.setHex(hex);

  mesh.geometry.verticesNeedUpdate = true;
  mesh.geometry.normalsNeedUpdate = true;
  mesh.geometry.computeVertexNormals();
  mesh.geometry.computeFaceNormals();
};

const loop = () => {
  audioLooper();
  camera.position.z = cameraPos.z;
  renderer.render(scene, camera);
  updateBackground();

  switch (selectedVisual) {
  case 1:
    updateVisualOne();
    break;
  case 2:
    updateVisualTwo();
    break;
  case 3:
    updateVisualThree();
    break;
  case 4:
    updateVisualFour(ball2);
    break;
  default:
    break;
  }

  requestAnimationFrame(loop);
};

const createVerticesSphere = () => {
  verticesSphere = new VerticesSphere();
  verticesSphereRotated = new VerticesSphere();
  verticesSphereRotated.mesh.rotation.y = 90;
  verticesSphereRotated.mesh.position.z = 10;
  verticesSphere.mesh.position.z = 10;
  scene.add(verticesSphereRotated.mesh);
  scene.add(verticesSphere.mesh);
};

const createBall = () => {
  for (let i = 0;i < ballAmount;i ++) {
    balls.push(new Ball());
    scene.add(balls[i].mesh);
  }
};

const createCubes = () => {
  for (let i = 0;i < cubeAmount;i ++) {
    const x = i % 10;
    const y = Math.floor(i / 10);
    cubes.push(new Cube());
    cubes[i].mesh.position.x = 2.5 * mapRange(x, 0, 9, - 9, 9);
    cubes[i].mesh.position.y = 2.5 * mapRange(y, 0, 9, - 9, 9);
    scene.add(cubes[i].mesh);
  }
};

const handleWindowResize = () => {
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;
  renderer.setSize(WIDTH, HEIGHT);
  camera.aspect = WIDTH / HEIGHT;
  camera.updateProjectionMatrix();
};

init();
