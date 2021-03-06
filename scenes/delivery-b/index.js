import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { TransformControls } from "three/examples/jsm/controls/TransformControls.js";
// import { wait } from "../../utils";
import * as dat from "dat.gui";
import * as THREE from "three";
import anime from "animejs/lib/anime.es.js";
import { showOverlay, hideOverlay } from "../../ui";
import { SKIP, BASE, EMISSIVE } from "../../consts";

const WHITE = "#b7b7b7";
const PURPLE = "#5c63ff";
const PURPLE_EMISSIVE_INTENSITY = 0.75;
const COLOR_TRANSITION_DURATION = 700;
const SCALE_FACTOR = 0.03;

const whiteColor = new THREE.Color(WHITE);

let vanD2C0;
let roverD2C0;
let packageD2C0;
let checkIfD2CFunction;
let vanB2B;
let packageB2B;
let vanB2BMaterial;
let vanD2C;
let packageD2C;
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
let transformControls;
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
  b2bScene.background = new THREE.Color("#ebebeb");
  const ambientLight = new THREE.AmbientLight(0xebebeb, 0.42);
  const directionalLight = new THREE.DirectionalLight(0xebebeb, 1);
  directionalLight.position.set(40, 30, 10);
  b2bScene.add(ambientLight, directionalLight);
  parts = {};
  b2bModel.traverse((obj) => {
    parts[obj.name] = obj;
    if (obj.type === "Mesh") {
      obj.material.emissiveIntensity = 0.6;
      obj.material.color = whiteColor;
      obj.material.emissive = whiteColor;
    }
  });
  const plane = parts["Plane"];
  plane.material.normalMap.wrapS = THREE.RepeatWrapping;
  plane.material.normalMap.wrapT = THREE.RepeatWrapping;
  plane.material.normalMap.repeat = new THREE.Vector2(100, 100);
  plane.material.emissiveIntensity = 0.85;

  vanB2B = parts["van"];
  vanB2B.position.z = 20000;

  vanB2BMaterial = cart.material.clone();
  vanB2BMaterial.color = new THREE.Color(PURPLE);
  vanB2BMaterial.emissive = new THREE.Color(PURPLE);
  vanB2BMaterial.emissiveIntensity = 0.4;
  vanB2B.traverse((obj) => {
    if (obj.type === "Mesh") {
      obj.material = vanB2BMaterial;
    }
  });

  d2c0Model.traverse((obj) => {
    if (obj.type === "Mesh" && obj.name === "package") {
      packageB2B = obj.clone();
    }
  });
  packageB2B.visible = false;
  packageB2B.material.color = new THREE.Color(PURPLE);
  packageB2B.material.emissive = new THREE.Color(PURPLE);
  packageB2B.material.emissiveIntensity = 0.4;
  packageB2B.position.copy({ x: -7, y: 7, z: -303 });
  b2bScene.add(packageB2B);

  // transformControls = new TransformControls(camera, canvas);
  // transformControls.attach(packageB2B);
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
  d2c0Scene.background = new THREE.Color("#ebebeb");
  const ambientLight = new THREE.AmbientLight(0xebebeb, 0.3);
  const directionalLight = new THREE.DirectionalLight(0xebebeb, 0.5);
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
        obj.material.emissiveIntensity = PURPLE_EMISSIVE_INTENSITY;
      }
    }
  });

  const road = parts["road"];
  road.material.emissiveIntensity = 1.2;
  road.material.normalMap.wrapS = THREE.RepeatWrapping;
  road.material.normalMap.wrapT = THREE.RepeatWrapping;
  road.material.normalMap.repeat = new THREE.Vector2(100, 100);

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
  // transformControls = new TransformControls(camera, canvas);
  // transformControls.attach(packageD2C0);
  // transformControls.addEventListener("dragging-changed", function (event) {
  // controls.enabled = !event.value;
  // });
  // transformControls.addEventListener("change", () => {
  //   console.log(transformControls.object.position);
  //   console.log(transformControls.object.rotation);
  // });

  // transformControls.setSize(30);
  // d2c0Scene.add(transformControls);

  sceneObject.scene = d2c0Scene;
};

