import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import serversModel from "../assets/models/servers-draco.gltf";
import anime from "animejs/lib/anime.es.js";

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/draco/");
const loader = new GLTFLoader();
loader.setDRACOLoader(dracoLoader);

export const loadServersModel = (cb) => {
  loader.load(serversModel, (gltf) => {
    cb(gltf);
  });
};

export const initServersScene = (serversModel) => {
  const serverScene = new THREE.Scene();
  serverScene.background = new THREE.Color("#ffffff");
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
  serverScene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  const directionalLightTarget = new THREE.Object3D();
  directionalLightTarget.position.set(0, 0, 0);
  directionalLight.target = directionalLightTarget;
  directionalLight.position.set(100, 100, 50);
  // const helper = new THREE.DirectionalLightHelper(directionalLight, 10, "red");
  serverScene.add(ambientLight);
  serverScene.add(directionalLight);
  serversModel.position.y = -70;
  serverScene.add(serversModel);

  const bulb = new THREE.PointLight("red", 5, 10);
  bulb.position.set(7.7, 7.6, 12);
  const bulbSphere = new THREE.Mesh(
    new THREE.SphereBufferGeometry(1, 32, 32),
    new THREE.MeshBasicMaterial({ color: "red" })
  );
  bulbSphere.position.set(7.7, 7.6, 9);
  serverScene.add(bulb);
  serverScene.add(bulbSphere);

  anime({
    targets: bulb,
    intensity: 0,
    direction: "alternate",
    loop: true,
    easing: "easeInOutSine",
  });

  return serverScene;
};

export const setServerSceneCamera = (camera) => {
  camera.position.set(0, 0, 250);
  camera.lookAt(new THREE.Vector3(0, 0, 0));
};
