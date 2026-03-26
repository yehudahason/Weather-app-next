"use client";
import { useState, useRef, useEffect, useMemo } from "react";
import Units from "./components/Units";
import { searchCities } from "./utils/getWeather";
import { weekForecast, hoursForecast, getLiteralDays } from "./utils/utilsFunc";
import { City, UnitSystem, TodayForecast, ForecastDay } from "./types/types";
import { fToCelius } from "./utils/utilsFunc";
import { getIcon } from "./utils/weatherIcons";

export const week = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const Home = () => {
  const [system, setSystem] = useState<UnitSystem>("metric");
  const [selectedDay, setSelectedDay] = useState<string>(
    week[new Date().getDay()],
  );
  const [isOpen, setIsOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const dropUnitRef = useRef<HTMLDivElement | null>(null);
  const dropCities = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [query, setQuery] = useState("haifa");
  const [cities, setCities] = useState<City[]>([]);
  const [forecast, setForecast] = useState<any>({});

  const hourWeekD = useMemo(() => getLiteralDays(), [forecast]);

  const handleSearch = async (value: string) => {
    setQuery(value);
    if (!value) return setCities([]);
    const results = await searchCities(value);
    setCities(results);
  };

  const fetchWeatherData = async (
    city: string,
    lon: number | null = null,
    lat: number | null = null,
  ) => {
    try {
      if (lon == null && lat == null) {
        const resCity = await searchCities(city);
        lon = resCity[0].coord.lon;
        lat = resCity[0].coord.lat;
      }
      const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
      const data = await res.json();
      setSelectedDay(week[new Date().getDay()]);
      setForecast(data);
    } catch (err) {
      console.log(err);
    }
  };

  // 👉 Reset + auto select first
  useEffect(() => {
    if (cities.length > 0) {
      setSelectedIndex(0);
    } else {
      setSelectedIndex(-1);
    }
  }, [cities]);

  // 👉 Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0) {
      itemRefs.current[selectedIndex]?.scrollIntoView({
        block: "nearest",
      });
    }
  }, [selectedIndex]);

  // 👉 Click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropCities.current &&
        !dropCities.current.contains(event.target as Node)
      ) {
        setCities([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <main className="main">
      <section className="search-section">
        <div className="search-box">
          <button onClick={() => fetchWeatherData(query)}>Search</button>
        </div>
      </section>
    </main>
  );
};

export default Home;
