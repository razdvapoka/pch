import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

import lightMapTexture from "./assets/images/earth-lights.png";
import cloudsTexture from "./assets/images/tex-clouds-inverted.jpg";
import planeShadowAlphaTexture from "./assets/images/plane-shadow.png";
import serversModelSrc from "./assets/models/servers-draco.gltf";
import manufacturingModelSrc from "./assets/models/manufacturing-draco.gltf";
import postponementModelSrc from "./assets/models/postponement-draco.gltf";
import fulfillmentModelSrc from "./assets/models/fulfillment-draco.gltf";
import deliveryAModelSrc from "./assets/models/delivery-a-draco.gltf";
import deliveryBModelSrc from "./assets/models/delivery-b-draco.gltf";
import orderD2CModelSrc from "./assets/models/order-d2c-draco.gltf";
import deliveryC_B2B_ModelSrc from "./assets/models/delivery-c-b2b-draco.gltf";
import deliveryC0_D2C_ModelSrc from "./assets/models/delivery-c1-d2c-draco.gltf";
import deliveryC_D2C_ModelSrc from "./assets/models/delivery-c-d2c-draco.gltf";
import pyramidSrc from "./assets/models/pyramid-draco.gltf";

import {
  GLOBE_STEP,
  ORDER_B2B_STEP,
  MANUFACTURING_STEP,
  POSTPONEMENT_STEP,
  FULFILLMENT_STEP,
  DELIVERY_B2B_STEP,
  DELIVERY_D2C_STEP,
  ORDER_D2C_STEP,
  RESET_STEP,
  DEFAULT_POINT_TIMEOUT,
} from "./consts";

import { wait } from "./utils";

import {
  sceneToChinaRotator,
  switchToTomorrow,
  switchToToday,
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
  resetGlobeScene,
  setPyramidModel,
  showNavButtons,
  setHtmlElementsHidden,
  getTransitionFromStepToStep,
} from "./scenes/globe";
import { setMaxPointTimeout } from "./scenes/globe/arcs";
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
  launchDeliveryB2BScene,
  launchDeliveryD2C0Scene,
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
  tomorrowButton,
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
  longFlghts,
  todayButton,
  menuButtons,
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
let deliveryC0_D2C_Model;
let isD2C = true;
let isLogoUploaded = false;

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
    setCurrentStep(DELIVERY_B2B_STEP);
  });
};

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/draco/");
const gltfLoader = new GLTFLoader(manager);
gltfLoader.setDRACOLoader(dracoLoader);
gltfLoader.load(pyramidSrc, (gltf) => {
  setPyramidModel(gltf.scene.children[0]);
});
// gltfLoader.load(serversModelSrc, (gltf) => {
//   serversModel = gltf.scene.children[0];
// });
// gltfLoader.load(manufacturingModelSrc, (gltf) => {
//   manufacturingModel = gltf.scene.children[0];
// });
// gltfLoader.load(postponementModelSrc, (gltf) => {
//   postponementModel = gltf.scene.children[0];
// });
// gltfLoader.load(fulfillmentModelSrc, (gltf) => {
//   fulfillmentModel = gltf.scene.children[0];
// });
// gltfLoader.load(deliveryAModelSrc, (gltf) => {
//   deliveryAModel = gltf.scene.children[0];
// });
gltfLoader.load(deliveryBModelSrc, (gltf) => {
  deliveryBModel = gltf.scene.children[0];
});
gltfLoader.load(deliveryC_B2B_ModelSrc, (gltf) => {
  deliveryC_B2B_Model = gltf.scene.children[0];
});
gltfLoader.load(deliveryC_D2C_ModelSrc, (gltf) => {
  deliveryC_D2C_Model = gltf.scene.children[0];
});
gltfLoader.load(deliveryC0_D2C_ModelSrc, (gltf) => {
  deliveryC0_D2C_Model = gltf.scene.children[0];
});
// gltfLoader.load(orderD2CModelSrc, (gltf) => {
//   orderD2CModel = gltf.scene.children[0];
// });

