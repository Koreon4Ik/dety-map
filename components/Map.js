import { MapContainer, TileLayer, Marker, useMap, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';

// Контролер для плавної зміни фокусу мапи
function MapController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      // Якщо центр змінився (наприклад, натиснули "Де я?"), мапа плавно летить туди
      map.setView(center, 15, { animate: true, duration: 1.5 });
    }
  }, [center, map]); // zoom прибрали з залежностей, щоб не "дьоргати" мапу при кожному наближенні користувачем
  return null;
}

export default function Map({ points = [], onPointClick, center, zoom = 12 }) {
  
  // Функція для створення маркерів локацій
  const createCustomIcon = (category) => {
    const colors = { 
      'МЦ': '#fbbf24',           // Жовтий
      'NGO': '#34d399',          // Зелений
      'Освіта': '#60a5fa',       // Блакитний
      'Коворкінг': '#a78bfa',    // Фіолетовий
      'Волонтерство': '#f472b6', // Рожевий
      'Спорт': '#fb7185',        // Червоний
      'Культура': '#2dd4bf',     // Бірюзовий
      'Інше': '#94a3b8' 
    };

    const color = colors[category] || colors['Інше'];

    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          background: ${color};
          width: 22px;
          height: 22px;
          border-radius: 50%;
          border: 3px solid #0f172a;
          box-shadow: 0 0 15px ${color}88;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        " onmouseover="this.style.transform='scale(1.4)'" onmouseout="this.style.transform='scale(1)'">
        </div>
      `,
      iconSize: [22, 22],
      iconAnchor: [11, 11]
    });
  };

  // Окремий стиль для маркера користувача (синя точка з пульсацією)
  const userIcon = L.divIcon({
    className: 'user-marker',
    html: `
      <div class="user-pulse-container">
        <div class="user-pulse"></div>
        <div class="user-dot"></div>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  });

  return (
    <div className="h-full w-full bg-slate-950">
      <MapContainer 
        center={[48.46, 35.04]} // Початковий центр (Дніпро)
        zoom={zoom} 
        zoomControl={false} 
        style={{ height: '100%', width: '100%', background: '#020617' }}
      >
        <MapController center={center} zoom={zoom} />
        
        <TileLayer 
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        />

        <ZoomControl position="bottomleft" />

        {/* Маркер користувача (якщо геолокація отримана) */}
        {center && (
          <Marker position={center} icon={userIcon} zIndexOffset={1000} />
        )}

        {/* Рендеринг точок з бази */}
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
        
        /* Стилізація маркера користувача */
        .user-pulse-container {
          position: relative;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .user-dot {
          width: 12px;
          height: 12px;
          background: #3b82f6;
          border: 2px solid white;
          border-radius: 50%;
          z-index: 2;
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.8);
        }
        
        .user-pulse {
          position: absolute;
          width: 100%;
          height: 100%;
          background: #3b82f6;
          border-radius: 50%;
          opacity: 0.4;
          animation: user-ping 2s infinite ease-out;
        }
        
        @keyframes user-ping {
          0% { transform: scale(0.5); opacity: 0.8; }
          100% { transform: scale(2.5); opacity: 0; }
        }

        .custom-marker {
          filter: drop-shadow(0 0 5px rgba(0,0,0,0.5));
        }
        
        .custom-marker:hover {
          z-index: 1000 !important;
        }
      `}</style>
    </div>
  );
}