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

export const launchManufacturingScene = () => {
  return new Promise((resolve) => {
    const innerBase = parts["inner_base"];
    const chips = parts["chips"];
    const cam = parts["cam"];
    const glass = parts["glass"];
    const phone = parts["phone"];

    const offset = "-=200";
    const timeline = anime.timeline({
      autoplay: false,
      easing: "easeInOutSine",
      complete: resolve,
    });
    timeline
      .add({
        duration: COLOR_TRANSITION_DURATION,
        targets: purpleMaterial,
        emissiveIntensity: 0.2,
        easing: "easeInOutSine",
        __color: PURPLE,
        update: () => {
          purpleMaterial.color.set(purpleMaterial.__color);
        },
      })
      .add(
        {
          duration: 600,
          targets: innerBase.position,
          z: -0.025,
        },
        offset
      )
      .add(
        {
          duration: 500,
          targets: chips.position,
          z: 0.01,
        },
        offset
      )
      .add(
        {
          duration: 400,
          targets: cam.position,
          z: 0.009,
        },
        offset
      )
      .add(
        {
          duration: 300,
          targets: glass.position,
          z: -0.0874,
        },
        offset
      )
      .add({
        duration: 1000,
        targets: phone.position,
        easing: "linear",
        x: -100,
      });
    timeline.play();
  });
};

export const initManufacturingSceneObject = ({
  manufacturingModel,
  sizes,
  canvas,
}) => {
  model = manufacturingModel;
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
      if (obj.material.name === "Plain Violet") {
        obj.material.color = purpleColor;
        obj.material.emissive = purpleColor;
        if (!purpleMaterial) {
          purpleMaterial = obj.material;
          purpleMaterial.__color = WHITE;
        }
      } else {
        obj.material.color = whiteColor;
        obj.material.emissive = whiteColor;
      }
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
  camera.position.set(57.6, 58.4, 50.2);
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