import { forwardRef } from "react";
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
      },
      imperial: {
        label: "Switch to Metric",
      },
    };

    const toggle = () => setSystem(system === "metric" ? "imperial" : "metric");

    return (
      <div className="units" ref={ref}>
        {/* ✅ Button (ARIA added, no design change) */}
        <button
          className="units-btn"
          onClick={() => setUnitOpen(!unitOpen)}
          aria-expanded={unitOpen}
          aria-controls="units-menu"
          aria-haspopup="menu"
          type="button"
        >
          <Settings size={16} aria-hidden="true" />
          Units
          <span className="caret">▾</span>
        </button>

        {/* Dropdown */}
        {unitOpen && (
          <div className="units-panel" id="units-menu" role="menu">
            {/* Header (still looks same, now accessible) */}
            <div
              className="units-header"
              role="menuitem"
              tabIndex={0}
              onClick={toggle}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggle();
                }
              }}
            >
              {SYSTEMS[system].label}
            </div>

            {/* Temperature */}
            <div className="units-section">
              <div className="units-label">Temperature</div>

              <div
                role="menuitemradio"
                aria-checked={system === "metric"}
                tabIndex={0}
                className={`units-option ${
                  system === "metric" ? "active" : ""
                }`}
                onClick={() => setSystem("metric")}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSystem("metric");
                  }
                }}
              >
                Celsius (°C)
                {system === "metric" && (
                  <span>
                    <img
                      src="/assets/images/icon-checkmark.svg"
                      alt="checkmark"
                    />
                  </span>
                )}
              </div>

              <div
                role="menuitemradio"
                aria-checked={system === "imperial"}
                tabIndex={0}
                className={`units-option ${
                  system === "imperial" ? "active" : ""
                }`}
                onClick={() => setSystem("imperial")}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSystem("imperial");
                  }
                }}
              >
                Fahrenheit (°F)
                {system === "imperial" && (
                  <span>
                    <img
                      src="/assets/images/icon-checkmark.svg"
                      alt="checkmark"
                    />
                  </span>
                )}
              </div>
            </div>

            <div className="units-divider" />

            {/* Wind */}
            <div className="units-section">
              <div className="units-label">Wind Speed</div>

              <div
                role="menuitemradio"
                aria-checked={system === "metric"}
                tabIndex={0}
                className={`units-option ${
                  system === "metric" ? "active" : ""
                }`}
                onClick={() => setSystem("metric")}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSystem("metric");
                  }
                }}
              >
                km/h
                {system === "metric" && (
                  <span>
                    <img
                      src="/assets/images/icon-checkmark.svg"
                      alt="checkmark"
                    />
                  </span>
                )}
              </div>

              <div
                role="menuitemradio"
                aria-checked={system === "imperial"}
                tabIndex={0}
                className={`units-option ${
                  system === "imperial" ? "active" : ""
                }`}
                onClick={() => setSystem("imperial")}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSystem("imperial");
                  }
                }}
              >
                mph
                {system === "imperial" && (
                  <span>
                    <img
                      src="/assets/images/icon-checkmark.svg"
                      alt="checkmark"
                    />
                  </span>
                )}
              </div>
            </div>

            <div className="units-divider" />

            {/* Precipitation */}
            <div className="units-section">
              <div className="units-label">Precipitation</div>

              <div
                role="menuitemradio"
                aria-checked={system === "metric"}
                tabIndex={0}
                className={`units-option ${
                  system === "metric" ? "active" : ""
                }`}
                onClick={() => setSystem("metric")}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSystem("metric");
                  }
                }}
              >
                Millimeters (mm)
                {system === "metric" && (
                  <span>
                    <img
                      src="/assets/images/icon-checkmark.svg"
                      alt="checkmark"
                    />
                  </span>
                )}
              </div>

              <div
                role="menuitemradio"
                aria-checked={system === "imperial"}
                tabIndex={0}
                className={`units-option ${
                  system === "imperial" ? "active" : ""
                }`}
                onClick={() => setSystem("imperial")}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSystem("imperial");
                  }
                }}
              >
                Inches (in)
                {system === "imperial" && (
                  <span>
                    <img
                      src="/assets/images/icon-checkmark.svg"
                      alt="checkmark"
                    />
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
