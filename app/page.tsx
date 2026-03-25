"use client";
import { useState, useRef, useEffect, useMemo } from "react";
import Units from "./components/Units";
import { searchCities } from "./utils/getWeather";
import { weekForecast, hoursForecast, getLiteralDays } from "./utils/utilsFunc";
import { City, UnitSystem, TodayForecast } from "./types/types";
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
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const dropUnitRef = useRef<HTMLDivElement | null>(null);
  const dropCities = useRef<HTMLDivElement | null>(null);

  const [query, setQuery] = useState<string>("haifa");
  const [cities, setCities] = useState<City[]>([]);
  const [hourWeekD, setHourWeekD] = useState<string[]>([]);
  const [forecast, setForecast] = useState<any>({});

  const handleSearch = async (value: string) => {
    setQuery(value);
    if (!value) {
      setCities([]);
      return;
    }

    const results = await searchCities(value);
    setCities(results);
  };

  // 🌐 FETCH
  const fetchWeatherData = async (city: string) => {
    try {
      const resCity = await searchCities(city);
      const { lon, lat } = resCity[0].coord;

      const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
      const data = await res.json();
      console.log(data);
      setForecast(data);
    } catch (err) {
      console.log(err);
    }
  };

  // 📅 DAYS (DERIVED)
  const weekD = useMemo(() => {
    let icons: string[] = [];
    let minTemps: (number | string)[] = [];
    let maxTemps: (number | string)[] = [];
    for (let i = 0; i < 7; i++) {
      icons.push("blank");
      maxTemps.push("");
      minTemps.push("");
    }
    if (!forecast?.days) {
      let test = weekForecast(icons, minTemps, maxTemps);
      console.log(test);
      return test;
    } else {
      icons = [];
      minTemps = [];
      maxTemps = [];
    }

    let resDays = [];
    for (let i = 0; i < 7; i++) {}
    resDays = forecast.days.slice(0, 7);

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
  }, [forecast, system]);

  // 📅 Today Forecast (DERIVED)
  const today: TodayForecast = useMemo(() => {
    const res: TodayForecast = {
      temp: "",
      feelslike: "",
      wind: "",
      humidity: "",
      precip: "",
      icon: "blank",
    };
    if (!forecast?.currentConditions) return res;

    const todayF = forecast.currentConditions;
    console.log(todayF);
    if (system === "metric") {
      res.temp = +fToCelius(todayF.temp);
    } else {
      res.temp = todayF.temp;
    }
    res.humidity = todayF.humidity;
    res.precip = todayF.precip;
    res.wind = todayF.windspeed;
    res.feelslike = todayF.feelslike;

    res.icon = getIcon(todayF.conditions);
    console.log(res);
    return res;
  }, [forecast, system]);
  // ⏰ HOURS (DERIVED BASED ON SELECTED DAY)
  const hourForecast = useMemo(() => {
    let hicons: string[] = [];
    let htemps: (number | string)[] = [];
    for (let i = 0; i < 24; i++) {
      hicons.push("blank");
      htemps.push("");
    }
    if (!forecast?.days) {
      return hoursForecast(hicons, htemps);
    } else {
      hicons = [];
      htemps = [];
    }

    // const index = hourWeekD.indexOf(selectedDay);
    // const selected = forecast.days[index];
    const selected = forecast.days.find((d: any) => {
      const dayName = new Date(d.datetime).toLocaleDateString("en-US", {
        weekday: "long",
      });
      return dayName === selectedDay;
    });
    if (!selected) return [];

    selected.hours.forEach((h: any) => {
      hicons.push(h.conditions);

      if (system === "metric") {
        htemps.push(+fToCelius(h.temp));
      } else {
        htemps.push(h.temp);
      }
    });
    let test = hoursForecast(hicons, htemps);
    return test;
  }, [forecast, selectedDay, system]);

  // 🚀 LOAD DATA
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

    fetchWeatherData(query);
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
          {/* <button className="units-button">Units ▼</button> */}
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
        {/* Search Section */}
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
                        fetchWeatherData(city.name);
                      }}
                    >
                      {city.name}
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
          {/* LEFT COLUMN */}
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
                    <p className="day-temp">{temp} </p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN */}
          <section className="hourly-forecast">
            <div className="hourly-scroll">
              <div className="hourly-header">
                <h3 className="section-title">
                  <span>Hourly forecast</span>{" "}
                  <span>
                    {/* DROPDOWN */}
                    <div className="dropdown-container" ref={dropdownRef}>
                      <button
                        className="dropdown-button"
                        onClick={() => setIsOpen(!isOpen)}
                      >
                        {selectedDay}
                        <span className={`arrow ${isOpen ? "rotate" : ""}`}>
                          <img
                            src={`/assets/images/icon-dropdown.svg`}
                            alt=""
                          />
                        </span>
                      </button>

                      {isOpen && (
                        <div className="dropdown-menu">
                          {hourWeekD.map((day) => (
                            <button
                              key={day}
                              className={`dropdown-item ${
                                selectedDay === day ? "active" : ""
                              }`}
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
