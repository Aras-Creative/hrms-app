import React, { useState } from "react";

function Timepicker() {
  const [selectedTime, setSelectedTime] = useState("");

  // Generate time options (e.g., every 30 minutes with seconds)
  const generateTimeOptions = () => {
    const times = [];
    for (let i = 0; i < 24; i++) {
      for (let j = 0; j < 60; j += 30) {
        for (let k = 0; k < 60; k += 10) {
          // Adding seconds options
          const hour = i.toString().padStart(2, "0");
          const minute = j.toString().padStart(2, "0");
          const second = k.toString().padStart(2, "0");
          times.push(`${hour}:${minute}:${second}`);
        }
      }
    }
    return times;
  };

  const handleChange = (e) => {
    setSelectedTime(e.target.value);
  };

  const timeOptions = generateTimeOptions();

  return (
    <div className="time-dropdown-container max-w-xs mx-auto mt-8">
      <label htmlFor="time-select" className="block text-sm font-medium text-gray-700 mb-2">
        Select a time:
      </label>
      <select
        id="time-select"
        value={selectedTime}
        onChange={handleChange}
        className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm max-h-60 overflow-y-auto"
      >
        <option value="">-- Select Time --</option>
        {timeOptions.map((time) => (
          <option key={time} value={time}>
            {time}
          </option>
        ))}
      </select>
      {selectedTime && (
        <p className="mt-2 text-sm text-gray-600">
          Selected time: <strong>{selectedTime}</strong>
        </p>
      )}
    </div>
  );
}

export default Timepicker;
