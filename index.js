import { geoDistance } from "d3-geo";
import anime from "animejs/lib/anime.es.js";
import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
import ThreeGlobe from "three-globe";
import globeImage from "./assets/images/earth-gray.png";
import lightMapTexture from "./assets/images/earth-lights.png";
import cloudsTexture from "./assets/images/tex-clouds-inverted.jpg";
import { calcCurve } from "./calcCurve";
import { airport, tallBuildingsGroup, lowBuildingsGroup } from "./buildings";
import {
  pointsGeometry,
  pointsMaterial,
  launchCurveAnimationLoop,
  getArcAnimationHandle,
} from "./arcs";

import {
  arcsData,
  pathsData,
  customData,
  USA_STATE,
  CHINA_STATE,
  EUROPE_STATE,
} from "./data";

const CANONIC_WIDTH = 1440;
const CANONIC_GLOBE_RADIUS = 100;
const CENTER = new THREE.Vector3(0, 0, 0);
const CAM_R = 220;
const DEFAULT_CAM_THETA = Math.PI - 1.1732590418436886;
const DEFAULT_CAM_PHI = 1.2649334407322725;
const ROTATION_DURATION = 500;

const setObjectPositionOnSphere = (object, theta, phi, radius) => {
  object.position.z = radius * Math.sin(phi) * Math.cos(theta);
  object.position.x = radius * Math.sin(phi) * Math.sin(theta);
  object.position.y = radius * Math.cos(phi);
  object.lookAt(CENTER);
};

const polar2Cartesian = (lat, lng, alt, rad) => {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((90 - lng) * Math.PI) / 180;
  const r = rad * (1 + alt);
  return {
    x: r * Math.sin(phi) * Math.cos(theta),
    y: r * Math.cos(phi),
    z: r * Math.sin(phi) * Math.sin(theta),
  };
};

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const d2r = THREE.Math.degToRad;

const textureLoader = new THREE.TextureLoader();
const lightMap = textureLoader.load(lightMapTexture);
const cloudsMap = textureLoader.load(cloudsTexture);

const raycaster = new THREE.Raycaster();

// State
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
const labels = {};
const explosions = {};
let isGlobeReady = false;
let currentState = CHINA_STATE;
let cameraTheta = DEFAULT_CAM_THETA;
let cameraPhi = DEFAULT_CAM_PHI;
let pointsMesh = null;

// Camera rotation

const getCameraRotator = (theta, phi) => () => {
  const newCameraTheta = cameraTheta + theta;
  const newCameraPhi = cameraPhi + phi;
  anime({
    duration: ROTATION_DURATION,
    easing: "easeInOutCubic",
    update: (a) => {
      const alpha = a.progress / 100;
      const t = cameraTheta + alpha * (newCameraTheta - cameraTheta);
      const p = cameraPhi + alpha * (newCameraPhi - cameraPhi);
      setObjectPositionOnSphere(camera, t, p, CAM_R);
    },
    complete: () => {
      cameraTheta = newCameraTheta;
      cameraPhi = newCameraPhi;
    },
  });
};

const china2USARotator = getCameraRotator(Math.PI * 0.8, -Math.PI * 0.08);
const china2EuropeRotator = getCameraRotator(-Math.PI * 0.5, -Math.PI * 0.12);
const USA2ChinaRotator = getCameraRotator(-Math.PI * 0.8, Math.PI * 0.08);
const USA2EuropeRotator = getCameraRotator(Math.PI * 0.7, -Math.PI * 0.04);
const europe2ChinaRotator = getCameraRotator(Math.PI * 0.5, Math.PI * 0.12);
const europe2USARotator = getCameraRotator(-Math.PI * 0.7, Math.PI * 0.04);

// GUI
const parameters = {
  china2USA: china2USARotator,
  USA2China: USA2ChinaRotator,
  china2Europe: china2EuropeRotator,
  europe2China: europe2ChinaRotator,
  light1Theta: d2r(51),
  light1Phi: d2r(89),
  light2Theta: d2r(23),
  light2Phi: d2r(279),
};

// Canvas
const canvas = document.querySelector("#canvas");

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color("#000000");

// const axesHelper = new THREE.AxesHelper(1000);
// scene.add(axesHelper);

