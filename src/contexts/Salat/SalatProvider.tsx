import { useState, useEffect } from "react";
import SalatContext from "./SalatContext";
import fetchSalatDataToday from "../../functions/fetchSalatData";
import type { Prayers, Salat } from "./SalatInterface";
import useLocation from "../Location/UseLocation";

export default function SalatProvider({ children }: {children: React.ReactNode}) {
    const [salatData, setSalatData] = useState<Prayers | null>(null);
    const location = useLocation();

    useEffect(() => {
        const fetchData = async () => {
            if (!location) return; // location provider may not be ready yet
            const data = await fetchSalatDataToday(location.lat, location.lng);
            if (!data) {
                setSalatData(null);
                return;
            }

            const names = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
            const todayTimings: Salat[] = names.map((name) => {
                const salatTime = (data.todayTimings && data.todayTimings[name]) || "";
                return {
                    salatName: name,
                    salatTime,
                    missed: false,
                    additionMin: 0,
                    finalSalatTime: () => salatTime,
                };
            });

            const transformed: Prayers = {
                todayTimings,
                todayDate: {
                    hijri: data.todayDate?.hijri?.date || "",
                    gregorian: data.todayDate?.gregorian?.date || "",
                    day: data.todayDate?.hijri?.weekday?.ar || "",
                },
            };

            setSalatData(transformed);
            try { localStorage.setItem("salatDataToday", JSON.stringify(transformed)); } catch {}
        };

        fetchData();
    }, [location]);

    return (
        <SalatContext.Provider value={salatData}>
            {children}
        </SalatContext.Provider>
    );
}

