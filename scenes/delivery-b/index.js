// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// import { TransformControls } from "three/examples/jsm/controls/TransformControls.js";
// import { wait } from "../../utils";
// import * as dat from "dat.gui";
import * as THREE from "three";
import anime from "animejs/lib/anime.es.js";
import { showOverlay, hideOverlay } from "../../ui";
import { SKIP } from "../../consts";

const WHITE = "#b7b7b7";
const PURPLE = "#5964fa";
const COLOR_TRANSITION_DURATION = 700;

const whiteColor = new THREE.Color(WHITE);

let checkIfD2CFunction;
let vanB2B;
let vanB2BMaterial;
let vanD2C;
let vanD2CMaterial;
let cameraTarget;
let sceneObject;
let controls;
let camera;
let scene;
let model;
let b2bModel;
let d2cModel;
let parts = {};
// let transformControls;
let containerB;
let cartGroup = new THREE.Group();
let cartMaterial;
let cart;
let golfCart;
let cartRamp;
let truck;
let truckMaterial;
let leftDoor;
let rightDoor;
let van;
let vanMaterial;

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
//

const initB2BScene = () => {
  const b2bScene = new THREE.Scene();
  b2bScene.background = new THREE.Color("#ffffff");
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.42);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(100, 75, 45);
  b2bScene.add(ambientLight, directionalLight);
  parts = {};
  b2bModel.traverse((obj) => {
    parts[obj.name] = obj;
    if (obj.type === "Mesh") {
      obj.material.emissiveIntensity = 0.3;
      obj.material.color = whiteColor;
      obj.material.emissive = whiteColor;
    }
  });

  vanB2B = parts["van"];
  vanB2B.position.z = 3500;

  vanB2BMaterial = cart.material.clone();
  vanB2BMaterial.color = whiteColor.clone();
  vanB2BMaterial.__color = WHITE;
  vanB2B.traverse((obj) => {
    if (obj.type === "Mesh") {
      obj.material = vanB2BMaterial;
    }
  });

  // transformControls = new TransformControls(camera, canvas);
  // transformControls.attach(vanB2B);
  // transformControls.addEventListener("dragging-changed", function (event) {
  //   controls.enabled = !event.value;
  // });
  // transformControls.addEventListener("change", () => {
  //   console.log(transformControls.object.position);
  //   console.log(transformControls.object.rotation);
  // });
  // b2bScene.add(transformControls);

  b2bModel.scale.set(0.03, 0.03, 0.03);
  b2bScene.add(b2bModel);

  camera.position.copy({ x: -11, y: 1055, z: 100 });
  cameraTarget = new THREE.Vector3(-12, 0, 100);
  camera.lookAt(cameraTarget);
  // controls.target = cameraTarget;
  // controls.update();

  sceneObject.scene = b2bScene;
};

const initD2CScene = () => {
  const d2cScene = new THREE.Scene();
  d2cScene.background = new THREE.Color("#ffffff");
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.42);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(100, 75, 45);
  d2cScene.add(ambientLight, directionalLight);
  parts = {};
  d2cModel.traverse((obj) => {
    parts[obj.name] = obj;
    if (obj.type === "Mesh") {
      obj.material.emissiveIntensity = 0.3;
      obj.material.color = whiteColor;
      obj.material.emissive = whiteColor;
    }
  });

  vanD2C = parts["van"];
  vanD2C.position.z = 8545;

  vanD2CMaterial = cart.material.clone();
  vanD2CMaterial.color = whiteColor.clone();
  vanD2CMaterial.__color = WHITE;
  vanD2C.traverse((obj) => {
    if (obj.type === "Mesh") {
      obj.material = vanD2CMaterial;
    }
  });

  // transformControls = new TransformControls(camera, canvas);
  // transformControls.attach(vanD2C);
  // transformControls.addEventListener("dragging-changed", function (event) {
  //   controls.enabled = !event.value;
  // });
  // transformControls.addEventListener("change", () => {
  //   console.log(transformControls.object.position);
  //   console.log(transformControls.object.rotation);
  // });

  d2cScene.scale.set(0.03, 0.03, 0.03);
  d2cScene.add(d2cModel);

  camera.position.copy({ x: -12, y: 205, z: 210 });
  cameraTarget = new THREE.Vector3(-13, 0, 210);
  camera.lookAt(cameraTarget);
  // controls.target = cameraTarget;
  // controls.update();

  // d2cScene.add(transformControls);
  sceneObject.scene = d2cScene;
};

const launchDeliveryD2CScene = (resolve) => {
  showOverlay("white", 600).then(() => {
    initD2CScene();
    hideOverlay(600).then(() => {
      const timeline = anime.timeline({
        autoplay: false,
        easing: "easeInOutSine",
        complete: resolve,
      });
      timeline
        .add({
          duration: COLOR_TRANSITION_DURATION,
          targets: vanD2CMaterial,
          emissiveIntensity: 0.2,
          __color: PURPLE,
          update: () => {
            vanD2CMaterial.color.set(vanD2CMaterial.__color);
          },
        })
        .add({
          targets: [vanD2C.position, camera.position],
          z: (_, i) => (i === 0 ? -2225 : -70),
          duration: 3000,
        });
      timeline.play();
    });
  });
};

