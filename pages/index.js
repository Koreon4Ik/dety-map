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
    subtext: isDark ? 'text-slate-400' : 'text-slate-500',
    input: isDark ? 'bg-white/5 border-white/5' : 'bg-slate-100 border-slate-200',
    dropdown: isDark ? 'bg-slate-800 border-white/10' : 'bg-white border-slate-200',
    card: isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200'
  };

  return (
    <div className={`h-screen w-full ${theme.bg} ${theme.text} relative overflow-hidden transition-colors duration-500`}>
      
      {/* HEADER BLOCK */}
      <div className="absolute top-4 md:top-6 left-1/2 -translate-x-1/2 z-[1000] w-[95%] max-w-[1400px] flex flex-col md:flex-row gap-3">
        
        {/* LOGO SECTION */}
        <div className={`${theme.panel} backdrop-blur-2xl border p-2.5 pr-6 rounded-[30px] shadow-2xl flex items-center gap-4 shrink-0`}>
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl overflow-hidden bg-yellow-400 p-0.5 shadow-lg shadow-yellow-400/20">
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
          <div className={`flex items-center gap-3 ${theme.input} border rounded-2xl px-4 py-2.5 flex-grow focus-within:border-yellow-400/50 transition-all`}>
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
                filter !== 'ВСІ' ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/20' : `${isDark ? 'bg-white/5 text-slate-300' : 'bg-slate-200 text-slate-700'}`
              }`}
            >
              <Filter size={14} className={filter !== 'ВСІ' ? 'text-black' : 'text-yellow-500'} />
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

      {/* ABOUT MODAL — ПОВНИЙ КОНТЕНТ ПОВЕРНЕНО */}
      {isAboutOpen && (
        <div className={`fixed inset-0 z-[2000] flex items-center justify-center p-4 md:p-6 ${isDark ? 'bg-slate-950/95' : 'bg-white/90'} backdrop-blur-2xl animate-fade-in overflow-y-auto`}>
          <div className={`${isDark ? 'bg-slate-900/50 border-white/10' : 'bg-white border-slate-200'} border rounded-[48px] md:rounded-[64px] p-8 md:p-12 max-w-5xl w-full relative shadow-2xl my-auto`}>
            
            <button 
              onClick={() => setIsAboutOpen(false)} 
              className="absolute top-6 right-6 p-4 bg-white/5 rounded-full hover:bg-yellow-400 hover:text-black transition-all text-slate-400 z-20 group"
            >
              <X size={20} className="group-hover:rotate-90 transition-transform" />
            </button>

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-8">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-yellow-400 rounded-3xl p-0.5 shrink-0 shadow-xl shadow-yellow-400/20">
                    <img src="/img/logo.PNG" className="w-full h-full object-cover rounded-[22px]" alt="DeTy?" />
                  </div>
                  <div>
                    <h2 className={`text-4xl md:text-5xl font-black italic uppercase tracking-tighter leading-none ${theme.text}`}>DeTy<span className="text-yellow-500">?</span></h2>
                    <p className="text-yellow-500 font-bold uppercase tracking-[0.2em] text-[10px] mt-2">Платформа можливостей</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-black uppercase italic text-white flex items-center gap-3">
                    <Info size={18} className="text-yellow-400" /> Про проєкт
                  </h3>
                  <div className={`space-y-4 ${theme.subtext} text-sm leading-relaxed font-medium`}>
                    <p>
                      Ми створили <span className={`font-bold ${theme.text}`}>DeTy?</span> як інструмент для кожного, хто хоче бути в центрі подій. Це відповідь на інформаційний вакуум: платформа, де зібрані всі «живі» локації твого міста.
                    </p>
                    <p>
                      Наша місія — об’єднати всі ініціативи України в одну екосистему, щоб ти завжди знав відповідь на питання: 
                      <span className="text-yellow-500 italic font-black ml-1 uppercase">Де ти сьогодні?</span>
                    </p>
                  </div>
                </div>

                <div className={`p-5 ${theme.card} border rounded-[28px]`}>
                  <h3 className="text-sm font-black uppercase italic flex items-center gap-2 mb-2">
                    <Users size={16} className="text-blue-400" /> Хто ми?
                  </h3>
                  <p className="text-xs opacity-70 leading-relaxed italic">Ініціатива відділу «Якісне дозвілля» Національної дитячої та молодіжної ради при МОН України.</p>
                </div>
              </div>

              <div className="space-y-8">
                <h3 className="text-lg font-black uppercase italic text-white flex items-center gap-3">
                  <Settings size={18} className="text-yellow-400" /> Наша екосистема
                </h3>
                
                <div className="grid grid-cols-1 gap-3">
                  <a href="https://www.instagram.com/child.youth.council/" target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 bg-gradient-to-r from-pink-500/10 to-purple-600/10 border border-white/5 rounded-2xl hover:scale-[1.02] transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-gradient-to-tr from-yellow-400 to-pink-600 rounded-xl text-white"><LinkIcon size={16} /></div>
                      <div>
                        <div className="text-xs font-black uppercase tracking-widest text-white">Instagram</div>
                        <div className="text-[9px] text-slate-500 font-bold">Наші новини та івенти</div>
                      </div>
                    </div>
                    <Plus size={14} className="opacity-50 group-hover:opacity-100 transition-opacity" />
                  </a>

                  <a href="https://t.me/childyouthcouncil_bot" target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 bg-blue-500/10 border border-white/5 rounded-2xl hover:scale-[1.02] transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-blue-500 rounded-xl text-white"><Navigation size={16} /></div>
                      <div>
                        <div className="text-xs font-black uppercase tracking-widest text-white">Telegram Bot</div>
                        <div className="text-[9px] text-slate-500 font-bold">Розумний помічник у кишені</div>
                      </div>
                    </div>
                    <div className="px-2 py-0.5 bg-blue-500 text-[8px] font-black rounded-full text-white animate-pulse">LIVE</div>
                  </a>
                </div>

                <div className={`p-5 ${theme.card} border rounded-[28px]`}>
                    <h4 className="text-[10px] font-black uppercase text-slate-500 mb-3 tracking-[0.2em]">Майбутні ініціативи</h4>
                    <div className="flex flex-wrap gap-2.5">
                      {['Reader', 'Skills', 'Donate-Dance'].map(proj => (
                        <div key={proj} className="px-3 py-1.5 bg-slate-800 rounded-lg text-[9px] font-bold text-slate-400 uppercase tracking-wider italic">Wiki-{proj}</div>
                      ))}
                    </div>
                  </div>
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

      {/* MOBILE BOTTOM NAV */}
      <div className={`md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[1000] w-[90%] ${theme.panel} backdrop-blur-3xl border rounded-[32px] p-2 flex items-center justify-around shadow-2xl`}>
        <button onClick={findMe} className="p-4 text-slate-500 hover:text-yellow-500 transition-colors"><Navigation size={20} /></button>
        <Link href="/add" className="bg-yellow-400 text-black p-4 rounded-2xl shadow-lg -translate-y-4 border-4 border-slate-950 active:scale-90 transition-all"><Plus size={24} strokeWidth={3} /></Link>
        <Link href="/login" className="p-4 text-slate-500 hover:text-yellow-500 transition-colors"><Settings size={20} /></Link>
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        @keyframes fade-in { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        body { margin: 0; padding: 0; overflow: hidden; }
      `}</style>
    </div>
  );
}