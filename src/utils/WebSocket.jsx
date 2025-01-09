import { io } from "socket.io-client";

export const initializeSocket = (url, options, handlers) => {
  const socket = io(url, options);

  socket.onAny((event, ...args) => {
    console.log(`Event received: ${event}`, args);
  });

  Object.entries(handlers).forEach(([event, handler]) => {
    socket.on(event, handler);
  });

  return () => {
    socket.disconnect();
  };
};
