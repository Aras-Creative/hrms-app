import React, { useEffect } from "react";
import Layouts from "./profile/Layouts";
import { useLocation } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import useAuth from "../../hooks/useAuth";
import { io } from "socket.io-client";
import { IconBell } from "@tabler/icons-react";
import NoNoitf from "../../assets/user/no-notif.webp";

const Notification = () => {
  const { profile } = useAuth();
  const { responseData: notifications, loading: notificationLoading, error: notificationError } = useFetch(`/notification/${profile.userId}`);

  const {
    submitData: readNotification,
    loading: readNotificationLoading,
    error: readNotificationError,
  } = useFetch(`/notification/${profile?.userId}/read`);

  useEffect(() => {
    readNotification();
  }, []);

  return (
    <Layouts title={"Notification"} backUrl={"/homepage"}>
      <div className="mt-14 bg-white py-2 h-screen overflow-auto">
        {notifications?.length > 0 ? (
          notifications?.map((notification, idx) => (
            <div
              key={idx}
              className={`flex items-start px-6 pb-4 pt-2 hover:bg-zinc-100 transition-all duration-300 ease-in-out  ${
                notification?.isRead ? "bg-white border-b" : "bg-blue-50 border-l-4 border-indigo-500"
              }`}
            >
              {/* Icon Notification */}
              <div className="flex-shrink-0 mt-2">
                <IconBell className="text-indigo-500" />
              </div>

              {/* Notification Text */}
              <div className="ml-4 flex-1">
                <h1 className={`${!notification?.isRead ? "font-bold" : "font-semibold text-gray-600"}`}>{notification?.title}</h1>
                <p className={`text-gray-800 text-sm `}>{notification?.message}</p>
                <p className="text-sm text-gray-500 mt-2">{new Date(notification?.createdAt).toLocaleDateString("id-ID")}</p>
              </div>

              {/* Read Status */}
              {!notification?.isRead && <div className="ml-4 text-sm text-gray-500 font-semibold">New</div>}
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-full">
            <img src={NoNoitf} alt="No Notification" className="w-80 h-80" />
          </div>
        )}
      </div>
    </Layouts>
  );
};

export default Notification;
