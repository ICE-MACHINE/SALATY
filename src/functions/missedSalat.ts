import { useEffect, useState } from "react";

/**
 * Returns true when the given time (HH:mm, 24-hour) has passed for today.
 * Example time: "04:30" or "16:05"
 * If `time` is falsy or invalid, the hook returns false.
 */
export default function useMissedSalat(time?: string): boolean {
  const [missed, setMissed] = useState<boolean>(() => {
    if (!time) return false;
    const target = parseTimeToToday(time);
    return Date.now() > target.getTime();
  });

  useEffect(() => {
    if (!time) {
      // No valid time: ensure missed is false and don't start an interval.
      setMissed(false);
      return;
    }

    function check() {
      const target = parseTimeToToday(time);
      setMissed(Date.now() > target.getTime());
    }

    // Check immediately and then every 15 seconds (adjust as needed).
    check();
    const id = setInterval(check, 15000);
    return () => clearInterval(id);
  }, [time]);

  return missed;
}

function parseTimeToToday(time?: string): Date {
  if (!time) {
    // If invalid or undefined, return a date far in the future so it's never considered missed.
    return new Date(8640000000000000);
  }

  const parts = time.split(":").map((p) => p.trim());
  const hStr = parts[0] ?? "0";
  const mStr = parts[1] ?? "0";
  const h = Number(hStr) || 0;
  const m = Number(mStr) || 0;
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), Math.min(Math.max(h, 0), 23), Math.min(Math.max(m, 0), 59), 0, 0);
}