import { geoDistance } from "d3-geo";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import anime from "animejs/lib/anime.es.js";
import * as THREE from "three";
import ThreeGlobe from "three-globe";
import globeImage from "../../assets/images/earth-gray.png";
import { calcCurve } from "./calcCurve";
import { wait, setObjectPositionOnSphere, polar2Cartesian } from "../../utils";

import {
  airport,
  tallBuildingsGroup,
  lowBuildingsGroup,
  singleTallBuilding,
} from "./buildings";

import {
  pointsGeometry,
  pointsMaterial,
  launchCurveAnimationLoop,
  getArcAnimationHandle,
  setMaxPointTimeout,
  resetCurveAnimations,
} from "./arcs";

import {
  quarterArcsData,
  restArcsData,
  pathsData,
  customData,
  pyramids,
  shenzhenLabel,
  shenzhenAirport,
  fulfillment,
  fulfillmentLabel,
  fulfillmentPaths,
} from "./data";

import {
  INTRO_CAM_THETA,
  INTRO_CAM_PHI,
  INTRO_CAM_R,
  CHINA_CAM_THETA,
  CHINA_CAM_PHI,
  USA_CAM_THETA,
  USA_CAM_PHI,
  USA_STATE,
  CHINA_STATE,
  EUROPE_STATE,
  INTRO_STATE,
  CANONIC_GLOBE_RADIUS,
  ROTATION_DURATION,
  CAM_R,
  DEFAULT_POINT_TIMEOUT,
  CENTER,
  EUROPE_CAM_THETA,
  EUROPE_CAM_PHI,
  MANUFACTURERS_CAM_PHI,
  MANUFACTURERS_CAM_THETA,
  POSTPONEMENT_CAM_PHI,
  POSTPONEMENT_CAM_THETA,
  FULFILLMENT_CAM_PHI,
  FULFILLMENT_CAM_THETA,
  DELIVERY_CAM_PHI,
  DELIVERY_CAM_THETA,
  ZOOMED_CAM_R,
  LIGHT_1_INTRO_THETA,
  LIGHT_1_INTRO_PHI,
  LIGHT_1_CHINA_THETA,
  LIGHT_1_CHINA_PHI,
  LIGHT_1_CHINA_R,
  LIGHT_2_INTRO_THETA,
  LIGHT_2_INTRO_PHI,
} from "../../consts";

import { leftButton, rightButton } from "../../ui";

const mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();

const onMouseMove = (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
};

const onClick = () => {
  // const r = light2.position.distanceTo(CENTER);
  // const phi = Math.acos(light2.position.y / r);
  // const theta = Math.atan2(light2.position.x, light2.position.z);
  // console.log(theta, phi, r);
  // raycaster.setFromCamera(mouse, camera);
  // const intersects = raycaster.intersectObjects(scene.children, true);
  // if (intersects.length > 0) {
  //   const c = globe.toGeoCoords(intersects[0].point);
  //   console.log(c);
  // }
};

// State

const labels = {};
const explosions = {};
const pyramidAnimationHandles = {};
let isGlobeReady = false;
let htmlElementsHidden = true;
export const setHtmlElementsHidden = (hidden) => (htmlElementsHidden = hidden);
let currentGlobeState = INTRO_STATE;

let pyramidModel;
export const setPyramidModel = (model) => {
  pyramidModel = model;
  pyramidModel.scale.set(5, 5, 5);
  pyramidModel.geometry.rotateX(-Math.PI / 2);
  fulfillmentLabel.isHidden = true;
  globe.customLayerData([
    ...customData,
    ...pyramids,
    fulfillmentLabel,
    shenzhenAirport,
    shenzhenLabel,
  ]);
};

const setCurrentGlobeState = (s) => {
  currentGlobeState = s;
};

const FOV = 60;
let pointsMesh = null;
let scene = null;
let camera = null;
let tick = null;
let onResize = null;
let globe = null;
let globeMesh = null;
let light1 = null;
let light2 = null;
let cloudSphere = null;
let material = null;
let intro2ChinaLight1Rotator;
let intro2ChinaRotator;
let china2USARotator;
let china2EuropeRotator;
let USA2ChinaRotator;
let USA2ManufacturingRotator;
let europe2ManufacturingRotator;
let manufacturing2PostponementRotator;
let postponementToFulfillmentRotator;
let fulfillmentToDeliveryRotator;
let deliveryToFulfillmentRotator;
let USA2EuropeRotator;
let europe2ChinaRotator;
let europe2USARotator;
let zoomRotator;
let zoomOutRotator;

