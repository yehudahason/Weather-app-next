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
  temp: number | "";
  feelslike: number | "";
  wind: number | "";
  humidity: number | "";
  precip: number | "";
  icon: string | null;
};

export type ForecastDay = {
  tempmax: number | "";
  tempmin: number | "";
  conditions: string;
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
};

export type CurrentConditions = {
  temp: number;
  feelslike: number;
  humidity: number;
  precip: number;
  windspeed: number;
  conditions: string;
  datetimeEpoch: number;
};

export type ForecastDayWithHours = ForecastDay & {
  datetime: string;
  hours: ForecastHour[];
};

export type ForecastResponse = {
  currentConditions?: CurrentConditions;
  days?: ForecastDayWithHours[];
};