const launchDeliveryB2BScene = (resolve) => {
  showOverlay("white", 600).then(() => {
    initB2BScene();
    hideOverlay(600).then(() => {
      const timeline = anime.timeline({
        autoplay: false,
        easing: "easeInOutSine",
        complete: resolve,
      });
      timeline
        .add({
          targets: camera.position,
          y: 200,
          duration: 500,
        })
        .add({
          duration: COLOR_TRANSITION_DURATION,
          targets: vanB2BMaterial,
          emissiveIntensity: 0.2,
          __color: PURPLE,
          update: () => {
            vanB2BMaterial.color.set(vanB2BMaterial.__color);
          },
        })
        .add({
          targets: [vanB2B.position, camera.position],
          z: (_, i) => (i === 0 ? -9690 : -290),
          duration: 3000,
        });
      timeline.play();
    });
  });
};

export const launchDeliveryBScene = () =>
  SKIP
    ? Promise.resolve()
    : new Promise((resolve) => {
        const timeline = anime.timeline({
          autoplay: false,
          easing: "easeInOutSine",
          complete: () => {
            if (checkIfD2CFunction()) {
              launchDeliveryD2CScene(resolve);
            } else {
              launchDeliveryB2BScene(resolve);
            }
          },
        });
        timeline
          .add({
            targets: containerB.position,
            x: -1021.9810791015625,
            y: 116.2855224609375,
            duration: 600,
          })
          .add({
            duration: COLOR_TRANSITION_DURATION,
            targets: cartMaterial,
            emissiveIntensity: 0.2,
            __color: PURPLE,
            update: () => {
              cartMaterial.color.set(cartMaterial.__color);
            },
          })
          .add({
            targets: [
              cartGroup.position,
              containerB.position,
              camera.position,
              // controls.target,
            ],
            z: (_, i) => (i === 0 ? "+=25451" : "+=0"),
            x: (_, i) =>
              i === 1 ? "-=5110" : i === 2 || i === 3 ? "-=170" : "+=0",
            duration: 1000,
          })
          .add({
            targets: golfCart.rotation,
            z: `+=${Math.PI / 2}`,
            duration: 500,
          })
          .add({
            targets: golfCart.position,
            x: "+=30000",
            duration: 800,
            complete: () => {
              golfCart.visible = false;
            },
          })
          .add({
            targets: containerB.position,
            y: 354,
            duration: 300,
          })
          .add({
            targets: [
              containerB.position,
              camera.position,
              // controls.target
            ],
            x: (_, i) => (i === 0 ? -7140 : "-=30"),
            y: (_, i) => (i === 1 ? "+=50" : "+=0"),
            duration: 500,
          })
          .add({
            targets: [containerB.position],
            y: 120,
            duration: 300,
          })
          .add({
            targets: [
              containerB.position,
              camera.position,
              //controls.target
            ],
            x: (_, i) => (i === 0 ? -11450 : "-=135"),
            duration: 1000,
          })
          .add({
            duration: COLOR_TRANSITION_DURATION,
            targets: truckMaterial,
            emissiveIntensity: 0.2,
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
            targets: [
              containerB.position,
              camera.position,
              // controls.target
            ],
            y: (_, i) => (i === 0 ? "+=110" : "+=0"),
            x: (_, i) => (i === 0 ? "-=1030" : "-=40"),
            duration: 1000,
          })
          .add({
            targets: [leftDoor.rotation, rightDoor.rotation],
            duration: 500,
            z: (_, i) => `-=${i === 0 ? -Math.PI / 2 : Math.PI / 2}`,
          })
          .add({
            targets: [
              truck.position,
              containerB.position,
              camera.position,
              // controls.target,
            ],
            duration: 1500,
            x: (_, i) =>
              i === 0 || i === 1 ? "-=15160" : i === 2 ? -810 : -811,
          })
          .add({
            targets: [
              camera.position,
              // controls.target
            ],
            duration: 1000,
            keyframes: [{ x: -490 }, { z: -250 }], //, { z: -50 }, { x: -810 }],
          })
          .add({
            duration: COLOR_TRANSITION_DURATION,
            targets: vanMaterial,
            emissiveIntensity: 0.2,
            __color: PURPLE,
            update: () => {
              vanMaterial.color.set(vanMaterial.__color);
            },
          })
          .add({
            targets: [
              van.position,
              camera.position,
              // controls.target
            ],
            duration: 500,
            z: (_, i) => (i === 0 ? -1750 : -50),
          })
          .add({
            targets: [van.rotation],
            duration: 500,
            y: `-=${Math.PI / 2}`,
          })
          .add({
            targets: [
              van.position,
              camera.position,
              //controls.target
            ],
            duration: 2000,
            x: (_, i) => (i === 0 ? -26760 : -810),
          })
          .add({
            targets: [leftDoor.rotation, rightDoor.rotation, van.rotation],
            duration: 500,
            z: (_, i) =>
              i === 2 ? "+=0" : `+=${i === 0 ? -Math.PI / 2 : Math.PI / 2}`,
            y: (_, i) => (i === 2 ? `-=${Math.PI / 2}` : "+=0"),
          })
          .add({
            targets: containerB.position,
            duration: 400,
            x: -26626,
            y: 163,
          })
          .add({
            targets: containerB.position,
            duration: 400,
            z: -1494,
          })
          .add({
            targets: [leftDoor.rotation, rightDoor.rotation],
            duration: 500,
            z: (_, i) => `-=${i === 0 ? -Math.PI / 2 : Math.PI / 2}`,
          })
          .add({
            targets: [van.position, containerB.position],
            duration: 2000,
            z: (_, i) => (i === 0 ? -13550 : -13310),
          });
        timeline.play();
      });

