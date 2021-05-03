import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import anime from "animejs/lib/anime.es.js";
import { wait } from "../../utils";

const WHITE = "#b7b7b7";
const PURPLE = "#5964fa";
const COLOR_TRANSITION_DURATION = 700;
const BLINK_DURATION = 600;

let camera;
let scene;
let model;
let purpleServer;
let bulb;

export const launchServerScene = () => {
  anime({
    duration: COLOR_TRANSITION_DURATION,
    targets: purpleServer.material,
    emissiveIntensity: 0.2,
    easing: "easeInOutSine",
    __color: PURPLE,
    update: () => {
      purpleServer.material.color.set(purpleServer.material.__color);
    },
  });
  return wait(COLOR_TRANSITION_DURATION).then(() => {
    anime({
      duration: BLINK_DURATION,
      targets: bulb,
      intensity: 5,
      direction: "alternate",
      loop: true,
      easing: "easeInOutSine",
    });
  });
};

export const initServersSceneObject = ({ serversModel, sizes, canvas }) => {
  model = serversModel;
  scene = new THREE.Scene();
  scene.background = new THREE.Color("#ffffff");
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.42);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(100, 100, 50);
  scene.add(ambientLight);
  scene.add(directionalLight);
  scene.add(serversModel);
  model.traverse((obj) => {
    if (obj.type === "Mesh") {
      obj.material.color = new THREE.Color(WHITE);
      obj.material.emissive = new THREE.Color(WHITE);
      obj.material.emissiveIntensity = 0.53;
      if (obj.material.name === "Plain Violet") {
        purpleServer = obj;
        purpleServer.material.__color = WHITE;
      }
    }
  });

  bulb = new THREE.PointLight("red", 0, 10);
  bulb.position.set(7.7, 77.6, 12);
  const bulbSphere = new THREE.Mesh(
    new THREE.SphereBufferGeometry(1, 32, 32),
    new THREE.MeshBasicMaterial({ color: "red" })
  );
  bulbSphere.position.set(7.7, 77.6, 9);
  scene.add(bulb);
  scene.add(bulbSphere);

  camera = new THREE.PerspectiveCamera(
    40,
    sizes.width / sizes.height,
    0.1,
    2500
  );
  camera.position.set(0, 70, 250);
  const cameraTarget = new THREE.Vector3(0, 70, 0);
  const controls = new OrbitControls(camera, canvas);
  controls.target = cameraTarget;
  camera.lookAt(cameraTarget);
  controls.update();

  const onResize = (sizes) => {
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    controls.update();
  };

  return { scene, camera, onResize };
};
