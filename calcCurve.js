import * as THREE from "three";
import { geoDistance, geoInterpolate } from "d3-geo";

function polar2Cartesian(lat, lng, relAltitude = 0) {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((90 - lng) * Math.PI) / 180;
  const r = 100 * (1 + relAltitude);
  return {
    x: r * Math.sin(phi) * Math.cos(theta),
    y: r * Math.cos(phi),
    z: r * Math.sin(phi) * Math.sin(theta),
  };
}

export function calcCurve({
  alt,
  altAutoScale,
  startLat,
  startLng,
  endLat,
  endLng,
}) {
  const getVec = ([lng, lat, alt]) => {
    const { x, y, z } = polar2Cartesian(lat, lng, alt);
    return new THREE.Vector3(x, y, z);
  };

  //calculate curve
  const startPnt = [startLng, startLat];
  const endPnt = [endLng, endLat];

  let altitude = alt;
  (altitude === null || altitude === undefined) &&
    // by default set altitude proportional to the great-arc distance
    (altitude = (geoDistance(startPnt, endPnt) / 2) * altAutoScale);

  if (altitude) {
    const interpolate = geoInterpolate(startPnt, endPnt);
    const [m1Pnt, m2Pnt] = [0.25, 0.75].map((t) => [
      ...interpolate(t),
      altitude * 1.5,
    ]);
    const curve = new THREE.CubicBezierCurve3(
      ...[startPnt, m1Pnt, m2Pnt, endPnt].map(getVec)
    );

    //const mPnt = [...interpolate(0.5), altitude * 2];
    //curve = new THREE.QuadraticBezierCurve3(...[startPnt, mPnt, endPnt].map(getVec));

    return curve;
  } else {
    // ground line
    const alt = 0.001; // slightly above the ground to prevent occlusion
    return calcSphereArc(
      ...[
        [...startPnt, alt],
        [...endPnt, alt],
      ].map(getVec)
    );
  }

  //

  function calcSphereArc(startVec, endVec) {
    const angle = startVec.angleTo(endVec);
    const getGreatCirclePoint = (t) =>
      new THREE.Vector3()
        .addVectors(
          startVec.clone().multiplyScalar(Math.sin((1 - t) * angle)),
          endVec.clone().multiplyScalar(Math.sin(t * angle))
        )
        .divideScalar(Math.sin(angle));

    const sphereArc = new THREE.Curve();
    sphereArc.getPoint = getGreatCirclePoint;

    return sphereArc;
  }
}
