export function formatDate(dateString: string) {
  if (!dateString) {
    return {
      formattedDate: "-",
      isPast: false,
    };
  }
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isPast = date < today;
  const formattedDate = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);

  return { formattedDate, isPast };
}

export function formatTimeInHoursMinutes(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  let result = "";
  if (hours > 0) {
    result += `${hours}h `;
  }
  if (minutes > 0) {
    result += `${minutes}m`;
  }

  return result || "0m";
}

// Format time in HH:MM:SS
export const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
};
