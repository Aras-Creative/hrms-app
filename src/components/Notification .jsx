import { IconAlertCircleFilled, IconBell } from "@tabler/icons-react";
import React from "react";
import useFetch from "../hooks/useFetch";

const Notification = ({ onClose }) => {
  const { updateData: markAsRead } = useFetch("/dashboard/notifications/read", { method: "PUT" });
  const { responseData: notifications, loading } = useFetch(`/dashboard/notifications`);

  const handleClose = () => {
    markAsRead();
    onClose();
  };
  return (
    <div className="bg-white rounded-t-2xl rounded-bl-2xl overflow-hidden z-20 w-96 shadow-md">
      <div className="flex justify-between items-center border-b py-4 px-6">
        <h2 className="text-lg font-bold">Notifications</h2>
        <button type="button" onClick={handleClose} className="text-gray-500 hover:text-gray-700 transition-all duration-300 ease-in-out">
          Mark as read
        </button>
      </div>
      <div className="divide-y divide-gray-200">
        {notifications?.length > 0 ? (
          notifications.slice(0, 6).map((notification, index) => (
            <div key={index} className={`${notification.isRead ? "bg-white" : "bg-gray-100"} p-6`}>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  {notification.type === "info" ? <IconBell className="text-orange-500" /> : <IconAlertCircleFilled className="text-red-500" />}
                  <span className={`${notification.isRead ? "font-normal" : "font-bold"} ml-2 text-gray-600`}>{notification.title}</span>
                </div>

                <p className={`text-xs text-zinc-400`}>{new Date(notification.createdAt).toLocaleDateString("id-ID")}</p>
              </div>
              <p className="text-gray-500 text-sm mt-2">{notification.message}</p>
            </div>
          ))
        ) : (
          <p>No notifications available</p>
        )}
      </div>
    </div>
  );
};

export default Notification;
