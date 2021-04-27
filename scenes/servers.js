import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import serversModel from "../assets/models/servers-draco.gltf";

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/draco/");
const loader = new GLTFLoader();
loader.setDRACOLoader(dracoLoader);

const loadModel = () => {
  loader.load(serversModel, (gltf) => {
    console.log(gltf);
  });
};

const initScene = (gltf) => {
  const serverScene = new THREE.Scene();
  scene.background = new THREE.Color("#ffffff");
};