const textureLoader = new THREE.TextureLoader(manager);
const lightMap = textureLoader.load(lightMapTexture);
const cloudsMap = textureLoader.load(cloudsTexture);
const planeShadowAlphaMap = textureLoader.load(planeShadowAlphaTexture);

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
  [ORDER_B2B_STEP]: () =>
    initServersSceneObject({ sizes, canvas, serversModel }),
  [MANUFACTURING_STEP]: () =>
    initManufacturingSceneObject({ sizes, canvas, manufacturingModel }),
  [POSTPONEMENT_STEP]: () =>
    initPostponementSceneObject({ sizes, canvas, postponementModel }),
  [FULFILLMENT_STEP]: () =>
    initFulfillmentSceneObject({
      sizes,
      canvas,
      fulfillmentModel,
      deliveryAModel,
      planeShadowAlphaMap,
    }),
  [DELIVERY_B2B_STEP]: () =>
    initDeliveryBSceneObject({
      sizes,
      canvas,
      deliveryBModel,
      deliveryC_B2B_Model,
      deliveryC_D2C_Model,
      deliveryC0_D2C_Model,
      checkIfD2C,
    }),
  [ORDER_D2C_STEP]: () =>
    initOrderD2CSceneObject({ sizes, canvas, orderD2CModel }),
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
const getCurrentStep = () => currentStep;

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

const getPathButtonClickHandler = (transition, heading, d2c) => () => {
  transition().then(() => {
    setCurrentStep(d2c ? ORDER_D2C_STEP : ORDER_B2B_STEP);
    isD2C = d2c;
    setLightTheme();
    setNavVisibility(true);
    setElementVisibility(d2c ? placeOrderD2CButton : placeOrderButton, true);
    setElementVisibility(globeButton, true);
    setHeadingText(heading);
    hideOverlay(600);
  });
  showOverlay("white", 300, 700);
  setElementVisibility(pathButtons, false);
  setElementVisibility(todayButton, false);
  setElementVisibility(longFlghts, false);
  if (!isLogoUploaded) {
    setElementVisibility(uploadLogoLabel, false);
  }
};

const handleB2BButtonClick = getPathButtonClickHandler(
  globeToB2B,
  "Business-to-business",
  false
);
const handleD2CButtonClick = getPathButtonClickHandler(
  globeToD2C,
  "Direct-to-consumer",
  true
);

const handleLogoUpload = (e) => {
  const files = e.target.files;
  if (files.length > 0) {
    const file = files[0];
    const fileReader = new FileReader();
    fileReader.onload = (d) => {
      const fileString = d.target.result;
      const url = `url(${fileString.replace(/(\r\n|\n|\r)/gm, "")})`;
      clientLogo.style.backgroundImage = url;
      setElementVisibility(clientLogo, true);
      setElementVisibility(uploadLogoLabel, false);
      isLogoUploaded = true;
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
    setElementVisibility(tomorrowButton, true);
  });
};

const handleTomorrowButtonClick = () => {
  setElementVisibility(tomorrowButton, false);
  setElementVisibility(pathButtons, true);
  setElementVisibility(todayButton, true);
  setElementVisibility(longFlghts, true);
  setHeadingText("Tomorrow");
  switchToTomorrow();
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
          .then(() => showOverlay("white", 300, 300))
          .then(() => {
            setElementVisibility(heading, true);
            setElementVisibility(nav, true);
            setElementVisibility(globeButton, true);
            setElementVisibility(nextButton, true);
            setCurrentStep(nextStep);
            setNavButtonActive(navButton);
            hideOverlay(300);
          });
      });
    });
};

const NEXT_BUTTONS = {
  [ORDER_B2B_STEP]: placeOrderButton,
  [ORDER_D2C_STEP]: placeOrderD2CButton,
  [MANUFACTURING_STEP]: manufactureButton,
  [POSTPONEMENT_STEP]: postponementButton,
  [FULFILLMENT_STEP]: fulfillmentButton,
  [DELIVERY_B2B_STEP]: deliveryButton,
};

const NAV_BUTTONS = {
  [ORDER_B2B_STEP]: "order",
  [ORDER_D2C_STEP]: "order",
  [MANUFACTURING_STEP]: "manufacturing",
  [POSTPONEMENT_STEP]: "postponement",
  [FULFILLMENT_STEP]: "fulfillment",
  [DELIVERY_B2B_STEP]: "delivery",
};

