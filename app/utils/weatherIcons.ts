export const weatherIconMap = {
  snow: ["snow", "light snow", "heavy snow", "snow showers"],
  rain: ["rain", "showers", "heavy rain"],

  fog: ["fog", "mist", "haze", "smoke"],
  rainpartly: ["rain, partially cloudy"],
  cloudy: ["overcast", "cloudy", "mostly cloudy"],
  partlyCloudy: [
    "partially cloudy",
    "partly cloudy",
    "mostly sunny",
    "scattered clouds",
  ],
  sunny: ["clear", "clear-day", "sunny"],
  blank: ["blank"],
  drizzle: ["drizzle", "light rain", "light showers"],
  thunder: ["thunderstorm", "storm", "thundershowers"],
};

export function getIcon(condition?: string) {
  if (!condition) return "sunny"; // or "sunny" fallback

  const c = condition.toLowerCase();

  for (const [icon, values] of Object.entries(weatherIconMap)) {
    if (values.some((v) => c.includes(v))) {
      return icon;
    }
  }

  return "sunny";
}
