import * as THREE from "three";
import { createBoxWithRoundedEdges } from "./createBox";

const buildingColor = new THREE.Color(
  0.3529411764705882,
  0.39215686274509803,
  0.9803921568627451
);

const buildingMaterial = new THREE.MeshStandardMaterial({
  name: "Building Material",
  side: THREE.DoubleSide,
  color: buildingColor,
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
lowBuildings.rotateY(Math.PI / 1.3);
lowBuildingsGroup.add(lowBuildings);

export { airport, lowBuildingsGroup, tallBuildingsGroup };
