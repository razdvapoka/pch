import * as THREE from "three";
import { uid } from "uid";
import pointTexture from "../../assets/images/point-texture-2.png";
import anime from "animejs/lib/anime.es.js";

const POINT_VELOCITY = 0.8 / 5000;

const textureLoader = new THREE.TextureLoader();
const pointMap = textureLoader.load(pointTexture);

const pointsMaterial = new THREE.PointsMaterial({
  size: 10,
  sizeAttenuation: true,
  depthWrite: false,
  transparent: true,
  blending: THREE.AdditiveBlending,
  map: pointMap,
  color: "white",
  opacity: 0,
});

let pointsGeometry = new THREE.BufferGeometry();

const visiblePoints = {};
const arcAnimationHandles = {};

const updatePointsGeometry = () => {
  const positions = new Float32Array(Object.keys(visiblePoints).length * 3);
  Object.values(visiblePoints).forEach(({ x, y, z }, i) => {
    const pi = i * 3;
    positions[pi] = x;
    positions[pi + 1] = y;
    positions[pi + 2] = z;
  });
  const positionsBuffer = new THREE.Float32BufferAttribute(positions, 3);
  pointsGeometry.setAttribute("position", positionsBuffer);
};

const animateCurvePoint = (curvePoints, duration) => {
  const id = uid();
  const animatedPoint = {};
  anime({
    duration,
    easing: "linear",
    targets: animatedPoint,
    update: ({ progress }) => {
      if (progress > 2 && progress < 98) {
        const i = Math.floor((curvePoints.length - 1) * (progress / 100));
        visiblePoints[id] = curvePoints[i];
        updatePointsGeometry();
      } else {
        delete visiblePoints[id];
      }
    },
  });
};

const launchCurveAnimationLoop = (id, curvePoints, dist) => {
  const maxTimeout = 2000;
  const duration = dist / POINT_VELOCITY;
  arcAnimationHandles[id] = setTimeout(() => {
    animateCurvePoint(curvePoints, duration);
    launchCurveAnimationLoop(id, curvePoints, dist);
  }, Math.random() * maxTimeout);
};

const getArcAnimationHandle = (id) => arcAnimationHandles[id];

export {
  pointsGeometry,
  pointsMaterial,
  launchCurveAnimationLoop,
  getArcAnimationHandle,
};