const initD2CScene = () => {
  const d2cScene = new THREE.Scene();
  d2cScene.background = new THREE.Color("#ebebeb");
  const ambientLight = new THREE.AmbientLight(0xebebeb, 0.3);
  const directionalLight = new THREE.DirectionalLight(0xebebeb, 0.3);
  directionalLight.position.set(60, 50, 10);
  d2cScene.add(ambientLight, directionalLight);
  parts = {};
  d2cModel.traverse((obj) => {
    parts[obj.name] = obj;
    if (obj.type === "Mesh") {
      if (obj.name === "road") {
        obj.material.emissiveIntensity = 1.2;
        obj.material.normalMap.wrapS = THREE.RepeatWrapping;
        obj.material.normalMap.wrapT = THREE.RepeatWrapping;
        obj.material.normalMap.repeat.set(100, 100);
      } else {
        obj.material.emissiveIntensity = 0.75;
        obj.material.color = whiteColor;
        obj.material.emissive = whiteColor;
      }
    }
  });

  vanD2C = roverD2C0.clone();
  vanD2C.position.clone(parts["rover"].position);
  vanD2C.position.z = 8545;
  vanD2C.position.x -= 500;
  vanD2C.visible = true;
  const scaleFactor = 200;
  vanD2C.scale.set(scaleFactor, scaleFactor, scaleFactor);
  parts["rover"].visible = false;
  d2cScene.add(vanD2C);

  vanD2CMaterial = vanD2C.material.clone();
  vanD2CMaterial.emissiveIntensity = 0.45;
  vanD2CMaterial.emissive = new THREE.Color("#ebebeb");
  vanD2CMaterial.color = new THREE.Color("#ebebeb");
  vanD2CMaterial.__color = "#ebebeb";
  vanD2C.material = vanD2CMaterial;

  packageD2C = packageD2C0.clone();
  packageD2C.scale.set(5000, 5000, 5000);
  packageD2C.position.copy({
    x: -392,
    y: 228,
    z: -2591,
  });
  packageD2C.visible = false;
  d2cScene.add(packageD2C);

  // transformControls = new TransformControls(camera, canvas);
  // transformControls.attach(packageD2C);
  // transformControls.addEventListener("dragging-changed", function (event) {
  //   controls.enabled = !event.value;
  // });
  // transformControls.addEventListener("change", () => {
  //   console.log(transformControls.object.position);
  //   console.log(transformControls.object.rotation);
  // });

  // transformControls.setSize(100);
  // d2cScene.add(transformControls);

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
  showOverlay("white", 600).then(() => {
    initD2C0Scene();
    hideOverlay(600).then(() => {
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
          targets: packageD2C0.position,
          z: -20,
          duration: 500,
        })
        .add({
          targets: packageD2C0.position,
          x: -56,
          duration: 500,
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
          targets: roverD2C0.position,
          z: -32,
          duration: 2000,
        })
        .add({
          targets: packageD2C0.position,
          x: 68,
          y: 20,
          duration: 500,
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
    });
  });
};

export const launchDeliveryD2CScene = (resolve) => {
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
          emissiveIntensity: PURPLE_EMISSIVE_INTENSITY,
          __color: PURPLE,
          update: () => {
            vanD2CMaterial.color.set(vanD2CMaterial.__color);
            vanD2CMaterial.emissive.set(vanD2CMaterial.__color);
          },
        })
        .add({
          targets: [vanD2C.position, camera.position],
          z: (_, i) => (i === 0 ? -2725 : -70),
          duration: 3000,
        })
        .add({
          begin: () => {
            packageD2C.visible = true;
          },
          targets: packageD2C.position,
          z: -2173,
          duration: 500,
        })
        .add({
          targets: packageD2C.rotation,
          z: `+=${Math.PI / 2}`,
          duration: 500,
        })
        .add({
          targets: packageD2C.position,
          x: 726,
          duration: 500,
        });
      timeline.play();
    });
  });
};

