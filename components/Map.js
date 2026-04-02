import { MapContainer, TileLayer, Marker, useMap, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';

// Контролер для зміни вигляду мапи (плавний перехід)
function MapController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom, { animate: true, duration: 1 });
    }
  }, [center, zoom, map]);
  return null;
}

export default function Map({ points = [], onPointClick, center = [48.46, 35.04], zoom = 12 }) {
  
  // Функція для створення стильних кастомних маркерів
  const createCustomIcon = (category) => {
    const colors = { 
      'МЦ': '#fbbf24',           // Жовтий
      'NGO': '#34d399',          // Зелений
      'Освіта': '#60a5fa',       // Блакитний
      'Коворкінг': '#a78bfa',    // Фіолетовий
      'Волонтерство': '#f472b6', // Рожевий
      'Спорт': '#fb7185',        // Червоний
      'Культура': '#2dd4bf',     // Бірюзовий
      'Інше': '#94a3b8'          // Сірий
    };

    const color = colors[category] || colors['Інше'];

    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          background: ${color};
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 3px solid #0f172a;
          box-shadow: 0 0 15px ${color}66;
          transition: all 0.3s ease;
        " onmouseover="this.style.transform='scale(1.3)'" onmouseout="this.style.transform='scale(1)'">
        </div>
      `,
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });
  };

  return (
    <div className="h-full w-full bg-slate-950">
      <MapContainer 
        center={center} 
        zoom={zoom} 
        zoomControl={false} 
        style={{ height: '100%', width: '100%', background: '#020617' }}
      >
        {/* Контролер для керування камерою мапи */}
        <MapController center={center} zoom={zoom} />
        
        {/* Темна стильна підкладка мапи (CartoDB Dark Matter) */}
        <TileLayer 
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        {/* Відображення кнопок зуму в зручному місці (опціонально) */}
        <ZoomControl position="bottomleft" />

        {/* Рендеринг точок з бази даних */}
        {points.map((loc) => (
          <Marker 
            key={loc.id} 
            position={[loc.lat, loc.lng]} 
            icon={createCustomIcon(loc.category)}
            eventHandlers={{
              click: () => {
                if (onPointClick) onPointClick(loc);
              }
            }}
          />
        ))}
      </MapContainer>

      <style jsx global>{`
        .leaflet-container {
          background: #020617 !important;
        }
        /* Стиль для активного маркера, якщо потрібно */
        .custom-marker:hover {
          z-index: 1000 !important;
        }
      `}</style>
    </div>
  );
}