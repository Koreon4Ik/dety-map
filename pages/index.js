import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Plus, Search, Settings, Info, X, MapPin, Navigation, Users, Link as LinkIcon } from 'lucide-react';
} from 'lucide-react';

// Динамічний імпорт мапи
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
  const router = useRouter();

  // Завантаження даних
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

  // Функція геолокації
  const findMe = () => {
    if (!navigator.geolocation) {
      alert("Геолокація не підтримується");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation([position.coords.latitude, position.coords.longitude]);
      },
      () => { alert("Доступ до локації відхилено"); }
    );
  };

  // РОЗУМНА ФІЛЬТРАЦІЯ (ігнорує великі/малі літери)
  const filteredData = data.filter(item => {
    const itemCategory = item.category ? item.category.toUpperCase() : '';
    const selectedFilter = filter.toUpperCase();

    const matchesFilter = selectedFilter === 'ВСІ' || itemCategory === selectedFilter;
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="h-screen w-full bg-slate-950 relative overflow-hidden font-sans text-white">
      
      {/* HEADER */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[1000] w-[95%] max-w-[1500px] flex flex-col md:flex-row gap-5 items-start md:items-center">
        
        {/* LOGO BLOCK */}
        <div className="flex items-center gap-5 bg-slate-900/90 backdrop-blur-2xl border border-white/10 p-4 pr-7 rounded-[40px] shadow-2xl animate-fade-in shrink-0">
          <div className="w-20 h-20 rounded-[30px] overflow-hidden flex items-center justify-center bg-yellow-400 p-0.5 shadow-2xl shadow-yellow-400/20 animate-pulse-slow">
            <img 
              src="/img/logo.PNG" 
              alt="Logo" 
              className="w-full h-full object-cover rounded-[28px]"
              onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=D&background=fbbf24&color=000&size=128"; }}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <h1 className="text-3xl font-black italic uppercase tracking-tighter leading-none text-white">DETY MAP</h1>
            <button 
              onClick={() => setIsAboutOpen(true)}
              className="flex items-center gap-2 text-yellow-400 text-[11px] font-black uppercase tracking-[0.2em] hover:text-white transition-colors w-fit group"
            >
              <div className="relative flex h-3 w-3 items-center justify-center">
                <div className="animate-ping absolute h-full w-full rounded-full bg-yellow-400 opacity-75"></div>
                <div className="relative h-2.5 w-2.5 rounded-full bg-yellow-500"></div>
              </div>
              Про нас
            </button>
          </div>
        </div>

        {/* SEARCH & FILTERS */}
        <div className="bg-slate-900/90 backdrop-blur-2xl border border-white/10 p-3 rounded-[32px] flex flex-grow items-center gap-3 shadow-2xl w-full overflow-hidden">
          <div className="flex items-center gap-4 bg-white/5 rounded-3xl px-6 py-4 flex-grow border border-white/5 focus-within:border-yellow-400/50 transition-all">
            <Search size={22} className="text-slate-500" />
            <input 
              type="text"
              placeholder="Пошук..."
              className="bg-transparent outline-none w-full text-base font-bold text-white placeholder:text-slate-600"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="hidden lg:flex gap-1.5 pr-2 overflow-x-auto no-scrollbar">
            {['ВСІ', 'МЦ', 'NGO', 'ОСВІТА', 'КОВОРКІНГ', 'СПОРТ', 'КУЛЬТУРА'].map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-5 py-3.5 rounded-2xl text-[11px] font-black uppercase transition-all whitespace-nowrap tracking-wider ${
                  filter === cat ? 'bg-yellow-400 text-black shadow-xl shadow-yellow-400/30' : 'bg-white/5 text-slate-400 hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ABOUT MODAL — ПОВНА ВЕРСІЯ */}
      {isAboutOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 md:p-6 bg-slate-950/95 backdrop-blur-2xl animate-fade-in overflow-y-auto">
          <div className="bg-slate-900/50 border border-white/10 rounded-[48px] md:rounded-[64px] p-8 md:p-14 max-w-5xl w-full relative shadow-2xl overflow-hidden my-auto">
            
            {/* Декоративні світлові ефекти на фоні */}
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-yellow-400/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>

            {/* Кнопка закриття */}
            <button 
              onClick={() => setIsAboutOpen(false)} 
              className="absolute top-8 right-8 p-4 bg-white/5 rounded-full hover:bg-yellow-400 hover:text-black transition-all text-slate-400 z-20 group"
            >
              <X size={24} className="group-hover:rotate-90 transition-transform" />
            </button>

            <div className="relative z-10">
              {/* HEADER: Лого та Назва */}
              <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
                 <div className="w-32 h-32 bg-yellow-400 rounded-[40px] p-1 shadow-2xl shadow-yellow-400/20 shrink-0">
                    <img src="/img/logo.PNG" className="w-full h-full object-cover rounded-[38px]" alt="DeTy Logo" />
                 </div>
                 <div className="text-center md:text-left">
                    <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-white leading-none">DeTy?</h2>
                    <p className="text-yellow-400 font-black uppercase tracking-[0.3em] text-xs mt-3 flex items-center justify-center md:justify-start gap-2">
                      <div className="h-1 w-8 bg-yellow-400"></div> Платформа можливостей
                    </p>
                 </div>
              </div>

              {/* ОСНОВНИЙ КОНТЕНТ (2 КОЛОНКИ) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                
                {/* ЛІВА КОЛОНКА: Про проєкт та Хто ми */}
                <div className="space-y-10">
                  
                  {/* Блок 1: Про проєкт */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-black uppercase italic text-white flex items-center gap-3">
                      <Info size={20} className="text-yellow-400" /> Про проєкт
                    </h3>
                    <div className="space-y-4 text-slate-400 leading-relaxed font-medium">
                      <p>
                        Ми створили <span className="text-white font-bold">DeTy?</span> як відповідь на інформаційний вакуум. 
                        Це інструмент для кожного, хто хоче змінити пасивне споживання контенту на реальну дію.
                      </p>
                      <p>
                        Наша місія — об’єднати всі «живі» локації України в одну екосистему, щоб ти завжди знав відповідь на питання: 
                        <span className="text-yellow-400 italic font-black ml-1 uppercase">Де ти сьогодні?</span>
                      </p>
                    </div>
                  </div>

                  {/* Блок 2: Хто ми (Відділ Ради) */}
                  <div className="space-y-4 p-6 bg-white/5 rounded-[32px] border border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl"></div>
                    <h3 className="text-xl font-black uppercase italic text-white flex items-center gap-3">
                      <Users size={20} className="text-blue-400" /> Хто ми?
                    </h3>
                    <p className="text-slate-400 leading-relaxed text-sm font-medium relative z-10">
                      Проєкт ініційований та впроваджений <span className="text-white font-bold">відділом «Якісне дозвілля»</span> Національної дитячої та молодіжної консультативної ради України.
                    </p>
                    <p className="text-slate-500 text-xs leading-relaxed italic relative z-10">
                      Ми працюємо над тим, щоб голос молоді був почутий, а можливості для самореалізації стали доступними у кожному куточку країни.
                    </p>
                  </div>
                </div>

                {/* ПРАВА КОЛОНКА: Соцмережі та Екосистема */}
                <div className="space-y-8">
                  <h3 className="text-xl font-black uppercase italic text-white flex items-center gap-3">
                    <Settings size={20} className="text-yellow-400" /> Наша екосистема
                  </h3>
                  
                  <div className="grid grid-cols-1 gap-4">
                    {/* Кнопка Instagram */}
                    <a 
                      href="https://www.instagram.com/child.youth.council/" 
                      target="_blank" 
                      className="group flex items-center justify-between p-5 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-white/5 rounded-3xl hover:border-pink-500/50 transition-all shadow-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 rounded-2xl text-white">
                          <LinkIcon size={20} />
                        </div>
                        <div>
                          <div className="text-white font-black uppercase text-xs tracking-widest">Instagram</div>
                          <div className="text-slate-500 text-[10px] font-bold">Наші новини та івенти</div>
                        </div>
                      </div>
                      <Plus size={18} className="text-slate-600 group-hover:text-white transition-colors" />
                    </a>

                    {/* Кнопка Telegram Bot (Coming Soon) */}
                    <div className="group flex items-center justify-between p-5 bg-blue-600/10 border border-white/5 rounded-3xl opacity-80 relative overflow-hidden grayscale hover:grayscale-0 transition-all cursor-not-allowed">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-500 rounded-2xl text-white">
                          <Navigation size={20} />
                        </div>
                        <div>
                          <div className="text-white font-black uppercase text-xs tracking-widest flex items-center gap-2">
                            Telegram Bot <span className="text-[8px] bg-blue-500 px-1.5 py-0.5 rounded-full text-white">SOON</span>
                          </div>
                          <div className="text-slate-500 text-[10px] font-bold">Розумний помічник у кишені</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Блок майбутніх проєктів */}
                  <div className="p-6 bg-white/5 rounded-[32px] border border-white/5">
                    <h4 className="text-[10px] font-black uppercase text-slate-500 mb-3 tracking-[0.2em]">Майбутні ініціативи ради</h4>
                    <div className="flex flex-wrap gap-3">
                      <div className="px-4 py-2 bg-slate-800 rounded-xl text-[10px] font-bold text-slate-400 uppercase tracking-wider italic">Reader</div>
                      <div className="px-4 py-2 bg-slate-800 rounded-xl text-[10px] font-bold text-slate-400 uppercase tracking-wider italic">Donate-Dance</div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

      {/* MAP */}
      <div className="h-full w-full">
        <MapCustom points={filteredData} center={userLocation} onPointClick={(loc) => router.push(`/location/${loc.id}`)} />
      </div>

      {/* FLOATING CONTROLS */}
      <div className="absolute bottom-10 right-10 z-[1000] flex flex-col gap-4">
        <button onClick={findMe} className="bg-white text-black p-5 rounded-3xl hover:bg-yellow-400 transition-all shadow-2xl flex items-center justify-center active:scale-90">
          <Navigation size={28} fill="currentColor" />
        </button>
        <Link href="/login" className="bg-slate-900 border border-white/10 text-white p-5 rounded-3xl hover:bg-white hover:text-black transition-all shadow-xl flex items-center justify-center">
          <Settings size={28} />
        </Link>
        <Link href="/add" className="bg-yellow-400 text-black p-6 rounded-[32px] hover:scale-110 transition-all shadow-2xl shadow-yellow-400/30 flex items-center justify-center">
          <Plus size={40} strokeWidth={4} />
        </Link>
      </div>

      <style jsx global>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(-30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse-slow { 0%, 100% { transform: scale(1); } 50% { transform: scale(0.97); } }
        .animate-fade-in { animation: fade-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-pulse-slow { animation: pulse-slow 5s infinite ease-in-out; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        body { margin: 0; background: #020617; }
      `}</style>
    </div>
  );
}