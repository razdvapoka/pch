const airports = require("./airports_raw.json");
// const fs = require("fs");
//
console.log(airports.slice(0, 10));

// const airportTypes = airports.reduce((types, airport) => {
//   return types.add(airport.type);
// }, new Set());
// console.log(airportTypes);

// const countries = airports
//   .filter(({ type }) => type === "large_airport")
//   .reduce(
//     (r, a) => {
//       r.countries.add(a.iso_country);
//       r.regions.add(a.iso_region);
//       return r;
//     },
//     {
//       countries: new Set(),
//       regions: new Set(),
//     }
//   );
// console.log(countries);

// const largeAirports = airports.filter(({ type }) => type === "large_airport");
// fs.writeFileSync("large_airports.json", JSON.stringify(largeAirports));
//

// const formatted = airports.map((a) => {
//   const [lng, lat] = a.coordinates.split(", ");
//   const { coordinates, ...rest } = a;
//   return {
//     lng: Number.parseFloat(lng),
//     lat: Number.parseFloat(lat),
//     ...rest,
//   };
// });
// fs.writeFileSync("airports_formatted.json", JSON.stringify(formatted));

console.log("data processed all right man");
