import { uid } from "uid";
import { CHINA_STATE, EUROPE_STATE, USA_STATE } from "../../consts";
import largeAirports from "./largeAirports.json";

const airportObjects = largeAirports.map((a) => {
  const [lng, lat] = a.coordinates.split(", ");
  return {
    objType: "a",
    lat,
    lng,
    id: uid(),
    small: true,
  };
});

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

export const fulfillmentPaths = [
  [
    [23.700551681153613, 112.5178530352569],
    [26.697672656009466, 111.2],
  ],
  [
    [26.697672656009466, 111.2],
    [30.788767443843554, 110.64099274823512],
  ],
  [
    [26.697672656009466, 111.2],
    [30.8541141483191, 108.18689228757488],
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

export const arcsData = airportObjects.map((ap) => {
  return {
    startLat: 22.5,
    startLng: 113.5993578911301,
    endLat: ap.lat,
    endLng: ap.lng,
    color: "rgba(255,255,255, 0.25)",
    altAutoScale: 0.33,
  };
});

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

  // Europe B2B Hubs
  {
    lat: 52.879624090684273,
    lng: 18.9032797724225021,
    objType: "tb",
    id: uid(),
  },
  {
    lat: 55.879624090684273,
    lng: 22.9032797724225021,
    objType: "tb",
    id: uid(),
  },
  {
    lat: 53.479624090684273,
    lng: 28.9032797724225021,
    objType: "label",
    label: "B2B Hubs",
    id: uid(),
    state: EUROPE_STATE,
  },

  // Europe B2C Hubs
  {
    lat: 43.879624090684273,
    lng: 0.9032797724225021,
    objType: "tb",
    id: uid(),
  },
  {
    lat: 46.879624090684273,
    lng: 4.4032797724225021,
    objType: "tb",
    id: uid(),
  },
  {
    lat: 44.879624090684273,
    lng: 10.4032797724225021,
    objType: "label",
    label: "B2C Hubs",
    id: uid(),
    state: EUROPE_STATE,
  },

  // Europe labels
  // {
  //   lat: 46.879624090684273,
  //   lng: 19.9032797724225021,
  //   objType: "label",
  //   label: "B2B Hubs",
  //   id: uid(),
  //   state: EUROPE_STATE,
  // },
  // {
  //   lat: 48.879624090684273,
  //   lng: 20.9032797724225021,
  //   objType: "label",
  //   label: "B2С Hubs",
  //   id: uid(),
  //   state: EUROPE_STATE,
  // },

  // USA B2B Hubs
  {
    lat: 35.879624090684273,
    lng: 253.9032797724225021,
    objType: "tb",
    id: uid(),
  },
  {
    lat: 39.179624090684273,
    lng: 253.9032797724225021,
    objType: "tb",
    id: uid(),
  },
  {
    lat: 32.179624090684273,
    lng: 253.9032797724225021,
    objType: "label",
    label: "B2B Hubs",
    id: uid(),
    state: USA_STATE,
  },

  // USA B2C Hubs
  {
    lat: 39.879624090684273,
    lng: 265.9032797724225021,
    objType: "tb",
    id: uid(),
  },
  {
    lat: 43.179624090684273,
    lng: 265.9032797724225021,
    objType: "tb",
    id: uid(),
  },
  {
    lat: 37.179624090684273,
    lng: 265.9032797724225021,
    objType: "label",
    label: "B2С Hubs",
    id: uid(),
    state: USA_STATE,
  },

  // China
  {
    lat: 20.413554687037546,
    lng: 113.5993578911301,
    objType: "label",
    label: "hong kong",
    subLabel: "airport",
    id: uid(),
    state: CHINA_STATE,
  },
  {
    lat: 23.099670914334197,
    lng: 98.4498283380363,
    objType: "label",
    label: "manufacturers",
    id: uid(),
    state: CHINA_STATE,
  },
  {
    lat: 33.89749680434696,
    lng: 117.4922954485937,
    objType: "label",
    label: "postponement",
    id: uid(),
    state: CHINA_STATE,
  },

  // Other stuff

  {
    lat: 26.697672656009466,
    lng: 111.2,
    objType: "explosion",
    id: uid(),
  },
  ...airportObjects,
];

export const fulfillment = {
  lat: 26.697672656009466,
  lng: 111.2,
  objType: "tb-single",
  id: uid(),
};
export const fulfillmentLabel = {
  lat: 28.367832556457905,
  lng: 119.30302357080461,
  objType: "label",
  label: "fulfillment",
  id: uid(),
  state: CHINA_STATE,
};
