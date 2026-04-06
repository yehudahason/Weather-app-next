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

export function getCountryName(code: string) {
  const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
  return regionNames.of(code);
}

export async function searchCities(query: string, signal?: AbortSignal) {
  try {
    const res = await fetch(`/api/cities?q=${query}`, { signal });

    // ✅ handle HTTP errors
    if (!res.ok) {
      throw new Error(`City search failed: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (err: any) {
    // ✅ ignore cancelled requests (race condition safe)
    if (err.name === "AbortError") {
      return null;
    }

    console.error("searchCities error:", err);
    throw err;
  }
}
