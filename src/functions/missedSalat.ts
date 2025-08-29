import { useEffect, useState } from "react";

/**
 * Returns true when the given time (HH:mm, 24-hour) has passed for today.
 * Example time: "04:30" or "16:05"
 */
export default function useMissedSalat(time: string): boolean {
  const [missed, setMissed] = useState<boolean>(() => {
    const target = parseTimeToToday(time);
    return Date.now() > target.getTime();
  });

  useEffect(() => {
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

function parseTimeToToday(time: string): Date {
  const [hStr = "0", mStr = "0"] = time.split(":");
  const h = Number(hStr);
  const m = Number(mStr);
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0, 0);
}