const createLabel = (objData) => {
  const element = document.createElement("div");
  element.id = objData.id;
  element.classList.add("label");
  const textElement = document.createElement("span");
  textElement.innerText = objData.label;
  element.appendChild(textElement);
  if (objData.subLabel) {
    const subTextElement = document.createElement("span");
    subTextElement.classList.add("sub-label");
    subTextElement.innerText = objData.subLabel;
    element.appendChild(subTextElement);
  }
  document.body.appendChild(element);
  const scale = sizes.width / CANONIC_WIDTH;
  return {
    position: new THREE.Vector3().copy(
      polar2Cartesian(
        objData.lat,
        objData.lng,
        0.01,
        CANONIC_GLOBE_RADIUS * scale
      )
    ),
    element,
    coords: {
      lat: objData.lat,
      lng: objData.lng,
    },
  };
};

const createExplosion = (objData) => {
  const element = document.createElement("div");
  element.id = objData.id;
  element.classList.add("explosion-box");
  const explosion = document.createElement("div");
  explosion.classList.add("explosion");
  element.appendChild(explosion);
  document.body.appendChild(element);
  const scale = sizes.width / CANONIC_WIDTH;
  return {
    position: new THREE.Vector3().copy(
      polar2Cartesian(
        objData.lat,
        objData.lng,
        0.01,
        CANONIC_GLOBE_RADIUS * scale
      )
    ),
    element,
    coords: {
      lat: objData.lat,
      lng: objData.lng,
    },
  };
};

const handleCustomObject = (objData) => {
  switch (objData.objType) {
    case "label": {
      if (!labels[objData.id]) {
        labels[objData.id] = createLabel(objData);
      }
      return;
    }
    case "explosion": {
      if (!explosions[objData.id]) {
        explosions[objData.id] = createExplosion(objData);
      }
      return;
    }
    case "a":
      return airport.clone();
    case "tb":
      return tallBuildingsGroup.clone();
    case "lb":
      return lowBuildingsGroup.clone();
    case "arc": {
      if (!getArcAnimationHandle(objData.id)) {
        const dist = geoDistance(
          [objData.startLng, objData.startLat],
          [objData.endLng, objData.endLat]
        );
        const curve = calcCurve(objData);
        launchCurveAnimationLoop(objData.id, curve.getPoints(400), dist);
      }
      if (!pointsMesh) {
        pointsMesh = new THREE.Points(pointsGeometry, pointsMaterial);
        globe.add(pointsMesh);
      }
    }
  }
};

const handleCustomObjectUpdate = (obj, d) => {
  Object.assign(obj.position, globe.getCoords(d.lat, d.lng, d.alt));
  obj.lookAt(new THREE.Vector3(0, 0, 0));
  if (d.objType !== "a") {
    obj.rotation.z += Math.PI / 2;
  }
};

const handleGlobeReady = () => {
  const scale = sizes.width / CANONIC_WIDTH;
  globe.scale.set(scale, scale, scale);
  isGlobeReady = true;
  pointsMaterial.opacity = 1;
  console.log("globe ready");
  console.log(globe);
};

// Globe
const globe = new ThreeGlobe({ animateIn: false, atmosphereColor: "white" })
  .rendererSize(new THREE.Vector2(sizes.width, sizes.height))
  .globeImageUrl(globeImage)
  .atmosphereColor("white")
  .atmosphereAltitude(0.1)
  .customLayerData(customData)
  .customThreeObject(handleCustomObject)
  .customThreeObjectUpdate(handleCustomObjectUpdate)
  .arcsData(arcsData)
  .arcColor("color")
  .arcAltitude((arc) => arc.alt)
  .arcAltitudeAutoScale((arc) => arc.altitudeAutoScale)
  .pathsData(pathsData)
  .pathPointAlt(0.01)
  .pathColor(() => "rgb(90, 100, 250)")
  .onGlobeReady(handleGlobeReady);

// Globe mesh
const globeMesh = globe.children[0].children[0].children[0];
const uv = globeMesh.geometry.getAttribute("uv").array;
globeMesh.geometry.setAttribute("uv2", new THREE.BufferAttribute(uv, 2));

// Globe material
const material = globe.globeMaterial();
material.color = new THREE.Color("#2750CC");
material.lightMap = lightMap;
material.lightMapIntensity = 7;

scene.add(globe);

const cloudSphere = new THREE.Mesh(
  new THREE.SphereBufferGeometry(101, 64, 64),
  new THREE.MeshStandardMaterial({
    color: "white",
    alphaMap: cloudsMap,
    transparent: true,
    opacity: 0.1,
  })
);
globe.add(cloudSphere);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

