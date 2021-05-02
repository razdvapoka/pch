import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import anime from "animejs/lib/anime.es.js";

let camera;
let scene;

export const initServersSceneObject = ({ serversModel, sizes, canvas }) => {
  scene = new THREE.Scene();
  scene.background = new THREE.Color("#ffffff");
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.42);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(100, 100, 50);
  // const helper = new THREE.DirectionalLightHelper(directionalLight, 10, "red");
  // scene.add(helper);
  scene.add(ambientLight);
  scene.add(directionalLight);
  scene.add(serversModel);
  // gui.add(ambientLight, "intensity", 0, 1, 0.001).name("ambient light int");
  // gui.add(directionalLight, "intensity", 0, 1, 0.001).name("direct light int");
  // gui.add(directionalLight.position, "x", -200, 200, 1).onChange(() => {
  //   helper.update();
  // });
  // gui.add(directionalLight.position, "y", -200, 200, 1).onChange(() => {
  //   helper.update();
  // });
  // gui.add(directionalLight.position, "z", -200, 200, 1).onChange(() => {
  //   helper.update();
  // });
  serversModel.traverse((obj) => {
    if (obj.type === "Mesh") {
      obj.material.emissive = obj.material.color.clone();
      obj.material.emissiveIntensity =
        obj.material.name === "Plain Violet" ? 0.2 : 0.53;
      // const params = {
      //   color: obj.material.color.getHex(),
      //   emissive: obj.material.emissive.getHex(),
      // };
      // gui
      //   .addColor(params, "color")
      //   .onChange(() => obj.material.color.set(params.color));
      // gui
      //   .addColor(params, "emissive")
      //   .onChange(() => obj.material.emissive.set(params.emissive));
      // gui.add(obj.material, "emissiveIntensity", 0, 1, 0.001);
    }
  });

  const bulb = new THREE.PointLight("red", 5, 10);
  bulb.position.set(7.7, 77.6, 12);
  const bulbSphere = new THREE.Mesh(
    new THREE.SphereBufferGeometry(1, 32, 32),
    new THREE.MeshBasicMaterial({ color: "red" })
  );
  bulbSphere.position.set(7.7, 77.6, 9);
  scene.add(bulb);
  scene.add(bulbSphere);

  anime({
    targets: bulb,
    intensity: 0,
    direction: "alternate",
    loop: true,
    easing: "easeInOutSine",
  });

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
