import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

import lightMapTexture from "./assets/images/earth-lights.png";
import cloudsTexture from "./assets/images/tex-clouds-inverted.jpg";
import serversModelSrc from "./assets/models/servers-draco.gltf";
import manufacturingModelSrc from "./assets/models/manufacturing-draco.gltf";
import postponementModelSrc from "./assets/models/postponement-draco.gltf";
import fulfillmentModelSrc from "./assets/models/fulfillment-draco.gltf";
import deliveryAModelSrc from "./assets/models/delivery-a-draco.gltf";
import deliveryBModelSrc from "./assets/models/delivery-b-draco.gltf";
import orderD2CModelSrc from "./assets/models/order-d2c-draco.gltf";
import deliveryC_B2B_ModelSrc from "./assets/models/delivery-c-b2b-draco.gltf";
import deliveryC_D2C_ModelSrc from "./assets/models/delivery-c-d2c-draco.gltf";

import {
  GLOBE_STEP,
  B2B_STEP_1,
  B2B_STEP_2,
  B2B_STEP_3,
  B2B_STEP_4,
  B2B_STEP_5,
  D2C_STEP_1,
  RESET_STEP,
} from "./consts";

import { wait } from "./utils";

import {
  addFulfillment,
  launchGlobeScene,
  globeToB2B,
  globeToD2C,
  initGlobeSceneObject,
  getGlobeSceneObject,
  transitionB2BToManufacturing,
  transitionD2CToManufacturing,
  transitionToPostponement,
  transitionToFulfillment,
  transitionToDelivery,
  transitionFromDeliveryToFulfillment,
  resetGlobeScene,
} from "./scenes/globe";
import { initServersSceneObject, launchServerScene } from "./scenes/servers";
import {
  initManufacturingSceneObject,
  launchManufacturingScene,
} from "./scenes/manufacturing";
import {
  initFulfillmentSceneObject,
  launchFulfillmentScene,
} from "./scenes/fulfillment";
import {
  initPostponementSceneObject,
  launchPostponementScene,
} from "./scenes/postponement";
import {
  initDeliveryBSceneObject,
  launchDeliveryBScene,
} from "./scenes/delivery-b";
import {
  initOrderD2CSceneObject,
  launchOrderD2CScene,
} from "./scenes/order-d2c";

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
  d2cButton,
  placeOrderButton,
  placeOrderD2CButton,
  setElementVisibility,
  showOverlay,
  hideOverlay,
  setNavButtonActive,
  manufactureButton,
  postponementButton,
  fulfillmentButton,
  deliveryButton,
  progressBar,
  globeButton,
  restartScene,
  restartButton,
} from "./ui";

let serversModel;
let manufacturingModel;
let postponementModel;
let fulfillmentModel;
let deliveryAModel;
let deliveryBModel;
let orderD2CModel;
let deliveryC_B2B_Model;
let deliveryC_D2C_Model;
let isD2C = false;

const checkIfD2C = () => {
  return isD2C;
};

const manager = new THREE.LoadingManager();
manager.onProgress = (_, itemsLoaded, itemsTotal) => {
  progressBar.style.transform = `scaleX(${itemsLoaded / itemsTotal})`;
};
manager.onLoad = () => {
  progressBar.style.transform = `scale(0.1640625, 3.05) translateY(-2.04rem)`;
  progressBar.style.borderRadius = `0.5rem`;
  wait(200).then(() => {
    setElementVisibility(launchButton, true);
    progressBar.style.opacity = 0;
    hideOverlay(800);
  });
};

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/draco/");
const gltfLoader = new GLTFLoader(manager);
gltfLoader.setDRACOLoader(dracoLoader);
gltfLoader.load(serversModelSrc, (gltf) => {
  serversModel = gltf.scene.children[0];
});
gltfLoader.load(manufacturingModelSrc, (gltf) => {
  manufacturingModel = gltf.scene.children[0];
});
gltfLoader.load(postponementModelSrc, (gltf) => {
  postponementModel = gltf.scene.children[0];
});
gltfLoader.load(fulfillmentModelSrc, (gltf) => {
  fulfillmentModel = gltf.scene.children[0];
});
gltfLoader.load(deliveryAModelSrc, (gltf) => {
  deliveryAModel = gltf.scene.children[0];
});
gltfLoader.load(deliveryBModelSrc, (gltf) => {
  deliveryBModel = gltf.scene.children[0];
});
gltfLoader.load(deliveryC_B2B_ModelSrc, (gltf) => {
  deliveryC_B2B_Model = gltf.scene.children[0];
});
gltfLoader.load(deliveryC_D2C_ModelSrc, (gltf) => {
  deliveryC_D2C_Model = gltf.scene.children[0];
});
gltfLoader.load(orderD2CModelSrc, (gltf) => {
  orderD2CModel = gltf.scene.children[0];
});

