"use client";
import { useState, useRef, useEffect } from "react";
import Units from "./components/Units";
import { getWeather } from "./utils/getWeather";
import { getCity } from "./utils/getWeather";

const Home = () => {
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const [selectedDay, setSelectedDay] = useState<string>("Tuesday");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <header className="header">
        <div className="header-container">
          <img className="logo" src={`/assets/images/logo.svg`} />
          {/* <button className="units-button">Units ▼</button> */}
          <Units />
        </div>
      </header>

      <main className="main">
        {/* Search Section */}
        <section className="search-section">
          <h1 className="main-title">How’s the sky looking today?</h1>

          <div className="search-box">
            <input
              className="search-input"
              type="text"
              placeholder="Search for a place..."
            />
            <button className="search-button">Search</button>
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
                {[
                  ["Tue", "🌧", "20° / 14°"],
                  ["Wed", "🌧", "21° / 15°"],
                  ["Thu", "☀", "24° / 14°"],
                  ["Fri", "⛅", "25° / 13°"],
                  ["Sat", "⛈", "21° / 15°"],
                  ["Sun", "🌧", "25° / 16°"],
                  ["Mon", "🌫", "24° / 15°"],
                ].map(([day, icon, temp]) => (
                  <div key={day} className="daily-card">
                    <p className="day">{day}</p>
                    <p className="weather-icon">{icon}</p>
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
                          {days.map((day) => (
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
                {[
                  ["0 PM", "☁ 20°"],
                  ["1 PM", "☁ 20°"],
                  ["2 PM", "☁ 20°"],
                  ["3 PM", "☁ 20°"],
                  ["4 PM", "⛅ 20°"],
                  ["5 PM", "☀ 20°"],
                  ["6 PM", "☁ 19°"],
                  ["7 PM", "🌧 18°"],
                  ["8 PM", "🌫 18°"],
                  ["9 PM", "🌧 17°"],
                  ["10 PM", "☁ 17°"],
                  ["3 PM", "☁ 20°"],
                  ["11 PM", "⛅ 20°"],
                  ["12 PM", "☀ 20°"],
                  ["13 PM", "☁ 19°"],
                  ["14 PM", "🌧 18°"],
                  ["15 PM", "🌫 18°"],
                  ["16 PM", "🌧 17°"],
                  ["18 PM", "☁ 17°"],
                  ["19 PM", "☁ 17°"],
                  ["20 PM", "☁ 17°"],
                  ["21 PM", "☁ 17°"],
                  ["22 PM", "☁ 17°"],
                  ["23 PM", "☁ 17°"],
                ].map(([time, temp]) => (
                  <div key={time} className="hour-item">
                    <p className="hour-time">{time}</p>
                    <p className="hour-temp">{temp}</p>
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
