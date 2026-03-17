const weatherIconMap = {
  sunny: ["clear", "clear-day", "sunny"],
  partlyCloudy: [
    "partially cloudy",
    "partly cloudy",
    "mostly sunny",
    "scattered clouds",
  ],
  cloudy: ["overcast", "cloudy", "mostly cloudy"],
  fog: ["fog", "mist", "haze", "smoke"],
  drizzle: ["drizzle", "light rain", "light showers"],
  rain: ["rain", "showers", "heavy rain"],
  snow: ["snow", "light snow", "heavy snow", "snow showers"],
  thunder: ["thunderstorm", "storm", "thundershowers"],
};

function getIcon(condition: string) {
  const c = condition.toLowerCase();

  for (const [icon, values] of Object.entries(weatherIconMap)) {
    if (values.some((v) => c.includes(v))) {
      return icon;
    }
  }

  return "unknown";
}
