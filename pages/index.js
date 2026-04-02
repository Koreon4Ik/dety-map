import React, { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Search, X, Plus, MapPin, Info, Settings } from 'lucide-react';

// Динамічний імпорт карти, щоб уникнути помилок SSR (Server Side Rendering)
const Map = dynamic(() => import('../components/Map'), { 
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-slate-950 flex items-center justify-center text-yellow-400 font-black italic animate-pulse">
      ЗАВАНТАЖЕННЯ МАПИ...
    </div>
  )
});

export default function Home() {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState('Всі');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const categories = ['Всі', 'МЦ', 'NGO', 'Освіта', 'Коворкінг', 'Волонтерство', 'Спорт', 'Культура'];

  // НОВА ЛОГІКА: Завантаження даних із локального JSON файлу
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/locations.json');
        const jsonData = await response.json();
        
        // Перетворюємо дані у потрібний формат та фільтруємо некоректні координати
        const points = jsonData.map((item, index) => ({
          id: index,
          name: item.name || "Без назви",
          category: item.category || "Інше",
          description: item.description || "",
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lng)
        })).filter(p => !isNaN(p.lat) && !isNaN(p.lng));
        
        setData(points);
        setIsLoading(false);
      } catch (error) {
        console.error("Помилка завантаження locations.json:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Фільтрація точок за категорією та пошуком
  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchesFilter = filter === 'Всі' || item.category === filter;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [data, filter, searchQuery]);

  return (
    <div className="h-screen w-full bg-slate-950 flex flex-col font-sans overflow-hidden text-white relative">
      
      {/* ВЕРХНЯ ПАНЕЛЬ: ПОШУК ТА КАТЕГОРІЇ */}
      <nav className="absolute top-6 left-1/2 -translate-x-1/2 z-[1001] w-[92%] max-w-5xl">
        <div className="bg-slate-900/90 backdrop-blur-2xl border border-white/10 p-3 rounded-[32px] shadow-2xl flex flex-col md:flex-row gap-4 px-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Знайти простір..." 
              className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 pl-12 pr-6 text-sm outline-none focus:ring-1 focus:ring-yellow-400 transition-all" 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
            />
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
            {categories.map(cat => (
              <button 
                key={cat} 
                onClick={() => setFilter(cat)} 
                className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase whitespace-nowrap transition-all ${filter === cat ? 'bg-yellow-400 text-black' : 'text-slate-400 bg-white/5 hover:bg-white/10'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* ОСНОВНИЙ ЕКРАН МАПИ */}
      <main className="flex-1 relative">
        {isLoading ? (
          <div className="h-full w-full bg-slate-950 flex items-center justify-center">
             <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <Map points={filteredData} onPointClick={setSelectedPoint} />
        )}
        
        {/* КНОПКИ УПРАВЛІННЯ */}
        <div className="absolute bottom-10 right-6 z-[1001] flex flex-col gap-4">
          {/* Кнопка переходу в Адмінку */}
          <Link href="/admin" className="w-12 h-12 bg-slate-900/90 border border-white/10 text-white rounded-2xl flex items-center justify-center shadow-xl hover:bg-white hover:text-black transition-all">
            <Settings size={20} />
          </Link>
          
          {/* Кнопка "Додати" */}
          <Link href="/add" className="w-16 h-16 bg-yellow-400 text-black rounded-[24px] flex items-center justify-center shadow-2xl active:scale-95 transition-all hover:rotate-90">
            <Plus size={32} strokeWidth={3} />
          </Link>
        </div>

        {/* ДЕТАЛЬНА КАРТКА ОБРАНОГО ПРОСТОРУ */}
        {selectedPoint && (
          <div className="absolute bottom-10 left-6 right-6 md:right-auto md:top-32 md:bottom-auto z-[1002] md:w-[400px] bg-slate-900/95 backdrop-blur-3xl border border-white/10 rounded-[40px] shadow-2xl p-8 animate-in slide-in-from-bottom-10 fade-in duration-300">
            <button 
              onClick={() => setSelectedPoint(null)} 
              className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors p-2 bg-white/5 rounded-full"
            >
              <X size={18} />
            </button>
            
            <span className="bg-yellow-400 text-black text-[9px] font-black px-3 py-1 rounded-full uppercase italic mb-4 inline-block">
              {selectedPoint.category}
            </span>

            <h2 className="text-3xl font-black text-white italic uppercase leading-none tracking-tighter">
              {selectedPoint.name}
            </h2>
            
            <p className="text-slate-400 text-sm mt-4 line-clamp-4 leading-relaxed font-medium">
              {selectedPoint.description}
            </p>

            <div className="mt-8 flex items-center gap-1 text-slate-500 text-[10px] font-mono">
              <MapPin size={14} className="text-yellow-400" /> {selectedPoint.lat.toFixed(4)}, {selectedPoint.lng.toFixed(4)}
            </div>

            <button className="mt-8 w-full bg-white text-black font-black py-5 rounded-[24px] text-center text-[10px] uppercase italic hover:bg-yellow-400 transition-all active:scale-95 flex items-center justify-center gap-2">
              <Info size={14} /> Детальніше про простір
            </button>
          </div>
        )}
      </main>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}