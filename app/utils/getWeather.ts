const GEO = process.env.GEO_KEY;
const url =
  "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/";

export async function getWeather(lat: number, lon: number) {
  const apiKey = process.env.API_KEY;

  const res = await fetch(`${url}${lat},${lon}?key=${apiKey}`);

  if (!res.ok) {
    throw new Error("Failed to fetch weather");
  }

  return res.json();
}

export async function getCity(city: string) {
  const res = await fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${GEO}`,
  );
  const data = await res.json();
  console.log(data);
  // getWeather(city);
}

export function getCountryName(code: string) {
  const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
  return regionNames.of(code);
}

export async function searchCities(query: string) {
  try {
    const res = await fetch(`/api/cities?q=${query}`);
    return res.json();
  } catch (err) {
    console.log(err);
    return false;
  }
}
