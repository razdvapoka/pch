import * as THREE from "three";
import { uid } from "uid";

export const arcsData = [
  {
    startLat: 31.66384845695724,
    startLng: 9.515365304680117,
    endLat: -10.253771944501281,
    endLng: -9.493511060694289,
    alt: 0.1,
    altAutoScale: 0.5,
    color: "white",
  },
  {
    startLat: 15.738119294738112,
    startLng: 13.494344062915246,
    endLat: 7.740852253632141,
    endLng: 30.852743891823337,
    alt: 0.1,
    altAutoScale: 0.5,
    color: "white",
  },
];

export const pathsData = [
  [
    [44.797291, 5.799053],
    [44.57118, 11.625918],
  ],
  [
    [41.99853, 13.35305],
    [44.229152, 17.493191],
    [44.088743, 21.808484],
  ],
];

//
// a = airport
// lb = low buildings
// tb = tall buildings
// arc = arc
export const customData = [
  {
    startLat: 31.66384845695724,
    startLng: 9.515365304680117,
    endLat: -10.253771944501281,
    endLng: -9.493511060694289,
    alt: 0.1,
    altAutoScale: 0.5,
    objType: "arc",
    id: uid(),
  },
  {
    startLat: 15.738119294738112,
    startLng: 13.494344062915246,
    endLat: 7.740852253632141,
    endLng: 30.852743891823337,
    alt: 0.1,
    altAutoScale: 0.5,
    objType: "arc",
    id: uid(),
  },
  {
    lat: 38.048961,
    lng: 15.816407,
    objType: "a",
    id: uid(),
  },
  {
    lat: 40.0060239,
    lng: 18.349105,
    objType: "a",
    id: uid(),
  },
  {
    lat: 30.785335,
    lng: 119.735688,
    objType: "a",
    id: uid(),
  },
  {
    lat: 33.3322783,
    lng: 114.749361,
    objType: "lb",
    label: "facility 1",
    id: uid(),
  },
  {
    lat: 35.419435,
    lng: 108.172554,
    objType: "tb",
    id: uid(),
  },
  {
    lat: 32.40188920911271,
    lng: 108.19698028012733,
    objType: "label",
    label: "facility 1",
    subLabel: "airport",
    id: uid(),
  },
  {
    lat: 37.40188920911271,
    lng: 100.19698028012733,
    objType: "label",
    label: "facility 2",
    id: uid(),
  },
];
