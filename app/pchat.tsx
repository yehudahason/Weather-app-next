"use client";
import { useState, useRef, useEffect, useMemo } from "react";
import Units from "./components/Units";
import { getWeather, searchCities, getCountryName } from "./utils/getWeather";
import {
  getDays,
  weekForecast,
  hoursForecast,
  getLiteralDays,
} from "./utils/utilsFunc";
import { City, WeatherEntry, UnitSystem, HourEntry } from "./types/types";
import { fToCelius } from "./utils/utilsFunc";

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
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const dropUnitRef = useRef<HTMLDivElement | null>(null);
  const dropCities = useRef<HTMLDivElement | null>(null);
  const [query, setQuery] = useState<string>("haifa");
  const [cities, setCities] = useState<City[]>([]);
  const [weekD, setWeekD] = useState<WeatherEntry[]>([]);
  const [hourWeekD, setHourWeekD] = useState<string[]>([]);
  const [forecast, setForecast] = useState<any>({});
  const [hourForecast, setHourForecast] = useState<HourEntry[]>([]);

  const handleSearch = async (value: string) => {
    setQuery(value);
    if (!value) {
      setCities([]);
      return;
    }
    const results = await searchCities(value);
    setCities(results);
  };

  // ✅ 1. FETCH FUNCTION (ONLY API + setForecast)
  const fetchWeatherData = async (city: string) => {
    try {
      const resCity = await searchCities(city);
      const { lon, lat } = resCity[0].coord;

      const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
      const data = await res.json();

      setForecast(data); // single source of truth
      return data;
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ 2. DAYS FORECAST
  const buildDaysForecast = (days: any[]) => {
    const resDays = days.slice(0, 7);

    let icons: string[] = [];
    let minTemps: number[] = [];
    let maxTemps: number[] = [];

    resDays.forEach((e: any) => {
      icons.push(e.conditions);

      if (system === "metric") {
        maxTemps.push(fToCelius(e.tempmax));
        minTemps.push(fToCelius(e.tempmin));
      } else {
        maxTemps.push(e.tempmax);
        minTemps.push(e.tempmin);
      }
    });

    return weekForecast(icons, minTemps, maxTemps);
  };

  // ✅ 3. HOURS FORECAST
  const buildHoursForecast = (hours: any[]) => {
    let hicons: string[] = [];
    let htemps: number[] = [];

    hours.forEach((h: any) => {
      hicons.push(h.conditions);

      if (system === "metric") {
        htemps.push(fToCelius(h.temp));
      } else {
        htemps.push(h.temp);
      }
    });

    return hoursForecast(hicons, htemps);
  };

  // ✅ CONTROLLER FUNCTION
  const setData = async (city: string) => {
    const data = await fetchWeatherData(city);
    if (!data) return;

    const { days } = data;

    const weekF = buildDaysForecast(days);
    const hourF = buildHoursForecast(days[0].hours);

    setWeekD(weekF);
    setHourForecast(hourF);
  };

  useMemo(() => {
    try {
    } catch (err) {
      console.log(err);
    }
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
      if (
        dropUnitRef.current &&
        !dropUnitRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
      if (
        dropCities.current &&
        !dropCities.current.contains(event.target as Node)
      ) {
        setCities([]);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    setData(query);
    setHourWeekD(getLiteralDays());

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [system]);

  return (
    <>
      <header className="header">
        <div className="header-container">
          <img className="logo" src={`/assets/images/logo.svg`} />
          <Units
            open={open}
            setOpen={setOpen}
            ref={dropUnitRef}
            system={system}
            setSystem={setSystem}
          />
        </div>
      </header>

      <main className="main">
        <section className="search-section">
          <h1 className="main-title">How’s the sky looking today?</h1>

          <div className="search-box">
            <div className="input-wrapper">
              <input
                className="search-input"
                type="text"
                placeholder="Search for a place..."
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
              />
              {cities.length > 0 && (
                <div className="dropdown-city" ref={dropCities}>
                  {cities.map((city, index) => (
                    <div
                      key={index}
                      className="dropdown-item-city"
                      onClick={() => {
                        setQuery(city.name);
                        setCities([]);
                        setData(city.name);
                      }}
                    >
                      {city.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button className="search-button" onClick={() => setData(query)}>
              Search
            </button>
          </div>
        </section>

        <div className="content-grid">
          <div className="left-column">
            <section className="daily-forecast">
              <h3 className="section-title">Daily forecast</h3>
              <div className="daily-cards">
                {weekD.map(([day, icon, temp]) => (
                  <div key={day} className="daily-card">
                    <p className="day">{day}</p>
                    <img src={`/assets/images/icon-${icon}.webp`} />
                    <p className="day-temp">{temp}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <section className="hourly-forecast">
            <div className="hourly-list">
              {hourForecast.map(([icon, time, temp]) => (
                <div key={time} className="hour-item">
                  <img src={`/assets/images/icon-${icon}.webp`} />
                  <span>{time}</span>
                  <p>{temp}°</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

export default Home;