const createLight = (theta, phi, needHelper = false) => {
  const light = new THREE.DirectionalLight(0xffffff, 0.5);
  setObjectPositionOnSphere(light, theta, phi, 200);

  const lightTarget = new THREE.Object3D();
  setObjectPositionOnSphere(lightTarget, theta + Math.PI, phi + Math.PI, 1);

  light.target = lightTarget;

  scene.add(light, lightTarget);

  if (needHelper) {
    const helper = new THREE.DirectionalLightHelper(light);
    scene.add(helper);
    light.__helper = helper;
  }

  return light;
};

const light1 = createLight(d2r(51), d2r(89));
const light2 = createLight(d2r(23), d2r(279));
light1.intensity = 0.75;
light2.intensity = 0.25;

const onResize = () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // RESPONSIVENESS
  const scale = sizes.width / CANONIC_WIDTH;
  globe.scale.set(scale, scale, scale);

  Object.keys(labels).map((labelKey) => {
    const label = labels[labelKey];
    label.position = new THREE.Vector3().copy(
      polar2Cartesian(
        label.coords.lat,
        label.coords.lng,
        0.01,
        CANONIC_GLOBE_RADIUS * scale
      )
    );
  });
};

// const onMouseMove = (event) => {
//   // calculate mouse position in normalized device coordinates
//   // (-1 to +1) for both components

//   mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//   mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
// };

// const onClick = () => {
//   // const tc = camera.position.angleTo(Z_AXIS);
//   // const pc = camera.position.angleTo(Y_AXIS);
//   // console.log(tc, pc);
//   // raycaster.setFromCamera(mouse, camera);
//   // const intersects = raycaster.intersectObjects(scene.children, true);
//   // if (intersects.length > 0) {
//   // const c = globe.toGeoCoords(intersects[0].point);
//   // console.log(c);
//   // console.log(camera);
//   // const v = Math.random();
//   // const t = v < 0.33 ? "a" : v < 0.66 ? "tb" : "lb";
//   // data.push({ ...c, objType: t });
//   // globe.customLayerData(data);
//   // }
// };

window.addEventListener("resize", onResize);
// window.addEventListener("mousemove", onMouseMove);
// window.addEventListener("click", onClick);

/**
 * Camera
 */

const camera = new THREE.PerspectiveCamera(
  40,
  sizes.width / sizes.height,
  0.1,
  2500
);
setObjectPositionOnSphere(camera, DEFAULT_CAM_THETA, DEFAULT_CAM_PHI, CAM_R);
scene.add(camera);

// Controls
// const controls = new OrbitControls(camera, canvas);
// controls.update();

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
  outputEncoding: THREE.sRGBEncoding,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0xcecece);

// GUI

const gui = new dat.GUI({
  width: 350,
});

const getLightUpdater = (light) => (theta, phi) => {
  setObjectPositionOnSphere(light, theta, phi, 200);
  setObjectPositionOnSphere(light.target, theta + Math.PI, phi + Math.PI, 1);
  if (light.__helper) {
    light.__helper.update();
  }
};

const lightsFolder = gui.addFolder("lights");
lightsFolder.add(light1, "intensity", 0, 1, 0.001).name("light 1").listen();
lightsFolder.add(light2, "intensity", 0, 1, 0.001).name("light 2").listen();
lightsFolder
  .add(parameters, "light1Theta", -360, 360, 1)
  .name("light 1 theta")
  .onChange(() => {
    const updater = getLightUpdater(light1);
    updater(d2r(parameters.light1Theta), d2r(parameters.light1Phi));
  });
lightsFolder
  .add(parameters, "light1Phi", -360, 360, 1)
  .name("light 1 phi")
  .onChange(() => {
    const updater = getLightUpdater(light1);
    updater(d2r(parameters.light1Theta), d2r(parameters.light1Phi));
  });
lightsFolder
  .add(parameters, "light2Theta", -360, 360, 1)
  .name("light 2 theta")
  .onChange(() => {
    const updater = getLightUpdater(light2);
    updater(d2r(parameters.light2Theta), d2r(parameters.light2Phi));
  });
lightsFolder
  .add(parameters, "light2Phi", -360, 360, 1)
  .name("light 2 phi")
  .onChange(() => {
    const updater = getLightUpdater(light2);
    updater(d2r(parameters.light2Theta), d2r(parameters.light2Phi));
  });
lightsFolder.open();

gui
  .add(cloudSphere.material, "opacity", 0, 1, 0.001)
  .name("cloud sphere opacity");

gui.close();

