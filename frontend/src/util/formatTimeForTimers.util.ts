export const formatTime = (time: number) => {
  const absoluteTime = Math.abs(time);
  const minutes = Math.floor(absoluteTime / 60);
  const seconds = Math.round(absoluteTime % 60); // Round seconds to nearest integer
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(seconds).padStart(2, "0");
  const sign = time < 0 ? "-" : ""; // Add sign for negative values
  return `${sign}${formattedMinutes}:${formattedSeconds}`;
};
