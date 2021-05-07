import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
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

export const launchPostponementScene = () => {
  return new Promise((resolve) => {
    const phone = parts["phone"];
    const boxTop = parts["box_top"];
    const boxHolder = parts["box_holder"];
    const timeline = anime
      .timeline({
        autoplay: false,
        easing: "easeOutExpo",
        duration: 400,
        complete: resolve,
      })
      .add({
        targets: boxHolder.position,
        y: -9.6,
      })
      .add({
        targets: phone.position,
        y: -8.5,
      })
      .add({
        targets: boxTop.position,
        y: -28.6,
      });
    timeline.play();
  });
};

export const initPostponementSceneObject = ({
  postponementModel,
  sizes,
  canvas,
}) => {
  model = postponementModel;
  scene = new THREE.Scene();
  scene.translateY(-20);
  scene.background = new THREE.Color("#ffffff");
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.42);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(-100, 79, -61);
  directionalLight.translateY(20);
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
    }
  });
  purpleMaterial = parts["box3"].material.clone();
  purpleMaterial.color = purpleColor;
  purpleMaterial.emissive = purpleColor;
  purpleMaterial.__color = WHITE;
  parts["box3"].material = purpleMaterial;
  Object.values(parts).map((part) => {
    if (part.type === "Mesh" && part.material.name === "Plain Violet") {
      part.material = purpleMaterial;
    }
  });

  // const axesHelper = new THREE.AxesHelper(1000);
  // scene.add(axesHelper);

  // camera = new THREE.PerspectiveCamera(
  //   40,
  //   sizes.width / sizes.height,
  //   0.1,
  //   2500
  // );
  camera = new THREE.OrthographicCamera(
    sizes.width / -2,
    sizes.width / 2,
    sizes.height / 2,
    sizes.height / -2,
    1,
    1000
  );
  camera.position.copy({
    x: -95.14147177159829,
    y: 115.95072054418478,
    z: -95.79763594924385,
  });
  camera.zoom = 13;
  camera.updateProjectionMatrix();
  const cameraTarget = new THREE.Vector3(0, 0, 0);
  // const controls = new OrbitControls(camera, canvas);
  // controls.target = cameraTarget;
  camera.lookAt(cameraTarget);
  // controls.update();
  // controls.addEventListener("change", () => {
  //   console.log(camera);
  // });

  parts["boxes"].position.z = 50; //-46.20795933635105 //
  parts["phone"].position.x = -150; // 15.82770824432373 // y -8.5
  parts["box_top"].position.x = -167; // 0 // y -28.6
  parts["box_holder"].position.x = -167; // 0 // y -9.6

  // transformControls = new TransformControls(camera, canvas);
  // transformControls.attach(parts["phone"]);
  // transformControls.addEventListener("dragging-changed", function (event) {
  //   controls.enabled = !event.value;
  // });
  // transformControls.addEventListener("change", () => { console.log(transformControls.object.position);
  // });
  // scene.add(transformControls);

  const timeline = anime
    .timeline({
      autoplay: false,
    })
    .add({
      targets: parts["boxes"].position,
      z: -46.2,
      duration: 1000,
      delay: 500,
      easing: "easeOutExpo",
    })
    .add(
      {
        duration: COLOR_TRANSITION_DURATION,
        delay: 500,
        targets: purpleMaterial,
        emissiveIntensity: 0.2,
        easing: "easeOutExpo",
        __color: PURPLE,
        update: () => {
          purpleMaterial.color.set(purpleMaterial.__color);
        },
      },
      0
    )
    .add({
      targets: parts["box_holder"].position,
      x: 0,
      easing: "easeOutExpo",
      duration: 600,
    })
    .add(
      {
        targets: parts["phone"].position,
        x: 15.82770824432373,
        easing: "easeOutExpo",
        duration: 600,
      },
      "-=400"
    )
    .add(
      {
        targets: parts["box_top"].position,
        x: 0,
        easing: "easeOutExpo",
        duration: 600,
      },
      "-=400"
    );
  timeline.play();

  const onResize = (sizes) => {
    camera.aspect = sizes.width / sizes.height;
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

  // window.addEventListener("click", () => {
  //   console.log(camera.position);
  // });

  // console.log(parts);

  return { scene, camera, onResize };
};
