import Cube from './objects/cube';
import TranslatedCube from './objects/translatedCube';
import Triangle from './objects/triangle';
import Ball from './objects/ball';
import VerticesSphere from './objects/verticesSphere';
import mapRange from './lib/mapRange';
import rgbToHex from './lib/rgbToHex';
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

const freqArray = [],
  freqArrayMapped = [];

const
  cube = [];

let translatedCube, ball, triangle, verticesSphere, verticesSphereRotated;

let selectedVisual;

const color = {r: 0, g: 0, b: 255, max: 255};

const ballRotation = {x: 0, y: 0, z: 0},
  verticesSphereRotation = {x: 0, y: 0, z: 0},
  translatedCubeRotation = {x: 0, y: 0, z: 0};

const ballMaxRotation = {x: 0.3, y: 0.3, z: 0.3},
  translatedCubeMaxRotation = {x: 0.3, y: 0.3, z: 0.3},
  verticesSphereMaxRotation = {x: 0.3, y: 0.3, z: 0.3};

// const cubeProps = {width: 10, height: 10, depth: 10},
const cubeRotation = {x: 0, y: 0, z: 0};

// const cubeMaxProps = {width: 800, height: 800, depth: 800},
const cubeMaxRotation = {x: 0.3, y: 0.3, z: 0.3};

let cubeWireframe = false,
  verticesWireframe = false;


// Development Mode

// const cameraPos = {z: 30},
//   cameraMaxPos = {z: 1000};
//
// const init = () => {
//   configureMidiControlls();
//   configureAudio();
//   createScene();
//   visualTwoCreate();
//   selectedVisual = 2;
//   loop();
// };

// Midi Mode
const cameraPos = {z: 30, min: 5, max: 30};

const init = () => {
  configureMidiControlls();
  configureAudio();
  configureWebcam();
  createScene();
  loop();
};

// Midi Mode
// const cameraPos = {z: 0},
//   cameraMaxPos = {z: 1000};
//
// const init = () => {
//   configureMidiControlls();
//   configureAudio();
//   createScene();
//   loop();
// };

const configureAudio = () => {
  audio = new Audio();
  audio.src = `../assets/audio/thewayudo.mp3`;
  audio.controls = true;
  audio.autoplay = false;
  audio.className = `mic`;
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
    console.log(`Using audio device: ${  audioTracks[0].label}`);
    stream.oninactive = function() {
      console.log(`Stream ended`);
    };
    window.stream = stream; // make variable available to browser console
    // mic.srcObject = stream;
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

  audioLooper();
};

const audioLooper = () => {
  requestAnimationFrame(audioLooper);

  analyser.getByteFrequencyData(fbcArray);

  const differentFreqs = 4;
  for (let i = 0;i < differentFreqs;i ++) {
    if (fbcArray[i] > 0) {
      freqArray[i] = fbcArray[i];
      freqArrayMapped[i] = mapRange(freqArray[i], 0, 255, 0, 3);
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
    console.log(`Using audio device: ${  videoTracks[0].label}`);
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
      cameraPos.z = mapRange(message.data[2], 0, 127, cameraPos.min, cameraPos.max);
      // console.log(cameraPos.z);
    }

    const createFunctions = {
      1: visualOneCreate,
      2: visualTwoCreate,
      3: visualThreeCreate
    };

    const visualFromMessage = getVisualFromMessage(message, selectedVisual);

    if (visualFromMessage && selectedVisual !== visualFromMessage) {
      removeAllObjects(scene, camera);
      selectedVisual = visualFromMessage;
      createFunctions[selectedVisual]();
    }

    visualControls(selectedVisual, message);
  };
};

