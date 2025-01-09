import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { IconBell, IconMail } from "@tabler/icons-react";
import { getGreeting } from "../utils/dateUtils";
import { useCurrentTime } from "../hooks/useCurrentTime";
import { initializeSocket } from "../utils/WebSocket";
import { BASE_API_URL } from "../config";
import Notification from "../components/Notification ";
import useFetch from "../hooks/useFetch";
import { RequestNotificationPermission, showDesktopNotification } from "../components/RequestNotificationPermission";

const DashboardLayouts = ({ children }) => {
  const [showNotification, setShowNotification] = useState(false);
  const [notifBadge, setNotifBadge] = useState(false);
  const { responseData: notifications, refetch } = useFetch(`/dashboard/notifications`);

  useEffect(() => {
    const cleanupSocket = initializeSocket(
      `${BASE_API_URL}admin`,
      {
        withCredentials: true,
        transports: ["websocket", "polling"],
      },
      {
        notification: (data) => {
          setNotifBadge(true);
          setShowNotification(true);
          showDesktopNotification(data);

          setTimeout(() => {
            setShowNotification(false);
          }, 10000);
        },
      }
    );
    RequestNotificationPermission();
    return cleanupSocket;
  }, []);

  const currentTime = useCurrentTime();
  const handleShowNotification = () => {
    setShowNotification((prev) => !prev);
  };

  const hasUnreadNotification = notifications?.some((notification) => !notification.isRead);

  return (
    <div className="flex h-screen flex-col relative w-full mx-auto">
      <header className="px-8 w-full py-3 flex justify-between items-center bg-slate-800 shadow">
        <div className="flex gap-3 items-center">
          <img className="w-44" src="/image/aras-logo.webp" alt="Aras Creative Logo" />
        </div>

        <div className="flex gap-3 items-center text-end">
          <div className="flex flex-col gap-1 text-white">
            <h1 className="text-lg">Now is {currentTime.format("hh:mm A")}</h1>
            <p className="text-sm text-white">{getGreeting()}</p>
          </div>
        </div>
      </header>
      <div className="flex flex-col h-screen overflow-y-auto scrollbar-none">
        <div className="flex flex-1 overflow-hidden">
          <aside>
            <nav id="sidebar" className="sidebar w-full h-full bg-white text-zinc-700 shadow-md relative">
              <Sidebar />
            </nav>
          </aside>
          <main className="w-full flex-1 overflow-y-auto h-full flex flex-col">
            <div className="w-full bg-zinc-100 flex-1">
              <section className="main-content flex-1 2xl:p-6 p-4">{children}</section>
            </div>
            <div className="flex items-center">
              <footer className="mt-4 text-center text-gray-600 w-full text-sm py-4">
                © {new Date().getFullYear()} Aras Creative. All rights reserved.
              </footer>
              <div className="w-full flex flex-1 items-center justify-end pr-8 py-6">
                <div className="relative">
                  <button
                    type="button"
                    onClick={handleShowNotification}
                    className="rounded-full p-4 bg-slate-800 hover:bg-slate-700 transition-all duration-300 ease-in-out text-slate-200"
                  >
                    <div className="relative">
                      <IconBell />
                      {(notifBadge || hasUnreadNotification) && <div className="absolute bg-red-500 h-2 w-2 top-0 right-0.5 rounded-full"></div>}
                    </div>
                  </button>
                  <div className="absolute bottom-0 flex-row-reverse right-16">
                    {showNotification && (
                      <Notification
                        onClose={() => {
                          setShowNotification((prev) => !prev);
                          setNotifBadge(false);
                          refetch();
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayouts;
