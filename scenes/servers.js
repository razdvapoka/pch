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

export const initServersScene = (serversModel, gui) => {
  const serverScene = new THREE.Scene();
  serverScene.background = new THREE.Color("#ffffff");
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.42);
  serverScene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(100, 100, 50);
  const helper = new THREE.DirectionalLightHelper(directionalLight, 10, "red");
  serverScene.add(helper);
  serverScene.add(ambientLight);
  serverScene.add(directionalLight);
  serversModel.position.y = -70;
  serverScene.add(serversModel);
  gui.add(ambientLight, "intensity", 0, 1, 0.001).name("ambient light int");
  gui.add(directionalLight, "intensity", 0, 1, 0.001).name("direct light int");
  gui.add(directionalLight.position, "x", -200, 200, 1).onChange(() => {
    helper.update();
  });
  gui.add(directionalLight.position, "y", -200, 200, 1).onChange(() => {
    helper.update();
  });
  gui.add(directionalLight.position, "z", -200, 200, 1).onChange(() => {
    helper.update();
  });
  serversModel.traverse((obj) => {
    if (obj.type === "Mesh") {
      obj.material.emissive = obj.material.color.clone();
      obj.material.emissiveIntensity =
        obj.material.name === "Plain Violet" ? 0.2 : 0.45;
      const params = {
        color: obj.material.color.getHex(),
        emissive: obj.material.emissive.getHex(),
      };
      gui
        .addColor(params, "color")
        .onChange(() => obj.material.color.set(params.color));
      gui
        .addColor(params, "emissive")
        .onChange(() => obj.material.emissive.set(params.emissive));
      gui.add(obj.material, "emissiveIntensity", 0, 1, 0.001);
    }
  });

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
