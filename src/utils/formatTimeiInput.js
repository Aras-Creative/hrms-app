export const formatTime = (time) => {
  let formattedTime = time.toString().replace(".", ":");
  if (formattedTime.length === 4) {
    formattedTime = `0${formattedTime}`;
  }
  return formattedTime;
};
