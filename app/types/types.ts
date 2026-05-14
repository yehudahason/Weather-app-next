export type City = {
  name: string;
  country: string;
  lon: number;
  lat: number;
  search: string;
  state: string;
};

export type WeatherEntry =
  | [day: string, icon: string, temp: string, today: number]
  | [];
export type HourEntry =
  | [icon: string, time: string, temp: number | string]
  | [];

export type UnitSystem = "metric" | "imperial";

export type TodayForecast = {
  temp: number | null | "" | "-";
  feelslike: number | null | "" | "-";
  wind: number | null | "" | "-";
  humidity: number | null | "" | "-";
  precip: number | null | "" | "-";
  icon: string | null | "" | "-";
};

export type ForecastDay = {
  tempmax: number | "";
  tempmin: number | "";
  conditions: string;
  temp: number | "";
  feelslike: number | "";
  windspeed: number | "";
  humidity: number | "";
  precip: number | "";
};

export const week = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export type ForecastHour = {
  temp: number;
  conditions: string;
  feelslike: number;
};

export type CurrentConditions = {
  temp: number | null | "";
  feelslike: number | null | "";
  humidity: number | null | "";
  precip: number | null | "";
  windspeed: number | null | "";
  conditions: string | null | "";
  datetimeEpoch: number | null | "";
};

export type ForecastDayWithHours = ForecastDay & {
  datetime: string;
  hours: ForecastHour[];
};

export type ForecastResponse = {
  currentConditions?: CurrentConditions;
  days?: ForecastDayWithHours[];
};
