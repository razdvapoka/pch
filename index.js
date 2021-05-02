import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

import lightMapTexture from "./assets/images/earth-lights.png";
import cloudsTexture from "./assets/images/tex-clouds-inverted.jpg";
import serversModelSrc from "./assets/models/servers-draco.gltf";

import { GLOBE_STEP, B2B_STEP_1 } from "./consts";

import {
  addFulfillment,
  launchGlobeScene,
  globeToB2B,
  initGlobeSceneObject,
} from "./scenes/globe";
import { initServersSceneObject } from "./scenes/servers";

import {
  canvas,
  overlay,
  launchButton,
  html,
  heading,
  nav,
  pathButtons,
  clientLogo,
  uploadLogoLabel,
  uploadLogoInput,
  nextButton,
  b2bButton,
} from "./ui";

let serversModel;
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/draco/");
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);
gltfLoader.load(serversModelSrc, (gltf) => {
  serversModel = gltf.scene.children[0];
});

const textureLoader = new THREE.TextureLoader();
const lightMap = textureLoader.load(lightMapTexture);
const cloudsMap = textureLoader.load(cloudsTexture);

const handleGlobeReady = () => {
  overlay.classList.add("canvas-overlay-black-hidden");
  launchButton.classList.remove("hidden");
};

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const stepToSceneObject = {
  [GLOBE_STEP]: () =>
    initGlobeSceneObject({
      lightMap,
      cloudsMap,
      sizes,
      onReady: handleGlobeReady,
      canvas,
    }),
  [B2B_STEP_1]: () => initServersSceneObject({ sizes, canvas, serversModel }),
};

let currentSceneObject;
const setCurrentSceneObject = (s) => {
  currentSceneObject = s;
};

let currentStep;
const setCurrentStep = (s) => {
  currentStep = s;
  setCurrentSceneObject(stepToSceneObject[s]());
};

setCurrentStep(GLOBE_STEP);

const onResize = () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  currentSceneObject.onResize(sizes);
};

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
  outputEncoding: THREE.sRGBEncoding,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0xcecece);

const clock = new THREE.Clock();
const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  if (currentSceneObject) {
    renderer.render(currentSceneObject.scene, currentSceneObject.camera);
    if (currentSceneObject.tick) {
      currentSceneObject.tick(elapsedTime, sizes);
    }
  }
  window.requestAnimationFrame(tick);
};

const handleB2BButtonClick = () => {
  globeToB2B().then(() => {
    setCurrentStep(B2B_STEP_1);
    html.style.color = "#363636";
    html.style.backgroundColor = "#EFEEEE";
    heading.innerText = "Business-to-business";
    nav.style.display = "block";
    overlay.classList.add("canvas-overlay-white-hidden");
  });
  overlay.classList.add("canvas-overlay-white");
  pathButtons.classList.add("hidden");
};

const handleLogoUpload = (e) => {
  const files = e.target.files;
  if (files.length > 0) {
    const file = files[0];
    const fileReader = new FileReader();
    fileReader.onload = (d) => {
      const svgString = d.target.result;
      const url =
        `url('data:image/svg+xml;utf8,` + encodeURIComponent(svgString) + `')`;
      clientLogo.style.backgroundImage = url;
      clientLogo.style.display = "block";
      uploadLogoLabel.style.display = "none";
    };
    fileReader.readAsText(file);
  }
};

const handleLaunchButtonClick = () => {
  launchButton.style.display = "none";
  launchGlobeScene().then(() => {
    heading.innerText = "Today";
    heading.classList.remove("intro-heading");
    heading.classList.add("today-heading");
    nextButton.classList.remove("hidden");
  });
};

const handleNextButtonClick = () => {
  nextButton.style.display = "none";
  pathButtons.style.display = "flex";
  heading.innerText = "Tomorrow";
  addFulfillment();
};

const addEventListeners = () => {
  nextButton.addEventListener("click", handleNextButtonClick);
  launchButton.addEventListener("click", handleLaunchButtonClick);
  uploadLogoInput.addEventListener("change", handleLogoUpload);
  b2bButton.addEventListener("click", handleB2BButtonClick);
  window.addEventListener("resize", onResize);
};

addEventListeners();
tick();
