import largeAirports from "./large_airports.json";
import anime from "animejs/lib/anime.es.js";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
import ThreeGlobe from "three-globe";
import globeImage from "./assets/earth-blue-marble.jpeg";
import bumpImage from "./assets/earth-topology.png";

const CANONIC_WIDTH = 1440;

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
};
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

// Airports
const airports = largeAirports.map((a) => {
  const [lng, lat] = a.coordinates.split(", ");
  return {
    lat: Number.parseFloat(lat),
    lng: Number.parseFloat(lng),
  };
});

// Canvas
const canvas = document.querySelector("#canvas");

// Scene
const scene = new THREE.Scene();

// Test Globe
const globe = new ThreeGlobe()
  .globeImageUrl(globeImage)
  .bumpImageUrl(bumpImage)
  .pointsData(airports)
  .pointsMerge(true)
  .pointAltitude(() => parameters.pointAltitude)
  .pointColor(() => parameters.pointColor)
  .pointRadius(() => parameters.pointRadius);
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

// Base camera
const camera = new THREE.PerspectiveCamera(
  40,
  sizes.width / sizes.height,
  0.1,
  500
);
camera.position.set(0, 0, 350);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enableZoom = false;

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

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
