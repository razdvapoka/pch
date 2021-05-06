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

// const mouse = new THREE.Vector2();
// const raycaster = new THREE.Raycaster();

// const onMouseMove = (event) => {
//   mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//   mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
// };

// const onClick = () => {
//   console.log(camera);
//   raycaster.setFromCamera(mouse, camera);
//   const intersects = raycaster
//     .intersectObjects(scene.children, true)
//     .filter((o) => o.object.type === "Mesh");
//   if (intersects.length > 0) {
//     const c = intersects[0];
//     console.log(c);
//   }
// };

let camera;
let cameraTarget;
let controls;
let scene;
let model;
let parts = {};
let transformControls;
let usa;
let eu;
let boxA;
let boxB;
let boxAGroup = new THREE.Group();
let boxBGroup = new THREE.Group();
let boxesMaterial;
let paletteA;
let paletteAMaterial;
let cube133;
let cube131;
let leftDoor;
let rightDoor;
let truck;
let paletteAGroup = new THREE.Group();
let containerA;
let containerAMaterial;
let containerAGroup = new THREE.Group();
let truckMaterial;

export const launchFulfillmentScene = () =>
  new Promise((resolve) => {
    const timeline = anime.timeline({
      autoplay: false,
      easing: "easeInOutSine",
      complete: resolve,
    });
    timeline
      .add({
        targets: [usa.position, eu.position],
        z: (_, i) => (i === 0 ? 2.5 : 1.6),
        duration: 300,
        complete: () => {
          boxBGroup.add(boxB, usa);
          boxAGroup.add(boxA, eu);
          scene.add(boxAGroup);
          scene.add(boxBGroup);
        },
      })
      .add({
        duration: COLOR_TRANSITION_DURATION,
        targets: boxesMaterial,
        emissiveIntensity: 0.2,
        easing: "easeInOutSine",
        __color: PURPLE,
        update: () => {
          boxesMaterial.color.set(boxesMaterial.__color);
        },
      })
      .add({
        targets: [
          camera.position,
          boxAGroup.position,
          boxBGroup.position,
          controls.target,
        ],
        z: "+=1402",
        duration: 600,
        complete: () => {
          controls.update();
        },
      })
      .add({
        targets: [cube133.position, cube131.position],
        x: (_, i) => (i === 0 ? -13.164300453074018 : -15.355573540012779),
        easing: "easeInOutSine",
        duration: 300,
      })
      .add({
        duration: COLOR_TRANSITION_DURATION,
        targets: paletteAMaterial,
        emissiveIntensity: 0.2,
        easing: "easeInOutSine",
        __color: PURPLE,
        update: () => {
          paletteAMaterial.color.set(paletteAMaterial.__color);
        },
        complete: () => {
          paletteAGroup.add(paletteA, boxBGroup);
          scene.add(paletteAGroup);
        },
      })
      .add({
        targets: [paletteAGroup.position, camera.position, controls.target],
        easing: "easeInOutSine",
        z: "+=273",
        duration: 500,
      })
      .add({
        targets: [paletteAGroup.position, camera.position, controls.target],
        easing: "easeInOutSine",
        x: "+=95.7",
        z: "+=352",
        duration: 500,
      })
      .add({
        targets: [paletteAGroup.position, camera.position, controls.target],
        easing: "easeInOutSine",
        z: "+=1835",
        x: "+=14",
        duration: 1500,
      })
      .add({
        duration: COLOR_TRANSITION_DURATION,
        targets: containerAMaterial,
        emissiveIntensity: 0.2,
        easing: "easeInOutSine",
        __color: PURPLE,
        update: () => {
          containerAMaterial.color.set(containerAMaterial.__color);
        },
      })
      .add({
        targets: containerA.position,
        easing: "easeInOutSine",
        y: "-=202",
        duration: 500,
        complete: () => {
          containerAGroup.add(containerA, paletteAGroup);
          scene.add(containerAGroup);
        },
      })
      .add({
        targets: [containerAGroup.position, camera.position, controls.target],
        easing: "easeInOutSine",
        z: "+=496",
        duration: 500,
        complete: () => {},
      })
      .add({
        targets: camera.position,
        easing: "easeInOutSine",
        duration: 500,
        x: 422,
        y: 253,
        z: 3818,
        update: () => {
          camera.lookAt(cameraTarget);
        },
      })
      .add({
        duration: COLOR_TRANSITION_DURATION,
        targets: truckMaterial,
        emissiveIntensity: 0.2,
        easing: "easeInOutSine",
        __color: PURPLE,
        update: () => {
          truckMaterial.color.set(truckMaterial.__color);
        },
      })
      .add({
        targets: [leftDoor.rotation, rightDoor.rotation],
        easing: "easeInOutSine",
        duration: 500,
        z: (_, i) => `+=${i === 0 ? -Math.PI / 2 : Math.PI / 2}`,
      })
      .add({
        targets: [containerAGroup.position],
        easing: "easeInOutSine",
        duration: 500,
        y: "+=202",
        z: "+=300",
      })
      .add({
        targets: [containerAGroup.position],
        easing: "easeInOutSine",
        duration: 500,
        z: "+=500",
      })
      .add({
        targets: [leftDoor.rotation, rightDoor.rotation],
        easing: "easeInOutSine",
        duration: 500,
        z: (_, i) => `-=${i === 0 ? -Math.PI / 2 : Math.PI / 2}`,
        complete: () => {
          truck.add(containerAGroup);
        },
      })
      .add({
        targets: truck.position,
        easing: "easeOutSine",
        duration: 1000,
        z: "+=2500",
      });
    timeline.play();
  });

