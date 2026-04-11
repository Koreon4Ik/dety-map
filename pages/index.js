import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  Plus, Search, Settings, Info, X, MapPin, 
  Navigation, Users, Link as LinkIcon, Sun, Moon, ChevronDown, Filter 
} from 'lucide-react';

const MapCustom = dynamic(() => import('../components/Map'), { 
  ssr: false,
  loading: () => <div className="h-screen w-full bg-slate-950 flex items-center justify-center text-slate-500 font-black italic uppercase tracking-tighter">Завантаження мапи...</div>
});

export default function Home() {
  const UKRAINE_CENTER = [48.3794, 31.1656];
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState('ВСІ');
  const [search, setSearch] = useState('');
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [mapConfig, setMapConfig] = useState({ center: UKRAINE_CENTER, zoom: 6 });
  const [isDark, setIsDark] = useState(true);
  
  const dropdownRef = useRef(null);
  const categories = ['ВСІ', 'МЦ', 'NGO', 'ОСВІТА', 'КОВОРКІНГ', 'СПОРТ', 'КУЛЬТУРА', 'ВОЛОНТЕРСТВО'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/locations.json');
        if (res.ok) {
          const jsonData = await res.json();
          setData(jsonData);
        }
      } catch (err) { console.error("Помилка завантаження:", err); }
    };
    fetchData();

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsFilterOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const findMe = () => {
    if (!navigator.geolocation) return alert("Геолокація не підтримується");
    navigator.geolocation.getCurrentPosition(
      (pos) => setMapConfig({ center: [pos.coords.latitude, pos.coords.longitude], zoom: 15 }),
      () => alert("Доступ обмежено")
    );
  };

  const filteredData = data.filter(item => {
    const matchesFilter = filter === 'ВСІ' || item.category?.toUpperCase() === filter.toUpperCase();
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const theme = {
    bg: isDark ? 'bg-slate-950' : 'bg-slate-50',
    panel: isDark ? 'bg-slate-900/90 border-white/10' : 'bg-white/95 border-slate-200',
    text: isDark ? 'text-white' : 'text-slate-900',
    input: isDark ? 'bg-white/5 border-white/5' : 'bg-slate-100 border-slate-200',
    dropdown: isDark ? 'bg-slate-800 border-white/10' : 'bg-white border-slate-200'
  };

  return (
    <div className={`h-screen w-full ${theme.bg} ${theme.text} relative overflow-hidden transition-colors duration-500`}>
      
      {/* HEADER BLOCK */}
      <div className="absolute top-4 md:top-6 left-1/2 -translate-x-1/2 z-[1000] w-[95%] max-w-[1400px] flex flex-col md:flex-row gap-3">
        
        {/* LOGO SECTION */}
        <div className={`${theme.panel} backdrop-blur-2xl border p-2.5 pr-6 rounded-[30px] shadow-2xl flex items-center gap-4 shrink-0`}>
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl overflow-hidden bg-yellow-400 p-0.5">
            <img src="/img/logo.PNG" alt="Logo" className="w-full h-full object-cover rounded-[14px]" />
          </div>
          <div>
            <h1 className="text-xl font-black italic tracking-tighter leading-none">
              DeTy<span className="text-yellow-500">?</span>
            </h1>
            <div className="flex items-center gap-3 mt-1">
              <button onClick={() => setIsAboutOpen(true)} className="text-yellow-500 text-[10px] font-black uppercase tracking-widest hover:opacity-70">Про проєкт</button>
              <button onClick={() => setIsDark(!isDark)} className="p-1 rounded-full opacity-50 hover:opacity-100 transition-all">
                {isDark ? <Sun size={14} /> : <Moon size={14} />}
              </button>
            </div>
          </div>
        </div>

        {/* SEARCH & FILTER SECTION */}
        <div className={`${theme.panel} backdrop-blur-2xl border p-2 rounded-[30px] flex flex-grow items-center gap-2 shadow-2xl`}>
          <div className={`flex items-center gap-3 ${theme.input} border rounded-2xl px-4 py-2.5 flex-grow`}>
            <Search size={18} className="text-slate-500" />
            <input 
              type="text" 
              placeholder="Пошук локації..." 
              className="bg-transparent outline-none w-full text-sm font-bold placeholder:text-slate-500"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* DROPDOWN */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase transition-all ${
                filter !== 'ВСІ' ? 'bg-yellow-400 text-black' : `${isDark ? 'bg-white/5 text-slate-300' : 'bg-slate-200 text-slate-700'}`
              }`}
            >
              <Filter size={14} />
              <span>{filter}</span>
              <ChevronDown size={14} className={`transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
            </button>

            {isFilterOpen && (
              <div className={`absolute top-full right-0 mt-2 w-56 p-2 rounded-3xl border ${theme.dropdown} shadow-2xl animate-fade-in`}>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => { setFilter(cat); setIsFilterOpen(false); }}
                    className={`w-full text-left px-4 py-3 rounded-2xl text-[10px] font-black uppercase transition-all ${
                      filter === cat ? 'bg-yellow-400 text-black' : `hover:${isDark ? 'bg-white/5' : 'bg-slate-100'}`
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL ABOUT */}
      {isAboutOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className={`${isDark ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-200'} border rounded-[40px] p-10 max-w-2xl w-full relative shadow-2xl`}>
            <button onClick={() => setIsAboutOpen(false)} className="absolute top-6 right-6 p-2 rounded-full hover:bg-yellow-400 hover:text-black transition-all text-slate-500"><X /></button>
            <div className="flex items-center gap-6 mb-8">
              <div className="w-20 h-20 bg-yellow-400 rounded-3xl p-0.5 shadow-xl shadow-yellow-400/20">
                <img src="/img/logo.PNG" className="w-full h-full object-cover rounded-[22px]" alt="DeTy?" />
              </div>
              <div>
                <h2 className="text-4xl font-black italic tracking-tighter">DeTy<span className="text-yellow-500">?</span></h2>
                <p className="text-yellow-500 font-bold uppercase tracking-[0.2em] text-[10px] mt-1">Платформа можливостей</p>
              </div>
            </div>
            <p className="text-slate-400 leading-relaxed font-medium mb-8">
              Ми створили <span className="text-yellow-500 font-bold">DeTy?</span> для того, щоб кожен молодий українець міг швидко знайти свій простір для розвитку, творчості та волонтерства.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <a href="https://t.me/childyouthcouncil_bot" className="flex items-center gap-3 p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20 hover:scale-105 transition-all">
                <div className="p-2 bg-blue-500 rounded-xl text-white"><Navigation size={18} /></div>
                <span className="text-[10px] font-black uppercase">Telegram Bot</span>
              </a>
              <div className="flex items-center gap-3 p-4 bg-yellow-400/10 rounded-2xl border border-yellow-400/20">
                <div className="p-2 bg-yellow-400 rounded-xl text-black"><Users size={18} /></div>
                <span className="text-[10px] font-black uppercase text-yellow-500">НДМР</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MAP SECTION */}
      <div className="h-full w-full">
        <MapCustom 
          points={filteredData} 
          center={mapConfig.center} 
          zoom={mapConfig.zoom} 
          isDark={isDark} 
        />
      </div>

      {/* FLOATING ACTION BUTTONS */}
      <div className="absolute bottom-8 right-8 z-[1000] flex flex-col gap-4">
        <button onClick={findMe} className="bg-white text-black p-4 rounded-2xl shadow-2xl active:scale-90 transition-all hover:bg-slate-100">
          <Navigation size={22} fill="currentColor" />
        </button>
        <Link href="/add" className="bg-yellow-400 text-black p-5 rounded-[28px] hover:scale-110 transition-all shadow-xl shadow-yellow-400/40">
          <Plus size={32} strokeWidth={3} />
        </Link>
      </div>

      <style jsx global>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        body { margin: 0; padding: 0; overflow: hidden; }
      `}</style>
    </div>
  );
}