const visualControls = (selectedVisual, message) => {
  const ctrlFilOne = message.data[1] === 2,
    ctrlFilTwo = message.data[1] === 3,
    ctrlFilThree = message.data[1] === 4,

    ctrlSldrOne = message.data[1] === 6,
    ctrlSldrTwo = message.data[1] === 7,
    ctrlSldrThree = message.data[1] === 8,

    keyLckOne = message.data[1] === 10,
    keyLckTwo = message.data[1] === 11,
    keyLckThree = message.data[1] === 12,
    keyLckFour = message.data[1] === 13;

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
      cubeRotation.x = mapRange(message.data[2], 0, 127, 0, cubeMaxRotation.x);
    }
    if (ctrlSldrTwo) {
      cubeRotation.y = mapRange(message.data[2], 0, 127, 0, cubeMaxRotation.y);
    }
    if (ctrlSldrThree) {
      cubeRotation.z = mapRange(message.data[2], 0, 127, 0, cubeMaxRotation.z);
    }

    if (keyLckOne && message.data[2] === 127) {
      if (cubeWireframe) {
        console.log(`wireframe On`);
        for (let i = 0;i < 100;i ++) {
          cube[i].mesh.children[0].material.wireframe = false;
        }
        cubeWireframe = false;
      } else {
        console.log(`wireframe Off`);
        for (let i = 0;i < 100;i ++) {
          cube[i].mesh.children[0].material.wireframe = true;
        }
        cubeWireframe = true;
      }
    }
    if (keyLckTwo && message.data[2] === 127) {
      cubeRotation.z = mapRange(message.data[2], 0, 127, 0, cubeMaxRotation.z);
    }
    if (keyLckThree && message.data[2] === 127) {
      cubeRotation.z = mapRange(message.data[2], 0, 127, 0, cubeMaxRotation.z);
    }
    if (keyLckFour && message.data[2] === 127) {
      cubeRotation.z = mapRange(message.data[2], 0, 127, 0, cubeMaxRotation.z);
    }
  }

  if (selectedVisual === 2) {
    // CUBE ROTATION
    if (ctrlSldrOne) {
      ballRotation.y = mapRange(message.data[2], 0, 127, 0, ballMaxRotation.y);
    }
    if (ctrlSldrTwo) {
      ballRotation.z = mapRange(message.data[2], 0, 127, 0, ballMaxRotation.z);
    }
    if (ctrlSldrThree) {
      translatedCubeRotation.y = mapRange(message.data[2], 0, 127, 0, translatedCubeMaxRotation.y);
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
      verticesSphereRotation.x = mapRange(message.data[2], 0, 127, 0, verticesSphereMaxRotation.x);
    }
    if (ctrlSldrTwo) {
      verticesSphereRotation.y = mapRange(message.data[2], 0, 127, 0, verticesSphereMaxRotation.y);
    }
    if (ctrlSldrThree) {
      verticesSphereRotation.z = mapRange(message.data[2], 0, 127, 0, verticesSphereMaxRotation.z);
    }

    if (keyLckOne && message.data[2] === 127) {
      if (verticesWireframe) {
        console.log(`wireframe On`);
        verticesSphere.mesh.material.wireframe = false;
        verticesSphereRotated.mesh.material.wireframe = false;
        verticesWireframe = false;
      } else {
        console.log(`wireframe Off`);
        console.log(verticesSphere);
        verticesSphere.mesh.material.wireframe = true;
        verticesSphereRotated.mesh.material.wireframe = true;
        verticesWireframe = true;
      }
    }
    if (keyLckTwo && message.data[2] === 127) {
      console.log(`alternative material`);
      // verticesSphere.mesh.material = verticesSphere.alternativeMaterial;
    }
  }

};

