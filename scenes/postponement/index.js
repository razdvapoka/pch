import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// import { TransformControls } from "three/examples/jsm/controls/TransformControls.js";
import anime from "animejs/lib/anime.es.js";
// import { wait } from "../../utils";
// import * as dat from "dat.gui";
import { SKIP, BASE, EMISSIVE, WHITE, PURPLE } from "../../consts";
import { postponementButton } from "../../ui";

const COLOR_TRANSITION_DURATION = 700;

let camera;
let scene;
let model;
let purpleMaterial;
let vynilMaterial;
let parts = {};
// let transformControls;

export const launchPostponementScene = () =>
  SKIP
    ? Promise.resolve()
    : new Promise((resolve) => {
        const phone = parts["phone"];
        const boxTop = parts["box_top"];
        const boxHolder = parts["box_holder"];
        postponementButton.disabled = true;
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
          })
          .add({
            targets: [
              parts["boxes"].position,
              boxHolder.position,
              phone.position,
              boxTop.position,
            ],
            z: "-=130",
            duration: 1500,
            easing: "linear",
          })
          .add(
            {
              targets: vynilMaterial.normalMap.offset,
              y: -150,
              duration: 1500,
              easing: "linear",
            },
            "-=1500"
          );
        timeline.play();
      });

export const initPostponementSceneObject = ({ postponementModel, sizes }) => {
  model = postponementModel.clone();
  scene = new THREE.Scene();
  scene.translateY(-20);
  scene.background = new THREE.Color(WHITE);
  const ambientLight = new THREE.AmbientLight(WHITE, 0.42);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(WHITE, 0.4);
  directionalLight.position.set(-180, 120, 180);
  directionalLight.translateY(20);
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
  purpleMaterial = parts["box3"].material.clone();
  purpleMaterial.__color = BASE;
  purpleMaterial.__emissive = EMISSIVE;
  parts["box3"].material = purpleMaterial;
  Object.values(parts).map((part) => {
    if (part.type === "Mesh" && part.material.name === "Plain Violet") {
      part.material = purpleMaterial;
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
  camera.position.copy({
    x: -108,
    y: 95,
    z: -101,
  });
  camera.zoom = 8;
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
      complete: () => {
        postponementButton.disabled = false;
      },
    })
    .add({
      targets: parts["boxes"].position,
      z: -46.2,
      duration: 1200,
      delay: 500,
      easing: "linear",
    })
    .add(
      {
        targets: vynilMaterial.normalMap.offset,
        y: -46.2,
        duration: 1200,
        easing: "linear",
      },
      "-=1200"
    )
    .add(
      {
        duration: COLOR_TRANSITION_DURATION,
        delay: 500,
        targets: purpleMaterial,
        easing: "easeOutExpo",
        emissiveIntensity: 0.8,
        __color: PURPLE,
        __emissive: PURPLE,
        update: () => {
          purpleMaterial.color.set(purpleMaterial.__color);
          purpleMaterial.emissive.set(purpleMaterial.__emissive);
        },
      },
      0
    )
    .add({
      targets: parts["box_holder"].position,
      x: 0,
      easing: "easeOutExpo",
      duration: 900,
    })
    .add(
      {
        targets: parts["phone"].position,
        x: 15.82770824432373,
        easing: "easeOutExpo",
        duration: 900,
      },
      "-=600"
    )
    .add(
      {
        targets: parts["box_top"].position,
        x: 0,
        easing: "easeOutExpo",
        duration: 900,
      },
      "-=600"
    );
  timeline.play();

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

  // window.addEventListener("click", () => {
  //   console.log(camera.position);
  // });

  // console.log(parts);

  return { scene, camera, onResize };
};
