import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// import { TransformControls } from "three/examples/jsm/controls/TransformControls.js";
import anime from "animejs/lib/anime.es.js";
import { showOverlay, hideOverlay } from "../../ui";
// import { wait } from "../../utils";
// import * as dat from "dat.gui";
import { SKIP } from "../../consts";

const WHITE = "#b7b7b7";
const PURPLE = "#5964fa";
const COLOR_TRANSITION_DURATION = 700;
const FACTOR = 70;
const scaleFactor = 1 / (FACTOR / 2);

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

let s;
let sceneObject;
let camera;
let cameraTarget;
let controls;
let scene;
let model;
let deliveryModel;
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
let plane;
let planeMaterial;

const launchDeliveryScene = (resolve) => {
  showOverlay("white", 600).then(() => {
    initDeliveryScene();
    hideOverlay(600).then(() => {
      const timeline = anime.timeline({
        autoplay: false,
        easing: "easeInOutSine",
        complete: resolve,
      });
      timeline
        .add({
          duration: COLOR_TRANSITION_DURATION,
          targets: planeMaterial,
          emissiveIntensity: 0.2,
          __color: PURPLE,
          update: () => {
            planeMaterial.color.set(planeMaterial.__color);
          },
        })
        .add({
          duration: 2000,
          targets: plane.position,
          y: 15000,
          z: 30000,
        });
      timeline.play();
    });
  });
};

export const launchFulfillmentScene = () =>
  SKIP
    ? Promise.resolve()
    : new Promise((resolve) => {
        const timeline = anime.timeline({
          autoplay: false,
          easing: "easeInOutSine",
        });
        timeline
          .add({
            duration: COLOR_TRANSITION_DURATION,
            targets: boxesMaterial,
            emissiveIntensity: 0.2,
            __color: PURPLE,
            update: () => {
              boxesMaterial.color.set(boxesMaterial.__color);
            },
          })
          .add({
            targets: [
              camera.position,
              cameraTarget,
              boxAGroup.position,
              boxBGroup.position,
            ],
            z: (_, i) =>
              i === 0 || i === 1 ? `+=${1542 * scaleFactor}` : `+=${1402}`,
            duration: 1500,
          })
          .add(
            {
              duration: 1500,
              targets: camera,
              zoom: 2,
              update: () => {
                camera.updateProjectionMatrix();
              },
            },
            "-=1500"
          )
          .add({
            duration: COLOR_TRANSITION_DURATION,
            targets: paletteAMaterial,
            emissiveIntensity: 0.2,
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
            targets: [paletteAGroup.position, camera.position, cameraTarget],
            z: (_, i) => `+=${273 * (i === 0 ? 1 : scaleFactor)}`,
            duration: 500,
          })
          .add({
            targets: [paletteAGroup.position, camera.position, cameraTarget],
            x: (_, i) => `+=${95.7 * (i === 0 ? 1 : scaleFactor)}`,
            z: (_, i) => `+=${352 * (i === 0 ? 1 : scaleFactor)}`,
            duration: 500,
          })
          .add({
            targets: paletteAGroup.position,
            z: "+=1835",
            x: "+=14",
            duration: 1500,
          })
          .add(
            {
              targets: [camera.position, cameraTarget],
              z: (_, i) => (i === 0 ? "+=47.38" : "+=52.43"),
              x: (_, i) => (i === 0 ? "+=2.644" : "+=0.4"),
              y: (_, i) => (i === 0 ? "+=2.32" : "+=0"),
              duration: 1500,
              update: () => {
                camera.lookAt(cameraTarget);
              },
            },
            "-=1500"
          )
          .add(
            {
              duration: 1500,
              targets: camera,
              zoom: 0.6,
              update: () => {
                camera.updateProjectionMatrix();
              },
            },
            "-=1500"
          )
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
            duration: 500,
            z: (_, i) => `+=${i === 0 ? -Math.PI / 2 : Math.PI / 2}`,
          })
          .add({
            targets: [containerAGroup.position],
            duration: 500,
            y: "+=202",
          })
          .add({
            targets: [containerAGroup.position],
            duration: 1000,
            z: "+=1200",
          })
          .add(
            {
              targets: camera,
              duration: 1000,
              zoom: 0.4,
              update: () => {
                camera.updateProjectionMatrix();
              },
            },
            "-=1000"
          )
          .add({
            targets: [leftDoor.rotation, rightDoor.rotation],
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
            complete: () => {
              launchDeliveryScene(resolve);
            },
          });
        timeline.play();
      });

