import { getIcon } from "./weatherIcons";
import { WeatherEntry } from "../types/types.js";

export const weekDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const shortWeekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function getDays(): number[] {
  let days = [];
  const today = new Date().getDay(); // 0–6 (Sun–Sat)
  for (let i = 0; i < 7; i++) {
    days.push((today + i) % 7);
  }
  return days;
}

[
  ["Tue", "🌧", "20° / 14°"],
  ["Wed", "🌧", "21° / 15°"],
  ["Thu", "☀", "24° / 14°"],
  ["Fri", "⛅", "25° / 13°"],
  ["Sat", "⛈", "21° / 15°"],
  ["Sun", "🌧", "25° / 16°"],
  ["Mon", "🌫", "24° / 15°"],
];

export function weekForecast(
  icons: string[],
  minTemps: number[],
  maxTemps: number[],
): WeatherEntry[] {
  const days = getDays();
  const week: WeatherEntry[] = [];
  for (let i = 0; i < 7; i++) {
    let day: WeatherEntry = [
      shortWeekDays[days[i]],
      getIcon(icons[i]),
      `${maxTemps[i]}°/${minTemps[i]}°`,
    ];
    week.push(day);
  }
  return week;
}

export function fToCelius(fahrenheit: number): number {
  return +(((fahrenheit - 32) * 5) / 9).toFixed(1);
}