const textureLoader = new THREE.TextureLoader(manager);
const lightMap = textureLoader.load(lightMapTexture);
const cloudsMap = textureLoader.load(cloudsTexture);

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
      canvas,
    }),
  [B2B_STEP_1]: () => initServersSceneObject({ sizes, canvas, serversModel }),
  [B2B_STEP_2]: () =>
    initManufacturingSceneObject({ sizes, canvas, manufacturingModel }),
  [B2B_STEP_3]: () =>
    initPostponementSceneObject({ sizes, canvas, postponementModel }),
  [B2B_STEP_4]: () =>
    initFulfillmentSceneObject({
      sizes,
      canvas,
      fulfillmentModel,
      deliveryAModel,
    }),
  [B2B_STEP_5]: () =>
    initDeliveryBSceneObject({
      sizes,
      canvas,
      deliveryBModel,
      deliveryC_B2B_Model,
      deliveryC_D2C_Model,
      checkIfD2C,
    }),
  [D2C_STEP_1]: () => initOrderD2CSceneObject({ sizes, canvas, orderD2CModel }),
  [RESET_STEP]: () => {
    const scene = new THREE.Scene();
    scene.background = null;
    const onResize = () => {};
    const camera = new THREE.Camera();
    return {
      scene,
      onResize,
      camera,
    };
  },
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
renderer.setClearColor(0xffffff, 0);

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

const setDarkTheme = () => {
  html.style.color = "white";
  html.style.backgroundColor = "black";
};

const setNavVisibility = (visible) => {
  setElementVisibility(nav, visible);
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
    setElementVisibility(globeButton, true);
    setHeadingText("Business-to-business");
    hideOverlay(600);
  });
  showOverlay("white", 300, 700);
  setElementVisibility(pathButtons, false);
};

const handleD2CButtonClick = () => {
  globeToD2C().then(() => {
    isD2C = true;
    setCurrentStep(D2C_STEP_1);
    setLightTheme();
    setNavVisibility(true);
    setElementVisibility(placeOrderD2CButton, true);
    setHeadingText("Direct-to-consumer");
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
      const fileString = d.target.result;
      const url = `url(${fileString.replace(/(\r\n|\n|\r)/gm, "")})`;
      clientLogo.style.backgroundImage = url;
      clientLogo.style.display = "block";
      uploadLogoLabel.style.display = "none";
    };
    fileReader.readAsDataURL(file);
  }
};

const handleLaunchButtonClick = () => {
  setElementVisibility(launchButton, false);
  launchGlobeScene().then(() => {
    setHeadingText("Today");
    heading.classList.remove("intro-heading");
    heading.classList.add("today-heading");
    setElementVisibility(nextButton, true);
  });
};

const handleNextButtonClick = () => {
  setElementVisibility(nextButton, false);
  setElementVisibility(pathButtons, true);
  setHeadingText("Tomorrow");
  addFulfillment();
};

const getGlobeTransitioner = ({
  launchScene,
  transition,
  startButton,
  nextButton,
  nextStep,
  navButton,
  waitBeforeOverlay = 1500,
}) => () => {
  setElementVisibility(startButton, false);
  return launchScene()
    .then(() => wait(1000))
    .then(() => {
      setElementVisibility(nav, false);
      setElementVisibility(heading, false);
      setElementVisibility(globeButton, false);
      showOverlay("white", 600).then(() => {
        setCurrentSceneObject(getGlobeSceneObject());
        hideOverlay(600);
        transition();
        wait(waitBeforeOverlay)
          .then(() => showOverlay("white", 300))
          .then(() => wait(300))
          .then(() => {
            setElementVisibility(heading, true);
            setElementVisibility(nav, true);
            setElementVisibility(globeButton, true);
            setElementVisibility(nextButton, true);
            setCurrentStep(nextStep);
            setNavButtonActive(navButton, true);
            hideOverlay(300);
          });
      });
    });
};