const createLabel = (objData) => {
  const element = document.createElement("div");
  element.id = objData.id;
  element.classList.add("label");
  const textElement = document.createElement("span");
  textElement.innerText = objData.label;
  element.appendChild(textElement);
  if (objData.subLabel) {
    const subTextElement = document.createElement("span");
    subTextElement.classList.add("sub-label");
    subTextElement.innerText = objData.subLabel;
    element.appendChild(subTextElement);
  }
  document.body.appendChild(element);
  return {
    position: new THREE.Vector3().copy(
      polar2Cartesian(objData.lat, objData.lng, 0.01, CANONIC_GLOBE_RADIUS)
    ),
    element,
    coords: {
      lat: objData.lat,
      lng: objData.lng,
    },
    data: objData,
  };
};

const createExplosion = (objData) => {
  const element = document.createElement("div");
  element.id = objData.id;
  element.classList.add("explosion-box");
  const explosion1 = document.createElement("div");
  explosion1.classList.add("explosion", "explosion-1");
  const explosion2 = document.createElement("div");
  explosion2.classList.add("explosion", "explosion-2");
  const explosion3 = document.createElement("div");
  explosion3.classList.add("explosion", "explosion-3");
  element.appendChild(explosion1);
  element.appendChild(explosion2);
  element.appendChild(explosion3);
  document.body.appendChild(element);
  return {
    position: new THREE.Vector3().copy(
      polar2Cartesian(objData.lat, objData.lng, 0.01, CANONIC_GLOBE_RADIUS)
    ),
    element,
    coords: {
      lat: objData.lat,
      lng: objData.lng,
    },
    data: objData,
  };
};

const handleArcObject = (arc) => {
  if (!getArcAnimationHandle(arc.id) && arc.hasMovingPoints) {
    const dist = geoDistance(
      [arc.startLng, arc.startLat],
      [arc.endLng, arc.endLat]
    );
    const curve = calcCurve(arc);
    launchCurveAnimationLoop(arc.id, curve.getPoints(1500), dist);
  }
};

const handleCustomObject = (objData) => {
  switch (objData.objType) {
    case "label": {
      if (!labels[objData.id]) {
        labels[objData.id] = createLabel(objData);
      }
      return;
    }
    case "explosion": {
      if (!explosions[objData.id]) {
        explosions[objData.id] = createExplosion(objData);
      }
      return;
    }
    case "a": {
      const a = airport.clone();
      if (objData.small) {
        a.scale.set(0.5, 0.5, 0.5);
      }
      return a;
    }
    case "tb":
      return tallBuildingsGroup.clone();
    case "pyramid":
      const pyramid = pyramidModel.clone();
      pyramid.visible = !!objData.isVisible;
      return pyramid;
    case "tb-single": {
      const building = singleTallBuilding.clone();
      anime({
        targets: building.children[0].scale,
        x: 3,
        y: 2,
        z: 3,
        easing: "easeInOutCubic",
        duration: 600,
      });
      return building;
    }
    case "lb":
      return lowBuildingsGroup.clone();
    case "arc": {
      handleArcObject(objData);
      if (!pointsMesh) {
        pointsMesh = new THREE.Points(pointsGeometry, pointsMaterial);
        globe.add(pointsMesh);
      }
      return;
    }
  }
};

const animateFulfillmentPyramid = (pyramid, pyramidObj) => {
  const curveToFulfillment = calcCurve({
    alt: 0,
    startLat: pyramid.lat,
    startLng: pyramid.lng,
    endLat: fulfillment.lat,
    endLng: fulfillment.lng,
  });
  const curvePoints = curveToFulfillment.getPoints(1500);
  const animated = { p: 0 };
  const animation = anime({
    targets: animated,
    duration: 1000,
    easing: "easeInOutCubic",
    p: 1,
    begin: () => {
      pyramidAnimationHandles[pyramid.id] = animation;
    },
    update: () => {
      const i = Math.floor((curvePoints.length - 1) * animated.p);
      pyramidObj.position.copy(curvePoints[i]);
      pyramidObj.lookAt(new THREE.Vector3(0, 0, 0));
      const scaleFactor = 5 + 5 * animated.p;
      pyramidObj.scale.set(scaleFactor, scaleFactor, scaleFactor);
    },
    complete: () => {
      pyramid.isAnimated = false;
      delete pyramidAnimationHandles[pyramid.id];
    },
  });
};

