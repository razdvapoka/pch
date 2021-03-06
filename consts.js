import * as THREE from "three";

export const CANONIC_GLOBE_RADIUS = 100;
export const CENTER = new THREE.Vector3(0, 0, 0);
export const CAM_R = 260;
export const ZOOMED_CAM_R = 160;

export const INTRO_CAM_R = 750;
export const INTRO_CAM_THETA = 1.23;
export const INTRO_CAM_PHI = 1.35;

export const CHINA_CAM_THETA = 1.97;
export const CHINA_CAM_PHI = 1.21;

export const USA_CAM_THETA = -1.7;
export const USA_CAM_PHI = 0.96;

export const EUROPE_CAM_THETA = 0.396;
export const EUROPE_CAM_PHI = 0.838;

export const MANUFACTURERS_CAM_THETA = 1.73;
export const MANUFACTURERS_CAM_PHI = 1.033;

export const POSTPONEMENT_CAM_THETA = 1.912;
export const POSTPONEMENT_CAM_PHI = 1.003;

export const FULFILLMENT_CAM_THETA = 1.947;
export const FULFILLMENT_CAM_PHI = 1.102;

export const DELIVERY_CAM_THETA = -1.737;
export const DELIVERY_CAM_PHI = 0.904;

export const LIGHT_1_INTRO_THETA = -0.7;
export const LIGHT_1_INTRO_PHI = 1.57;

export const LIGHT_1_CHINA_THETA = 0.89;
export const LIGHT_1_CHINA_PHI = 1.553;
export const LIGHT_1_CHINA_R = 400;

export const LIGHT_1_USA_THETA = 4.72;
export const LIGHT_1_USA_PHI = 1.32;

export const LIGHT_1_EROPE_THETA = 1.04;
export const LIGHT_1_EUROPE_PHI = 1.32;

export const LIGHT_2_INTRO_THETA = -2.74;
export const LIGHT_2_INTRO_PHI = 1.413;

export const ROTATION_DURATION = 666;

export const DEFAULT_POINT_TIMEOUT = 50000;

export const Z_AXIS = new THREE.Vector3(0, 0, 1);
export const Y_AXIS = new THREE.Vector3(0, 1, 0);

// globe states
export const USA_STATE = "USA_STATE";
export const EUROPE_STATE = "EUROPE_STATE";
export const CHINA_STATE = "CHINA_STATE";
export const INTRO_STATE = "INTRO_STATE";

// presentation steps
export const GLOBE_STEP = "GLOBE_STEP";
export const ORDER_B2B_STEP = "ORDER_B2B_STEP";
export const ORDER_D2C_STEP = "ORDER_D2C_STEP";
export const MANUFACTURING_STEP = "MANUFACTURING_STEP";
export const POSTPONEMENT_STEP = "POSTPONEMENT_STEP";
export const FULFILLMENT_STEP = "FULFILLMENT_STEP";
export const DELIVERY_B2B_STEP = "DELIVERY_B2B_STEP";
export const DELIVERY_D2C_STEP = "DELIVERY_D2C_STEP";
export const RESET_STEP = "RESET_STEP";

export const SCENE_CAM_POSITION = {
  [ORDER_D2C_STEP]: {
    theta: EUROPE_CAM_THETA,
    phi: EUROPE_CAM_PHI,
  },
  [ORDER_B2B_STEP]: {
    theta: USA_CAM_THETA,
    phi: USA_CAM_PHI,
  },
  [MANUFACTURING_STEP]: {
    theta: MANUFACTURERS_CAM_THETA,
    phi: MANUFACTURERS_CAM_PHI,
  },
  [POSTPONEMENT_STEP]: {
    theta: POSTPONEMENT_CAM_THETA,
    phi: POSTPONEMENT_CAM_PHI,
  },
  [FULFILLMENT_STEP]: {
    theta: FULFILLMENT_CAM_THETA,
    phi: FULFILLMENT_CAM_PHI,
  },
  [DELIVERY_D2C_STEP]: {
    theta: DELIVERY_CAM_THETA,
    phi: DELIVERY_CAM_PHI,
  },
  [DELIVERY_B2B_STEP]: {
    theta: DELIVERY_CAM_THETA,
    phi: DELIVERY_CAM_PHI,
  },
};

export const SKIP = false;
export const ALT_FULFILLMENT_CAMERA = true;

export const WHITE = "#ebebeb";
export const PURPLE = "#5964fa";
export const BASE = "#686868";
export const EMISSIVE = "#a1a1a1";
