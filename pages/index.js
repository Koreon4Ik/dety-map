import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Динамічний імпорт мапи, щоб уникнути помилок SSR
const MapCustom = dynamic(() => import('../components/Map'), { 
  ssr: false,
  loading: () => <div className="h-full w-full bg-slate-900 animate-pulse" />
});

export default function Home() {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState('ВСІ');
  const [search, setSearch] = useState('');

  useEffect(() => {
    // Функція завантаження твого локального JSON
    const loadPoints = async () => {
      try {
        const res = await fetch('/locations.json');
        if (!res.ok) throw new Error('Файл не знайдено');
        const jsonData = await res.json();
        setData(jsonData);
      } catch (err) {
        console.error("Помилка:", err);
      }
    };
    loadPoints();
  }, []);

  const filteredData = data.filter(item => {
    const matchesFilter = filter === 'ВСІ' || item.category === filter;
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="h-screen w-full bg-slate-950 relative overflow-hidden">
      {/* Твій верхній бар з фільтрами та пошуком */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[1000] w-[90%] max-w-4xl">
        <div className="bg-slate-900/80 backdrop-blur-md border border-white/10 p-2 rounded-3xl flex items-center gap-4 shadow-2xl">
          <input 
            type="text"
            placeholder="Знайти простір..."
            className="bg-transparent px-6 py-3 outline-none w-64 text-white font-medium"
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {['ВСІ', 'МЦ', 'NGO', 'Освіта', 'Коворкінг', 'Спорт'].map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-3 rounded-2xl text-xs font-black uppercase transition-all ${
                  filter === cat ? 'bg-yellow-400 text-black' : 'bg-white/5 text-slate-400 hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Сама мапа */}
      <MapCustom points={filteredData} />
    </div>
  );
}