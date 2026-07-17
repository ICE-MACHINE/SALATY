import React, { useEffect, useRef } from "react";
import L, { Map as LeafletMap, Marker as LeafletMarker } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useApp } from "../contexts/AppContext";

// Fix Leaflet's default marker asset resolution issue inside bundlers by using reliable CDNs
const markerIconUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png";
const markerIconRetinaUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png";
const markerShadowUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIconRetinaUrl,
  iconUrl: markerIconUrl,
  shadowUrl: markerShadowUrl,
});

export const MapComponent: React.FC = () => {
  const mapRef = useRef<LeafletMap | null>(null);
  const markerRef = useRef<LeafletMarker | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const { location, setLocation } = useApp();

  // Watch location context and synchronize the map view and marker
  useEffect(() => {
    if (!mapRef.current || !markerRef.current) return;
    const center = mapRef.current.getCenter();
    if (center.lat !== location.lat || center.lng !== location.lng) {
      mapRef.current.setView([location.lat, location.lng], mapRef.current.getZoom());
    }
    markerRef.current.setLatLng([location.lat, location.lng]);
  }, [location.lat, location.lng]);

  // Initial map setup
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Create Leaflet map centered at user's location
    mapRef.current = L.map(mapContainerRef.current, {
      center: [location.lat, location.lng],
      zoom: 11,
      zoomControl: true,
      attributionControl: true,
    });

    // Add high-resolution tile layer (OSM)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(mapRef.current);

    // Create a draggable marker representing user's active pin
    markerRef.current = L.marker([location.lat, location.lng], {
      draggable: true,
    }).addTo(mapRef.current);

    // Update location context when marker drag ends
    markerRef.current.on("dragend", () => {
      if (markerRef.current) {
        const newPos = markerRef.current.getLatLng();
        setLocation(newPos.lat, newPos.lng);
      }
    });

    // Support single-tapping anywhere on the map to relocate
    mapRef.current.on("click", (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      setLocation(lat, lng);
    });

    // Cleanup resources on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      markerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-inner">
      <div ref={mapContainerRef} className="w-full h-full min-h-[320px]" />
    </div>
  );
};

export default MapComponent;
