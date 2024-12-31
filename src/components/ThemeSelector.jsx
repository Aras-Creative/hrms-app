import React from "react";
import DarkTheme from "../assets/dark.jpeg";
import lightTheme from "../assets/light.png";
import systemTheme from "../assets/system.jpeg";

const ThemeSelector = ({ activeTheme, onThemeChange }) => {
  return (
    <div className="flex items-center space-x-4">
      {/* Light Theme Radio */}
      <div className="flex flex-col items-start gap-2">
        <input
          type="radio"
          id="light-theme"
          name="theme-switch"
          className="hidden peer"
          checked={activeTheme === "light"}
          onChange={() => onThemeChange("theme", "light")}
        />
        <label
          htmlFor="light-theme"
          className="flex justify-center flex-col items-start space-x-2 cursor-pointer border-2 border-gray-300 overflow-hidden rounded-lg transition-all duration-300 ease-out peer-checked:border-zinc-800"
        >
          {/* Light Theme Image */}
          <img src={lightTheme} alt="Light Mode" className="w-36 h-24 transition-all duration-300 ease-out" />
        </label>
        <span className="text-sm text-gray-500 peer-checked:text-zinc-800">Light Mode</span>
      </div>

      {/* Dark Theme Radio */}
      <div className="flex flex-col items-start gap-2">
        <input
          type="radio"
          id="dark-theme"
          name="theme-switch"
          className="hidden peer"
          checked={activeTheme === "dark"}
          onChange={() => onThemeChange("theme", "dark")}
        />

        <label
          htmlFor="dark-theme"
          className="flex justify-center flex-col items-start space-x-2 cursor-pointer border-2 border-gray-300 overflow-hidden rounded-lg transition-all duration-300 ease-out peer-checked:border-zinc-800"
        >
          {/* Dark Theme Image */}
          <img src={DarkTheme} alt="Dark Mode" className="w-36 h-24 transition-all duration-300 ease-out" />
        </label>
        <span className="text-sm text-gray-500 peer-checked:text-zinc-800">Dark Mode</span>
      </div>

      <div className="flex flex-col items-start gap-2">
        <input
          type="radio"
          id="system-theme"
          name="theme-switch"
          className="hidden peer"
          checked={activeTheme === "system"}
          onChange={() => onThemeChange("theme", "system")}
        />

        <label
          htmlFor="system-theme"
          className="flex justify-center flex-col items-start space-x-2 cursor-pointer border-2 border-gray-300 overflow-hidden rounded-lg transition-all duration-300 ease-out peer-checked:border-zinc-800"
        >
          {/* Dark Theme Image */}
          <img src={systemTheme} alt="system-theme" className="w-36 h-24 transition-all duration-300 ease-out" />
        </label>
        <span className="text-sm text-gray-500 peer-checked:text-zinc-800">System preference</span>
      </div>
    </div>
  );
};

export default ThemeSelector;
