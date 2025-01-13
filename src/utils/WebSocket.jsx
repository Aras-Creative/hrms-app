import { io } from "socket.io-client";

export const initializeSocket = (url, options, handlers) => {
  const socket = io(url, options);

  Object.entries(handlers).forEach(([event, handler]) => {
    socket.on(event, handler);
  });

  return () => {
    socket.disconnect();
  };
};