const handleCustomObjectUpdate = (obj, d) => {
  Object.assign(obj.position, globe.getCoords(d.lat, d.lng, d.alt));
  obj.lookAt(new THREE.Vector3(0, 0, 0));
  if (obj.objType !== "a") {
    obj.rotation.z += Math.PI / 2;
  }
  switch (d.objType) {
    case "pyramid": {
      if (d.isAnimated && !pyramidAnimationHandles[d.id]) {
        animateFulfillmentPyramid(d, obj);
      }
      if (!d.isAnimated) {
        obj.scale.set(5, 5, 5);
      }
      obj.visible = d.isVisible;
      break;
    }
  }
};

const handleGlobeReady = () => {
  isGlobeReady = true;
  pointsMaterial.opacity = 1;
};

const createLight = (theta, phi, r = 200, needHelper = false) => {
  const light = new THREE.DirectionalLight(0xffffff, 0.5);
  setObjectPositionOnSphere(light, theta, phi, r);

  const lightTarget = new THREE.Object3D();
  setObjectPositionOnSphere(lightTarget, theta + Math.PI, phi + Math.PI, 1);

  light.target = lightTarget;

  scene.add(light, lightTarget);

  if (needHelper) {
    const helper = new THREE.DirectionalLightHelper(light);
    scene.add(helper);
    light.__helper = helper;
  }

  return light;
};

const launchIntro2ChinaAnimation = () => {
  const intro2ChinaLight1Animation = {
    targets: light1,
    intensity: 0.75,
  };
  const intro2ChinaLight2Animation = {
    targets: light2,
    intensity: 0.25,
  };
  const intro2ChinaGlobeMaterialAnimation = {
    targets: material,
    lightMapIntensity: 7,
  };
  const intro2ChinaCloudMaterialAnimation = {
    targets: cloudSphere.material,
    opacity: 0.2,
  };
  const timeline = anime.timeline({
    duration: ROTATION_DURATION,
    easing: "easeInOutCubic",
    autoplay: false,
    complete: () => {
      htmlElementsHidden = false;
    },
  });
  timeline.add(intro2ChinaLight1Animation);
  timeline.add(intro2ChinaLight2Animation, 0);
  timeline.add(intro2ChinaGlobeMaterialAnimation, 0);
  timeline.add(intro2ChinaCloudMaterialAnimation, 0);
  timeline.play();
};

const updateGlobeHTMLElements = (elements, sizes) => {
  Object.keys(elements).forEach((elementKey) => {
    const element = elements[elementKey];
    if (
      !htmlElementsHidden &&
      !element.data.isHidden &&
      (!element.data.state || element.data.state === currentGlobeState)
    ) {
      const screenPosition = element.position.clone();
      screenPosition.project(camera);
      raycaster.setFromCamera(screenPosition, camera);
      const intersects = raycaster.intersectObject(globeMesh);
      if (intersects.length === 0) {
        element.element.classList.add("visible");
      } else {
        const intersectionDistance = intersects[0].distance;
        const elementDistance = element.position.distanceTo(camera.position);
        if (intersectionDistance < elementDistance) {
          element.element.classList.remove("visible");
        } else {
          element.element.classList.add("visible");
        }
      }

      const translateX = screenPosition.x * sizes.width * 0.5;
      const translateY = -screenPosition.y * sizes.height * 0.5;
      element.element.style.transform = `translate(calc(${translateX}px - 50%), calc(${translateY}px - 50%))`;
    } else {
      element.element.classList.remove("visible");
    }
  });
};

const setEuropeText = (button) => {
  button.children[0].innerText = "Europe";
  button.children[1].innerHTML = "B2B, B2C<br/>hubs";
};

const setUSAText = (button) => {
  button.children[0].innerText = "USA";
  button.children[1].innerHTML = "B2B, B2C<br/>hubs";
};

const setChinaText = (button) => {
  button.children[0].innerText = "China";
  button.children[1].innerHTML = "Airport,<br/>facilities";
};

const updateGlobeNavButtons = (state) => {
  switch (state) {
    case CHINA_STATE: {
      setEuropeText(leftButton);
      setUSAText(rightButton);
      return;
    }
    case USA_STATE: {
      setChinaText(leftButton);
      setEuropeText(rightButton);
      return;
    }
    case EUROPE_STATE: {
      setUSAText(leftButton);
      setChinaText(rightButton);
      return;
    }
  }
};

