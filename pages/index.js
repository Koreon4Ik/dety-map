import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Plus, Search, Settings, Info, X, MapPin } from 'lucide-react';

// Динамічний імпорт мапи (SSR: false для Leaflet)
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

  // Завантаження точок з public/locations.json
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

  // Фільтрація та пошук
  const filteredData = data.filter(item => {
    const matchesFilter = filter === 'ВСІ' || item.category === filter;
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="h-screen w-full bg-slate-950 relative overflow-hidden font-sans text-white">
      
      {/* --- ВЕРХНЯ ПАНЕЛЬ (HEADER) --- */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[1000] w-[95%] max-w-[1500px] flex flex-col md:flex-row gap-5 items-start md:items-center">
        
        {/* МАКСИМАЛЬНО ЗБІЛЬШЕНИЙ БЛОК ЛОГОТИПУ ТА ПРО НАС */}
        <div className="flex items-center gap-5 bg-slate-900/90 backdrop-blur-2xl border border-white/10 p-4 pr-7 rounded-[40px] shadow-2xl animate-fade-in shrink-0">
          
          {/* ВЕЛИКИЙ КОНТЕЙНЕР ДЛЯ КАРТИНКИ (LOGO) */}
          <div className="w-20 h-20 rounded-[30px] overflow-hidden flex items-center justify-center bg-yellow-400 p-0.5 shadow-2xl shadow-yellow-400/20 animate-pulse-slow">
            <img 
              src="/img/logo.PNG" 
              alt="Logo" 
              className="w-full h-full object-cover rounded-[28px]"
              onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=D&background=fbbf24&color=000&size=128"; }}
            />
          </div>
          
          <div className="flex flex-col gap-1.5">
            <h1 className="text-3xl font-black italic uppercase tracking-tighter leading-none mb-1 text-white">DETY MAP</h1>
            <button 
              onClick={() => setIsAboutOpen(true)}
              className="flex items-center gap-2 text-yellow-400 text-[11px] font-black uppercase tracking-[0.2em] hover:text-white transition-colors w-fit group"
            >
              <div className="relative flex h-3 w-3 items-center justify-center">
                <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75 group-hover:bg-white"></div>
                <div className="relative inline-flex h-2.5 w-2.5 rounded-full bg-yellow-500"></div>
              </div>
              Про нас
            </button>
          </div>
        </div>

        {/* БЛОК ПОШУКУ ТА ФІЛЬТРИ (залишаємо, але трохи збільшуємо) */}
        <div className="bg-slate-900/90 backdrop-blur-2xl border border-white/10 p-3 rounded-[32px] flex flex-grow items-center gap-3 shadow-2xl w-full">
          <div className="flex items-center gap-4 bg-white/5 rounded-3xl px-6 py-4 flex-grow border border-white/5 focus-within:border-yellow-400/50 transition-all">
            <Search size={22} className="text-slate-500" />
            <input 
              type="text"
              placeholder="Знайти коворкінг, молодіжний центр..."
              className="bg-transparent outline-none w-full text-base font-bold text-white placeholder:text-slate-600"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="hidden lg:flex gap-1.5 pr-2 no-scrollbar overflow-x-auto max-w-[500px]">
            {['ВСІ', 'МЦ', 'NGO', 'ОСВІТА', 'КОВОРКІНГ', 'СПОРТ'].map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-5 py-3.5 rounded-2xl text-[11px] font-black uppercase transition-all whitespace-nowrap tracking-wider active:scale-95 ${
                  filter === cat 
                    ? 'bg-yellow-400 text-black shadow-xl shadow-yellow-400/30' 
                    : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* --- МОДАЛЬНЕ ВІКНО "ПРО НАС" --- */}
      {isAboutOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-xl animate-fade-in">
          <div className="bg-slate-900 border border-white/10 rounded-[56px] p-12 md:p-16 max-w-4xl w-full relative shadow-2xl shadow-black/70 relative overflow-hidden">
            {/* Декор на фоні модалки */}
            <div className="absolute -top-32 -left-32 w-64 h-64 bg-yellow-400/5 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-yellow-400/5 rounded-full blur-3xl"></div>

            <button 
              onClick={() => setIsAboutOpen(false)}
              className="absolute top-8 right-8 p-3.5 bg-white/5 rounded-full hover:bg-white/10 transition-all text-slate-400 hover:text-white z-10"
            >
              <X size={28} />
            </button>
            
            <div className="flex flex-col md:flex-row items-center gap-8 mb-12 relative z-10">
               <div className="w-32 h-32 bg-yellow-400 rounded-[40px] p-1.5 shadow-2xl shadow-yellow-400/20 flex items-center justify-center overflow-hidden shrink-0 animate-pulse-slow">
                  <img src="/img/logo.PNG" className="w-full h-full object-cover rounded-[36px]" alt="Large Logo" />
               </div>
               <div>
                  <span className="text-yellow-400 font-black uppercase italic tracking-[0.4em] text-xs">Про проект</span>
                  <h2 className="text-6xl font-black italic uppercase tracking-tighter mt-1 leading-none text-white">DETY MAP</h2>
                  <p className="text-slate-400 text-base mt-2 flex items-center gap-2"><MapPin size={16} /> Карта активних просторів твого міста</p>
               </div>
            </div>
            
            <div className="text-slate-400 space-y-6 leading-relaxed text-xl font-medium relative z-10 max-w-3xl">
              <p>DETY MAP — це проект для молодих та активних, хто шукає своє місце сили. Ми зібрали всі круті локації твого міста на одній інтерактивній мапі.</p>
              <p>Тут ти знайдеш <strong className="text-white">молодіжні центри, громадські організації, коворкінги та хаби</strong>, де можна навчатися, працювати над власними проектами та знаходити однодумців.</p>
              
              <div className="pt-10 mt-10 border-t border-white/10 flex flex-col md:flex-row gap-8">
                <div className="bg-white/5 p-6 rounded-3xl flex-1 border border-white/5">
                   <h4 className="text-yellow-400 font-black uppercase italic text-sm mb-2">Для кого?</h4>
                   <p className="text-slate-300 text-base">Студенти, волонтери, стартапери та всі, хто хоче розвиватися та діяти.</p>
                </div>
                <div className="bg-white/5 p-6 rounded-3xl flex-1 border border-white/5">
                   <h4 className="text-yellow-400 font-black uppercase italic text-sm mb-2">Як допомогти?</h4>
                   <p className="text-slate-300 text-base">Тисни на "+" у кутку мапи та пропонуй нові локації для нашої бази даних.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- МАПА --- */}
      <div className="h-full w-full">
        <MapCustom points={filteredData} onPointClick={(loc) => router.push(`/location/${loc.id}`)} />
      </div>

      {/* --- ПЛАВАЮЧІ КНОПКИ КЕРУВАННЯ --- */}
      <div className="absolute bottom-10 right-10 z-[1000] flex flex-col gap-5">
        <Link href="/login" className="bg-slate-900 border border-white/10 text-white p-5 rounded-3xl hover:bg-white hover:text-black transition-all shadow-2xl group flex items-center justify-center">
          <Settings size={28} className="group-hover:rotate-180 transition-transform duration-700" />
        </Link>
        <Link href="/add" className="bg-yellow-400 text-black p-6 rounded-[32px] hover:scale-110 hover:-rotate-3 transition-all shadow-2xl shadow-yellow-400/30 flex items-center justify-center group active:scale-95">
          <Plus size={40} strokeWidth={4} className="group-hover:rotate-90 transition-transform" />
        </Link>
      </div>

      {/* --- ГЛОБАЛЬНІ СТИЛІ АНІМАЦІЙ --- */}
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); filter: brightness(1) contrast(1); }
          50% { transform: scale(0.97); filter: brightness(1.1) contrast(1.05); }
        }
        .animate-fade-in { animation: fade-in 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-pulse-slow { animation: pulse-slow 5s infinite ease-in-out; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        body { margin: 0; padding: 0; overflow: hidden; background: #020617; }
      `}</style>
    </div>
  );
}