"use client";
import { useState, useRef, useEffect, useMemo } from "react";
import Units from "./components/Units";
import { getWeather, searchCities, getCountryName } from "./utils/getWeather";
import {
  getDays,
  weekDays,
  weekForecast,
  hoursForecast,
} from "./utils/utilsFunc";
import { City, WeatherEntry, UnitSystem, HourEntry } from "./types/types";
import { fToCelius } from "./utils/utilsFunc";

const Home = () => {
  const [system, setSystem] = useState<UnitSystem>("metric");
  const [selectedDay, setSelectedDay] = useState<string>("Tuesday");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const dropUnitRef = useRef<HTMLDivElement | null>(null);
  const dropCities = useRef<HTMLDivElement | null>(null);
  const [query, setQuery] = useState<string>("haifa");
  const [cities, setCities] = useState<City[]>([]);
  const [weekD, setWeekD] = useState<WeatherEntry[]>([]);
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

  const setData = async (city: string) => {
    try {
      let resCity = await searchCities(city);
      let resCountry = await getCountryName(resCity[0].country);
      console.log("city", resCity);
      console.log("country", resCountry);
      let lon = resCity[0].coord.lon;
      let lat = resCity[0].coord.lat;
      let res = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
      let data = await res.json();
      setForecast(data);
      let { days }: any = data;
      let resDays = days.slice(0, 7);
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
      console.log(icons, minTemps, maxTemps);
      let weekF = weekForecast(icons, minTemps, maxTemps);
      console.log(weekF);

      setWeekD(weekF);
      let verbDays = getDays();
      console.log(verbDays);
      console.log(data);
      let { hours } = days[0];
      console.log(hours);
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
      console.log(hicons);
      console.log(htemps);
      setHourForecast(hoursForecast(hicons, htemps));
    } catch (err) {
      console.log(err);
    }
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
          {/* LEFT COLUMN */}
          <div className="left-column">
            <section className="current-weather">
              <div className="weather-main">
                <h2 className="city-name">Berlin, Germany</h2>
                <p className="date">Tuesday, Aug 5, 2025</p>
                <h1 className="temperature">20° ☀</h1>
              </div>

              <div className="weather-details">
                {[
                  ["Feels Like", "18°"],
                  ["Humidity", "46%"],
                  ["Wind", "14 km/h"],
                  ["Precipitation", "0 mm"],
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
                      />
                    </p>
                    <p className="day-temp">{temp}</p>
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
                          {weekDays.map((day) => (
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
