import largeAirports from "./large_airports.json";
import anime from "animejs/lib/anime.es.js";
import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
import ThreeGlobe from "three-globe";
import globeImage from "./assets/images/wrld-13-bw-gray.png";
// import bumpImage from "./assets/images/earth-topology.png";
import lightMapTexture from "./assets/images/tex-lights-bw.png";

const textureLoader = new THREE.TextureLoader();
const lightMap = textureLoader.load(lightMapTexture);

const CANONIC_WIDTH = 1440;

const OVERIVIEW_CAMERA_PROPS = {
  positionX: -177,
  positionY: 208,
  positionZ: 448,
  rotationX: THREE.MathUtils.degToRad(-25.411),
  rotationY: THREE.MathUtils.degToRad(-25.204),
};

const CHINA_CAMERA_PROPS = {
  positionX: 115,
  positionY: 139,
  positionZ: 267,
  rotationX: THREE.MathUtils.degToRad(-23.115),
  rotationY: THREE.MathUtils.degToRad(25.265),
};

const getCameraProps = (c) => ({
  positionX: c.position.x,
  positionY: c.position.y,
  positionZ: c.position.z,
  rotationX: c.rotation.x,
  rotationY: c.rotation.y,
});

const getCameraPropsUpdater = (cam, props) => () => {
  cam.position.set(props.positionX, props.positionY, props.positionZ);
  cam.rotation.x = props.rotationX;
  cam.rotation.y = props.rotationY;
};

// GUI
const parameters = {
  pointColor: "#ff00ff",
  pointAltitude: 0.01,
  pointRadius: 0.25,
  rotateClockwise: () => {
    anime({
      duration: 1000,
      targets: globe.rotation,
      y: globe.rotation.y - Math.PI * 0.5,
      easing: "easeInOutCubic",
    });
  },
  rotateCounterClockwise: () => {
    anime({
      duration: 1000,
      targets: globe.rotation,
      y: globe.rotation.y + Math.PI * 0.5,
      easing: "easeInOutCubic",
    });
  },
  overview: () => {
    const cameraProps = getCameraProps(camera);
    anime({
      duration: 1000,
      targets: cameraProps,
      easing: "easeInOutCubic",
      ...OVERIVIEW_CAMERA_PROPS,
      update: getCameraPropsUpdater(camera, cameraProps),
    });
  },
  china: () => {
    const cameraProps = getCameraProps(camera);
    anime({
      duration: 1000,
      targets: cameraProps,
      easing: "easeInOutCubic",
      ...CHINA_CAMERA_PROPS,
      update: getCameraPropsUpdater(camera, cameraProps),
    });
  },
};

// Airports
// const airports = largeAirports.map((a) => {
//   const [lng, lat] = a.coordinates.split(", ");
//   return {
//     lat: Number.parseFloat(lat),
//     lng: Number.parseFloat(lng),
//   };
// });

// Canvas
const canvas = document.querySelector("#canvas");

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color("#000000");

// Test Globe
const globe = new ThreeGlobe({ animateIn: false, atmosphereColor: "white" })
  .globeImageUrl(globeImage)
  .atmosphereColor("white")
  .atmosphereAltitude(0.2)
  // .pointsData(airports)
  // .pointsMerge(true)
  .pointAltitude(() => parameters.pointAltitude)
  .pointColor(() => parameters.pointColor)
  .pointRadius(() => parameters.pointRadius);

globe.rotation.y = -Math.PI * 0.5;

// Globe mesh
const globeMesh = globe.children[0].children[0].children[0];
const uv = globeMesh.geometry.getAttribute("uv").array;
globeMesh.geometry.setAttribute("uv2", new THREE.BufferAttribute(uv, 2));

// Globe material
const material = globe.globeMaterial();
material.color = new THREE.Color("#2750CC");
material.lightMap = lightMap;
material.lightMapIntensity = 15;
// material.needsUpdate = true;

scene.add(globe);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scale = sizes.width / CANONIC_WIDTH;
  globe.scale.set(scale, scale, scale);
});

/**
 * Camera
 */

const camera = new THREE.PerspectiveCamera(
  40,
  sizes.width / sizes.height,
  0.1,
  2500
);
camera.position.set(-177, 208, 448);
camera.rotation.x = THREE.MathUtils.degToRad(-25.411);
camera.rotation.y = THREE.MathUtils.degToRad(-25.204);
scene.add(camera);

// Controls
// const controls = new OrbitControls(activeCamera, canvas);
// controls.enableDamping = true;
// controls.enableZoom = false;
// controls.enabled = false;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0xcecece);

// GUI

const gui = new dat.GUI({
  width: 300,
});
gui.addColor(parameters, "pointColor").onChange(() => {
  globe.pointColor(() => parameters.pointColor);
});
gui.add(parameters, "pointAltitude", 0, 0.03, 0.0001).onFinishChange(() => {
  globe.pointAltitude(() => parameters.pointAltitude);
});
gui.add(parameters, "pointRadius", 0, 1, 0.01).onFinishChange(() => {
  globe.pointRadius(() => parameters.pointRadius);
});
gui.add(parameters, "rotateClockwise");
gui.add(parameters, "rotateCounterClockwise");
gui.add(parameters, "overview");
gui.add(parameters, "china");
//gui.close();

const cameraFolder = gui.addFolder("camera");
cameraFolder.add(camera.position, "x", -500, 500, 1).listen();
cameraFolder.add(camera.position, "y", -500, 500, 1).listen();
cameraFolder.add(camera.position, "z", -500, 500, 1).listen();
cameraFolder
  .add(camera.rotation, "x", -Math.PI / 2, Math.PI / 2, 0.001)
  .listen();
cameraFolder
  .add(camera.rotation, "y", -Math.PI / 2, Math.PI / 2, 0.001)
  .listen();
cameraFolder
  .add(camera.rotation, "z", -Math.PI / 2, Math.PI / 2, 0.001)
  .listen();
cameraFolder.open();

/**
 * Animate
 */
//const clock = new THREE.Clock();

const tick = () => {
  //const elapsedTime = clock.getElapsedTime();

  // Update controls
  // controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
