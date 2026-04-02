import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';

function MapController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, zoom, { animate: true });
  }, [center, zoom, map]);
  return null;
}

export default function Map({ points, onPointClick, center, zoom }) {
  const customIcon = (cat) => {
    const colors = { 'МЦ': '#fbbf24', 'NGO': '#34d399', 'Освіта': '#60a5fa', 'Коворкінг': '#a78bfa' };
    return L.divIcon({
      className: 'custom-pin',
      html: `<div style="background:${colors[cat] || '#f43f5e'};width:22px;height:22px;border-radius:50%;border:3px solid white;box-shadow:0 4px 10px rgba(0,0,0,0.4);"></div>`,
      iconSize: [22, 22], iconAnchor: [11, 11]
    });
  };

  return (
    <MapContainer center={center} zoom={zoom} zoomControl={false} style={{ height: '100%', width: '100%' }}>
      <MapController center={center} zoom={zoom} />
      <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
      {points.map(loc => (
        <Marker key={loc.id} position={[loc.lat, loc.lng]} icon={customIcon(loc.category)} eventHandlers={{ click: () => onPointClick(loc) }} />
      ))}
    </MapContainer>
  );
}