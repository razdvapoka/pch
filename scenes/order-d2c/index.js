import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// import { TransformControls } from "three/examples/jsm/controls/TransformControls.js";
import anime from "animejs/lib/anime.es.js";
// import { wait } from "../../utils";
// import * as dat from "dat.gui";
import { SKIP } from "../../consts";

const WHITE = "#b7b7b7";
const PURPLE = "#5964fa";
const COLOR_TRANSITION_DURATION = 700;

const whiteColor = new THREE.Color(WHITE);

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
          emissiveIntensity: 0.2,
          __color: PURPLE,
          update: () => {
            laptopMaterial.color.set(laptopMaterial.__color);
          },
        });
        timeline.play();
      });

export const initOrderD2CSceneObject = ({ orderD2CModel, sizes, canvas }) => {
  model = orderD2CModel.clone();
  scene = new THREE.Scene();
  scene.background = new THREE.Color("#ffffff");
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.42);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
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
      obj.material.emissiveIntensity = 0.3;
      obj.material.color = whiteColor;
      obj.material.emissive = whiteColor;
    }
  });

  laptopMaterial = parts["base"].material.clone();
  laptopMaterial.color = laptopMaterial.color.clone();
  laptopMaterial.__color = WHITE;
  parts["base"].material = laptopMaterial;
  parts["screen"].material = laptopMaterial;
  parts["buttons"].material = laptopMaterial;

  screenInit = parts["screen-init"];
  screenFinal = parts["screen-final"];
  screenFinal.visible = false;
  screenInitMaterial = screenInit.material;
  screenInitMaterial.color = new THREE.Color("white");
  screenInitMaterial.metalness = 0;
  screenInitMaterial.roughness = 1;
  screenFinalMaterial = screenFinal.material;
  screenFinalMaterial.color = new THREE.Color("white");
  screenFinalMaterial.metalness = 0;
  screenFinalMaterial.roughness = 1;

  // const axesHelper = new THREE.AxesHelper(1000);
  // scene.add(axesHelper);

  camera = new THREE.PerspectiveCamera(
    40,
    sizes.width / sizes.height,
    0.1,
    2500
  );
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
    camera.aspect = sizes.width / sizes.height;
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
