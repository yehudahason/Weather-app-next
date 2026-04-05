"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Units from "./Units";
import { searchCities } from "../utils/getWeather";
import {
  weekForecast,
  hoursForecast,
  getLiteralDays,
  fToCelius,
  toKmh,
  toMm,
  getDate,
  normalize,
  toEnglish,
} from "../utils/utilsFunc";
import { getIcon } from "../utils/weatherIcons";
import { getCountryName } from "../utils/getWeather";
import {
  City,
  UnitSystem,
  TodayForecast,
  week,
  ForecastResponse,
} from "../types/types";
import { bricolage } from "../fonts";
const Home = () => {
  const [system, setSystem] = useState<UnitSystem>("metric");
  const [selectedDay, setSelectedDay] = useState<string | "">("");
  const [isDayOpen, setDayIsOpen] = useState<boolean>(false);
  const [unitOpen, setUnitOpen] = useState<boolean>(false);
  const [citySelectedIndex, setCitySelectedIndex] = useState<number>(-1);

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const dropUnitRef = useRef<HTMLDivElement | null>(null);
  const dropCities = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [query, setQuery] = useState<string>("");
  const [location, setLocation] = useState<string>("Berlin, Germany");
  const [date, setDate] = useState<string>("2025");
  const [cities, setCities] = useState<City[]>([]);
  const [forecast, setForecast] = useState<ForecastResponse>({});
  const [loading, setLoading] = useState<boolean>(false); //
  const [showForcast, setShowForcast] = useState<boolean>(false); //
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const abortRef = useRef<AbortController | null>(null);
  const requestIdRef = useRef(0);
  const weatherRequestRef = useRef(0);
  const hourWeekD = useMemo(
    () => getLiteralDays(week.indexOf(selectedDay)),
    [forecast],
  );
  const handleSearch = async (value: string) => {
    setQuery(value);

    // 🆔 unique request ID
    const requestId = ++requestIdRef.current;

    // ❌ cancel previous request
    if (abortRef.current) {
      abortRef.current.abort();
    }

    const controller = new AbortController();
    abortRef.current = controller;

    if (!value.trim()) {
      setCities([]);
      setCitySelectedIndex(-1);
      setLoading(false);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setShowForcast(false);
    setHasSearched(true);

    try {
      const results = await searchCities(value, controller.signal);

      // 🛑 ignore:
      // 1. aborted requests
      // 2. outdated requests
      if (!results || requestId !== requestIdRef.current) return;

      setCities(results);
      setCitySelectedIndex(results.length > 0 ? 0 : -1);
    } catch (error) {
      if (requestId !== requestIdRef.current) return;

      console.error("Failed to search cities:", error);
      setCities([]);
      setCitySelectedIndex(-1);
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  };
  const fetchWeatherData = async (
    city: string,
    lon: number | null = null,
    lat: number | null = null,
  ) => {
    const requestId = ++weatherRequestRef.current;
    try {
      let resolvedLon = lon;
      let resolvedLat = lat;

      if (resolvedLon == null || resolvedLat == null) {
        const resCity = await searchCities(city);
        console.log(resCity);
        if (
          !resCity ||
          resCity.length === 0 ||
          requestId !== weatherRequestRef.current
        ) {
          console.log("City not found");
          setHasSearched(true);
          return;
        }

        // ✅ EXACT MATCH ONLY
        const normalizedQuery = normalize(city);
        const exactCity = resCity.find(
          (c: City) => normalize(c.name) === normalizedQuery,
        );

        if (!exactCity || requestId !== weatherRequestRef.current) {
          console.log("No exact match found");
          setCities([]);

          setHasSearched(true);
          return;
        }
        setHasSearched(false);
        resolvedLon = exactCity.lon;
        resolvedLat = exactCity.lat;

        setLocation(`${exactCity.name}, ${getCountryName(exactCity.country)}`);
      }
      setHasSearched(false);
      setShowForcast(true);

      const res = await fetch(
        `/api/weather?lat=${resolvedLat}&lon=${resolvedLon}`,
      );

      if (!res.ok) {
        throw new Error(`Weather request failed with status ${res.status}`);
      }

      const data: ForecastResponse = await res.json();
      console.log(data);
      if (requestId !== weatherRequestRef.current) return;
      if (data.days?.length) {
        const dayName = new Date(data.days[0].datetime).toLocaleDateString(
          "en-US",
          { weekday: "long" },
        );
        setSelectedDay(dayName);
        setDate(getDate(data.days[0].datetime));
      }

      setForecast(data);
      setQuery(city);
    } catch (error) {
      console.error("Failed to fetch weather data:", error);
    }
  };
  const weekD = useMemo(() => {
    let icons: string[] = Array(7).fill("blank");
    let minTemps: (number | "")[] = Array(7).fill("");
    let maxTemps: (number | "")[] = Array(7).fill("");

    if (!forecast.days) {
      return weekForecast(icons, minTemps, maxTemps, 0);
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

    return weekForecast(icons, minTemps, maxTemps, week.indexOf(selectedDay));
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
      feelslike:
        system === "metric" ? +fToCelius(current.feelslike) : current.feelslike,
      wind: system === "metric" ? toKmh(current.windspeed) : current.windspeed,
      humidity: current.humidity.toFixed(0),
      precip: system === "metric" ? toMm(current.precip) : current.precip,
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
        setDayIsOpen(false);
      }

      if (dropUnitRef.current && !dropUnitRef.current.contains(target)) {
        setUnitOpen(false);
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
            unitOpen={unitOpen}
            setUnitOpen={setUnitOpen}
            ref={dropUnitRef}
            system={system}
            setSystem={setSystem}
          />
        </div>
      </header>

      <main className="main">
        <section className="search-section">
          <h1 className={`main-title ${bricolage.className}`}>
            How’s the sky looking today?
          </h1>

          <div className="search-box">
            <div className="input-wrapper">
              <input
                placeholder="Search for a place.."
                ref={inputRef}
                className="search-input"
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                autoComplete="off"
                onKeyDown={(e) => {
                  if (!cities.length) return;

                  if (e.code === "ArrowDown") {
                    e.preventDefault();
                    setCitySelectedIndex((prev) =>
                      prev < cities.length - 1 ? prev + 1 : 0,
                    );
                  }

                  if (e.code === "ArrowUp") {
                    e.preventDefault();
                    setCitySelectedIndex((prev) =>
                      prev > 0 ? prev - 1 : cities.length - 1,
                    );
                  }

                  if (e.code === "Enter" && citySelectedIndex >= 0) {
                    e.preventDefault();
                    const city = cities[citySelectedIndex];

                    setQuery(`${city.name}-${city.country}`);
                    setLocation(
                      `${city.name}, ${getCountryName(city.country)}`,
                    );
                    setCities([]);
                    fetchWeatherData(city.name, city.lon, city.lat);
                  }
                }}
              />
              <img
                src="/assets/images/icon-search.svg"
                alt="Search"
                className="searchIcon"
              />
              {loading && (
                <div className="dropdown-city loading">
                  <img src={"/assets/images/icon-loading.svg"} />
                  Search in progress..
                </div>
              )}
              {!loading && hasSearched && cities.length === 0 && (
                <div className="notFound">
                  <p>No Search results found!</p>
                </div>
              )}
              {!loading && cities.length > 0 && (
                <div className="dropdown-city" ref={dropCities}>
                  {cities.map((city, index) => (
                    <div
                      key={index}
                      className={`dropdown-item-city ${citySelectedIndex === index ? "active" : ""}`}
                      onClick={() => {
                        setQuery(`${city.name}-${city.country}`);
                        setLocation(
                          `${city.name}, ${getCountryName(city.country)}`,
                        );

                        setCities([]);
                        fetchWeatherData(city.name, city.lon, city.lat);
                        inputRef.current?.focus();
                      }}
                    >
                      {city.name} - {city.state}, {city.country}.
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              className="search-button"
              onClick={() => {
                fetchWeatherData(query.trim());
              }}
            >
              Search
            </button>
          </div>
        </section>
        {showForcast && (
          <div className="content-grid">
            <div className="left-column">
              <section className="current-weather">
                <div className="weather-main loading">
                  <div className="left-col">
                    <h2 className="city-name">{location}</h2>
                    <p className="date">{date}</p>
                  </div>

                  <h1 className="temperature">
                    <img
                      src={`/assets/images/icon-${today.icon}.webp`}
                      alt="icon"
                      style={{ height: "100px" }}
                    />{" "}
                    {today.temp}°
                  </h1>
                </div>

                <div className="weather-details">
                  {[
                    ["Feels Like", `${today.feelslike}°`],
                    ["Humidity", `${today.humidity} %`],
                    [
                      "Wind",
                      `${today.wind} ${system === "metric" ? "kmh" : "mph"}`,
                    ],
                    [
                      "Precipitation",
                      `${today.precip} ${system === "metric" ? "mm" : "in"}`,
                    ],
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
                          onClick={() => setDayIsOpen((prev) => !prev)}
                        >
                          {selectedDay}
                          <span
                            className={`arrow ${isDayOpen ? "rotate" : ""}`}
                          >
                            <img
                              src="/assets/images/icon-dropdown.svg"
                              alt=""
                            />
                          </span>
                        </button>

                        {isDayOpen && (
                          <div className="dropdown-menu">
                            {hourWeekD.map((day) => (
                              <button
                                key={day}
                                className={`dropdown-item ${selectedDay === day ? "active" : ""}`}
                                onClick={() => {
                                  setSelectedDay(day);
                                  setDayIsOpen(false);
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
        )}
      </main>
    </>
  );
};

export default Home;
