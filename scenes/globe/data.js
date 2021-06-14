import { uid } from "uid";
import { CHINA_STATE, EUROPE_STATE, USA_STATE } from "../../consts";
import largeAirports from "./largeAirports.json";
import shuffle from "array-shuffle";

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
    [31.6, 106.7],
    [30.7, 99.3],
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
    [31.6, 106.7],
    [30.7, 99.3],
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
    id: uid(),
  };
});

const shuffledArcsData = shuffle(arcsData);
export const quarterArcsData = shuffledArcsData.slice(
  0,
  Math.floor(arcsData.length / 4)
);
export const restArcsData = shuffledArcsData.slice(
  Math.floor(arcsData.length / 4)
);
quarterArcsData.forEach((arc) => {
  arc.hasMovingPoints = true;
});
restArcsData.forEach((arc) => {
  arc.hasMovingPoints = false;
});

// a = airport
// lb = low buildings
// tb = tall buildings
// arc = arc
export const customData = [
  ...arcsData.map((arc) => ({
    ...arc,
    objType: "arc",
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
    lat: 30.850434299862897,
    lng: 97.86767940342078,
    objType: "tb",
    id: uid(),
  },

  // Europe B2B Hubs
  {
    lat: 52.879624090684273,
    lng: 18.9032797724225021,
    objType: "tb",
    id: uid(),
    hideTomorrow: true,
  },
  {
    lat: 55.879624090684273,
    lng: 22.9032797724225021,
    objType: "tb",
    id: uid(),
    hideTomorrow: true,
  },
  {
    lat: 53.479624090684273,
    lng: 28.9032797724225021,
    objType: "label",
    label: "B2B Hubs",
    id: uid(),
    state: EUROPE_STATE,
    hideTomorrow: true,
  },

  // Europe B2C Hubs
  {
    lat: 43.879624090684273,
    lng: 0.9032797724225021,
    objType: "tb",
    id: uid(),
    hideTomorrow: true,
  },
  {
    lat: 46.879624090684273,
    lng: 4.4032797724225021,
    objType: "tb",
    id: uid(),
    hideTomorrow: true,
  },
  {
    lat: 44.879624090684273,
    lng: 10.4032797724225021,
    objType: "label",
    label: "B2C Hubs",
    id: uid(),
    state: EUROPE_STATE,
    hideTomorrow: true,
  },

  // USA B2B Hubs
  {
    lat: 35.879624090684273,
    lng: 253.9032797724225021,
    objType: "tb",
    id: uid(),
    hideTomorrow: true,
  },
  {
    lat: 39.179624090684273,
    lng: 253.9032797724225021,
    objType: "tb",
    id: uid(),
    hideTomorrow: true,
  },
  {
    lat: 32.179624090684273,
    lng: 253.9032797724225021,
    objType: "label",
    label: "B2B Hubs",
    id: uid(),
    state: USA_STATE,
    hideTomorrow: true,
  },

  // USA B2C Hubs
  {
    lat: 39.879624090684273,
    lng: 265.9032797724225021,
    objType: "tb",
    id: uid(),
    hideTomorrow: true,
  },
  {
    lat: 43.179624090684273,
    lng: 265.9032797724225021,
    objType: "tb",
    id: uid(),
    hideTomorrow: true,
  },
  {
    lat: 37.179624090684273,
    lng: 265.9032797724225021,
    objType: "label",
    label: "B2С Hubs",
    id: uid(),
    state: USA_STATE,
    hideTomorrow: true,
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
    hasAesterisk: true,
  },
  {
    lat: 28,
    lng: 98,
    objType: "label",
    label: "manufacturers",
    id: uid(),
    state: CHINA_STATE,
  },
  {
    lat: 34.5,
    lng: 114.41096002666973,
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

export const shenzhenAirport = {
  lat: 29.885144074883932,
  lng: 114.15653816052826,
  objType: "a",
  id: uid(),
  small: true,
};

export const shenzhenLabel = {
  lat: 30,
  lng: 120.5,
  objType: "label",
  label: "Shenzhen",
  id: uid(),
  state: CHINA_STATE,
};

export const fulfillment = {
  lat: 26.697672656009466,
  lng: 111.2,
  objType: "tb-single",
  id: uid(),
};
export const fulfillmentLabel = {
  lat: 26.5,
  lng: 119.3,
  objType: "label",
  label: "fulfillment",
  id: uid(),
  state: CHINA_STATE,
};

export const pyramids = [
  {
    lat: 27.381928678384035,
    lng: 121.56614125774303,
    objType: "pyramid",
    id: uid(),
    isVisible: false,
  },
  {
    lat: 37.461535731998595,
    lng: 111.64091211571221,

    objType: "pyramid",
    id: uid(),
    isVisible: false,
  },
  {
    lat: 41.52587105016799,
    lng: 126.1851943717729,

    objType: "pyramid",
    id: uid(),
    isVisible: false,
  },
  {
    lat: 5.596302845121826,
    lng: 116.86703986874468,

    objType: "pyramid",
    id: uid(),
    isVisible: false,
  },
  {
    lat: 1.6037695646748773,
    lng: 99.91862787264319,

    objType: "pyramid",
    id: uid(),
    isVisible: false,
  },
  {
    lat: 25.784588267474945,
    lng: 82.21694607975658,

    objType: "pyramid",
    id: uid(),
    isVisible: false,
  },
  {
    lat: 29.93975937810714,
    lng: 90.71470660856683,

    objType: "pyramid",
    id: uid(),
    isVisible: false,
  },
  {
    lat: 36.57276446270508,
    lng: 79.02502494837277,

    objType: "pyramid",
    id: uid(),
    isVisible: false,
  },
];
