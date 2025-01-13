export const RequestNotificationPermission = async () => {
  if (!("Notification" in window)) {
    console.error("This browser does not support desktop notifications.");
    return;
  }

  if (Notification.permission === "granted") {
    return;
  }

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      console.log("Notification permission granted.");
    }
  }
};

export const showDesktopNotification = (data) => {
  if (Notification.permission === "granted") {
    const notification = new Notification(data.title || "New Notification", {
      body: data.message || "You have a new notification.",
      icon: "/image/aras-logo.webp",
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  }
};
