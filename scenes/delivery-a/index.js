import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// import { TransformControls } from "three/examples/jsm/controls/TransformControls.js";
import anime from "animejs/lib/anime.es.js";
// import { wait } from "../../utils";
// import * as dat from "dat.gui";

const WHITE = "#b7b7b7";
const PURPLE = "#5964fa";
const COLOR_TRANSITION_DURATION = 700;

const whiteColor = new THREE.Color(WHITE);
const purpleColor = new THREE.Color(WHITE);

let camera;
let scene;
let model;
let purpleMaterial;
let parts = {};
// let transformControls;

export const launchDeliveryAScene = () =>
  new Promise((resolve) => {
    resolve();
  });

export const initDeliveryASceneObject = ({ deliveryAModel, sizes, canvas }) => {
  model = deliveryAModel;
  model.scale.set(0.05, 0.05, 0.05);
  scene = new THREE.Scene();
  scene.background = new THREE.Color("#ffffff");
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.42);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(100, 75, 45);
  // const helper = new THREE.DirectionalLightHelper(directionalLight, 10, "red");
  // scene.add(helper);
  scene.add(ambientLight);
  scene.add(directionalLight);
  scene.add(model);
  model.traverse((obj) => {
    parts[obj.name] = obj;
    if (obj.type === "Mesh") {
      obj.material.emissiveIntensity = 0.3;
      obj.material.color = whiteColor;
      obj.material.emissive = whiteColor;
      // if (obj.material.name === "Plain Violet") {
      //   obj.material.color = purpleColor;
      //   obj.material.emissive = purpleColor;
      //   if (!purpleMaterial) {
      //     purpleMaterial = obj.material;
      //     purpleMaterial.__color = WHITE;
      //   }
      // } else {
      //   obj.material.color = whiteColor;
      //   obj.material.emissive = whiteColor;
      // }
    }
  });

  // const axesHelper = new THREE.AxesHelper(1000);
  // scene.add(axesHelper);

  camera = new THREE.PerspectiveCamera(
    40,
    sizes.width / sizes.height,
    0.1,
    2500
  );
  camera.position.copy({
    x: 0.0014579586008573895,
    y: 1457.894736841371,
    z: -0.0000016541668697174197,
  });
  const cameraTarget = new THREE.Vector3(0, 0, 0);
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

  return { scene, camera, onResize };
};
