import { MapContainer, TileLayer, Marker, useMap, ZoomControl, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';

// Контролер руху камери
function MapController({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 15, { animate: true, duration: 1.5 });
    }
  }, [center, map]);
  return null;
}

export default function Map({ points = [], onPointClick, center, zoom = 12, isDark = true }) {
  
  // Кастомна іконка для локацій
  const createCustomIcon = (category) => {
    const colors = { 
      'МЦ': '#fbbf24',
      'NGO': '#34d399',
      'ОСВІТА': '#60a5fa',
      'КОВОРКІНГ': '#a78bfa',
      'СПОРТ': '#fb7185',
      'КУЛЬТУРА': '#2dd4bf',
      'ВОЛОНТЕРСТВО': '#f472b6',
      'ІНШЕ': '#94a3b8' 
    };

    const color = colors[category?.toUpperCase()] || colors['ІНШЕ'];
    // Обводка маркера змінюється залежно від теми
    const borderColor = isDark ? '#0f172a' : '#ffffff';

    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="background: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 3px solid ${borderColor}; box-shadow: 0 0 15px ${color}88;"></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });
  };

  // Іконка для самого користувача
  const userIcon = L.divIcon({
    className: 'user-marker',
    html: `<div class="user-pulse-container"><div class="user-pulse"></div><div class="user-dot"></div></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  });

  // URL мапи залежно від теми
  const tileUrl = isDark 
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

  return (
    <div className={`h-full w-full ${isDark ? 'bg-slate-950' : 'bg-slate-100'} transition-colors duration-500`}>
      <MapContainer 
        center={[48.46, 35.04]} 
        zoom={zoom} 
        zoomControl={false} 
        style={{ height: '100%', width: '100%', background: isDark ? '#020617' : '#f8fafc' }}
      >
        <MapController center={center} />
        
        <TileLayer 
          url={tileUrl}
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        />

        <ZoomControl position="bottomleft" />

        {/* Маркер користувача */}
        {center && <Marker position={center} icon={userIcon} zIndexOffset={1000} />}

        {/* Точки локацій */}
        {points.map((loc) => (
          <Marker 
            key={loc.id} 
            position={[loc.lat, loc.lng]} 
            icon={createCustomIcon(loc.category)}
            eventHandlers={{
              click: () => { if (onPointClick) onPointClick(loc); }
            }}
          >
            <Tooltip direction="top" offset={[0, -10]} opacity={1} sticky>
              <div className="p-1">
                <div className="font-black uppercase italic text-[12px] text-slate-900 leading-tight">
                  {loc.name}
                </div>
                <div className="text-[10px] font-bold text-slate-500 uppercase mt-0.5 tracking-widest">
                  {loc.category}
                </div>
              </div>
            </Tooltip>
          </Marker>
        ))}
      </MapContainer>

      <style jsx global>{`
        .leaflet-container { background: ${isDark ? '#020617' : '#f8fafc'} !important; transition: background 0.5s ease; }
        .leaflet-tooltip {
          background: white !important;
          border: none !important;
          border-radius: 12px !important;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2) !important;
          padding: 8px 12px !important;
        }
        /* Стилізація кнопок зуму для світлої/темної теми */
        .leaflet-bar a {
          background-color: ${isDark ? '#0f172a' : '#ffffff'} !important;
          color: ${isDark ? '#ffffff' : '#0f172a'} !important;
          border-bottom: 1px solid ${isDark ? '#1e293b' : '#e2e8f0'} !important;
        }
        .user-pulse-container { position: relative; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; }
        .user-dot { width: 12px; height: 12px; background: #3b82f6; border: 2px solid white; border-radius: 50%; z-index: 2; box-shadow: 0 0 10px #3b82f6; }
        .user-pulse { position: absolute; width: 100%; height: 100%; background: #3b82f6; border-radius: 50%; opacity: 0.4; animation: user-ping 2s infinite ease-out; }
        @keyframes user-ping { 0% { transform: scale(0.5); opacity: 0.8; } 100% { transform: scale(2.5); opacity: 0; } }
      `}</style>
    </div>
  );
}