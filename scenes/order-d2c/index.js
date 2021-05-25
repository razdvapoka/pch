import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// import { TransformControls } from "three/examples/jsm/controls/TransformControls.js";
import anime from "animejs/lib/anime.es.js";
// import { wait } from "../../utils";
// import * as dat from "dat.gui";
import { SKIP } from "../../consts";

const WHITE = "#ebebeb";
const PURPLE = "#5964fa";
const BASE = "#686868";
const EMISSIVE = "#a1a1a1";
const COLOR_TRANSITION_DURATION = 700;
const FOV = 60;

let camera;
let scene;
let model;
let parts = {};
let screenInit;
let screenFinal;
let screenInitMaterial;
let screenFinalMaterial;
let laptopMaterial;

// let transformControls;

export const launchOrderD2CScene = () =>
  SKIP
    ? Promise.resolve()
    : new Promise((resolve) => {
        const timeline = anime.timeline({
          autoplay: false,
          easing: "easeInOutSine",
          begin: () => {
            screenFinal.visible = true;
            screenInit.visible = false;
          },
          complete: resolve,
        });
        timeline.add({
          duration: COLOR_TRANSITION_DURATION,
          targets: laptopMaterial,
          emissiveIntensity: 0.5,
          __color: PURPLE,
          __emissive: PURPLE,
          update: () => {
            laptopMaterial.color.set(laptopMaterial.__color);
            laptopMaterial.emissive.set(laptopMaterial.__emissive);
          },
        });
        timeline.play();
      });

export const initOrderD2CSceneObject = ({ orderD2CModel, sizes, canvas }) => {
  model = orderD2CModel.clone();
  scene = new THREE.Scene();
  scene.background = new THREE.Color(WHITE);
  const ambientLight = new THREE.AmbientLight(WHITE, 0.42);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(WHITE, 0.4);
  directionalLight.position.set(100, 70, 50);
  // const helper = new THREE.DirectionalLightHelper(directionalLight, 10, "red");
  // scene.add(helper);
  scene.add(ambientLight);
  scene.add(directionalLight);
  scene.add(model);
  parts = {};
  model.traverse((obj) => {
    parts[obj.name] = obj;
    if (obj.type === "Mesh") {
      obj.material.emissiveIntensity = 1.125;
      obj.material.color = new THREE.Color(BASE);
      obj.material.emissive = new THREE.Color(EMISSIVE);
    }
  });

  laptopMaterial = parts["base"].material.clone();
  laptopMaterial.color = laptopMaterial.color.clone();
  laptopMaterial.__color = BASE;
  laptopMaterial.__emissive = EMISSIVE;
  parts["base"].material = laptopMaterial;
  parts["screen"].material = laptopMaterial;
  parts["buttons"].material = laptopMaterial;

  screenInit = parts["screen-init"];
  screenFinal = parts["screen-final"];
  screenFinal.visible = false;
  screenInitMaterial = screenInit.material;
  screenInitMaterial.color = new THREE.Color(WHITE);
  screenInitMaterial.emissive = new THREE.Color(WHITE);
  screenInitMaterial.emissiveIntensity = 0.45;
  screenInitMaterial.metalness = 0;
  screenInitMaterial.roughness = 1;
  screenFinalMaterial = screenFinal.material;
  screenFinalMaterial.color = new THREE.Color(WHITE);
  screenFinalMaterial.emissive = new THREE.Color(WHITE);
  screenFinalMaterial.emissiveIntensity = 0.45;
  screenFinalMaterial.metalness = 0;
  screenFinalMaterial.roughness = 1;

  // const axesHelper = new THREE.AxesHelper(1000);
  // scene.add(axesHelper);

  const aspect = sizes.width / sizes.height;
  camera = new THREE.PerspectiveCamera(FOV / aspect, aspect, 0.1, 2500);
  camera.position.copy({
    x: -0.6639131743538825,
    y: 51.77881705665486,
    z: 86.61668236918044,
  });
  const cameraTarget = new THREE.Vector3(0, 10, 0);
  const controls = new OrbitControls(camera, canvas);
  controls.target = cameraTarget;
  camera.lookAt(cameraTarget);
  controls.update();

  // transformControls = new TransformControls(camera, canvas);
  // transformControls.attach(parts["glass"]);
  // transformControls.addEventListener("dragging-changed", function (event) {
  //   controls.enabled = !event.value;
  // });
  // console.log(parts["glass"].position);
  // transformControls.addEventListener("change", () => {
  //   console.log(transformControls.object.position);
  // });
  // scene.add(transformControls);
  //

  const onResize = (sizes) => {
    const aspect = sizes.width / sizes.height;
    camera.aspect = aspect;
    camera.fov = FOV / aspect;
    camera.updateProjectionMatrix();

    controls.update();
  };

  // const gui = new dat.GUI();
  // gui.add(directionalLight.position, "x", -100, 100, 1).onChange(() => {
  //   helper.update();
  // });
  // gui.add(directionalLight.position, "y", -100, 100, 1).onChange(() => {
  //   helper.update();
  // });
  // gui.add(directionalLight.position, "z", -100, 100, 1).onChange(() => {
  //   helper.update();
  // });

  // window.addEventListener("click", () => {
  //   console.log(camera.position);
  // });

  return { scene, camera, onResize };
};
