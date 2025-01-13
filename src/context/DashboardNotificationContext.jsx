import React, { createContext, useContext, useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";

const DashboardNotificationContext = createContext();

export const DashboardNotificationProvider = ({ children }) => {
  const { responseData: notifications } = useFetch(`/dashboard/notifications`);
  const [data, setData] = useState([]);

  useEffect(() => {
    if (notifications) {
      setData(notifications);
    }
  }, [notifications]);

  const addNotification = (notification) => {
    setData((prevData) => [notification, ...prevData]);
  };

  const markAsRead = (id) => {
    setData((prevData) => prevData.map((notif) => (notif?.id === id ? { ...notif, isRead: true } : notif)));
  };

  return <DashboardNotificationContext.Provider value={{ data, addNotification, markAsRead }}>{children}</DashboardNotificationContext.Provider>;
};

export const useDashboardNotification = () => {
  const context = useContext(DashboardNotificationContext);
  if (context === undefined) {
    throw new Error("useDashboardNotification must be used within a DashboardNotificationProvider");
  }
  return context;
};