const hideAndRevealNav = (cb) => {
  hideNavButtons();
  wait(ROTATION_DURATION + 100).then(() => {
    cb();
    showNavButtons();
  });
};

const handleRightButtonClick = () => {
  htmlElementsHidden = true;
  switch (currentGlobeState) {
    case CHINA_STATE: {
      china2USARotator();
      hideAndRevealNav(() => {
        updateGlobeNavButtons(USA_STATE);
        htmlElementsHidden = false;
      });
      setCurrentGlobeState(USA_STATE);
      return;
    }
    case USA_STATE: {
      USA2EuropeRotator();
      hideAndRevealNav(() => {
        updateGlobeNavButtons(EUROPE_STATE);
        htmlElementsHidden = false;
      });
      setCurrentGlobeState(EUROPE_STATE);
      return;
    }
    case EUROPE_STATE: {
      europe2ChinaRotator();
      hideAndRevealNav(() => {
        updateGlobeNavButtons(CHINA_STATE);
        setCurrentGlobeState(CHINA_STATE);
        htmlElementsHidden = false;
      });
      return;
    }
  }
};

const handleLeftButtonClick = () => {
  htmlElementsHidden = true;
  switch (currentGlobeState) {
    case CHINA_STATE: {
      china2EuropeRotator();
      hideAndRevealNav(() => {
        updateGlobeNavButtons(EUROPE_STATE);
        htmlElementsHidden = false;
      });
      setCurrentGlobeState(EUROPE_STATE);
      return;
    }
    case EUROPE_STATE: {
      europe2USARotator();
      hideAndRevealNav(() => {
        updateGlobeNavButtons(USA_STATE);
        htmlElementsHidden = false;
      });
      setCurrentGlobeState(USA_STATE);
      return;
    }
    case USA_STATE: {
      USA2ChinaRotator();
      hideAndRevealNav(() => {
        updateGlobeNavButtons(CHINA_STATE);
        setCurrentGlobeState(CHINA_STATE);
        htmlElementsHidden = false;
      });
      return;
    }
  }
};

const getBackToChinaRotator = () => {
  switch (currentGlobeState) {
    case USA_STATE:
      return USA2ChinaRotator;
    case EUROPE_STATE:
      return europe2ChinaRotator;
    case CHINA_STATE:
      return () => Promise.resolve();
  }
};

export const sceneToChinaRotator = () => {
  return getCameraRotator(CHINA_CAM_THETA, CHINA_CAM_PHI, CAM_R);
};

export const switchToTomorrow = () => {
  htmlElementsHidden = true;
  const rotator = getBackToChinaRotator();
  rotator().then(() => {
    setCurrentGlobeState(CHINA_STATE);
    htmlElementsHidden = false;
    Object.values(explosions).map((explosion) => {
      explosion.element.classList.add("active");
    });
    pyramids.forEach((p) => {
      p.isAnimated = true;
      p.isVisible = true;
    });
    // shenzhenLabel.isHidden = true;
    fulfillmentLabel.isHidden = false;
    customData.forEach((o) => {
      if (o.objType === "arc") {
        o.hasMovingPoints = true;
      }
    });
    globe
      .customLayerData([
        ...customData,
        ...pyramids,
        shenzhenAirport,
        shenzhenLabel,
        fulfillmentLabel,
      ])
      .arcsData([...quarterArcsData, ...restArcsData])
      .pathTransitionDuration(0)
      .pathsData(fulfillmentPaths);
    setMaxPointTimeout(DEFAULT_POINT_TIMEOUT / 5);
  });
};

export const switchToToday = () => {
  htmlElementsHidden = true;
  const rotator = getBackToChinaRotator();
  rotator().then(() => {
    setCurrentGlobeState(CHINA_STATE);
    htmlElementsHidden = false;
    shenzhenLabel.isHidden = false;
    fulfillmentLabel.isHidden = true;
    Object.values(explosions).map((explosion) => {
      explosion.element.classList.remove("active");
    });
    pyramids.forEach((p) => {
      p.isAnimated = false;
      p.isVisible = false;
    });
    restArcsData.forEach((arcData) => {
      const arc = customData.find((o) => o.id === arcData.id);
      arc.hasMovingPoints = false;
    });
    resetCurveAnimations();
    globe
      .pathsData(pathsData)
      .customLayerData([...customData, ...pyramids])
      .arcsData(quarterArcsData);
    setMaxPointTimeout(DEFAULT_POINT_TIMEOUT);
  });
};

