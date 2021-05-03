import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

import lightMapTexture from "./assets/images/earth-lights.png";
import cloudsTexture from "./assets/images/tex-clouds-inverted.jpg";
import serversModelSrc from "./assets/models/servers-draco.gltf";
import manufacturingModelSrc from "./assets/models/manufacturing-draco.gltf";

import { GLOBE_STEP, B2B_STEP_1, B2B_STEP_2 } from "./consts";

import { wait } from "./utils";

import {
  addFulfillment,
  launchGlobeScene,
  globeToB2B,
  initGlobeSceneObject,
  getGlobeSceneObject,
  transitionToManufacturing,
} from "./scenes/globe";
import { initServersSceneObject, launchServerScene } from "./scenes/servers";
import {
  initManufacturingSceneObject,
  launchManufacturingScene,
} from "./scenes/manufacturing";

import {
  canvas,
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
  placeOrderButton,
  setElementVisibility,
  showOverlay,
  hideOverlay,
  setNavButtonActive,
  manufactureButton,
} from "./ui";

let serversModel;
let manufacturingModel;

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/draco/");
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);
gltfLoader.load(serversModelSrc, (gltf) => {
  serversModel = gltf.scene.children[0];
});
gltfLoader.load(manufacturingModelSrc, (gltf) => {
  manufacturingModel = gltf.scene.children[0];
});

const textureLoader = new THREE.TextureLoader();
const lightMap = textureLoader.load(lightMapTexture);
const cloudsMap = textureLoader.load(cloudsTexture);

const handleGlobeReady = () => {
  hideOverlay(800);
  setElementVisibility(launchButton, true);
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
  [B2B_STEP_2]: () =>
    initManufacturingSceneObject({ sizes, canvas, manufacturingModel }),
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

const setLightTheme = () => {
  html.style.color = "#363636";
  html.style.backgroundColor = "#EFEEEE";
};

const setNavVisibility = (visible) => {
  nav.style.display = visible ? "block" : "none";
};

const setHeadingText = (text) => {
  heading.innerText = text;
};

const handleB2BButtonClick = () => {
  globeToB2B().then(() => {
    setCurrentStep(B2B_STEP_1);
    setLightTheme();
    setNavVisibility(true);
    setElementVisibility(placeOrderButton, true);
    setHeadingText("Business-to-business");
    hideOverlay(600);
  });
  showOverlay("white", 300, 700);
  setElementVisibility(pathButtons, false);
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
    setHeadingText("Today");
    heading.classList.remove("intro-heading");
    heading.classList.add("today-heading");
    setElementVisibility(nextButton, true);
  });
};

const handleNextButtonClick = () => {
  nextButton.style.display = "none";
  pathButtons.style.display = "flex";
  setHeadingText("Tomorrow");
  addFulfillment();
};

const handlePlacOrderButtonClick = () => {
  setElementVisibility(placeOrderButton, false);
  launchServerScene()
    .then(() => wait(1000))
    .then(() => {
      setElementVisibility(nav, false);
      setElementVisibility(heading, false);
      showOverlay("white", 600);
      wait(600).then(() => {
        setCurrentSceneObject(getGlobeSceneObject());
        hideOverlay(600);
        transitionToManufacturing();
        wait(1500)
          .then(() => showOverlay("white", 300))
          .then(() => wait(300))
          .then(() => {
            setElementVisibility(heading, true);
            setElementVisibility(nav, true);
            setElementVisibility(manufactureButton, true);
            setCurrentStep(B2B_STEP_2);
            setNavButtonActive("manufacturing", true);
            hideOverlay(300);
          });
      });
    });
};

const handleManufactureClick = () => {
  launchManufacturingScene().then(() => {
    showOverlay("white", 300);
  });
};

const addEventListeners = () => {
  nextButton.addEventListener("click", handleNextButtonClick);
  launchButton.addEventListener("click", handleLaunchButtonClick);
  uploadLogoInput.addEventListener("change", handleLogoUpload);
  b2bButton.addEventListener("click", handleB2BButtonClick);
  placeOrderButton.addEventListener("click", handlePlacOrderButtonClick);
  manufactureButton.addEventListener("click", handleManufactureClick);
  window.addEventListener("resize", onResize);
};

addEventListeners();
tick();
