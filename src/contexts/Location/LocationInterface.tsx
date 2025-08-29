interface LocationInterface {
    lat: number;
    lng: number;
    setPosition: (lat: number, lng: number) => void;
    getPosition: () => { lat: number; lng: number, place?: string };
    place?: string;
    setPlace: (place: string | undefined) => void;
    searchLocation: (query: string) => Promise<void>;
    
}

export type { LocationInterface };