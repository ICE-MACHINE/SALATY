import { useState, useEffect } from "react";
import LocationContext from "./LocationContext.tsx";
import type { LocationInterface } from "./LocationInterface.tsx";

const LAT_KEY = "location_lat";
const LNG_KEY = "location_lng";
const PLACE_KEY = "location_place";

export default function LocationProvider({ children }: {children: React.ReactNode}) {
    const [lat, setLat] = useState<number>(() => {
        const stored = localStorage.getItem(LAT_KEY);
        return stored ? Number(stored) : 36.75;
    });
    const [lng, setLng] = useState<number>(() => {
        const stored = localStorage.getItem(LNG_KEY);
        return stored ? Number(stored) : 3.06;
    });
    const [place, setPlace] = useState<string | undefined>(() => {
        return localStorage.getItem(PLACE_KEY) || undefined;
    });

    useEffect(() => {
        localStorage.setItem(LAT_KEY, String(lat));
    }, [lat]);

    useEffect(() => {
        localStorage.setItem(LNG_KEY, String(lng));
    }, [lng]);

    useEffect(() => {
        if (place !== undefined) {
            localStorage.setItem(PLACE_KEY, place);
        }
    }, [place]);
   async function updatePlace(lat:number, long:number):Promise<void>{
   try{
       const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${long}&format=json`);
       if(!response.ok) 
           throw new Error("Unable to retrieve location");
       const data = await response.json();
       if(!data || !data.address) 
           throw new Error("Unable to retrieve location");
       const city = (() => {
           if (data.address?.city) return data.address.city;
           if (data.address?.town) return data.address.town;
           if (data.address?.village) return data.address.village;
           return "";
       })();
       const country = data.address?.country.split(" ")[0];
       const state = data.address?.state;
       setPlace(`${city ? city + ", " : ""}${state ? state + ", " : ""}${country ? country : ""}`);
       }
       catch(error){
           setPlace(undefined);
           alert(error);
       }
   }
    const setPosition = (latitude: number, longitude: number) => {
        updatePlace(latitude, longitude);
        setLat(latitude);
        setLng(longitude);
    };

    const getPosition = () => ({ lat, lng, place });

    const searchLocation = async (query: string) => {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json`);
            if (!response.ok) 
                throw new Error("Unable to retrieve location");
            const data = await response.json();
            if (!data || data.length === 0) 
                throw new Error("No results found");
            const { lat, lon } = data[0];
            setPosition(lat, lon);
        } catch (error) {
            setPlace(undefined);
            alert(error);
        }
    };
    
    const value: LocationInterface = {
        lat,
        lng,
        setPosition,
        getPosition,
        place,
        setPlace, 
        searchLocation,
    };

    return (
        <LocationContext.Provider value={value}>
            {children}
        </LocationContext.Provider>
    );
}