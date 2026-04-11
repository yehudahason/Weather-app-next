export const weatherIconMap = {
  snow: ["snow", "light snow", "heavy snow", "snow showers"],
  drizzle: ["drizzle", "light rain", "light showers"],
  rain: ["rain", "showers", "heavy rain"],

  fog: ["fog", "mist", "haze", "smoke"],
  rainpartly: ["rain, partially cloudy"],
  partlyCloudy: [
    "partially cloudy",
    "partly cloudy",
    "mostly sunny",
    "scattered clouds",
  ],
  cloudy: ["overcast", "cloudy", "mostly cloudy"],
  sunny: ["clear", "clear-day", "sunny"],
  blank: ["blank"],
  thunder: ["thunderstorm", "storm", "thundershowers"],
};

export function getIcon(condition?: string) {
  if (!condition) return "sunny";

  const c = condition.toLowerCase();

  // 1. Exact match first
  for (const [icon, values] of Object.entries(weatherIconMap)) {
    if (values.includes(c)) {
      return icon;
    }
  }

  // 2. Then fallback to includes
  for (const [icon, values] of Object.entries(weatherIconMap)) {
    if (values.some((v) => c.includes(v))) {
      return icon;
    }
  }

  return "sunny";
}
