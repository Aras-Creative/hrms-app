import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";
import DashboardLayouts from "../layouts/DashboardLayouts";
import FormInput from "../components/FormInput";

const localizer = momentLocalizer(moment);

const MyCalendar = () => {
  const [events, setEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [eventStart, setEventStart] = useState(new Date());
  const [eventEnd, setEventEnd] = useState(new Date());
  const [holidays, setHolidays] = useState([]);
  const [eventType, setEventType] = useState("");

  const handleSelectSlot = ({ start, end }) => {
    setEventStart(setToStartOfDay(start));
    setEventEnd(setToStartOfDay(end));
    setModalOpen(true);
  };

  const handleAddEvent = () => {
    if (eventTitle) {
      const newEvent = {
        start: setToStartOfDay(eventStart),
        end: setToStartOfDay(eventEnd),
        title: eventTitle,
        type: eventType,
      };
      setEvents([...events, newEvent]);
      saveEventToBackend(newEvent);
      resetForm();
    }
  };

  const resetForm = () => {
    setEventTitle("");
    setEventStart(new Date());
    setEventEnd(new Date());
    setModalOpen(false);
  };

  const setToStartOfDay = (date) => {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
  };

  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const response = await fetch(`https://api-harilibur.vercel.app/api`);
        const result = await response.json();
        const formattedHolidays = result
          .filter((holiday) => holiday.is_national_holiday === true)
          .map((holiday) => ({
            start: setToStartOfDay(new Date(holiday.holiday_date)),
            end: setToStartOfDay(new Date(holiday.holiday_date)),
            title: holiday.holiday_name,
          }));
        setHolidays(formattedHolidays);
      } catch (error) {
        console.error("Error fetching holidays: ", error);
      }
    };

    fetchHolidays();
  }, []);

  const saveEventToBackend = async (event) => {
    try {
      // Uncomment the line below to save the event to your backend
      // const response = await axios.post("http://localhost:5000/api/events", event);
      console.log("Event saved:", event);
    } catch (error) {
      console.error("Error saving event:", error);
    }
  };

  const combinedEvents = [...events, ...holidays];

  return (
    <div>
      <DashboardLayouts>
        <div className="p-12">
          <Calendar localizer={localizer} events={combinedEvents} selectable onSelectSlot={handleSelectSlot} style={{ height: 500 }} />
        </div>

        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96">
              <h2 className="text-xl font-semibold mb-4">Add Event</h2>
              <label className="block mb-2">
                Title:
                <input
                  type="text"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  placeholder="Event Title"
                />
              </label>
              <label className="block mb-2">
                Start:
                <input
                  type="datetime-local"
                  value={moment(eventStart).format("YYYY-MM-DDTHH:mm")}
                  onChange={(e) => setEventStart(new Date(e.target.value))}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </label>
              <label className="block mb-4">
                End:
                <input
                  type="datetime-local"
                  value={moment(eventEnd).format("YYYY-MM-DDTHH:mm")}
                  onChange={(e) => setEventEnd(new Date(e.target.value))}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </label>

              <FormInput
                type="select"
                label={"Event Type"}
                options={[
                  { value: "holiday", label: "Holiday" },
                  { value: "event", label: "Event" },
                  { value: "appointment", label: "Appointment" },
                  { value: "meeting", label: "Meeting" },
                  { value: "task", label: "Task" },
                  { value: "celebration", label: "Celebration" },
                ]}
                onChange={(e) => setEventType(e.value)}
              />
              <div className="flex justify-end">
                <button onClick={handleAddEvent} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">
                  Add Event
                </button>
                <button onClick={resetForm} className="ml-2 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </DashboardLayouts>
    </div>
  );
};

export default MyCalendar;
