import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Plus, Search, Settings, Info, X } from 'lucide-react';

// Динамічний імпорт мапи для стабільної роботи Next.js (SSR: false)
const MapCustom = dynamic(() => import('../components/Map'), { 
  ssr: false,
  loading: () => (
    <div className="h-screen w-full bg-slate-950 flex items-center justify-center">
      <div className="text-slate-500 font-black italic uppercase tracking-tighter animate-pulse">
        Завантаження мапи...
      </div>
    </div>
  )
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
      } catch (err) {
        console.error("Помилка завантаження бази даних:", err);
      }
    };
    fetchData();
  }, []);

  // Логіка фільтрації та пошуку
  const filteredData = data.filter(item => {
    const matchesFilter = filter === 'ВСІ' || item.category === filter;
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="h-screen w-full bg-slate-950 relative overflow-hidden font-sans text-white">
      
      {/* --- ВЕРХНЯ ПАНЕЛЬ (HEADER) --- */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[1000] w-[95%] max-w-6xl flex flex-col gap-4">
        <div className="flex flex-wrap md:flex-nowrap items-center gap-4">
          
          {/* БЛОК ЛОГО ТА ПРО НАС */}
          <div className="flex items-center gap-3 bg-slate-900/90 backdrop-blur-xl border border-white/10 p-2 pr-4 rounded-3xl shadow-2xl animate-fade-in">
            <div className="w-10 h-10 rounded-2xl overflow-hidden flex items-center justify-center bg-white/5 animate-pulse-slow">
              <img 
                src="/img/logo.PNG" 
                alt="Logo" 
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=D&background=fbbf24&color=000"; }}
              />
            </div>
            <button 
              onClick={() => setIsAboutOpen(true)}
              className="text-[10px] font-black uppercase italic tracking-widest hover:text-yellow-400 transition-colors flex items-center gap-2"
            >
              <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
              Про нас
            </button>
          </div>

          {/* БЛОК ПОШУКУ ТА ФІЛЬТРІВ */}
          <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 p-2 rounded-[32px] flex flex-grow items-center gap-3 shadow-2xl overflow-hidden">
            <div className="flex items-center gap-3 bg-white/5 rounded-2xl px-4 py-2 flex-grow">
              <Search size={18} className="text-slate-500" />
              <input 
                type="text"
                placeholder="Пошук простору..."
                className="bg-transparent outline-none w-full text-sm font-bold text-white placeholder:text-slate-600"
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <div className="hidden lg:flex gap-1 pr-2">
              {['ВСІ', 'МЦ', 'NGO', 'ОСВІТА', 'КОВОРКІНГ', 'СПОРТ', 'КУЛЬТУРА'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-4 py-2.5 rounded-xl text-[9px] font-black uppercase transition-all whitespace-nowrap ${
                    filter === cat ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/20' : 'bg-white/5 text-slate-500 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* --- МОДАЛЬНЕ ВІКНО "ПРО НАС" --- */}
      {isAboutOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border border-white/10 rounded-[40px] p-8 md:p-12 max-w-2xl w-full relative shadow-2xl shadow-black/50">
            <button 
              onClick={() => setIsAboutOpen(false)}
              className="absolute top-6 right-6 p-2 bg-white/5 rounded-full hover:bg-white/10 transition-all text-slate-400 hover:text-white"
            >
              <X size={24} />
            </button>
            
            <span className="text-yellow-400 font-black uppercase italic tracking-widest text-xs">Інформація</span>
            <h2 className="text-4xl font-black italic uppercase tracking-tighter mt-2 mb-6">Мапа активних просторів</h2>
            
            <div className="text-slate-400 space-y-4 leading-relaxed text-lg">
              <p>Це інтерактивна платформа для швидкого пошуку молодіжних центрів, громадських організацій та коворкінгів.</p>
              <p>Ми збираємо всі важливі локації в один інструмент, щоб ви могли легко знайти місце для роботи, навчання чи волонтерства.</p>
              <p className="pt-6 border-t border-white/5 font-bold text-slate-200">
                Є цікава локація? Тисни на плюс і пропонуй її нам!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* --- МАПА --- */}
      <div className="h-full w-full">
        <MapCustom 
          points={filteredData} 
          onPointClick={(loc) => router.push(`/location/${loc.id}`)} 
        />
      </div>

      {/* --- КНОПКИ КЕРУВАННЯ (ПРАВИЙ НИЖНІЙ КУТ) --- */}
      <div className="absolute bottom-8 right-8 z-[1000] flex flex-col gap-4">
        {/* Кнопка Адмінки */}
        <Link href="/login" className="bg-slate-900 border border-white/10 text-white p-4 rounded-2xl hover:bg-white hover:text-black transition-all shadow-xl group">
          <Settings size={24} className="group-hover:rotate-90 transition-transform duration-500" />
        </Link>
        
        {/* Кнопка Додати (Сторінка з Google Form) */}
        <Link href="/add" className="bg-yellow-400 text-black p-5 rounded-[24px] hover:bg-white transition-all shadow-2xl shadow-yellow-400/20 flex items-center justify-center">
          <Plus size={32} strokeWidth={3} />
        </Link>
      </div>

      {/* --- ГЛОБАЛЬНІ АНІМАЦІЇ --- */}
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(0.96); }
        }
        .animate-fade-in { animation: fade-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-pulse-slow { animation: pulse-slow 4s infinite ease-in-out; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}