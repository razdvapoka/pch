import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// import { TransformControls } from "three/examples/jsm/controls/TransformControls.js";
import anime from "animejs/lib/anime.es.js";
// import { wait } from "../../utils";
// import * as dat from "dat.gui";
import { SKIP, PURPLE, WHITE, BASE, EMISSIVE } from "../../consts";

let camera;
let scene;
let model;
let purpleMaterial;
let vynilMaterial;
let parts = {};
// let transformControls;

export const launchManufacturingScene = () =>
  SKIP
    ? Promise.resolve()
    : new Promise((resolve) => {
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
            duration: 600,
            targets: phone.position,
            easing: "linear",
            x: -80,
          })
          .add(
            {
              duration: 600,
              targets: vynilMaterial.normalMap.offset,
              easing: "linear",
              x: -80,
            },
            "-=600"
          );
        timeline.play();
      });

export const initManufacturingSceneObject = ({ manufacturingModel, sizes }) => {
  model = manufacturingModel.clone();
  scene = new THREE.Scene();
  scene.background = new THREE.Color(WHITE);
  const ambientLight = new THREE.AmbientLight(WHITE, 0.4);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(WHITE, 0.4);
  directionalLight.position.set(-120, 90, 90);
  // const helper = new THREE.DirectionalLightHelper(directionalLight, 10, "red");
  // scene.add(helper);
  scene.add(ambientLight);
  scene.add(directionalLight);
  scene.add(model);
  parts = {};
  model.traverse((obj) => {
    parts[obj.name] = obj;
    if (obj.type === "Mesh") {
      obj.material.color = new THREE.Color(BASE);
      obj.material.emissive = new THREE.Color(EMISSIVE);
      obj.material.emissiveIntensity = 1.125;
      if (obj.material.name === "Plain Violet") {
        if (!purpleMaterial) {
          purpleMaterial = obj.material.clone();
          purpleMaterial.color = new THREE.Color(PURPLE);
          purpleMaterial.emissive = new THREE.Color(PURPLE);
          purpleMaterial.emissiveIntensity = 0.8;
        }
        obj.material = purpleMaterial;
      }
    }
  });

  const vynil = parts["vynil"];
  vynil.material.normalMap.wrapS = THREE.RepeatWrapping;
  vynil.material.normalMap.wrapT = THREE.RepeatWrapping;
  vynil.material.normalMap.repeat = new THREE.Vector2(2, 10);
  vynilMaterial = vynil.material;

  // const axesHelper = new THREE.AxesHelper(1000);
  // scene.add(axesHelper);

  camera = new THREE.OrthographicCamera(
    sizes.width / -2,
    sizes.width / 2,
    sizes.height / 2,
    sizes.height / -2,
    1,
    1000
  );
  camera.position.set(52.6, 60, 50.2);
  camera.zoom = 15;
  camera.updateProjectionMatrix();
  const cameraTarget = new THREE.Vector3(-5, 7, 0);
  // const controls = new OrbitControls(camera, canvas);
  // controls.target = cameraTarget;
  camera.lookAt(cameraTarget);
  // controls.update();
  // controls.addEventListener("change", () => {
  //   console.log(camera);
  // });

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
    camera.left = sizes.width / -2;
    camera.right = sizes.width / 2;
    camera.top = sizes.height / 2;
    camera.bottom = sizes.height / -2;
    camera.updateProjectionMatrix();

    // controls.update();
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
