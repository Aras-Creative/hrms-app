import React, { useEffect, useState } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import useFetch from "../../hooks/useFetch";
import { IconCalendar, IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import Layouts from "./profile/Layouts";
import BottomNavigation from "../../components/BottomNav";

const localizer = momentLocalizer(moment);
const UserCalendar = () => {
  const { responseData: allEvents, refetch: eventRefetch } = useFetch("/event/all");
  const [holidays, setHolidays] = useState();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [eventDetails, setEventDetails] = useState(null);

  const handleEventClick = (event) => {
    setEventDetails(event);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  useEffect(() => {
    if (allEvents) {
      setHolidays(allEvents);
    }
  }, [allEvents]);
  return (
    <Layouts title={"Kalender"} backUrl={"/homepage"}>
      <div className="relative pt-14">
        <div className="w-full px-4 py-6 md:w-4/5 md:px-6 md:py-8 mx-auto overflow-y-auto">
          <Calendar
            style={{ minHeight: "75vh" }}
            localizer={localizer}
            events={holidays || []}
            views={["month", "day", "agenda"]}
            startOfWeek={1}
            step={30}
            className="rbc-calendar"
            eventPropGetter={() => ({
              className: "text-[8px] text-white bg-indigo-500 focus:bg-indigo-500 hover:bg-indigo-800",
            })}
            dayPropGetter={() => ({
              className: "text-[10px]",
            })}
            onSelectEvent={handleEventClick}
            components={{
              toolbar: CustomToolbar,
              month: {
                header: CustomHeader,
              },
            }}
          />
        </div>

        {/* Modal Design */}
        {modalIsOpen && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 sm:w-96 relative">
              {/* Close Button */}
              <button onClick={closeModal} className="absolute top-2 right-2 text-indigo-500 hover:text-indigo-700 text-2xl">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Title */}
              <h3 className="text-sm font-semibold text-indigo-500 truncate">{eventDetails?.title}</h3>

              <p className="text-xs text-gray-600 mt-2">
                <span className="font-medium">Date:</span>{" "}
                {new Date(eventDetails?.start).toLocaleDateString("id-ID", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>

              <p className="text-xs text-gray-600 mt-2">
                <span className="font-medium">Description:</span> {eventDetails?.description || "No description available"}
              </p>
            </div>
          </div>
        )}
      </div>
    </Layouts>
  );
};

const CustomHeader = (props) => {
  const dayOfWeek = localizer.format(props.date, "ddd");

  return (
    <div
      style={{
        fontSize: "10px",
        fontWeight: "bold",
        color: "#4F46E5",
        textAlign: "center",
        padding: "8px 0",
      }}>
      {dayOfWeek}
    </div>
  );
};

const CustomToolbar = (toolbarProps) => {
  const { onNavigate, label, date } = toolbarProps;

  const currentMonth = moment(date).format("MMMM YYYY");

  return (
    <div className="flex justify-center items-center space-x-2 p-2 mb-4">
      <button
        onClick={() => onNavigate("PREV")}
        className="flex items-center justify-center p-3 rounded-full bg-indigo-500 text-white hover:bg-indigo-600 transition duration-300 ease-in-out"
        style={{ minWidth: "16px", height: "16px" }}>
        <IconChevronLeft size={12} />
      </button>

      <button
        onClick={() => onNavigate("TODAY")}
        className="flex items-center justify-center p-3 rounded-full bg-indigo-500 text-white hover:bg-indigo-600 transition duration-300 ease-in-out"
        style={{ minWidth: "16px", height: "16px" }}>
        <span className="text-xs text-white font-semibold ">{currentMonth}</span>
      </button>

      <button
        onClick={() => onNavigate("NEXT")}
        className="flex items-center justify-center p-3 rounded-full bg-indigo-500 text-white hover:bg-indigo-600 transition duration-300 ease-in-out"
        style={{ minWidth: "16px", height: "16px" }}>
        <IconChevronRight size={12} />
      </button>
      <BottomNavigation />
    </div>
  );
};

export default UserCalendar;
