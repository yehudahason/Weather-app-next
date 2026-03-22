export type City = {
  id: number;
  name: string;
  state: string;
  country: string;
  searchName: string;
  coord: {
    lon: number;
    lat: number;
  };
};

export type WeatherEntry = [day: string, icon: string, temp: string] | [];
export type HourEntry = [icon: string, time: string, temp: number] | [];

export type UnitSystem = "metric" | "imperial";