export const initFulfillmentSceneObject = ({
  fulfillmentModel,
  sizes,
  canvas,
}) => {
  model = fulfillmentModel;
  scene = new THREE.Scene();
  scene.background = new THREE.Color("#ffffff");
  scene.fog = new THREE.Fog("white", 1900, 2500);
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
    x: 257,
    y: 306,
    z: 494,
  });
  cameraTarget = new THREE.Vector3(0, 120, 0);
  controls = new OrbitControls(camera, canvas);
  controls.target = cameraTarget;
  camera.lookAt(cameraTarget);
  controls.update();

  usa = parts["usa"];
  eu = parts["eu"];
  boxA = parts["main_box_a"];
  boxB = parts["main_box_b"];
  paletteA = parts["pallete_activation_a"];
  cube133 = parts["Cube133_1"];
  cube131 = parts["Cube131_1"];
  containerA = parts["container_a"];
  leftDoor = parts["left_door_3"];
  rightDoor = parts["right_door_3"];
  truck = parts["active_truck"];

  parts["Cube134"].visible = false;
  parts["Cube134_1"].visible = false;
  parts["Cube116_1"].visible = false;
  parts["active_pallete_st1"].visible = false;
  parts["active_pallete_st2"].visible = false;
  parts["container_b"].visible = false;

  usa.position.z = 45;
  eu.position.z = 45;

  boxesMaterial = boxA.material.clone();
  boxesMaterial.color = whiteColor.clone();
  boxesMaterial.__color = WHITE;
  boxA.material = boxesMaterial;
  boxB.material = boxesMaterial;

  paletteAMaterial = boxA.material.clone();
  paletteAMaterial.color = whiteColor.clone();
  paletteAMaterial.__color = WHITE;
  paletteA.traverse((obj) => {
    if (obj.type === "Mesh") {
      obj.material = paletteAMaterial;
    }
  });

  truckMaterial = boxA.material.clone();
  truckMaterial.color = whiteColor.clone();
  truckMaterial.__color = WHITE;
  truck.traverse((obj) => {
    if (obj.type === "Mesh") {
      obj.material = truckMaterial;
    }
  });

  containerAMaterial = containerA.material.clone();
  containerAMaterial.color = whiteColor.clone();
  containerAMaterial.__color = WHITE;
  containerA.material = containerAMaterial;

  // const transformedMesh = parts["main_box_b"];

  // transformControls = new TransformControls(camera, canvas);
  // transformControls.attach(transformedMesh);
  // transformControls.addEventListener("dragging-changed", function (event) {
  //   controls.enabled = !event.value;
  // });
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

  // window.addEventListener("mousemove", onMouseMove);
  // window.addEventListener("click", onClick);

  return { scene, camera, onResize };
};