const handleMenuButtonClick = (e) => {
  const stepFrom = getCurrentStep();
  let stepTo = e.target.dataset.step;
  if (checkIfD2C() && stepTo === ORDER_B2B_STEP) {
    stepTo = ORDER_D2C_STEP;
  }
  if (checkIfD2C() && stepTo === DELIVERY_B2B_STEP) {
    stepTo = DELIVERY_D2C_STEP;
  }
  const transition = getTransitionFromStepToStep(stepFrom, stepTo);
  const startButton = document.querySelector(".action-button:not(.hidden)");
  const globeTransitionProps = {
    launchScene: () => Promise.resolve(),
    transition,
    startButton,
    nextButton: NEXT_BUTTONS[stepTo],
    nextStep: stepTo,
    navButton: NAV_BUTTONS[stepTo],
  };
  const globeTransition = getGlobeTransitioner(globeTransitionProps);
  return globeTransition();
};

const handlePlaceOrderD2CButtonClick = getGlobeTransitioner({
  launchScene: launchOrderD2CScene,
  transition: transitionD2CToManufacturing,
  startButton: placeOrderD2CButton,
  nextButton: manufactureButton,
  nextStep: MANUFACTURING_STEP,
  navButton: "manufacturing",
});

const handlePlaceOrderButtonClick = getGlobeTransitioner({
  launchScene: launchServerScene,
  transition: transitionB2BToManufacturing,
  startButton: placeOrderButton,
  nextButton: manufactureButton,
  nextStep: MANUFACTURING_STEP,
  navButton: "manufacturing",
});

const handleManufactureClick = getGlobeTransitioner({
  launchScene: launchManufacturingScene,
  transition: transitionToPostponement,
  startButton: manufactureButton,
  nextButton: postponementButton,
  nextStep: POSTPONEMENT_STEP,
  navButton: "postponement",
});

const handlePostponementClick = getGlobeTransitioner({
  launchScene: launchPostponementScene,
  transition: transitionToFulfillment,
  startButton: postponementButton,
  nextButton: fulfillmentButton,
  nextStep: FULFILLMENT_STEP,
  navButton: "fulfillment",
});

const handleFulfillmentClick = getGlobeTransitioner({
  launchScene: launchFulfillmentScene,
  transition: transitionToDelivery,
  startButton: fulfillmentButton,
  nextButton: deliveryButton,
  nextStep: DELIVERY_B2B_STEP,
  navButton: "delivery",
  waitBeforeOverlay: 2500,
});

const showRestartScene = () => {
  heading.classList.remove("today-heading");
  heading.classList.add("intro-heading");
  setHeadingText("Our solution in China");
  setElementVisibility(heading, true);
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
    isD2C = false;
    isLogoUploaded = false;
    setElementVisibility(clientLogo, false);
    setElementVisibility(uploadLogoLabel, true);
    setElementVisibility(longFlghts, false);
    clientLogo.style.backgroundImage = "none";
    setMaxPointTimeout(DEFAULT_POINT_TIMEOUT);
    hideOverlay(600);
  });
};

const handleGlobeButtonClick = () => {
  setElementVisibility(nav, false);
  setElementVisibility(heading, false);
  setElementVisibility(globeButton, false);
  const actionButton = document.querySelector(".action-button:not(.hidden)");
  setElementVisibility(actionButton, false);
  setDarkTheme();
  showOverlay("white", 600).then(() => {
    setCurrentSceneObject(getGlobeSceneObject());
    hideOverlay(500, 150);
    sceneToChinaRotator(currentStep)().then(() => {
      setElementVisibility(pathButtons, true);
      setElementVisibility(heading, true);
      setHeadingText("Tomorrow");
      showNavButtons();
      setHtmlElementsHidden(false);
    });
  });
};

const handleTodayButtonClick = () => {
  setElementVisibility(tomorrowButton, true);
  setElementVisibility(pathButtons, false);
  setElementVisibility(todayButton, false);
  setElementVisibility(longFlghts, false);
  setHeadingText("Today");
  switchToToday();
};

const addEventListeners = () => {
  tomorrowButton.addEventListener("click", handleTomorrowButtonClick);
  launchButton.addEventListener("click", launchDeliveryD2C0Scene);
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
  globeButton.addEventListener("click", handleGlobeButtonClick);
  todayButton.addEventListener("click", handleTodayButtonClick);
  menuButtons.forEach((button) =>
    button.addEventListener("click", handleMenuButtonClick)
  );
  window.addEventListener("resize", onResize);
};

addEventListeners();
tick();
