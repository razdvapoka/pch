// import largeAirportsData from "./airports_formatted_slice.json";
// import tallBuildingsData from "./tb_formatted_slice.json";
// import lowBuildingsData from "./lb_formatted_slice.json";
import anime from "animejs/lib/anime.es.js";
import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as dat from "dat.gui";
import ThreeGlobe from "three-globe";
import globeImage from "./assets/images/wrld-13-bw-gray.png";
// import bumpImage from "./assets/images/earth-topology.png";
import lightMapTexture from "./assets/images/tex-lights-bw.png";
import cloudsTexture from "./assets/images/tex-clouds-inverted.jpg";
// import cloudsModel from "./assets/models/clouds.gltf";
// import { diff } from "deep-diff";

const textureLoader = new THREE.TextureLoader();
const lightMap = textureLoader.load(lightMapTexture);
const cloudsMap = textureLoader.load(cloudsTexture);
// const map = textureLoader.load(globeImage);

const createBoxWithRoundedEdges = (
  width,
  height,
  depth,
  radius0,
  smoothness
) => {
  let shape = new THREE.Shape();
  let eps = 0.00001;
  let radius = radius0 - eps;
  shape.absarc(eps, eps, eps, -Math.PI / 2, -Math.PI, true);
  shape.absarc(eps, height - radius * 2, eps, Math.PI, Math.PI / 2, true);
  shape.absarc(
    width - radius * 2,
    height - radius * 2,
    eps,
    Math.PI / 2,
    0,
    true
  );
  shape.absarc(width - radius * 2, eps, eps, 0, -Math.PI / 2, true);
  let geometry = new THREE.ExtrudeBufferGeometry(shape, {
    depth: depth - radius0 * 2,
    bevelEnabled: true,
    bevelSegments: smoothness * 2,
    steps: 1,
    bevelSize: radius,
    bevelThickness: radius0,
    curveSegments: smoothness,
  });

  geometry.center();

  return geometry;
};

const buildingMaterial = new THREE.MeshStandardMaterial({
  name: "Building Material",
  side: THREE.DoubleSide,
  color: new THREE.Color(
    0.3529411764705882,
    0.39215686274509803,
    0.9803921568627451
  ),
  roughness: 0.5,
  emissive: new THREE.Color(0.1, 0, 0.4),
});

const tallBuildingGeometry = createBoxWithRoundedEdges(
  0.974,
  5.437,
  0.974,
  0.1,
  15
);
tallBuildingGeometry.translate(0, -3.5, 0);

const lowBuildingGeometry = createBoxWithRoundedEdges(
  1.558,
  2.718,
  1.558,
  0.1,
  15
);
lowBuildingGeometry.translate(0, -2, 0);

const airportGeometry = new THREE.TorusBufferGeometry(0.8, 0.6, 32, 32);
airportGeometry.translate(0, 0, -1);

const tallBuilding = new THREE.Mesh(tallBuildingGeometry, buildingMaterial);
const lowBuilding = new THREE.Mesh(lowBuildingGeometry, buildingMaterial);
const airport = new THREE.Mesh(airportGeometry, buildingMaterial);

const TB_GAP = 0.9;
const tallBuildingsGroup = new THREE.Group();
const tallBuildings = new THREE.Group();
const b1 = tallBuilding.clone();
b1.position.x = -TB_GAP;
b1.position.z = -TB_GAP;
const b2 = tallBuilding.clone();
b2.position.x = TB_GAP;
b2.position.z = TB_GAP;
const b3 = tallBuilding.clone();
b3.position.x = -TB_GAP;
b3.position.z = TB_GAP;
const b4 = tallBuilding.clone();
b4.position.x = TB_GAP;
b4.position.z = -TB_GAP;
tallBuildings.add(b1, b2, b3, b4);
tallBuildings.rotateX(Math.PI / 2);
tallBuildingsGroup.add(tallBuildings);

const LB_GAP = 1.3;
const lowBuildingsGroup = new THREE.Group();
const lowBuildings = new THREE.Group();
const lb1 = lowBuilding.clone();
lb1.position.x = -LB_GAP;
lb1.position.z = -LB_GAP;
const lb2 = lowBuilding.clone();
lb2.position.x = LB_GAP;
lb2.position.z = LB_GAP;
lowBuildings.add(lb1, lb2);
lowBuildings.rotateX(Math.PI / 2);
lowBuildingsGroup.add(lowBuildings);

const CANONIC_WIDTH = 1440;

const OVERIVIEW_CAMERA_PROPS = {
  positionX: -177,
  positionY: 208,
  positionZ: 448,
  rotationX: THREE.MathUtils.degToRad(-25.411),
  rotationY: THREE.MathUtils.degToRad(-25.204),
};

const CHINA_CAMERA_PROPS = {
  positionX: 115,
  positionY: 139,
  positionZ: 267,
  rotationX: THREE.MathUtils.degToRad(-23.115),
  rotationY: THREE.MathUtils.degToRad(25.265),
};