export const initDeliveryBSceneObject = ({
  deliveryBModel,
  deliveryC_B2B_Model,
  deliveryC_D2C_Model,
  sizes,
  checkIfD2C,
  //canvas
}) => {
  checkIfD2CFunction = checkIfD2C;
  cartGroup = new THREE.Group();
  b2bModel = deliveryC_B2B_Model.clone();
  d2cModel = deliveryC_D2C_Model.clone();

  model = deliveryBModel.clone();
  model.scale.set(0.03, 0.03, 0.03);
  scene = new THREE.Scene();
  scene.background = new THREE.Color("#ffffff");
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(-100, 60, 100);
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

  containerB = parts["container_b"];
  containerB.position.copy({
    x: 30.833626018425775,
    y: 323.74526285305944,
    z: -1222.3502197265625,
  });
  containerB.material = containerB.material.clone();
  containerB.material.emissiveIntensity = 0.2;
  containerB.material.color.set(PURPLE);
  containerB.material.emissive.set(PURPLE);

  cart = parts["cart"];
  golfCart = parts["golfcart"];
  cartGroup.add(cart, golfCart);
  cartRamp = parts["cart_ramp"];
  cartRamp.add(cartGroup);
  cartMaterial = cart.material.clone();
  cartMaterial.color = whiteColor.clone();
  cartMaterial.__color = WHITE;
  cartGroup.traverse((obj) => {
    if (obj.type === "Mesh") {
      obj.material = cartMaterial;
    }
  });

  truck = parts["active_truck"];
  truckMaterial = cart.material.clone();
  truckMaterial.color = whiteColor.clone();
  truckMaterial.__color = WHITE;
  truck.traverse((obj) => {
    if (obj.type === "Mesh") {
      obj.material = truckMaterial;
    }
  });

  van = parts["van"];
  van.rotateY(Math.PI);
  vanMaterial = cart.material.clone();
  vanMaterial.color = whiteColor.clone();
  vanMaterial.__color = WHITE;
  van.traverse((obj) => {
    if (obj.type === "Mesh") {
      obj.material = vanMaterial;
    }
  });

  leftDoor = parts["left_door_1"];
  rightDoor = parts["right_door_1"];

  parts["active_cart"].visible = false;
  parts["container_b1"].visible = false;
  parts["passive_truck"].visible = false;
  parts["van_1"].visible = false;

  // const axesHelper = new THREE.AxesHelper(1000);
  // scene.add(axesHelper);

  camera = new THREE.PerspectiveCamera(
    40,
    sizes.width / sizes.height,
    0.1,
    2500
  );
  camera.position.copy({
    x: -20,
    y: 150,
    z: -30,
  });
  cameraTarget = new THREE.Vector3(-21, 0, -30);
  camera.lookAt(cameraTarget);
  // controls = new OrbitControls(camera, canvas);
  // controls.target = cameraTarget;
  // controls.update();

  // transformControls = new TransformControls(camera, canvas);
  // transformControls.attach(van);
  // transformControls.attach(truck);
  // transformControls.attach(containerB);
  // transformControls.attach(golfCart);
  // transformControls.attach(cartGroup);
  // transformControls.addEventListener("dragging-changed", function (event) {
  //   controls.enabled = !event.value;
  // });
  // transformControls.addEventListener("change", () => {
  //   console.log(transformControls.object.position);
  //   console.log(transformControls.object.rotation);
  // });
  // scene.add(transformControls);

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
  // window.addEventListener("mousemove", onMouseMove);
  // window.addEventListener("click", onClick);
  // window.addEventListener("keydown", (e) => {
  //   switch (e.which) {
  //     case 38: {
  //       camera.position.x -= 10;
  //       controls.target.x -= 10;
  //       break;
  //     }
  //     case 37: {
  //       camera.position.z += 10;
  //       controls.target.z += 10;
  //       break;
  //     }
  //     case 39: {
  //       camera.position.z -= 10;
  //       controls.target.z -= 10;
  //       break;
  //     }
  //     case 40: {
  //       camera.position.x += 10;
  //       controls.target.x += 10;
  //       break;
  //     }
  //   }
  //   console.log(camera.position);
  // });

  sceneObject = { scene, camera, onResize };
  return sceneObject;
};