const handlePlaceOrderD2CButtonClick = getGlobeTransitioner({
  launchScene: launchOrderD2CScene,
  transition: transitionD2CToManufacturing,
  startButton: placeOrderD2CButton,
  nextButton: manufactureButton,
  nextStep: B2B_STEP_2,
  navButton: "manufacturing",
});

const handlePlaceOrderButtonClick = getGlobeTransitioner({
  launchScene: launchServerScene,
  transition: transitionB2BToManufacturing,
  startButton: placeOrderButton,
  nextButton: manufactureButton,
  nextStep: B2B_STEP_2,
  navButton: "manufacturing",
});

const handleManufactureClick = getGlobeTransitioner({
  launchScene: launchManufacturingScene,
  transition: transitionToPostponement,
  startButton: manufactureButton,
  nextButton: postponementButton,
  nextStep: B2B_STEP_3,
  navButton: "postponement",
});

const handlePostponementClick = getGlobeTransitioner({
  launchScene: launchPostponementScene,
  transition: transitionToFulfillment,
  startButton: postponementButton,
  nextButton: fulfillmentButton,
  nextStep: B2B_STEP_4,
  navButton: "fulfillment",
});

const handleFulfillmentClick = getGlobeTransitioner({
  launchScene: launchFulfillmentScene,
  transition: transitionToDelivery,
  startButton: fulfillmentButton,
  nextButton: deliveryButton,
  nextStep: B2B_STEP_5,
  navButton: "delivery",
  waitBeforeOverlay: 2500,
});

const showRestartScene = () => {
  setHeadingText("Our solution in China");
  setElementVisibility(restartButton, true);
  setElementVisibility(restartScene, true);
};

const handleDeliveryButtonClick = () => {
  setElementVisibility(deliveryButton, false);
  return launchDeliveryBScene().then(() => {
    setElementVisibility(nav, false);
    setElementVisibility(heading, false);
    showOverlay("black", 600).then(() => {
      setCurrentStep(RESET_STEP);
      const explosionBox = document.querySelector(".explosion-box");
      explosionBox.classList.remove("active");
      const navMenuButtons = document.querySelectorAll(
        ".nav-menu-button:not(.nav-button-order)"
      );
      navMenuButtons.forEach((button) => button.classList.remove("active"));
      setDarkTheme();
      showRestartScene();
      hideOverlay(600);
    });
  });
};

const handleRestartButtonClick = () => {
  setElementVisibility(restartButton, false);
  setElementVisibility(nav, false);
  setElementVisibility(heading, false);
  setElementVisibility(restartScene, false);
  showOverlay("black", 600).then(() => {
    setCurrentSceneObject(getGlobeSceneObject());
    currentStep = GLOBE_STEP;
    resetGlobeScene();
    setElementVisibility(heading, true);
    setElementVisibility(launchButton, true);
    setHeadingText("Single solution to end supply chain");
    heading.classList.remove("today-heading");
    heading.classList.add("intro-heading");
    isD2C = false;
    hideOverlay(600);
  });
};

const addEventListeners = () => {
  nextButton.addEventListener("click", handleNextButtonClick);
  launchButton.addEventListener("click", handleLaunchButtonClick);
  uploadLogoInput.addEventListener("change", handleLogoUpload);
  b2bButton.addEventListener("click", handleB2BButtonClick);
  d2cButton.addEventListener("click", handleD2CButtonClick);
  placeOrderD2CButton.addEventListener("click", handlePlaceOrderD2CButtonClick);
  placeOrderButton.addEventListener("click", handlePlaceOrderButtonClick);
  manufactureButton.addEventListener("click", handleManufactureClick);
  postponementButton.addEventListener("click", handlePostponementClick);
  fulfillmentButton.addEventListener("click", handleFulfillmentClick);
  deliveryButton.addEventListener("click", handleDeliveryButtonClick);
  restartButton.addEventListener("click", handleRestartButtonClick);
  window.addEventListener("resize", onResize);
};

addEventListeners();
tick();
