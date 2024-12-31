import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import DashboardLayouts from "../layouts/DashboardLayouts";
import FormInput from "../components/FormInput";
import useFetch from "../hooks/useFetch";

const localizer = momentLocalizer(moment);

const MyCalendar = () => {
  const [events, setEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [eventStart, setEventStart] = useState(new Date());
  const [eventEnd, setEventEnd] = useState(new Date());
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

  const handleEventClick = (event) => {
    setEventTitle(event.title);
    setEventStart(setToStartOfDay(event.start));
    setEventEnd(setToStartOfDay(event.end));
    setModalOpen(true);
  };

  const handleDeleteEvent = (event) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this event?");
    if (confirmDelete) {
      setEvents((prevEvents) => prevEvents.filter((e) => e.id !== event.id));
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

  const { submitData: createEvent, loading: createEventLoading, error: createEventError } = useFetch("/event/create");
  const { responseData: allEvents, loading: eventsLoading, error: eventsError, refetch: eventRefetch } = useFetch("/event/all");
  const [holidays, setHolidays] = useState();

  useEffect(() => {
    if (allEvents) {
      setHolidays(allEvents);
    }
  }, [allEvents]);
  const saveEventToBackend = async (event) => {
    try {
      await createEvent(event);
      eventRefetch();
    } catch (error) {
      console.error("Error saving event:", error);
    }
  };

  return (
    <div>
      <DashboardLayouts>
        <div className="p-12">
          <Calendar
            localizer={localizer}
            events={holidays || []}
            selectable
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleEventClick}
            style={{ minHeight: "75vh" }}
            views={["month", "day", "agenda"]}
            startOfWeek={1}
            step={30}
            toolbarProps={{
              className: "bg-emerald-700 text-white py-2 px-4 rounded-t-lg shadow-md",
            }}
            eventPropGetter={() => ({
              className: "bg-emerald-700 text-white rounded-md px-2 py-1 shadow-md",
            })}
            dayPropGetter={(date) => {
              const today = new Date();
              const isToday =
                date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
              return {
                className: `p-4 text-center ${isToday ? "bg-emerald-50" : ""}`,
              };
            }}
          />
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
                value={{ label: eventType, value: eventType }}
                options={[
                  { value: "Holiday", label: "Holiday" },
                  { value: "Event", label: "Event" },
                  { value: "Appointment", label: "Appointment" },
                  { value: "Meeting", label: "Meeting" },
                  { value: "Task", label: "Task" },
                  { value: "Celebration", label: "Celebration" },
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
