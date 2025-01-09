export const calculateDuration = (clockIn, clockOut) => {
  if (!clockIn || !clockOut) {
    return "N/A";
  }

  const clockInTime = new Date(`1970-01-01T${clockIn}Z`);
  const clockOutTime = new Date(`1970-01-01T${clockOut}Z`);

  const durationInMilliseconds = clockOutTime - clockInTime;

  const hours = Math.floor(durationInMilliseconds / 3600000);
  const minutes = Math.floor((durationInMilliseconds % 3600000) / 60000);

  return `${hours}h ${minutes}m`;
};

export const checkTime = (timeToCheck, treshold, isEarlyClockOutCheck = false) => {
  if (!timeToCheck) return false;
  const referenceTime = new Date();
  const [hours, minutes, seconds] = treshold.split(":");
  referenceTime.setHours(hours, minutes, seconds);

  const currentTime = new Date();
  const [checkHours, checkMinutes, checkSeconds] = timeToCheck.split(":");
  currentTime.setHours(checkHours, checkMinutes, checkSeconds);

  if (isEarlyClockOutCheck) {
    return currentTime <= referenceTime;
  }
  return currentTime > referenceTime;
};
