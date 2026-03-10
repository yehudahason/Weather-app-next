const weatherGroups = {
  clear: [1000],

  cloudy: [1003, 1006, 1009],

  fog: [1030, 1135, 1147],

  storm: [1087, 1273, 1276, 1279, 1282],

  rain: [
    1063, 1150, 1153, 1168, 1171, 1180, 1183, 1186, 1189, 1192, 1195, 1240,
    1243, 1246,
  ],

  snow: [
    1066, 1069, 1072, 1204, 1207, 1210, 1213, 1216, 1219, 1222, 1225, 1237,
    1249, 1252, 1255, 1258, 1261, 1264,
  ],
};

export function getWeatherGroup(code: number) {
  for (const group in weatherGroups) {
    const key = group as keyof typeof weatherGroups;

    if (weatherGroups[key].includes(code)) {
      return key;
    }
  }

  return "clear";
}
// console.log(getWeatherGroup(1147));
