// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// import { TransformControls } from "three/examples/jsm/controls/TransformControls.js";
// import { wait } from "../../utils";
// import * as dat from "dat.gui";
import * as THREE from "three";
import anime from "animejs/lib/anime.es.js";
import { showOverlay, hideOverlay } from "../../ui";
import { SKIP, BASE, EMISSIVE } from "../../consts";

const WHITE = "#b7b7b7";
const PURPLE = "#5964fa";
const COLOR_TRANSITION_DURATION = 700;
const SCALE_FACTOR = 0.03;

const whiteColor = new THREE.Color(WHITE);

let vanD2C0;
let roverD2C0;
let packageD2C0;
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
let d2c0Model;
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

  b2bModel.scale.set(SCALE_FACTOR, SCALE_FACTOR, SCALE_FACTOR);
  b2bScene.add(b2bModel);

  camera.position.copy({ x: -11, y: 500, z: 100 });
  cameraTarget = new THREE.Vector3(-12, 0, 100);
  camera.lookAt(cameraTarget);
  // controls.target = cameraTarget;
  // controls.update();

  sceneObject.scene = b2bScene;
};

const initD2C0Scene = () => {
  const d2c0Scene = new THREE.Scene();
  d2c0Scene.background = new THREE.Color("#ffffff");
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(1000, 773, 166);
  d2c0Scene.add(ambientLight, directionalLight);
  parts = {};
  d2c0Model.traverse((obj) => {
    parts[obj.name] = obj;
    if (obj.type === "Mesh") {
      obj.material.emissiveIntensity = 1.125;
      obj.material.color = new THREE.Color(BASE);
      obj.material.emissive = new THREE.Color(EMISSIVE);
      if (obj.material.name === "Plain Violet") {
        obj.material = obj.material.clone();
        obj.material.color = new THREE.Color(PURPLE);
        obj.material.emissive = new THREE.Color(PURPLE);
        obj.material.emissiveIntensity = 0.8;
      }
    }
  });

  vanD2C0 = parts["van"];
  roverD2C0 = parts["rover"];
  packageD2C0 = parts["package"];

  vanD2C0.position.z = 628;
  roverD2C0.position.z = 648;
  packageD2C0.position.z = -70;
  packageD2C0.visible = false;

  d2c0Scene.scale.set(SCALE_FACTOR, SCALE_FACTOR, SCALE_FACTOR);
  d2c0Scene.add(d2c0Model);

  camera.position.copy({ x: 3, y: 18, z: 0 });
  cameraTarget = new THREE.Vector3(camera.position.x - 1, 0, camera.position.z);
  camera.lookAt(cameraTarget);
  // controls.target = cameraTarget;
  // controls.update();

  sceneObject.scene = d2c0Scene;
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

  vanD2C = roverD2C0.clone();
  vanD2C.position.clone(parts["van"].position);
  vanD2C.position.z = 8545;
  vanD2C.position.x -= 500;
  vanD2C.visible = true;
  const scaleFactor = 200;
  vanD2C.scale.set(scaleFactor, scaleFactor, scaleFactor);
  parts["van"].visible = false;
  d2cScene.add(vanD2C);

  vanD2CMaterial = vanD2C.material.clone();
  vanD2CMaterial.emissiveIntensity = 0.3;
  vanD2CMaterial.emissive = whiteColor.clone();
  vanD2CMaterial.color = whiteColor.clone();
  vanD2CMaterial.__color = WHITE;
  vanD2C.material = vanD2CMaterial;

  // transformControls = new TransformControls(camera, canvas);
  // transformControls.attach(vanD2C);
  // transformControls.addEventListener("dragging-changed", function (event) {
  //   controls.enabled = !event.value;
  // });
  // transformControls.addEventListener("change", () => {
  //   console.log(transformControls.object.position);
  //   console.log(transformControls.object.rotation);
  // });

  d2cScene.scale.set(SCALE_FACTOR, SCALE_FACTOR, SCALE_FACTOR);
  d2cScene.add(d2cModel);

  camera.position.copy({ x: -12, y: 205, z: 210 });
  cameraTarget = new THREE.Vector3(-13, 0, 210);
  camera.lookAt(cameraTarget);
  // controls.target = cameraTarget;
  // controls.update();

  // d2cScene.add(transformControls);
  sceneObject.scene = d2cScene;
};

export const launchDeliveryD2C0Scene = (resolve) => {
  // showOverlay("white", 600).then(() => {
  //   initD2C0Scene();
  // hideOverlay(600).then(() => {
  const timeline = anime.timeline({
    autoplay: false,
    easing: "easeInOutSine",
    complete: () => launchDeliveryD2CScene(resolve),
  });
  timeline
    .add({
      targets: vanD2C0.position,
      z: -90,
      duration: 2000,
      complete: () => {
        packageD2C0.visible = true;
      },
    })
    .add({
      targets: roverD2C0.position,
      z: 24,
      duration: 2000,
    })
    .add({
      targets: packageD2C0.position,
      z: 27,
      y: 10,
      duration: 1000,
    })
    .add({
      targets: vanD2C0.position,
      z: "-=700",
      duration: 1500,
      complete: () => {
        vanD2C0.visible = false;
      },
    })
    .add({
      targets: [roverD2C0.position, packageD2C0.position],
      z: "-=700",
      duration: 1500,
      complete: () => {
        roverD2C0.visible = false;
        packageD2C0.visible = false;
      },
    });
  timeline.play();
  //   });
  // });
};