const getCameraProps = (c) => ({
  positionX: c.position.x,
  positionY: c.position.y,
  positionZ: c.position.z,
  rotationX: c.rotation.x,
  rotationY: c.rotation.y,
});

const getCameraPropsUpdater = (cam, props, lights, otherLights) => (a) => {
  cam.position.set(props.positionX, props.positionY, props.positionZ);
  cam.rotation.x = props.rotationX;
  cam.rotation.y = props.rotationY;
  lights.forEach((l) => {
    l.intensity = (a.progress / 100) * 0.5;
  });
  otherLights.forEach((l) => {
    l.intensity = (1 - a.progress / 100) * 0.5;
  });
};

// GUI
const parameters = {
  pointColor: "#ff00ff",
  pointAltitude: 0.01,
  pointRadius: 0.25,
  rotateClockwise: () => {
    anime({
      duration: 1000,
      targets: globe.rotation,
      y: globe.rotation.y - Math.PI * 0.5,
      easing: "easeInOutCubic",
    });
  },
  rotateCounterClockwise: () => {
    anime({
      duration: 1000,
      targets: globe.rotation,
      y: globe.rotation.y + Math.PI * 0.5,
      easing: "easeInOutCubic",
    });
  },
  overview: () => {
    const cameraProps = getCameraProps(camera);
    anime({
      duration: 1000,
      targets: cameraProps,
      easing: "easeInOutCubic",
      ...OVERIVIEW_CAMERA_PROPS,
      update: getCameraPropsUpdater(
        camera,
        cameraProps,
        [primaryOverviewLight, secondaryOverviewLight],
        [primaryChinaLight, secondaryChinaLight]
      ),
    });
  },
  china: () => {
    const cameraProps = getCameraProps(camera);
    anime({
      duration: 1000,
      targets: cameraProps,
      easing: "easeInOutCubic",
      ...CHINA_CAMERA_PROPS,
      update: getCameraPropsUpdater(
        camera,
        cameraProps,
        [primaryChinaLight, secondaryChinaLight],
        [primaryOverviewLight, secondaryOverviewLight]
      ),
    });
  },
};

// Canvas
const canvas = document.querySelector("#canvas");

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color("#000000");

// const axesHelper = new THREE.AxesHelper(2000);
// scene.add(axesHelper);

// scene.add(tallBuildings);
// lowBuildings.position.x = -5;
// scene.add(lowBuildings);
// airport.position.x = 5;
// scene.add(airport);

const data = [
  {
    //30.785335, 119.735688
    lat: 30.785335,
    lng: 119.735688,
    objType: "a",
  },
  {
    //30.785335, 119.735688
    lat: 33.3322783,
    lng: 114.749361,
    objType: "lb",
  },
  //35.419435, 108.172554
  {
    lat: 35.419435,
    lng: 108.172554,
    objType: "tb",
  },
];

// Test Globe
const globe = new ThreeGlobe({ animateIn: false, atmosphereColor: "white" })
  .globeImageUrl(globeImage)
  .atmosphereColor("white")
  .atmosphereAltitude(0.1)
  .customLayerData(data)
  // .customLayerData([
  //   ...largeAirportsData,
  //   ...tallBuildingsData,
  //   ...lowBuildingsData,
  // ])
  .customThreeObject((objData) => {
    console.log(objData);
    switch (objData.objType) {
      case "a":
        return airport.clone();
      case "tb":
        return tallBuildingsGroup.clone();
      case "lb":
        return lowBuildingsGroup.clone();
    }
  })
  .customThreeObjectUpdate((obj, d) => {
    Object.assign(obj.position, globe.getCoords(d.lat, d.lng, d.alt));
    obj.lookAt(new THREE.Vector3(0, 0, 0));
    if (d.objType !== "a") {
      obj.rotation.z += Math.PI / 2;
    }
  });
// .pointsData(airports)
// .pointsMerge(true)
// .pointAltitude(() => parameters.pointAltitude)
// .pointColor(() => parameters.pointColor)
// .pointRadius(() => parameters.pointRadius);

globe.rotation.y = -Math.PI * 0.5;

// Globe mesh
const globeMesh = globe.children[0].children[0].children[0];
const uv = globeMesh.geometry.getAttribute("uv").array;
globeMesh.geometry.setAttribute("uv2", new THREE.BufferAttribute(uv, 2));
// const globeMaterial = new THREE.MeshStandardMaterial({
//   roughness: 0.5,
//   metalness: 0.01,
//   map,
// });
// globeMesh.material = globeMaterial;

// Globe material
const material = globe.globeMaterial();
material.color = new THREE.Color("#2750CC");
material.lightMap = lightMap;
material.lightMapIntensity = 15;

scene.add(globe);