const updateHTMLElements = (elements) => {
  Object.keys(elements).forEach((elementKey) => {
    const element = elements[elementKey];
    if (currentState === CHINA_STATE) {
      const screenPosition = element.position.clone();
      screenPosition.project(camera);
      raycaster.setFromCamera(screenPosition, camera);
      const intersects = raycaster.intersectObject(globeMesh);
      if (intersects.length === 0) {
        element.element.classList.add("visible");
      } else {
        const intersectionDistance = intersects[0].distance;
        const elementDistance = element.position.distanceTo(camera.position);
        if (intersectionDistance < elementDistance) {
          element.element.classList.remove("visible");
        } else {
          element.element.classList.add("visible");
        }
      }

      const translateX = screenPosition.x * sizes.width * 0.5;
      const translateY = -screenPosition.y * sizes.height * 0.5;
      element.element.style.transform = `translate(calc(${translateX}px - 50%), calc(${translateY}px - 50%))`;
    } else {
      element.element.classList.remove("visible");
    }
  });
};

/**
 * Animate
 */

const clock = new THREE.Clock();
const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  // controls.update();

  if (isGlobeReady) {
    updateHTMLElements(labels);
    updateHTMLElements(explosions);
  }

  cloudSphere.rotation.y = elapsedTime / 100;

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();

// HTML UI

const setEuropeText = (button) => {
  button.children[0].innerText = "Europe";
  button.children[1].innerHTML = "B2B, B2C<br/>hubs";
};

const setUSAText = (button) => {
  button.children[0].innerText = "USA";
  button.children[1].innerHTML = "B2B, B2C<br/>hubs";
};

const setChinaText = (button) => {
  button.children[0].innerText = "China";
  button.children[1].innerHTML = "Airport,<br/>facilities";
};

const updateNavButtons = (state) => {
  const rightButton = document.querySelector(".right-nav-button");
  const leftButton = document.querySelector(".left-nav-button");
  switch (state) {
    case CHINA_STATE: {
      setEuropeText(leftButton);
      setUSAText(leftButton);
      return;
    }
    case USA_STATE: {
      setChinaText(leftButton);
      setEuropeText(rightButton);
      return;
    }
    case EUROPE_STATE: {
      setUSAText(leftButton);
      setChinaText(rightButton);
      return;
    }
  }
};

const addUIHandlers = () => {
  const nextButton = document.querySelector(".next-button");
  const pathButtons = document.querySelector(".path-buttons");
  const rightButton = document.querySelector(".right-nav-button");
  const leftButton = document.querySelector(".left-nav-button");

  const handleNextButtonClick = () => {
    Object.keys(explosions).map((explosionKey) => {
      const explosion = explosions[explosionKey];
      explosion.element.classList.add("active");
      nextButton.style.display = "none";
      pathButtons.style.display = "flex";
    });
  };

  const hideAndRevealNav = (cb) => {
    rightButton.classList.add("hidden");
    leftButton.classList.add("hidden");
    wait(ROTATION_DURATION + 100).then(() => {
      cb();
      rightButton.classList.remove("hidden");
      leftButton.classList.remove("hidden");
    });
  };

  const handleRightButtonClick = () => {
    switch (currentState) {
      case CHINA_STATE: {
        china2USARotator();
        hideAndRevealNav(() => {
          updateNavButtons(USA_STATE);
        });
        currentState = USA_STATE;
        return;
      }
      case USA_STATE: {
        USA2EuropeRotator();
        hideAndRevealNav(() => {
          updateNavButtons(EUROPE_STATE);
        });
        currentState = EUROPE_STATE;
        return;
      }
      case EUROPE_STATE: {
        europe2ChinaRotator();
        hideAndRevealNav(() => {
          updateNavButtons(CHINA_STATE);
          currentState = CHINA_STATE;
        });
        return;
      }
    }
  };

  const handleLeftButtonClick = () => {
    switch (currentState) {
      case CHINA_STATE: {
        china2EuropeRotator();
        hideAndRevealNav(() => {
          updateNavButtons(EUROPE_STATE);
        });
        currentState = EUROPE_STATE;
        return;
      }
      case EUROPE_STATE: {
        europe2USARotator();
        hideAndRevealNav(() => {
          updateNavButtons(USA_STATE);
        });
        currentState = USA_STATE;
        return;
      }
      case USA_STATE: {
        USA2ChinaRotator();
        hideAndRevealNav(() => {
          updateNavButtons(CHINA_STATE);
          currentState = CHINA_STATE;
        });
        return;
      }
    }
  };

  nextButton.addEventListener("click", handleNextButtonClick);
  rightButton.addEventListener("click", handleRightButtonClick);
  leftButton.addEventListener("click", handleLeftButtonClick);
};

addUIHandlers();
