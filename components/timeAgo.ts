import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInMonths,
  differenceInWeeks,
} from "date-fns";

export function formatTimeAgo(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();

  const mins = differenceInMinutes(now, date);
  const hrs = differenceInHours(now, date);
  const days = differenceInDays(now, date);
  const weeks = differenceInWeeks(now, date);
  const months = differenceInMonths(now, date);

  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min${mins > 1 ? "" : ""} ago`;
  if (hrs < 24) return `${hrs} hr${hrs > 1 ? "" : ""} ago`;
  if (days < 7) return `${days} day${days > 1 ? "" : ""} ago`;
  if (weeks < 4) return `${weeks} week${weeks > 1 ? "" : ""} ago`;
  return `${months} month${months > 1 ? "" : ""} ago`;
}