export const launchDeliveryB2BScene = (resolve) => {
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
          targets: vanB2B.position,
          z: 3500,
          duration: 2000,
        })
        .add({
          targets: camera.position,
          y: 200,
          duration: 500,
        })
        .add({
          targets: [vanB2B.position, camera.position, cameraTarget],
          z: (_, i) => (i === 0 ? -10400 : -290),
          duration: 3000,
        })
        .add({
          begin: () => {
            packageB2B.visible = true;
          },
          targets: packageB2B.position,
          z: -288,
          duration: 500,
        })
        .add({
          targets: packageB2B.rotation,
          z: `+=${Math.PI / 2}`,
          duration: 500,
        })
        .add({
          targets: packageB2B.position,
          x: 18,
          duration: 500,
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
            emissiveIntensity: PURPLE_EMISSIVE_INTENSITY,
            __color: PURPLE,
            update: () => {
              cartMaterial.color.set(cartMaterial.__color);
              cartMaterial.emissive.set(cartMaterial.__color);
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
            emissiveIntensity: PURPLE_EMISSIVE_INTENSITY,
            __color: PURPLE,
            update: () => {
              truckMaterial.color.set(truckMaterial.__color);
              truckMaterial.emissive.set(truckMaterial.__color);
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
            emissiveIntensity: PURPLE_EMISSIVE_INTENSITY,
            __color: PURPLE,
            update: () => {
              vanMaterial.color.set(vanMaterial.__color);
              vanMaterial.emissive.set(vanMaterial.__color);
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
  scene.background = new THREE.Color("#ebebeb");
  const ambientLight = new THREE.AmbientLight(0xebebeb, 0.3);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xebebeb, 0.3);
  directionalLight.position.set(10, 25, 15);
  // const helper = new THREE.DirectionalLightHelper(directionalLight, 10, "red");
  // scene.add(helper);
  scene.add(ambientLight);
  scene.add(directionalLight);
  scene.add(model);
  parts = {};
  model.traverse((obj) => {
    parts[obj.name] = obj;
    if (obj.type === "Mesh") {
      obj.material.emissiveIntensity = 0.5;
      obj.material.color = new THREE.Color("#ebebeb");
      obj.material.emissive = new THREE.Color("#ebebeb");
    }
  });

  containerB = parts["container_b"];
  containerB.position.copy({
    x: 30,
    y: 323,
    z: -1222,
  });
  containerB.material = containerB.material.clone();
  containerB.material.emissiveIntensity = PURPLE_EMISSIVE_INTENSITY;
  containerB.material.color.set(PURPLE);
  containerB.material.emissive.set(PURPLE);

  cart = parts["cart"];
  golfCart = parts["golfcart"];
  cartGroup.add(cart, golfCart);
  cartRamp = parts["cart_ramp"];
  cartRamp.add(cartGroup);
  cartMaterial = cart.material.clone();
  cartMaterial.color = new THREE.Color("#ebebeb");
  cartMaterial.__color = "#ebebeb";
  cartGroup.traverse((obj) => {
    if (obj.type === "Mesh") {
      obj.material = cartMaterial;
    }
  });

  truck = parts["active_truck"];
  truckMaterial = cart.material.clone();
  truckMaterial.color = new THREE.Color("#ebebeb");
  truckMaterial.__color = "#ebebeb";
  truck.traverse((obj) => {
    if (obj.type === "Mesh") {
      obj.material = truckMaterial;
    }
  });

  van = parts["van"];
  van.position.copy({ x: -26832, y: 0, z: 5230 });
  vanMaterial = cart.material.clone();
  vanMaterial.color = new THREE.Color("#ebebeb");
  vanMaterial.__color = "#ebebeb";
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

  const ground = parts["Plane"];
  ground.material.normalMap.wrapS = THREE.RepeatWrapping;
  ground.material.normalMap.wrapT = THREE.RepeatWrapping;
  ground.material.normalMap.repeat = new THREE.Vector2(100, 100);
  ground.material.emissiveIntensity = 0.7;
  // const props = {
  //   purple: PURPLE,
  // }
  // const gui = new dat.GUI()
  // gui.addColor(props, 'purple').onChange((v) => {
  //   containerB.material.color.set(v)
  //   cartMaterial.color.set(v)
  // })
  // gui
  //   .add(containerB.material, 'emissiveIntensity', 0, 1, 0.01)
  //   .onChange((v) => {
  //     cartMaterial.emissiveIntensity = v
  //   })
  // gui.add(ground.material.normalMap.repeat, "x", 1, 100, 1);
  // gui.add(ground.material.normalMap.repeat, "y", 1, 100, 1);
  // gui.add(directionalLight.position, "y", -100, 100, 1).onChange(() => {
  //   helper.update();
  // });
  // gui.add(directionalLight.position, "z", -100, 100, 1).onChange(() => {
  //   helper.update();
  // });

  sceneObject = { scene, camera, onResize };
  return sceneObject;
};
