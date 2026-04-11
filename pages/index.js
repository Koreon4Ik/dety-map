import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  Plus, Search, Settings, Info, X, MapPin, 
  Navigation, Users, Link as LinkIcon, Sun, Moon 
} from 'lucide-react';

const MapCustom = dynamic(() => import('../components/Map'), { 
  ssr: false,
  loading: () => <div className="h-screen w-full bg-slate-950 flex items-center justify-center text-slate-500 font-black italic uppercase tracking-tighter">Завантаження мапи...</div>
});

export default function Home() {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState('ВСІ');
  const [search, setSearch] = useState('');
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [isDark, setIsDark] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/locations.json');
        if (res.ok) {
          const jsonData = await res.json();
          setData(jsonData);
        }
      } catch (err) { console.error("Помилка БД:", err); }
    };
    fetchData();
  }, []);

  const findMe = () => {
    if (!navigator.geolocation) return alert("Геолокація не підтримується");
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserLocation([pos.coords.latitude, pos.coords.longitude]),
      () => alert("Доступ до локації відхилено")
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
    card: isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200'
  };

  return (
    <div className={`h-screen w-full ${theme.bg} ${theme.text} relative overflow-hidden font-sans transition-colors duration-500`}>
      
      {/* HEADER */}
      <div className="absolute top-4 md:top-6 left-1/2 -translate-x-1/2 z-[1000] w-[95%] max-w-[1500px] flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-3 md:gap-5 items-stretch md:items-center">
          
          {/* LOGO BLOCK — ТЕПЕР ТОЧНО DeTy? */}
          <div className={`${theme.panel} backdrop-blur-2xl border p-3 pr-6 rounded-[32px] md:rounded-[40px] shadow-2xl flex items-center gap-4 shrink-0`}>
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-[24px] md:rounded-[28px] overflow-hidden bg-yellow-400 p-0.5 shadow-lg shadow-yellow-400/20">
              <img src="/img/logo.PNG" alt="Logo" className="w-full h-full object-cover rounded-[22px] md:rounded-[26px]" />
            </div>
            <div className="flex flex-col">
              <h1 className={`text-xl md:text-2xl font-black italic tracking-tighter leading-none ${theme.text}`}>
                DeTy<span className="text-yellow-500">?</span>
              </h1>
              <div className="flex items-center gap-3 mt-1">
                <button onClick={() => setIsAboutOpen(true)} className="text-yellow-500 text-[10px] font-black uppercase tracking-widest hover:opacity-70 transition-all flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-yellow-500 animate-pulse"></div>
                  Про проєкт
                </button>
                <button onClick={() => setIsDark(!isDark)} className={`p-1.5 rounded-full ${isDark ? 'bg-white/10 text-yellow-400' : 'bg-slate-200 text-slate-600'} transition-all`}>
                  {isDark ? <Sun size={14} /> : <Moon size={14} />}
                </button>
              </div>
            </div>
          </div>

          {/* SEARCH & FILTERS */}
          <div className={`${theme.panel} backdrop-blur-2xl border p-2 md:p-3 rounded-[32px] flex flex-grow items-center gap-3 shadow-2xl overflow-hidden`}>
            <div className={`flex items-center gap-3 ${theme.input} border rounded-2xl md:rounded-3xl px-4 py-2.5 md:py-3.5 flex-grow focus-within:border-yellow-400/50 transition-all`}>
              <Search size={18} className="text-slate-500" />
              <input 
                type="text"
                placeholder="Пошук локації..."
                className="bg-transparent outline-none w-full text-sm md:text-base font-bold placeholder:text-slate-500"
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar max-w-[40%] md:max-w-none">
              {['ВСІ', 'МЦ', 'NGO', 'ОСВІТА', 'КОВОРКІНГ', 'СПОРТ', 'КУЛЬТУРА'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-4 py-2.5 md:px-5 md:py-3 rounded-xl md:rounded-2xl text-[10px] font-black uppercase transition-all whitespace-nowrap ${
                    filter === cat 
                      ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/20' 
                      : `${isDark ? 'bg-white/5 text-slate-400' : 'bg-slate-100 text-slate-500'} hover:opacity-80`
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ABOUT MODAL — ТЕПЕР DeTy? ТУТ ТАКОЖ */}
      {isAboutOpen && (
        <div className={`fixed inset-0 z-[2000] flex items-center justify-center p-4 md:p-6 ${isDark ? 'bg-slate-950/95' : 'bg-white/90'} backdrop-blur-2xl animate-fade-in overflow-y-auto`}>
          <div className={`${isDark ? 'bg-slate-900/50 border-white/10' : 'bg-white border-slate-200'} border rounded-[48px] p-8 md:p-12 max-w-5xl w-full relative shadow-2xl my-auto`}>
            <button onClick={() => setIsAboutOpen(false)} className="absolute top-6 right-6 p-3 rounded-full hover:bg-yellow-400 hover:text-black transition-all text-slate-400 z-20">
              <X size={20} />
            </button>

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-8">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-yellow-400 rounded-[28px] p-0.5 shrink-0 shadow-xl">
                    <img src="/img/logo.PNG" className="w-full h-full object-cover rounded-[26px]" alt="DeTy?" />
                  </div>
                  <div>
                    <h2 className={`text-4xl md:text-5xl font-black italic tracking-tighter leading-none ${theme.text}`}>
                      DeTy<span className="text-yellow-500 font-black">?</span>
                    </h2>
                    <p className="text-yellow-500 font-bold uppercase tracking-[0.2em] text-[10px] mt-2 text-nowrap">Платформа можливостей</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-black uppercase italic flex items-center gap-2">
                    <Info size={18} className="text-yellow-400" /> Про проєкт
                  </h3>
                  <p className={`${theme.subtext} text-sm leading-relaxed font-medium`}>
                    Ми створили <span className="font-bold">DeTy?</span> як відповідь на інформаційний вакуум. Це інструмент для кожного, хто хоче змінити пасивне споживання на реальну дію.
                  </p>
                </div>

                <div className={`p-5 ${theme.card} border rounded-[28px]`}>
                  <h3 className="text-sm font-black uppercase italic flex items-center gap-2 mb-2">
                    <Users size={16} className="text-blue-400" /> Хто ми?
                  </h3>
                  <p className="text-xs opacity-70 leading-relaxed italic">Ініціатива відділу «Якісне дозвілля» Національної дитячої та молодіжної ради.</p>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-lg font-black uppercase italic flex items-center gap-2">
                  <Settings size={18} className="text-yellow-400" /> Наша екосистема
                </h3>
                
                <div className="grid gap-3">
                  <a href="https://www.instagram.com/child.youth.council/" target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 bg-gradient-to-r from-pink-500/10 to-purple-600/10 border border-white/5 rounded-2xl hover:scale-[1.02] transition-all">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-tr from-yellow-400 to-pink-600 rounded-xl text-white"><LinkIcon size={16} /></div>
                      <span className="text-xs font-black uppercase tracking-widest">Instagram</span>
                    </div>
                    <Plus size={14} className="opacity-50" />
                  </a>

                  <a href="https://t.me/childyouthcouncil_bot" target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 bg-blue-500/10 border border-white/5 rounded-2xl hover:scale-[1.02] transition-all">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500 rounded-xl text-white"><Navigation size={16} /></div>
                      <span className="text-xs font-black uppercase tracking-widest">Telegram Bot</span>
                    </div>
                    <div className="px-2 py-0.5 bg-blue-500 text-[8px] font-black rounded-full text-white">LIVE</div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MAP */}
      <div className="h-full w-full">
        <MapCustom points={filteredData} center={userLocation} isDark={isDark} />
      </div>

      {/* FLOATING CONTROLS (Desktop) */}
      <div className="hidden md:flex absolute bottom-10 right-10 z-[1000] flex-col gap-4">
        <button onClick={findMe} className={`${isDark ? 'bg-white text-black' : 'bg-slate-900 text-white'} p-4 rounded-2xl shadow-2xl active:scale-90 transition-all`}>
          <Navigation size={22} fill="currentColor" />
        </button>
        <Link href="/add" className="bg-yellow-400 text-black p-5 rounded-[28px] hover:scale-110 transition-all shadow-xl shadow-yellow-400/30">
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
        @keyframes fade-in { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .animate-fade-in { animation: fade-in 0.4s ease-out forwards; }
        body { margin: 0; overflow: hidden; }
      `}</style>
    </div>
  );
}