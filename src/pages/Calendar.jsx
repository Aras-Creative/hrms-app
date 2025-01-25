import React, { useEffect, useState, useRef } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import DashboardLayouts from "../layouts/DashboardLayouts";
import FormInput from "../components/FormInput";
import useFetch from "../hooks/useFetch";
import Toast from "../components/Toast";

const localizer = momentLocalizer(moment);

const MyCalendar = () => {
  const [events, setEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [eventStart, setEventStart] = useState(new Date());
  const [eventEnd, setEventEnd] = useState(new Date());
  const [eventType, setEventType] = useState("");
  const [eventId, setEventId] = useState(null);
  const [toast, setToast] = useState({ type: "", message: "" });

  const toastTimeoutRef = useRef(null);

  const handleSelectSlot = ({ start, end }) => {
    setEventStart(setToStartOfDay(start));
    setEventEnd(setToStartOfDay(end));
    setModalOpen(true);
  };

  const { deleteData } = useFetch(`/event/${eventTitle}`, { method: "DELETE" });

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
    setEventId(event.id);
    setEventType(event.type);
    setModalOpen(true);
  };

  const handleDeleteEvent = async () => {
    await deleteData();
    setModalOpen(false);
    eventRefetch();
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

  const { submitData: createEvent } = useFetch("/event/create", { method: "POST" });
  const { responseData: allEvents, refetch: eventRefetch } = useFetch("/event/all");
  const [holidays, setHolidays] = useState();

  useEffect(() => {
    if (allEvents) {
      setHolidays(allEvents);
    }
  }, [allEvents]);

  const saveEventToBackend = async () => {
    const eventData = {
      id: eventId,
      title: eventTitle,
      start: eventStart,
      end: eventEnd,
      type: eventType,
    };
    try {
      const { success, error } = await createEvent(eventData);
      if (success) {
        eventRefetch();
      } else {
        setToast({ type: "error", message: error[0] });

        if (toastTimeoutRef.current) {
          clearTimeout(toastTimeoutRef.current);
        }

        toastTimeoutRef.current = setTimeout(() => {
          setToast({ type: "", message: "" });
        }, 3000);
      }
    } catch (error) {
      setToast({ type: "error", message: error.message });
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
              <h2 className="text-xl font-semibold mb-4">Add or Edit Event</h2>
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

              <div className="mb-4">
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
              </div>
              <div className="flex justify-between items-center">
                <button className="bg-red-500 px-3 py-2 rounded-xl text-white hover:bg-red-600" type="button" onClick={handleDeleteEvent}>
                  Delete
                </button>
                <div className="flex items-center">
                  <button onClick={handleAddEvent} className="bg-emerald-700 text-white px-4 py-2 rounded-md hover:bg-emerald-600 transition">
                    Save
                  </button>
                  <button onClick={resetForm} className="ml-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {toast.message !== "" && <Toast text={toast.message} type={toast.type} onClick={() => setToast({ type: "", message: "" })} />}
      </DashboardLayouts>
    </div>
  );
};

export default MyCalendar;
