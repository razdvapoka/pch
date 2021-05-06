import * as THREE from "three";
import { CENTER, ROTATION_DURATION } from "./consts";
import anime from "animejs/lib/anime.es.js";

export const setObjectPositionOnSphere = (object, theta, phi, radius) => {
  object.position.z = radius * Math.sin(phi) * Math.cos(theta);
  object.position.x = radius * Math.sin(phi) * Math.sin(theta);
  object.position.y = radius * Math.cos(phi);
  object.lookAt(CENTER);
};

export const polar2Cartesian = (lat, lng, alt, rad) => {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((90 - lng) * Math.PI) / 180;
  const r = rad * (1 + alt);
  return {
    x: r * Math.sin(phi) * Math.cos(theta),
    y: r * Math.cos(phi),
    z: r * Math.sin(phi) * Math.sin(theta),
  };
};

export const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const d2r = THREE.Math.degToRad;

export const getObjectRotator = (
  theta,
  phi,
  r,
  object,
  props,
  duration = ROTATION_DURATION
) => () =>
  new Promise((resolve) => {
    const { theta: objTheta, phi: objPhi, r: objR } = props;
    const newObjTheta = objTheta + theta;
    const newObjPhi = objPhi + phi;
    const newObjR = objR + r;
    const animated = {
      alpha: 0,
    };
    anime({
      duration,
      targets: animated,
      alpha: 1,
      easing: "cubicBezier(.08,.98,.8,.98)",
      update: () => {
        const { alpha } = animated;
        const t = objTheta + alpha * (newObjTheta - objTheta);
        const p = objPhi + alpha * (newObjPhi - objPhi);
        const rr = objR + alpha * (newObjR - objR);
        setObjectPositionOnSphere(object, t, p, rr);
      },
      complete: () => {
        props.theta = newObjTheta;
        props.phi = newObjPhi;
        props.r = newObjR;
        resolve();
      },
    });
  });
