import { getIcon } from "./weatherIcons";
import type { WeatherEntry, HourEntry } from "../types/types.js";
import { week } from "../types/types";

export const shortWeekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function getDays(today: number): number[] {
  let days = [];
  for (let i = 0; i < 7; i++) {
    days.push((today + i) % 7);
  }
  return days;
}

export function getLiteralDays(today: number): string[] {
  let days = [];
  for (let i = 0; i < 7; i++) {
    days.push(week[(today + i) % 7]);
  }
  return days;
}

const hours = [
  "12 AM",
  "1 AM",
  "2 AM",
  "3 AM",
  "4 AM",
  "5 AM",
  "6 AM",
  "7 AM",
  "8 AM",
  "9 AM",
  "10 AM",
  "11 AM",
  "12 PM",
  "1 PM",
  "2 PM",
  "3 PM",
  "4 PM",
  "5 PM",
  "6 PM",
  "7 PM",
  "8 PM",
  "9 PM",
  "10 PM",
  "11 PM",
];

export function hoursForecast(icons: string[], temps: (string | number)[]) {
  const hoursArray: HourEntry[] = [];
  hours.forEach((t, i) => {
    let hour: HourEntry = [getIcon(icons[i]), t, temps[i]];
    hoursArray.push(hour);
  });
  return hoursArray;
}
export function weekForecast(
  icons: string[],
  minTemps: (number | string)[],
  maxTemps: (number | string)[],
  today: number,
): WeatherEntry[] {
  const days = getDays(today);
  const week: WeatherEntry[] = [];
  for (let i = 0; i < 7; i++) {
    let day: WeatherEntry = [
      shortWeekDays[days[i]],
      getIcon(icons[i]),
      `${maxTemps[i]}°     ${minTemps[i]}°`,
      today,
    ];
    week.push(day);
  }
  return week;
}

export function fToCelius(fahrenheit: number | ""): number {
  return Number((((+fahrenheit - 32) * 5) / 9).toFixed(1));
}
export function getDate(date: string): string {
  const fdate = new Date(date);

  const formatted = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(fdate);

  console.log(formatted);
  // Output: Tuesday, Aug 5, 2025

  console.log(formatted);
  return formatted;
}
export const toCelsius = (f: number | "") => ((+f - 32) * 5) / 9;
export const toKmh = (mph: number | ""): number => {
  if (!mph) return 0;
  return +(+mph * 1.60934).toFixed(1);
};

export const toMm = (inch: number | ""): number => {
  if (!inch) return 0;
  return Number((inch * 25.4).toFixed(1));
};
