const GEO = process.env.GEO_KEY;
const url =
  "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/";
const apikey = process.env.API_KEY;

export async function getWeather(city: string) {
  const res = await fetch(url + `${city}?key=${apikey}`);
  // console.log(res);
  const data = await res.json();
  console.log(data);
}

export async function getCity(city: string) {
  const res = await fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${GEO}`,
  );
  const data = await res.json();
  console.log(data);
  getWeather(city);
}

export function getCountryName(code: string) {
  const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
  return regionNames.of(code);
}

console.log(getCountryName("IL")); // Israel
