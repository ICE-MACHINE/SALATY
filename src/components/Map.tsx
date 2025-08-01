// components/MapComponent.tsx

import { useEffect, useRef, useState } from 'react';
import L, { Map as LeafletMap, Marker as LeafletMarker } from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MapComponent = () => {
  const mapRef = useRef<LeafletMap | null>(null);
  const markerRef = useRef<LeafletMarker | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  const [position, setPosition] = useState<{ lat: number; lng: number }>({
    lat: 36.75,
    lng: 3.06,
  });

  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapRef.current = L.map(mapContainerRef.current).setView(
      [position.lat, position.lng],
      13
    );

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(mapRef.current);

    markerRef.current = L.marker([position.lat, position.lng], {
      draggable: true,
    }).addTo(mapRef.current);

    markerRef.current.on('dragend', () => {
      const newPos = markerRef.current!.getLatLng();
      setPosition({ lat: newPos.lat, lng: newPos.lng });
    });

    mapRef.current.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      setPosition({ lat, lng });
      markerRef.current!.setLatLng([lat, lng]);
    });

    return () => {
      mapRef.current?.remove();
    };
  }, []);

  return (
    <div style={{ height: '100%', width: '100%',}}>
      <div
        ref={mapContainerRef}
        style={{ height: '100%', width: '100%', borderRadius: "50%" }}
      />
    </div>
  );
};

export default MapComponent;
