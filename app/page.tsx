"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Units from "./components/Units";
import { searchCities } from "./utils/getWeather";
import {
  weekForecast,
  hoursForecast,
  getLiteralDays,
  fToCelius,
} from "./utils/utilsFunc";
import { getIcon } from "./utils/weatherIcons";
import { City, UnitSystem, TodayForecast, ForecastDay } from "./types/types";

export const week = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

type ForecastHour = {
  temp: number;
  conditions: string;
};

type CurrentConditions = {
  temp: number;
  feelslike: number;
  humidity: number;
  precip: number;
  windspeed: number;
  conditions: string;
};

type ForecastDayWithHours = ForecastDay & {
  datetime: string;
  hours: ForecastHour[];
};

type ForecastResponse = {
  currentConditions?: CurrentConditions;
  days?: ForecastDayWithHours[];
};

const Home = () => {
  const [system, setSystem] = useState<UnitSystem>("metric");
  const [selectedDay, setSelectedDay] = useState<string>(
    week[new Date().getDay()],
  );
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const dropUnitRef = useRef<HTMLDivElement | null>(null);
  const dropCities = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [query, setQuery] = useState<string>("haifa");
  const [cities, setCities] = useState<City[]>([]);
  const [forecast, setForecast] = useState<ForecastResponse>({});

  const hourWeekD = useMemo(() => getLiteralDays(), [forecast]);

  const handleSearch = async (value: string) => {
    setQuery(value);

    if (!value.trim()) {
      setCities([]);
      setSelectedIndex(-1);
      return;
    }

    try {
      const results = await searchCities(value);
      setCities(results);
      setSelectedIndex(results.length > 0 ? 0 : -1);
    } catch (error) {
      console.error("Failed to search cities:", error);
      setCities([]);
      setSelectedIndex(-1);
    }
  };

  const fetchWeatherData = async (
    city: string,
    lon: number | null = null,
    lat: number | null = null,
  ) => {
    try {
      let resolvedLon = lon;
      let resolvedLat = lat;

      if (resolvedLon == null || resolvedLat == null) {
        const resCity = await searchCities(city);

        if (!resCity.length) {
          console.error("City not found");
          return;
        }

        resolvedLon = resCity[0].coord.lon;
        resolvedLat = resCity[0].coord.lat;
      }

      const res = await fetch(
        `/api/weather?lat=${resolvedLat}&lon=${resolvedLon}`,
      );

      if (!res.ok) {
        throw new Error(`Weather request failed with status ${res.status}`);
      }

      const data: ForecastResponse = await res.json();

      setSelectedDay(week[new Date().getDay()]);
      setForecast(data);
    } catch (error) {
      console.error("Failed to fetch weather data:", error);
    }
  };

  const weekD = useMemo(() => {
    let icons: string[] = Array(7).fill("blank");
    let minTemps: (number | "")[] = Array(7).fill("");
    let maxTemps: (number | "")[] = Array(7).fill("");

    if (!forecast.days) {
      return weekForecast(icons, minTemps, maxTemps);
    }

    icons = [];
    minTemps = [];
    maxTemps = [];

    const resDays = forecast.days.slice(0, 7);

    resDays.forEach((day) => {
      icons.push(day.conditions);

      if (system === "metric") {
        maxTemps.push(+fToCelius(Number(day.tempmax)));
        minTemps.push(+fToCelius(Number(day.tempmin)));
      } else {
        maxTemps.push(+day.tempmax);
        minTemps.push(+day.tempmin);
      }
    });

    return weekForecast(icons, minTemps, maxTemps);
  }, [forecast.days, system]);

  const today: TodayForecast = useMemo(() => {
    const defaultToday: TodayForecast = {
      temp: "",
      feelslike: "",
      wind: "",
      humidity: "",
      precip: "",
      icon: "blank",
    };

    if (!forecast.currentConditions) {
      return defaultToday;
    }

    const current = forecast.currentConditions;

    return {
      temp: system === "metric" ? +fToCelius(current.temp) : current.temp,
      feelslike: current.feelslike,
      wind: current.windspeed,
      humidity: current.humidity,
      precip: current.precip,
      icon: getIcon(current.conditions),
    };
  }, [forecast.currentConditions, system]);

  const hourForecast = useMemo(() => {
    let hicons: string[] = Array(24).fill("blank");
    let htemps: (number | string)[] = Array(24).fill("");

    if (!forecast.days) {
      return hoursForecast(hicons, htemps);
    }

    hicons = [];
    htemps = [];

    const selected = forecast.days.find((day) => {
      const dayName = new Date(day.datetime).toLocaleDateString("en-US", {
        weekday: "long",
      });

      return dayName === selectedDay;
    });

    if (!selected) {
      return [];
    }

    selected.hours.forEach((hour) => {
      hicons.push(hour.conditions);

      if (system === "metric") {
        htemps.push(+fToCelius(hour.temp));
      } else {
        htemps.push(hour.temp);
      }
    });

    return hoursForecast(hicons, htemps);
  }, [forecast.days, selectedDay, system]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setIsOpen(false);
      }

      if (dropUnitRef.current && !dropUnitRef.current.contains(target)) {
        setOpen(false);
      }

      if (dropCities.current && !dropCities.current.contains(target)) {
        setCities([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <header className="header">
        <div className="header-container">
          <img className="logo" src="/assets/images/logo.svg" />
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
                ref={inputRef}
                className="search-input"
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                autoComplete="off"
                onKeyDown={(e) => {
                  if (!cities.length) return;

                  if (e.code === "ArrowDown") {
                    e.preventDefault();
                    setSelectedIndex((prev) =>
                      prev < cities.length - 1 ? prev + 1 : 0,
                    );
                  }

                  if (e.code === "ArrowUp") {
                    e.preventDefault();
                    setSelectedIndex((prev) =>
                      prev > 0 ? prev - 1 : cities.length - 1,
                    );
                  }

                  if (e.code === "Enter" && selectedIndex >= 0) {
                    e.preventDefault();
                    const city = cities[selectedIndex];

                    setQuery(`${city.name}-${city.country}`);
                    setCities([]);
                    fetchWeatherData(city.name, city.coord.lon, city.coord.lat);
                  }
                }}
              />

              {cities.length > 0 && (
                <div className="dropdown-city" ref={dropCities}>
                  {cities.map((city, index) => (
                    <div
                      key={index}
                      className={`dropdown-item-city ${selectedIndex === index ? "active" : ""}`}
                      onClick={() => {
                        setQuery(`${city.name}-${city.country}`);
                        setCities([]);
                        fetchWeatherData(
                          city.name,
                          city.coord.lon,
                          city.coord.lat,
                        );
                        inputRef.current?.focus();
                      }}
                    >
                      {city.name} - {city.country}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              className="search-button"
              onClick={() => fetchWeatherData(query)}
            >
              Search
            </button>
          </div>
        </section>

        <div className="content-grid">
          <div className="left-column">
            <section className="current-weather">
              <div className="weather-main">
                <div className="left-col">
                  <h2 className="city-name">Berlin, Germany</h2>
                  <p className="date">Tuesday, Aug 5, 2025</p>
                </div>

                <h1 className="temperature">
                  <img
                    src={`/assets/images/icon-${today.icon}.webp`}
                    alt="icon"
                    style={{ height: "60px" }}
                  />
                  {today.temp}°
                </h1>
              </div>

              <div className="weather-details">
                {[
                  ["Feels Like", `${today.feelslike}`],
                  ["Humidity", `${today.humidity}`],
                  ["Wind", `${today.wind}`],
                  ["Precipitation", `${today.precip}`],
                ].map(([title, value]) => (
                  <div key={title} className="detail-card">
                    <p className="detail-title">{title}</p>
                    <h3 className="detail-value">{value}</h3>
                  </div>
                ))}
              </div>
            </section>

            <section className="daily-forecast">
              <h3 className="section-title">Daily forecast</h3>

              <div className="daily-cards">
                {weekD.map(([day, icon, temp]) => (
                  <div key={day} className="daily-card">
                    <p className="day">{day}</p>
                    <p className="weather-icon">
                      <img
                        src={`/assets/images/icon-${icon}.webp`}
                        alt="icon"
                        style={{ height: "60px" }}
                      />
                    </p>
                    <p className="day-temp">{temp}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <section className="hourly-forecast">
            <div className="hourly-scroll">
              <div className="hourly-header">
                <h3 className="section-title">
                  <span>Hourly forecast</span>{" "}
                  <span>
                    <div className="dropdown-container" ref={dropdownRef}>
                      <button
                        className="dropdown-button"
                        onClick={() => setIsOpen((prev) => !prev)}
                      >
                        {selectedDay}
                        <span className={`arrow ${isOpen ? "rotate" : ""}`}>
                          <img src="/assets/images/icon-dropdown.svg" alt="" />
                        </span>
                      </button>

                      {isOpen && (
                        <div className="dropdown-menu">
                          {hourWeekD.map((day) => (
                            <button
                              key={day}
                              className={`dropdown-item ${selectedDay === day ? "active" : ""}`}
                              onClick={() => {
                                setSelectedDay(day);
                                setIsOpen(false);
                              }}
                            >
                              {day}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </span>
                </h3>
              </div>

              <div className="hourly-list">
                {hourForecast.map(([icon, time, temp]) => (
                  <div key={time} className="hour-item">
                    <div className="left">
                      <img
                        src={`/assets/images/icon-${icon}.webp`}
                        alt="icon"
                      />
                      <span>{time}</span>
                    </div>
                    <p className="hour-temp">{temp}°</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

export default Home;
