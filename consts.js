import * as THREE from "three";

export const CANONIC_GLOBE_RADIUS = 100;
export const CENTER = new THREE.Vector3(0, 0, 0);
export const CAM_R = 260;
export const INTRO_CAM_R = 750;
export const INTRO_CAM_THETA = 1.2324469461144;
export const INTRO_CAM_PHI = 1.3532513064958416;
export const CHINA_CAM_THETA = Math.PI - 1.1732590418436886;
export const CHINA_CAM_PHI = 1.2149334407322725;
export const ROTATION_DURATION = 500;

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
export const B2B_STEP_1 = "B2B_STEP_1";
export const B2B_STEP_2 = "B2B_STEP_2";
export const B2B_STEP_3 = "B2B_STEP_3";
export const B2B_STEP_4 = "B2B_STEP_4";
export const B2B_STEP_5 = "B2B_STEP_5";
export const B2B_STEP_6 = "B2B_STEP_6";
export const D2C_STEP_1 = "D2C_STEP_1";
export const RESET_STEP = "RESET_STEP";

export const SKIP = false;