export const launchDeliveryD2CScene = (resolve) => {
  // showOverlay("white", 600).then(() => {
  //   initD2CScene();
  //   hideOverlay(600).then(() => {
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
  //   });
  // });
};

export const launchDeliveryB2BScene = (resolve) => {
  // showOverlay("white", 600).then(() => {
  // initB2BScene();
  // hideOverlay(600).then(() => {
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
  //   });
  // });
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
              launchDeliveryD2C0Scene(resolve);
            } else {
              launchDeliveryB2BScene(resolve);
            }
          },
        });
        timeline
          .add({
            targets: [containerB.position, camera.position, cameraTarget],
            x: (_, i) => -1022 * (i === 0 ? 1 : SCALE_FACTOR),
            y: (_, i) => (i === 0 ? 116 : "+=0"),
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
              cameraTarget,
            ],
            z: (_, i) => (i === 0 ? "+=25451" : "+=0"),
            x: (_, i) =>
              i === 1
                ? "-=5110"
                : i === 2 || i === 3
                ? `-=${5110 * SCALE_FACTOR}`
                : "+=0",
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
            targets: [containerB.position, camera.position, cameraTarget],
            x: (_, i) => -7140 * (i === 0 ? 1 : SCALE_FACTOR),
            y: (_, i) => (i === 1 ? "+=40" : "+=0"),
            duration: 500,
          })
          .add({
            targets: [containerB.position],
            y: 120,
            duration: 300,
          })
          .add({
            targets: [containerB.position, camera.position, cameraTarget],
            x: (_, i) => -11450 * (i === 0 ? 1 : SCALE_FACTOR),
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
            targets: [containerB.position, camera.position, cameraTarget],
            y: (_, i) => (i === 0 ? "+=110" : "+=0"),
            x: (_, i) => `-=${1030 * (i === 0 ? 1 : SCALE_FACTOR)}`,
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
              cameraTarget,
            ],
            duration: 1500,
            x: (_, i) =>
              `-=${15160 * (i === 0 || i === 1 ? 1 : SCALE_FACTOR)} `,
          })
          .add({
            duration: 100,
            targets: vanMaterial,
            emissiveIntensity: 0.2,
            __color: PURPLE,
            update: () => {
              vanMaterial.color.set(vanMaterial.__color);
            },
          })
          .add({
            targets: van.position,
            z: -2086,
            duration: 2000,
          })
          .add({
            targets: [leftDoor.rotation, rightDoor.rotation],
            duration: 500,
            z: (_, i) => `+=${i === 0 ? -Math.PI / 2 : Math.PI / 2}`,
          })
          .add({
            targets: [containerB.position, camera.position, cameraTarget],
            duration: 400,
            x: (_, i) => -26681 * (i === 0 ? 1 : SCALE_FACTOR),
            y: (_, i) => (i === 0 ? 163 : "+=0"),
          })
          .add({
            targets: [containerB.position, camera.position, cameraTarget],
            duration: 400,
            z: (_, i) => -1834 * (i === 0 ? 1 : SCALE_FACTOR),
          })
          .add({
            targets: [leftDoor.rotation, rightDoor.rotation],
            duration: 500,
            z: (_, i) => `-=${i === 0 ? -Math.PI / 2 : Math.PI / 2}`,
          })
          .add({
            targets: [camera.position, cameraTarget],
            duration: 1500,
            z: -7572 * SCALE_FACTOR,
          })
          .add(
            {
              targets: [van.position, containerB.position],
              duration: 2000,
              z: (_, i) => (i === 0 ? -13550 : -13310),
            },
            "-=1500"
          );
        timeline.play();
      });

export const initDeliveryBSceneObject = ({
  deliveryBModel,
  deliveryC_B2B_Model,
  deliveryC_D2C_Model,
  deliveryC0_D2C_Model,
  sizes,
  checkIfD2C,
  //canvas
}) => {
  checkIfD2CFunction = checkIfD2C;
  cartGroup = new THREE.Group();
  b2bModel = deliveryC_B2B_Model.clone();
  d2cModel = deliveryC_D2C_Model.clone();
  d2c0Model = deliveryC0_D2C_Model.clone();

  model = deliveryBModel.clone();
  model.scale.set(SCALE_FACTOR, SCALE_FACTOR, SCALE_FACTOR);
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
    x: 30,
    y: 323,
    z: -1222,
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
  van.position.copy({ x: -26832, y: 0, z: 5230 });
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
    x: containerB.position.x * SCALE_FACTOR,
    y: 150,
    z: containerB.position.z * SCALE_FACTOR,
  });
  cameraTarget = new THREE.Vector3(camera.position.x - 1, 0, camera.position.z);
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
  //       camera.position.x -= 1;
  //       controls.target.x -= 1;
  //       break;
  //     }
  //     case 37: {
  //       camera.position.z += 1;
  //       controls.target.z += 1;
  //       break;
  //     }
  //     case 39: {
  //       camera.position.z -= 1;
  //       controls.target.z -= 1;
  //       break;
  //     }
  //     case 40: {
  //       camera.position.x += 1;
  //       controls.target.x += 1;
  //       break;
  //     }
  //   }
  //   console.log(camera.position);
  // });

  sceneObject = { scene, camera, onResize };
  initD2C0Scene();
  initD2CScene();
  return sceneObject;
};
