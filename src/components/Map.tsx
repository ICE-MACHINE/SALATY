import { useEffect, useRef } from 'react';
import L, { Map as LeafletMap, Marker as LeafletMarker } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import useLocation from '../contexts/Location/UseLocation';
// leaflet marker icons 
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Ensure Leaflet CSS is loaded and marker icons are configured before map initialization
import 'leaflet/dist/leaflet.css';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const MapComponent = () => {
  const mapRef = useRef<LeafletMap | null>(null);
  const markerRef = useRef<LeafletMarker | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const { setPosition, getPosition } = useLocation();
  const position = getPosition();

  // Update marker and map when position changes
  useEffect(() => {
    if (!mapRef.current || !markerRef.current) return;
    mapRef.current.setView([position.lat, position.lng], mapRef.current.getZoom());
    markerRef.current.setLatLng([position.lat, position.lng]);
  }, [position.lat, position.lng]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize map
    mapRef.current = L.map(mapContainerRef.current, {
      center: [position.lat, position.lng],
      zoom: 13,
      zoomControl: false,
      attributionControl: false,
    });

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(mapRef.current);

    // Add draggable marker
    markerRef.current = L.marker([position.lat, position.lng], {
      draggable: true,
    }).addTo(mapRef.current);

    markerRef.current.on('dragend', () => {
      const newPos = markerRef.current!.getLatLng();
      setPosition(newPos.lat, newPos.lng);
    });

    mapRef.current.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      setPosition(lat, lng);
    });

    // Clean up
    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <div
        ref={mapContainerRef}
        style={{
          height: '100%',
          width: '100%',
          borderRadius: "50%",
          overflow: "hidden",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        }}
      />
    </div>
  );
};

export default MapComponent;