export const showNavButtons = () => {
  leftButton.classList.remove("hidden");
  rightButton.classList.remove("hidden");
};

export const hideNavButtons = () => {
  leftButton.classList.add("hidden");
  rightButton.classList.add("hidden");
};

export const launchGlobeScene = () => {
  intro2ChinaRotator();
  intro2ChinaLight1Rotator();
  launchIntro2ChinaAnimation();
  return wait(600).then(() => {
    setCurrentGlobeState(CHINA_STATE);
    updateGlobeNavButtons(CHINA_STATE);
    showNavButtons();
  });
};

export const globeToB2B = () => {
  hideNavButtons();
  return china2USARotator()
    .then(() => zoomRotator())
    .then(() => wait(100));
};

export const globeToD2C = () => {
  hideNavButtons();
  return china2EuropeRotator()
    .then(() => zoomRotator())
    .then(() => wait(100));
};

const getObjectSphereProps = (object) => {
  const r = object.position.distanceTo(CENTER);
  const phi = Math.acos(object.position.y / r);
  const theta = Math.atan2(object.position.x, object.position.z);
  return {
    r,
    phi,
    theta,
  };
};

export const getObjectRotator = (
  theta,
  phi,
  r,
  object,
  right,
  duration = ROTATION_DURATION
) => () =>
  new Promise((resolve) => {
    const {
      r: currentR,
      phi: currentPhi,
      theta: currentTheta,
    } = getObjectSphereProps(object);

    const newR = r === null ? currentR : r;
    const newTheta = theta === null ? currentTheta : theta;
    const newPhi = phi === null ? currentPhi : phi;

    const animated = {
      alpha: 0,
    };

    const targetTheta = right
      ? newTheta > currentTheta
        ? newTheta
        : newTheta + Math.PI * 2
      : newTheta > currentTheta
      ? newTheta - Math.PI * 2
      : newTheta;

    anime({
      duration,
      targets: animated,
      alpha: 1,
      easing: "cubicBezier(.08,.98,.8,.98)",
      update: () => {
        const { alpha } = animated;
        const t = currentTheta + alpha * (targetTheta - currentTheta);
        const p = currentPhi + alpha * (newPhi - currentPhi);
        const rr = currentR + alpha * (newR - currentR);
        setObjectPositionOnSphere(object, t, p, rr);
      },
      complete: () => {
        resolve();
      },
    });
  });

const getCameraRotator = (theta, phi, r, right, duration = ROTATION_DURATION) =>
  getObjectRotator(theta, phi, r, camera, right, duration);

const initRotators = () => {
  intro2ChinaLight1Rotator = getObjectRotator(
    LIGHT_1_CHINA_THETA,
    LIGHT_1_CHINA_PHI,
    LIGHT_1_CHINA_R,
    light1,
    true
  );

  intro2ChinaRotator = getCameraRotator(
    CHINA_CAM_THETA,
    CHINA_CAM_PHI,
    CAM_R,
    true
  );

  china2USARotator = getCameraRotator(USA_CAM_THETA, USA_CAM_PHI, CAM_R, true);

  china2EuropeRotator = getCameraRotator(
    EUROPE_CAM_THETA,
    EUROPE_CAM_PHI,
    CAM_R
  );

  USA2ChinaRotator = getCameraRotator(CHINA_CAM_THETA, CHINA_CAM_PHI, CAM_R);

  USA2ManufacturingRotator = getCameraRotator(
    MANUFACTURERS_CAM_THETA,
    MANUFACTURERS_CAM_PHI,
    CAM_R
  );
  europe2ManufacturingRotator = getCameraRotator(
    MANUFACTURERS_CAM_THETA,
    MANUFACTURERS_CAM_PHI,
    CAM_R,
    true
  );
  manufacturing2PostponementRotator = getCameraRotator(
    POSTPONEMENT_CAM_THETA,
    POSTPONEMENT_CAM_PHI,
    CAM_R,
    true
  );
  postponementToFulfillmentRotator = getCameraRotator(
    FULFILLMENT_CAM_THETA,
    FULFILLMENT_CAM_PHI,
    CAM_R,
    true
  );
  fulfillmentToDeliveryRotator = getCameraRotator(
    DELIVERY_CAM_THETA,
    DELIVERY_CAM_PHI,
    CAM_R,
    true,
    1500
  );
  deliveryToFulfillmentRotator = getCameraRotator(
    FULFILLMENT_CAM_THETA,
    FULFILLMENT_CAM_PHI,
    CAM_R,
    false,
    1500
  );
  USA2EuropeRotator = getCameraRotator(
    EUROPE_CAM_THETA,
    EUROPE_CAM_PHI,
    CAM_R,
    true
  );
  europe2ChinaRotator = getCameraRotator(
    CHINA_CAM_THETA,
    CHINA_CAM_PHI,
    CAM_R,
    true
  );
  europe2USARotator = getCameraRotator(USA_CAM_THETA, USA_CAM_PHI, CAM_R);
  zoomRotator = getCameraRotator(null, null, ZOOMED_CAM_R);
  zoomOutRotator = getCameraRotator(null, null, CAM_R);
};

