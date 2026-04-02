import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Plus, Search, Settings } from 'lucide-react';

const MapCustom = dynamic(() => import('../components/Map'), { 
  ssr: false,
  loading: () => <div className="h-screen w-full bg-slate-900 flex items-center justify-center text-slate-500 font-black italic uppercase tracking-tighter">Завантаження...</div>
});

export default function Home() {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState('ВСІ');
  const [search, setSearch] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/locations.json');
        if (res.ok) {
          const jsonData = await res.json();
          setData(jsonData);
        }
      } catch (err) {
        console.error("Помилка завантаження точок:", err);
      }
    };
    fetchData();
  }, []);

  const filteredData = data.filter(item => {
    const matchesFilter = filter === 'ВСІ' || item.category === filter;
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="h-screen w-full bg-slate-950 relative overflow-hidden font-sans">
      {/* ПАНЕЛЬ ПОШУКУ ТА ФІЛЬТРІВ */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[1000] w-[95%] max-w-5xl">
        <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 p-2 rounded-[32px] flex flex-wrap md:flex-nowrap items-center gap-3 shadow-2xl">
          <div className="flex items-center gap-3 bg-white/5 rounded-2xl px-4 py-2 flex-grow">
            <Search size={18} className="text-slate-500" />
            <input 
              type="text"
              placeholder="Знайти простір..."
              className="bg-transparent outline-none w-full text-white text-sm font-bold"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="flex gap-1 overflow-x-auto no-scrollbar">
            {['ВСІ', 'МЦ', 'NGO', 'ОСВІТА', 'КОВОРКІНГ', 'СПОРТ', 'КУЛЬТУРА'].map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all whitespace-nowrap ${
                  filter === cat ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/20' : 'bg-white/5 text-slate-400 hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* МАПА */}
      <div className="h-full w-full">
        <MapCustom 
          points={filteredData} 
          onPointClick={(loc) => router.push(`/location/${loc.id}`)} 
        />
      </div>

      {/* КНОПКИ У КУТКУ */}
      <div className="absolute bottom-8 right-8 z-[1000] flex flex-col gap-4">
        {/* Кнопка веде на LOGIN, а вже логін пустить в адмінку */}
        <Link href="/login" className="bg-slate-900 border border-white/10 text-white p-4 rounded-2xl hover:bg-white hover:text-black transition-all shadow-xl group">
          <Settings size={24} className="group-hover:rotate-90 transition-transform duration-500" />
        </Link>
        
        <Link href="/add" className="bg-yellow-400 text-black p-5 rounded-[24px] hover:bg-white transition-all shadow-2xl shadow-yellow-400/20 flex items-center justify-center">
          <Plus size={32} strokeWidth={3} />
        </Link>
      </div>
    </div>
  );
}