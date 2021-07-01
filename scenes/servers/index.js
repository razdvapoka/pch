import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import anime from "animejs/lib/anime.es.js";
import { wait } from "../../utils";
// import { SKIP } from "../../consts";

const WHITE = "#ebebeb";
const PURPLE = "#5964fa";
const BASE = "#686868";
const EMISSIVE = "#a1a1a1";
const COLOR_TRANSITION_DURATION = 700;
const BLINK_DURATION = 600;
const FOV = 60;

let camera;
let scene;
let model;
let purpleServerMaterial;
let bulb;

export const launchServerScene = () => {
  anime({
    duration: COLOR_TRANSITION_DURATION,
    targets: purpleServerMaterial,
    emissiveIntensity: 1.125,
    easing: "easeInOutSine",
    __color: PURPLE,
    __emissive: PURPLE,
    update: () => {
      purpleServerMaterial.color.set(purpleServerMaterial.__color);
      purpleServerMaterial.emissive.set(purpleServerMaterial.__emissive);
    },
  });
  anime({
    duration: BLINK_DURATION,
    targets: bulb,
    intensity: 5,
    direction: "alternate",
    loop: true,
    easing: "easeInOutSine",
  });
  return wait(BLINK_DURATION * 4);
};

export const initServersSceneObject = ({ serversModel, sizes }) => {
  model = serversModel.clone();
  scene = new THREE.Scene();
  scene.background = new THREE.Color(WHITE);
  const ambientLight = new THREE.AmbientLight(WHITE, 0.3);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(WHITE, 0.5);
  directionalLight.position.set(0, 90, 30);
  scene.add(ambientLight);
  scene.add(directionalLight);
  scene.add(serversModel);
  model.traverse((obj) => {
    if (obj.type === "Mesh") {
      obj.material.color = new THREE.Color(BASE);
      obj.material.emissive = new THREE.Color(EMISSIVE);
      obj.material.emissiveIntensity = 1.1;
      if (obj.material.name === "Plain Violet") {
        purpleServerMaterial = obj.material;
        obj.material.__color = BASE;
        obj.material.__emissive = EMISSIVE;
        obj.material.emissiveIntensity = 1.125;
      }
    }
  });

  bulb = new THREE.PointLight(WHITE, 0, 10);
  bulb.position.set(7.7, 77.6, 12);
  const bulbSphere = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.5, 32, 32),
    new THREE.MeshBasicMaterial({ color: WHITE })
  );
  bulbSphere.position.set(7.7, 77.6, 9);
  scene.add(bulb);
  scene.add(bulbSphere);

  const aspect = sizes.width / sizes.height;
  camera = new THREE.PerspectiveCamera(FOV / aspect, aspect, 0.1, 2500);
  camera.position.set(0, 50, 250);
  const cameraTarget = new THREE.Vector3(0, 50, 0);
  // const controls = new OrbitControls(camera, canvas);
  // controls.target = cameraTarget;
  camera.lookAt(cameraTarget);
  // controls.update();

  const onResize = (sizes) => {
    const aspect = sizes.width / sizes.height;
    camera.aspect = aspect;
    camera.fov = FOV / aspect;
    camera.updateProjectionMatrix();

    // controls.update();
  };

  return { scene, camera, onResize };
};