const initDeliveryScene = () => {
  const deliveryScene = new THREE.Scene();
  deliveryScene.background = new THREE.Color("#ffffff");
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.42);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(100, 75, 45);
  deliveryScene.add(ambientLight, directionalLight);
  // scene.add(transformControls);
  deliveryModel.traverse((obj) => {
    parts[obj.name] = obj;
    if (obj.type === "Mesh") {
      obj.material.emissiveIntensity = 0.3;
      obj.material.color = whiteColor;
      obj.material.emissive = whiteColor;
    }
  });

  plane = parts["plane_update"];
  planeMaterial = boxA.material.clone();
  planeMaterial.color = whiteColor.clone();
  planeMaterial.__color = WHITE;
  plane.traverse((obj) => {
    if (obj.type === "Mesh") {
      obj.material = planeMaterial;
    }
  });

  deliveryScene.add(deliveryModel);

  const deliveryCamera = new THREE.PerspectiveCamera(
    40,
    s.width / s.height,
    0.1,
    2500
  );
  deliveryCamera.position.copy({
    x: 0.0014579586008573895,
    y: 1457.894736841371,
    z: -0.0000016541668697174197,
  });
  const cameraTarget = new THREE.Vector3(0, 0, 0);
  // controls.target = cameraTarget;
  deliveryCamera.lookAt(cameraTarget);
  // controls.update();
  sceneObject.scene = deliveryScene;
  sceneObject.camera = deliveryCamera;
  sceneObject.onResize = (newSizes) => {
    camera.aspect = newSizes.width / newSizes.height;
    camera.updateProjectionMatrix();
  };
};

export const initFulfillmentSceneObject = ({
  fulfillmentModel,
  deliveryAModel,
  sizes,
}) => {
  s = sizes;
  boxAGroup = new THREE.Group();
  boxBGroup = new THREE.Group();
  paletteAGroup = new THREE.Group();
  containerAGroup = new THREE.Group();
  model = fulfillmentModel.clone();
  deliveryModel = deliveryAModel.clone();
  deliveryModel.scale.set(0.05, 0.05, 0.05);

  scene = new THREE.Scene();
  scene.scale.set(scaleFactor, scaleFactor, scaleFactor);

  scene.background = new THREE.Color("#ffffff");
  scene.fog = new THREE.Fog("white", 1900 * scaleFactor, 2500 * scaleFactor);
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.42);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(
    100 * scaleFactor,
    75 * scaleFactor,
    45 * scaleFactor
  );
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

  // const axesHelper = new THREE.AxesHelper(1000);
  // scene.add(axesHelper);

  camera = new THREE.OrthographicCamera(
    sizes.width / -FACTOR,
    sizes.width / FACTOR,
    sizes.height / FACTOR,
    sizes.height / -FACTOR,
    -100,
    500
  );
  camera.zoom = 5;
  camera.updateProjectionMatrix();
  camera.position.copy(
    // {
    //   x: 257 * scaleFactor,
    //   y: 306 * scaleFactor,
    //   z: 494 * scaleFactor,
    // }
    // { x: 8.298074077304108, y: 12.97306420463098, z: 8.259501851231171 }
    { x: 8.306184599688665, y: 10.439592469326413, z: 10.489405509234365 }
    // { x: 12.913666938266108, y: 13.427161236322922, z: 8.259501851231171 }
  );
  cameraTarget = new THREE.Vector3(0, 120 * scaleFactor, 0);
  // controls = new OrbitControls(camera, canvas);
  // controls.target = cameraTarget;
  camera.lookAt(cameraTarget);
  // controls.update();

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
  cube133.position.x = -13.164300453074018;
  cube131.position.x = -15.355573540012779;

  // usa.position.z = 45;
  // eu.position.z = 45;
  boxBGroup.add(boxB, usa);
  boxAGroup.add(boxA, eu);
  scene.add(boxAGroup);
  scene.add(boxBGroup);

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
    camera.left = sizes.width / -FACTOR;
    camera.right = sizes.width / FACTOR;
    camera.top = sizes.height / FACTOR;
    camera.bottom = sizes.height / -FACTOR;
    camera.updateProjectionMatrix();

    // controls.update();
  };

  // const gui = new dat.GUI();
  // gui.add(camera, "near", -100, 0, 0.01).onChange(() => {
  //   camera.updateProjectionMatrix();
  // });
  // gui.add(camera, "far", 0, 1000, 0.01).onChange(() => {
  //   camera.updateProjectionMatrix();
  // });
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
  // window.addEventListener("keydown", (e) => {
  //   switch (e.which) {
  //     case 38: {
  //       camera.position.x -= 10 * scaleFactor;
  //       controls.target.x -= 10 * scaleFactor;
  //       break;
  //     }
  //     case 37: {
  //       camera.position.z += 10 * scaleFactor;
  //       controls.target.z += 10 * scaleFactor;
  //       break;
  //     }
  //     case 39: {
  //       camera.position.z -= 10 * scaleFactor;
  //       controls.target.z -= 10 * scaleFactor;
  //       break;
  //     }
  //     case 40: {
  //       camera.position.x += 10 * scaleFactor;
  //       controls.target.x += 10 * scaleFactor;
  //       break;
  //     }
  //   }
  // });

  sceneObject = { scene, camera, onResize };
  return sceneObject;
};