export const transitionD2CToManufacturing = () => {
  setObjectPositionOnSphere(
    camera,
    EUROPE_CAM_THETA,
    EUROPE_CAM_PHI,
    ZOOMED_CAM_R
  );
  return zoomOutRotator()
    .then(() => europe2ManufacturingRotator())
    .then(() => {
      htmlElementsHidden = true;
      zoomRotator();
    });
};

export const transitionB2BToManufacturing = () => {
  setObjectPositionOnSphere(camera, USA_CAM_THETA, USA_CAM_PHI, ZOOMED_CAM_R);
  return zoomOutRotator()
    .then(() => USA2ManufacturingRotator())
    .then(() => {
      htmlElementsHidden = true;
      zoomRotator();
    });
};

export const transitionToPostponement = () => {
  setObjectPositionOnSphere(
    camera,
    MANUFACTURERS_CAM_THETA,
    MANUFACTURERS_CAM_PHI,
    ZOOMED_CAM_R
  );
  return zoomOutRotator()
    .then(() => {
      htmlElementsHidden = false;
      return manufacturing2PostponementRotator();
    })
    .then(() => {
      htmlElementsHidden = true;
      zoomRotator();
    });
};

export const transitionToFulfillment = () => {
  setObjectPositionOnSphere(
    camera,
    POSTPONEMENT_CAM_THETA,
    POSTPONEMENT_CAM_PHI,
    ZOOMED_CAM_R
  );
  return zoomOutRotator()
    .then(() => {
      htmlElementsHidden = false;
      return postponementToFulfillmentRotator();
    })
    .then(() => {
      htmlElementsHidden = true;
      zoomRotator();
    });
};

export const transitionToDelivery = () => {
  setObjectPositionOnSphere(
    camera,
    FULFILLMENT_CAM_THETA,
    FULFILLMENT_CAM_PHI,
    ZOOMED_CAM_R
  );
  return zoomOutRotator()
    .then(() => {
      htmlElementsHidden = false;
      return fulfillmentToDeliveryRotator();
    })
    .then(() => {
      htmlElementsHidden = true;
      zoomRotator();
    });
};

export const transitionFromDeliveryToFulfillment = () => {
  setObjectPositionOnSphere(
    camera,
    DELIVERY_CAM_THETA,
    DELIVERY_CAM_PHI,
    ZOOMED_CAM_R
  );
  return zoomOutRotator().then(() => {
    htmlElementsHidden = false;
    return deliveryToFulfillmentRotator();
  });
};

export const getGlobeSceneObject = () => {
  return {
    scene,
    camera,
    tick,
    onResize,
  };
};

