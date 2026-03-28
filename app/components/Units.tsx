import { useState, forwardRef } from "react";
import { Settings } from "lucide-react";

interface UnitsProps {
  system: "metric" | "imperial";
  setSystem: (system: "metric" | "imperial") => void;
  unitOpen: boolean;
  setUnitOpen: (value: boolean) => void;
}

const Units = forwardRef<HTMLDivElement, UnitsProps>(
  ({ unitOpen, setUnitOpen, system, setSystem }, ref) => {
    const SYSTEMS = {
      metric: {
        label: "Switch to Imperial",
        temperature: "Celsius (°C)",
        wind: "km/h",
        precipitation: "Millimeters (mm)",
      },
      imperial: {
        label: "Switch to Metric",
        temperature: "Fahrenheit (°F)",
        wind: "mph",
        precipitation: "Inches (in)",
      },
    };

    const OPTIONS = {
      temperature: ["Celsius (°C)", "Fahrenheit (°F)"],
      wind: ["km/h", "mph"],
      precipitation: ["Millimeters (mm)", "Inches (in)"],
    };

    const toggle = () => setSystem(system === "metric" ? "imperial" : "metric");

    const active = SYSTEMS[system];

    return (
      <div className="units" ref={ref}>
        {/* Button */}
        <button className="units-btn" onClick={() => setUnitOpen(!unitOpen)}>
          <Settings size={16} />
          Units
          <span className="caret">▾</span>
        </button>

        {/* Dropdown */}
        {unitOpen && (
          <div className="units-panel">
            <div className="units-header" onClick={toggle}>
              {active.label}
            </div>

            {/* Temperature */}
            <div className="units-section">
              <div className="units-label">Temperature</div>

              <div
                className={`units-option ${system === "metric" ? "active" : ""}`}
              >
                {OPTIONS.temperature[0]}
                {system === "metric" && (
                  <span>
                    <img src={`/assets/images/icon-checkmark.svg`} />
                  </span>
                )}
              </div>

              <div
                className={`units-option ${system === "imperial" ? "active" : ""}`}
              >
                {OPTIONS.temperature[1]}
                {system === "imperial" && (
                  <span>
                    <img src={`/assets/images/icon-checkmark.svg`} />
                  </span>
                )}
              </div>
            </div>

            <div className="units-divider" />

            {/* Wind */}
            <div className="units-section">
              <div className="units-label">Wind Speed</div>

              <div
                className={`units-option ${system === "metric" ? "active" : ""}`}
              >
                km/h
                {system === "metric" && (
                  <span>
                    <img src={`/assets/images/icon-checkmark.svg`} />
                  </span>
                )}
              </div>

              <div
                className={`units-option ${system === "imperial" ? "active" : ""}`}
              >
                mph
                {system === "imperial" && (
                  <span>
                    <img src={`/assets/images/icon-checkmark.svg`} />
                  </span>
                )}
              </div>
            </div>
            <div className="units-divider" />

            {/* Precipitation */}

            <div className="units-section">
              <div className="units-label">Precipitation</div>

              <div
                className={`units-option ${system === "metric" ? "active" : ""}`}
              >
                Millimeters (mm)
                {system === "metric" && (
                  <span>
                    <img src={`/assets/images/icon-checkmark.svg`} />
                  </span>
                )}
              </div>

              <div
                className={`units-option ${system === "imperial" ? "active" : ""}`}
              >
                Inches (in)
                {system === "imperial" && (
                  <span>
                    <img src={`/assets/images/icon-checkmark.svg`} />
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  },
);

Units.displayName = "Units";
export default Units;
