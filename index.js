import { geoDistance } from "d3-geo";
import anime from "animejs/lib/anime.es.js";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
import ThreeGlobe from "three-globe";
import globeImage from "./assets/images/earth-topology.png";
import lightMapTexture from "./assets/images/earth-lights.png";
import cloudsTexture from "./assets/images/tex-clouds-inverted.jpg";
import { calcCurve } from "./calcCurve";
import { airport, tallBuildingsGroup, lowBuildingsGroup } from "./buildings";
import {
  pointsGeometry,
  pointsMaterial,
  launchCurveAnimationLoop,
  getArcAnimationHandle,
} from "./arcs";
import { arcsData, pathsData, customData } from "./data";

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

const textureLoader = new THREE.TextureLoader();
const lightMap = textureLoader.load(lightMapTexture);
const cloudsMap = textureLoader.load(cloudsTexture);

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

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

let pointsMesh = null;

// Canvas
const canvas = document.querySelector("#canvas");

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color("#000000");

// Globe
const globe = new ThreeGlobe({ animateIn: false, atmosphereColor: "white" })
  .globeImageUrl(globeImage)
  .atmosphereColor("white")
  .atmosphereAltitude(0.1)
  .customLayerData(customData)
  .customThreeObject((objData) => {
    switch (objData.objType) {
      case "a":
        return airport.clone();
      case "tb":
        return tallBuildingsGroup.clone();
      case "lb":
        return lowBuildingsGroup.clone();
      case "arc": {
        if (!getArcAnimationHandle(objData.id)) {
          const dist = geoDistance(
            [objData.startLng, objData.startLat],
            [objData.endLng, objData.endLat]
          );
          const curve = calcCurve(objData);
          launchCurveAnimationLoop(objData.id, curve.getPoints(400), dist);
        }
        if (!pointsMesh) {
          pointsMesh = new THREE.Points(pointsGeometry, pointsMaterial);
          globe.add(pointsMesh);
        }
      }
    }
  })
  .customThreeObjectUpdate((obj, d) => {
    Object.assign(obj.position, globe.getCoords(d.lat, d.lng, d.alt));
    obj.lookAt(new THREE.Vector3(0, 0, 0));
    if (d.objType !== "a") {
      obj.rotation.z += Math.PI / 2;
    }
  })
  .arcsData(arcsData)
  .arcColor("color")
  .arcAltitude(0.1)
  .pathsData(pathsData)
  .pathPointAlt(0.01)
  .pathColor(() => "magenta")
  .pathStroke(() => 2)
  .onGlobeReady(() => {
    console.log("globe ready");
    pointsMaterial.opacity = 1;
  });

// Globe mesh
const globeMesh = globe.children[0].children[0].children[0];
const uv = globeMesh.geometry.getAttribute("uv").array;
globeMesh.geometry.setAttribute("uv2", new THREE.BufferAttribute(uv, 2));

// Globe material
const material = globe.globeMaterial();
material.color = new THREE.Color("#2750CC");
material.lightMap = lightMap;
material.lightMapIntensity = 10;

scene.add(globe);

const cloudSphere = new THREE.Mesh(
  new THREE.SphereBufferGeometry(101, 32, 32),
  new THREE.MeshStandardMaterial({
    color: "white",
    alphaMap: cloudsMap,
    transparent: true,
    opacity: 0.35,
  })
);
cloudSphere.rotation.y = Math.PI;
globe.add(cloudSphere);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(ambientLight);

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

const onResize = () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // RESPONSIVENESS
  const scale = sizes.width / CANONIC_WIDTH;
  globe.scale.set(scale, scale, scale);
};

const onMouseMove = (event) => {
  // calculate mouse position in normalized device coordinates
  // (-1 to +1) for both components

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
};

const onClick = () => {
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children, true);
  if (intersects.length > 0) {
    const c = globe.toGeoCoords(intersects[0].point);
    console.log(c);
    /*
    const v = Math.random();
    const t = v < 0.33 ? "a" : v < 0.66 ? "tb" : "lb";
    data.push({ ...c, objType: t });
    globe.customLayerData(data);
    */
  }
};

window.addEventListener("resize", onResize);
window.addEventListener("mousemove", onMouseMove);
window.addEventListener("click", onClick);

/**
 * Camera
 */

const camera = new THREE.PerspectiveCamera(
  40,
  sizes.width / sizes.height,
  0.1,
  2500
);
camera.position.set(96.23753242231034, 23.11100485395969, 184.14769205410772);
camera.lookAt(new THREE.Vector3(0, 0, 0));
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.addEventListener("change", () => {
  console.log(camera.position);
  console.log(camera.rotation);
});
controls.update();

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
gui.add(parameters, "rotateClockwise");
gui.add(parameters, "rotateCounterClockwise");
gui.add(parameters, "overview");
gui.add(parameters, "china");

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
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  cloudSphere.rotation.y = elapsedTime / 100;

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