export const initGlobeSceneObject = ({ lightMap, cloudsMap, sizes }) => {
  scene = new THREE.Scene();
  scene.background = new THREE.Color("#000000");

  // Globe
  globe = new ThreeGlobe({ animateIn: false, atmosphereColor: "white" })
    .rendererSize(new THREE.Vector2(sizes.width, sizes.height))
    .globeImageUrl(globeImage)
    .atmosphereColor("white")
    .atmosphereAltitude(0.1)
    .customLayerData(customData)
    .customThreeObject(handleCustomObject)
    .customThreeObjectUpdate(handleCustomObjectUpdate)
    .arcsData(quarterArcsData)
    .arcColor("color")
    .arcAltitudeAutoScale((arc) => arc.altAutoScale)
    .pathsData(pathsData)
    .pathPointAlt(0.01)
    .pathColor(() => "rgb(90, 100, 250)")
    .onGlobeReady(() => {
      handleGlobeReady();
    });

  // Globe mesh
  globeMesh = globe.children[0].children[0].children[0];
  const uv = globeMesh.geometry.getAttribute("uv").array;
  globeMesh.geometry.setAttribute("uv2", new THREE.BufferAttribute(uv, 2));

  // Globe material
  material = globe.globeMaterial();
  material.color = new THREE.Color("#2750CC");
  material.lightMap = lightMap;
  material.lightMapIntensity = 15;

  scene.add(globe);

  cloudSphere = new THREE.Mesh(
    new THREE.SphereBufferGeometry(101, 64, 64),
    new THREE.MeshStandardMaterial({
      color: "white",
      alphaMap: cloudsMap,
      transparent: true,
      opacity: 0,
    })
  );
  globe.add(cloudSphere);

  const aspect = sizes.width / sizes.height;

  camera = new THREE.PerspectiveCamera(FOV / aspect, aspect, 0.1, 2500);
  setObjectPositionOnSphere(
    camera,
    INTRO_CAM_THETA,
    INTRO_CAM_PHI,
    INTRO_CAM_R
  );

  light1 = createLight(LIGHT_1_INTRO_THETA, LIGHT_1_INTRO_PHI, 200);
  light2 = createLight(LIGHT_2_INTRO_THETA, LIGHT_2_INTRO_PHI, 200);
  light1.intensity = 2;
  light2.intensity = 0;

  scene.lights = { light1, light2 };

  initRotators();

  rightButton.addEventListener("click", handleRightButtonClick);
  leftButton.addEventListener("click", handleLeftButtonClick);

  tick = (elapsedTime, sizes) => {
    if (isGlobeReady) {
      updateGlobeHTMLElements(labels, sizes);
      updateGlobeHTMLElements(explosions, sizes);
      if (cloudSphere.material.opacity === 0) {
        cloudSphere.material.opacity = 0.5;
      }
    }

    cloudSphere.rotation.y = elapsedTime / 100;
  };

  camera.updateProjectionMatrix();

  // const controls = new OrbitControls(camera, canvas);
  // controls.update();

  onResize = (sizes) => {
    const aspect = sizes.width / sizes.height;
    camera.aspect = aspect;
    camera.fov = FOV / aspect;
    camera.updateProjectionMatrix();
    // controls.update();
  };

  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("click", onClick);

  return { scene, camera, tick, onResize };
};

export const resetGlobeScene = () => {
  setObjectPositionOnSphere(
    camera,
    INTRO_CAM_THETA,
    INTRO_CAM_PHI,
    INTRO_CAM_R
  );

  setObjectPositionOnSphere(
    scene.lights.light1,
    LIGHT_1_INTRO_THETA,
    LIGHT_1_INTRO_PHI,
    200
  );
  setObjectPositionOnSphere(
    scene.lights.light2,
    LIGHT_2_INTRO_THETA,
    LIGHT_2_INTRO_PHI,
    200
  );
  setObjectPositionOnSphere(
    scene.lights.light1.target,
    LIGHT_1_INTRO_THETA + Math.PI,
    LIGHT_1_INTRO_PHI + Math.PI,
    1
  );
  setObjectPositionOnSphere(
    scene.lights.light2.target,
    LIGHT_2_INTRO_THETA + Math.PI,
    LIGHT_2_INTRO_PHI + Math.PI,
    1
  );
  scene.lights.light1.intensity = 2;
  scene.lights.light2.intensity = 0;

  Object.values(explosions).map((explosion) => {
    explosion.element.classList.remove("active");
  });
  pyramids.forEach((p) => {
    p.isAnimated = false;
    p.isVisible = false;
  });
  restArcsData.forEach((arcData) => {
    const arc = customData.find((o) => o.id === arcData.id);
    arc.hasMovingPoints = false;
  });
  resetCurveAnimations();
  setMaxPointTimeout(DEFAULT_POINT_TIMEOUT);

  globe
    .customLayerData([
      ...customData,
      ...pyramids,
      fulfillmentLabel,
      shenzhenAirport,
      shenzhenLabel,
    ])
    .arcsData(quarterArcsData)
    .pathsData(pathsData);

  fulfillmentLabel.isHidden = true;
  shenzhenLabel.isHidden = false;

  currentGlobeState = INTRO_STATE;
};
