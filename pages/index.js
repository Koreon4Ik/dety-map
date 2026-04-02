import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Plus, Search, Settings, Info, X, Map as MapIcon } from 'lucide-react';

const MapCustom = dynamic(() => import('../components/Map'), { 
  ssr: false,
  loading: () => <div className="h-screen w-full bg-slate-950 flex items-center justify-center text-slate-500 font-black italic uppercase tracking-tighter">Завантаження...</div>
});

export default function Home() {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState('ВСІ');
  const [search, setSearch] = useState('');
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/locations.json');
        if (res.ok) {
          const jsonData = await res.json();
          setData(jsonData);
        }
      } catch (err) { console.error(err); }
    };
    fetchData();
  }, []);

  const filteredData = data.filter(item => {
    const matchesFilter = filter === 'ВСІ' || item.category === filter;
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="h-screen w-full bg-slate-950 relative overflow-hidden font-sans text-white">
      
      {/* --- HEADER --- */}
      <div className="absolute top-6 left-0 right-0 z-[1000] px-6">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row gap-4 items-start md:items-center">
          
          {/* ЗБІЛЬШЕНИЙ БЛОК ЛОГОТИПУ */}
          <div className="flex items-center gap-4 bg-slate-900/90 backdrop-blur-2xl border border-white/10 p-3 pr-6 rounded-[32px] shadow-2xl animate-fade-in shrink-0">
            <div className="w-16 h-16 rounded-[24px] overflow-hidden flex items-center justify-center bg-yellow-400 p-0.5 shadow-lg shadow-yellow-400/20 animate-pulse-slow">
              <img 
                src="/img/logo.png" 
                alt="Logo" 
                className="w-full h-full object-cover rounded-[22px]"
                onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=D&background=fbbf24&color=000"; }}
              />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-black italic uppercase tracking-tighter leading-none mb-1">DETY MAP</h1>
              <button 
                onClick={() => setIsAboutOpen(true)}
                className="flex items-center gap-1.5 text-yellow-400 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors w-fit"
              >
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
                Про нас
              </button>
            </div>
          </div>

          {/* ПОШУК ТА ФІЛЬТРИ */}
          <div className="bg-slate-900/90 backdrop-blur-2xl border border-white/10 p-2.5 rounded-[32px] flex flex-grow items-center gap-3 shadow-2xl w-full">
            <div className="flex items-center gap-3 bg-white/5 rounded-2xl px-5 py-3 flex-grow border border-white/5 focus-within:border-yellow-400/50 transition-all">
              <Search size={20} className="text-slate-500" />
              <input 
                type="text"
                placeholder="Пошук простору..."
                className="bg-transparent outline-none w-full text-base font-bold text-white placeholder:text-slate-600"
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <div className="hidden lg:flex gap-1.5 pr-2">
              {['ВСІ', 'МЦ', 'NGO', 'ОСВІТА', 'КОВОРКІНГ', 'СПОРТ', 'КУЛЬТУРА'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-5 py-3 rounded-2xl text-[11px] font-black uppercase transition-all whitespace-nowrap tracking-wider ${
                    filter === cat 
                      ? 'bg-yellow-400 text-black shadow-xl shadow-yellow-400/30 scale-105' 
                      : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL ABOUT */}
      {isAboutOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-xl animate-fade-in">
          <div className="bg-slate-900 border border-white/10 rounded-[48px] p-10 md:p-16 max-w-3xl w-full relative shadow-2xl">
            <button 
              onClick={() => setIsAboutOpen(false)}
              className="absolute top-8 right-8 p-3 bg-white/5 rounded-full hover:bg-white/10 transition-all text-slate-400 hover:text-white"
            >
              <X size={28} />
            </button>
            
            <div className="flex items-center gap-6 mb-10">
               <div className="w-24 h-24 bg-yellow-400 rounded-[32px] p-1 shadow-2xl shadow-yellow-400/20 flex items-center justify-center overflow-hidden shrink-0">
                  <img src="/img/logo.png" className="w-full h-full object-cover rounded-[28px]" alt="Large Logo" />
               </div>
               <div>
                  <span className="text-yellow-400 font-black uppercase italic tracking-[0.3em] text-xs">Про проект</span>
                  <h2 className="text-5xl font-black italic uppercase tracking-tighter mt-1 leading-none">DETY MAP</h2>
               </div>
            </div>
            
            <div className="text-slate-400 space-y-6 leading-relaxed text-xl font-medium">
              <p>Ми створили цю мапу, щоб кожен молодий активіст міг знайти своє місце сили у Дніпрі.</p>
              <p>Тут зібрані молодіжні центри, хаби, громадські простори та коворкінги, де можна навчатися, працювати та створювати майбутнє.</p>
              <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                   <h4 className="text-white font-black uppercase italic text-sm mb-2 underline decoration-yellow-400 underline-offset-4">Для кого?</h4>
                   <p className="text-sm">Студенти, волонтери, активісти та всі, хто хоче розвиватись.</p>
                </div>
                <div className="flex-1">
                   <h4 className="text-white font-black uppercase italic text-sm mb-2 underline decoration-yellow-400 underline-offset-4">Як допомогти?</h4>
                   <p className="text-sm">Тисни на "+" у кутку мапи та додавай нові круті локації.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MAP */}
      <div className="h-full w-full">
        <MapCustom points={filteredData} onPointClick={(loc) => router.push(`/location/${loc.id}`)} />
      </div>

      {/* FLOATING ACTIONS */}
      <div className="absolute bottom-10 right-10 z-[1000] flex flex-col gap-5">
        <Link href="/login" className="bg-slate-900 border border-white/10 text-white p-5 rounded-3xl hover:bg-white hover:text-black transition-all shadow-2xl group flex items-center justify-center">
          <Settings size={28} className="group-hover:rotate-180 transition-transform duration-700" />
        </Link>
        <Link href="/add" className="bg-yellow-400 text-black p-6 rounded-[32px] hover:scale-110 hover:-rotate-3 transition-all shadow-2xl shadow-yellow-400/30 flex items-center justify-center group">
          <Plus size={40} strokeWidth={3} className="group-hover:rotate-90 transition-transform" />
        </Link>
      </div>

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); filter: brightness(1); }
          50% { transform: scale(0.98); filter: brightness(1.1); }
        }
        .animate-fade-in { animation: fade-in 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        .animate-pulse-slow { animation: pulse-slow 5s infinite ease-in-out; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}