const cloudSphere = new THREE.Mesh(
  new THREE.SphereBufferGeometry(101, 32, 32),
  new THREE.MeshStandardMaterial({
    color: "white",
    // map: cloudsMap,
    alphaMap: cloudsMap,
    transparent: true,
    opacity: 0.35,
  })
);
cloudSphere.rotation.y = Math.PI;
scene.add(cloudSphere);

// Lights
// const ambientLight = new THREE.AmbientLight(0xffffff, 1);
// scene.add(ambientLight);

const createLight = (angleDeg, needHelper) => {
  const light = new THREE.DirectionalLight(0xffffff, 0.5);

  const lightPosition = new THREE.Vector3(0, 0, 200);
  lightPosition.applyAxisAngle(
    new THREE.Vector3(0, 1, 0),
    THREE.MathUtils.degToRad(angleDeg)
  );
  light.position.copy(lightPosition);

  const lightTarget = new THREE.Object3D();
  const lightTargetPosition = new THREE.Vector3(0, 0, 1);
  lightTargetPosition.applyAxisAngle(
    new THREE.Vector3(0, 1, 0),
    THREE.MathUtils.degToRad(angleDeg) + Math.PI
  );
  lightTarget.position.copy(lightTargetPosition);

  light.target = lightTarget;

  scene.add(light, lightTarget);

  if (needHelper) {
    const helper = new THREE.DirectionalLightHelper(light);
    scene.add(helper);
  }

  return light;
};

const primaryOverviewLight = createLight(-145.41);
const secondaryOverviewLight = createLight(131.874);
const primaryChinaLight = createLight(-54.663);
const secondaryChinaLight = createLight(-203.718);
primaryChinaLight.intensity = 0;
secondaryChinaLight.intensity = 0;

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scale = sizes.width / CANONIC_WIDTH;
  globe.scale.set(scale, scale, scale);
});

/**
 * Camera
 */

const camera = new THREE.PerspectiveCamera(
  40,
  sizes.width / sizes.height,
  0.1,
  2500
);
camera.position.set(
  OVERIVIEW_CAMERA_PROPS.positionX,
  OVERIVIEW_CAMERA_PROPS.positionY,
  OVERIVIEW_CAMERA_PROPS.positionZ
);
camera.rotation.x = OVERIVIEW_CAMERA_PROPS.rotationX;
camera.rotation.y = OVERIVIEW_CAMERA_PROPS.rotationY;
//
// camera.position.set(0, 0, 15);
scene.add(camera);

// Controls
// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;
// // controls.enableZoom = false;
// // controls.enabled = false;
// controls.update();

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
  outputEncoding: THREE.sRGBEncoding,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0xcecece);

// GUI

const gui = new dat.GUI({
  width: 350,
});
gui.addColor(parameters, "pointColor").onChange(() => {
  globe.pointColor(() => parameters.pointColor);
});
gui.add(parameters, "pointAltitude", 0, 0.03, 0.0001).onFinishChange(() => {
  globe.pointAltitude(() => parameters.pointAltitude);
});
gui.add(parameters, "pointRadius", 0, 1, 0.01).onFinishChange(() => {
  globe.pointRadius(() => parameters.pointRadius);
});
gui.add(parameters, "rotateClockwise");
gui.add(parameters, "rotateCounterClockwise");
gui.add(parameters, "overview");
gui.add(parameters, "china");
//gui.close();

const cameraFolder = gui.addFolder("camera");
cameraFolder.add(camera.position, "x", -500, 500, 1).listen();
cameraFolder.add(camera.position, "y", -500, 500, 1).listen();
cameraFolder.add(camera.position, "z", -500, 500, 1).listen();
cameraFolder
  .add(camera.rotation, "x", -Math.PI / 2, Math.PI / 2, 0.001)
  .listen();
cameraFolder
  .add(camera.rotation, "y", -Math.PI / 2, Math.PI / 2, 0.001)
  .listen();
cameraFolder
  .add(camera.rotation, "z", -Math.PI / 2, Math.PI / 2, 0.001)
  .listen();
cameraFolder.open();

const lightsFolder = gui.addFolder("lights");
lightsFolder
  .add(primaryOverviewLight, "intensity", 0, 1, 0.001)
  .name("overview primary")
  .listen();
lightsFolder
  .add(secondaryOverviewLight, "intensity", 0, 1, 0.001)
  .name("overview secondary")
  .listen();
lightsFolder
  .add(primaryChinaLight, "intensity", 0, 1, 0.001)
  .name("china primary")
  .listen();
lightsFolder
  .add(secondaryChinaLight, "intensity", 0, 1, 0.001)
  .name("china secondary")
  .listen();
lightsFolder.open();

gui
  .add(cloudSphere.rotation, "y", -Math.PI, Math.PI, 0.001)
  .name("cloud sphere rotation");
gui
  .add(cloudSphere.material, "opacity", 0, 1, 0.001)
  .name("cloud sphere opacity");

gui.close();

/**
 * Animate
 */
//const clock = new THREE.Clock();

const tick = () => {
  //const elapsedTime = clock.getElapsedTime();

  // Update controls
  // controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
