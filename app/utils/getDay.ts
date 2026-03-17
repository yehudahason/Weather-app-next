const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export function getDay(): number {
  let currentdDay = new Date().getDay();
  return currentdDay;
}

function dayFromForecast(forecastIndex: number): number {
  const today = new Date().getDay(); // 0–6 (Sun–Sat)
  return (today + forecastIndex) % 7;
}
