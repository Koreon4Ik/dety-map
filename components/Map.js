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

export default function Map({ points = [], onPointClick, center, zoom = 12 }) {
  
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

    // Приведення категорії до верхнього регістру для пошуку кольору
    const color = colors[category?.toUpperCase()] || colors['ІНШЕ'];

    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="background: ${color}; width: 22px; height: 22px; border-radius: 50%; border: 3px solid #0f172a; box-shadow: 0 0 15px ${color}88;"></div>`,
      iconSize: [22, 22],
      iconAnchor: [11, 11]
    });
  };

  // Іконка для самого користувача
  const userIcon = L.divIcon({
    className: 'user-marker',
    html: `<div class="user-pulse-container"><div class="user-pulse"></div><div class="user-dot"></div></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  });

  return (
    <div className="h-full w-full bg-slate-950">
      <MapContainer 
        center={[48.46, 35.04]} 
        zoom={zoom} 
        zoomControl={false} 
        style={{ height: '100%', width: '100%', background: '#020617' }}
      >
        <MapController center={center} />
        
        <TileLayer 
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; OSM'
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
            {/* Підказка при наведенні */}
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
        .leaflet-container { background: #020617 !important; }
        .leaflet-tooltip {
          background: white !important;
          border: none !important;
          border-radius: 12px !important;
          box-shadow: 0 10px 30px rgba(0,0,0,0.4) !important;
          padding: 8px 12px !important;
        }
        .user-pulse-container { position: relative; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; }
        .user-dot { width: 12px; height: 12px; background: #3b82f6; border: 2px solid white; border-radius: 50%; z-index: 2; box-shadow: 0 0 10px #3b82f6; }
        .user-pulse { position: absolute; width: 100%; height: 100%; background: #3b82f6; border-radius: 50%; opacity: 0.4; animation: user-ping 2s infinite ease-out; }
        @keyframes user-ping { 0% { transform: scale(0.5); opacity: 0.8; } 100% { transform: scale(2.5); opacity: 0; } }
      `}</style>
    </div>
  );
}