const createScene = () => {
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
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

const createLight = () => {
  const light = new THREE.PointLight(0xffffff, 2, 100, 5);
  light.position.set(3, 0, 15);
  light.castShadow = true;
  scene.add(light);

  // const pointLightHelper = new THREE.PointLightHelper(light, 1, 0xff0000);
  // scene.add(pointLightHelper);
};

const visualOneCreate = () => {
  console.log(`[CREATE VISUAL 1]`);
  createCube();

  if (cubeWireframe) {
    for (let i = 0;i < 100;i ++) {
      cube[i].mesh.children[0].material.wireframe = true;
    }
  }

  camera.position.x = 5;
  camera.position.y = 5;

  createLight();
};

const visualTwoCreate = () => {
  console.log(`[CREATE VISUAL 2]`);
  createTranslatedCube();
  createBall();
  createTriangle();

  createLight();
};

const visualThreeCreate = () => {
  console.log(`[CREATE VISUAL 3]`);
  createVerticesSphere();

  if (verticesWireframe) {
    verticesSphere.mesh.material.wireframe = true;
    verticesSphereRotated.mesh.material.wireframe = true;
  }

  createLight();
};

const createVerticesSphere = () => {
  verticesSphere = new VerticesSphere();
  verticesSphereRotated = new VerticesSphere();
  verticesSphereRotated.mesh.rotation.y = 90;
  scene.add(verticesSphereRotated.mesh);
  scene.add(verticesSphere.mesh);
};



const createCube = () => {
  for (let i = 0;i < 100;i ++) {
    const x = i % 10;
    const y = Math.floor(i / 10);
    cube.push(new Cube());
    cube[i].mesh.position.y = 1.5 * y;
    cube[i].mesh.position.x = 1.5 * x;
    scene.add(cube[i].mesh);
  }
};

const createTranslatedCube = () => {
  translatedCube = new TranslatedCube();
  translatedCube.receiveShadow = true;
  scene.add(translatedCube.mesh);
};

const createTriangle = () => {
  triangle = new Triangle();
  scene.add(triangle.mesh);
};

const createBall = () => {
  ball = new Ball();
  ball.receiveShadow = true;
  scene.add(ball.mesh);
};

const updateSceneOne = () => {

  const hex = rgbToHex(color.r, color.g, color.b);

  for (let i = 0;i < 100;i ++) {
    cube[i].mesh.rotation.x += cubeRotation.x;
    cube[i].mesh.rotation.y += cubeRotation.y;
    cube[i].mesh.rotation.z += cubeRotation.z;

    cube[i].mesh.scale.x = freqArrayMapped[1];
    cube[i].mesh.scale.y = freqArrayMapped[1];
    cube[i].mesh.scale.z = freqArrayMapped[1];

    cube[i].cube.material.color.setHex(hex);
  }
};

const updateSceneTwo = () => {
  // Midi
  translatedCube.mesh.rotation.y += translatedCubeRotation.y;

  ball.mesh.rotation.y += ballRotation.y;
  ball.mesh.rotation.z += ballRotation.z;

  ball.mesh.scale.x = 1;
  ball.mesh.scale.y = 1;
  ball.mesh.scale.z = 1;

  translatedCube.mesh.scale.x = 1;
  translatedCube.mesh.scale.y = 1;
  translatedCube.mesh.scale.z = 1;

  // Development
  // translatedCube.mesh.rotation.y += .02;
  //
  // ball.mesh.rotation.y += .05;
  // ball.mesh.rotation.x += .02;
};

const updateSceneThree = () => {
  verticesSphere.editVertices();
  verticesSphereRotated.editVertices();

  verticesSphere.mesh.rotation.x += verticesSphereRotation.x;
  verticesSphere.mesh.rotation.y += verticesSphereRotation.y;
  verticesSphere.mesh.rotation.z += verticesSphereRotation.z;

  verticesSphere.mesh.scale.x = freqArrayMapped[1];
  verticesSphere.mesh.scale.y = freqArrayMapped[1];
  verticesSphere.mesh.scale.z = freqArrayMapped[1];

  verticesSphereRotated.mesh.rotation.x += verticesSphereRotation.x;
  verticesSphereRotated.mesh.rotation.y += verticesSphereRotation.y;
  verticesSphereRotated.mesh.rotation.z += verticesSphereRotation.z;

  verticesSphereRotated.mesh.scale.x = freqArrayMapped[1];
  verticesSphereRotated.mesh.scale.y = freqArrayMapped[1];
  verticesSphereRotated.mesh.scale.z = freqArrayMapped[1];

  const hex = rgbToHex(color.r, color.g, color.b);
  const hexVerticesRotated = rgbToHex(color.r * 1.5, color.g * 1.8, color.b * 1.2);
  verticesSphere.mesh.material.color.setHex(hex);
  verticesSphereRotated.mesh.material.color.setHex(hexVerticesRotated);
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
