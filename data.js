import { uid } from "uid";

export const pathsData = [
  [
    [23.700551681153613, 112.5178530352569],
    [30.8541141483191, 108.18689228757488],
  ],
  [
    [23.700551681153613, 112.5178530352569],
    [30.788767443843554, 110.64099274823512],
  ],
  [
    [32.084486357469686, 109.70366047098372],
    [34.19275246598128, 101.3431390814407],
  ],
  [
    [30.906290040140114, 107.10192191858035],
    [26.10131939282151, 100.00000001524467],
  ],
];

export const arcsData = [
  {
    startLat: 21.59955118709118,
    startLng: 112.47016304067684,
    endLat: 5.577642128002978,
    endLng: 102.8120616247904,
    alt: 0.1,
    altAutoScale: 0.5,
    color: "white",
  },
  {
    startLat: 21.57184377214739,
    startLng: 112.84623106938115,
    endLat: 40.319220941044875,
    endLng: 14.73033314499672,
    alt: 0.12,
    color: "white",
  },
  {
    startLat: 21.57184377214739,
    startLng: 112.84623106938115,
    endLat: 36.90781940113789,
    endLng: 14.019301459219733,
    alt: 0.13,
    color: "white",
  },
  {
    startLat: 22.243255335845944,
    startLng: 113.48552631992973,
    endLat: 38.10681977721793,
    endLng: -109.93310721381238,
    alt: 0.2,
    color: "white",
  },
  {
    startLat: 22.243255335845944,
    startLng: 113.48552631992973,
    endLat: 34.58176320817789,
    endLng: -108.98736554433808,
    alt: 0.22,
    color: "white",
  },
  {
    startLat: 22.243255335845944,
    startLng: 113.48552631992973,
    endLat: 27.68087914068041,
    endLng: -105.0661391185123,
    alt: 0.25,
    color: "white",
  },
];

//
// a = airport
// lb = low buildings
// tb = tall buildings
// arc = arc
export const customData = [
  ...arcsData.map((a) => ({
    ...a,
    objType: "arc",
    id: uid(),
  })),
  {
    lat: 4.72157227071834,
    lng: 102.41762804571503,
    objType: "a",
    id: uid(),
  },
  {
    lat: 22.77903143771242,
    lng: 113.36730303246411,
    objType: "a",
    id: uid(),
  },
  {
    lat: 31.5,
    lng: 109,
    objType: "lb",
    id: uid(),
  },
  {
    lat: 34,
    lng: 100,
    objType: "tb",
    id: uid(),
  },
  {
    lat: 26.094558607779327,
    lng: 98.64827818735401,
    objType: "tb",
    id: uid(),
  },
  {
    lat: 20.413554687037546,
    lng: 113.5993578911301,
    objType: "label",
    label: "hong kong",
    subLabel: "airport",
    id: uid(),
  },
  {
    lat: 23.099670914334197,
    lng: 98.4498283380363,
    objType: "label",
    label: "manufacturers",
    id: uid(),
  },
  {
    lat: 28.367832556457905,
    lng: 120.30302357080461,
    objType: "label",
    label: "postponement",
    id: uid(),
  },
  {
    lat: 27.905158191663908,
    lng: 110.71756429489352,
    objType: "explosion",
    id: uid(),
  },
  {
    lat: 16.868466842703327,
    lng: 101.63054361401858,
    objType: "explosion",
    id: uid(),
  },
  {
    lat: 16.907429921581056,
    lng: 120.89764052671202,
    objType: "explosion",
    id: uid(),
  },
];

export const USA_STATE = "USA_STATE";
export const EUROPE_STATE = "EUROPE_STATE";
export const CHINA_STATE = "CHINA_STATE";

const usaButton = {
  text: "USA",
  subText: "B2B, B2C<br/>hubs",
  state: USA_STATE,
};
const europeButton = {
  text: "Europe",
  subText: "B2B, B2C<br/>hubs",
  state: EUROPE_STATE,
};
const chinaButton = {
  text: "China",
  subText: "B2B, B2C<br/>hubs",
  state: CHINA_STATE,
};

export const buttons = {
  [CHINA_STATE]: [europeButton, usaButton],
  [USA_STATE]: [chinaButton, europeButton],
  [EUROPE_STATE]: [usaButton, chinaButton],
};