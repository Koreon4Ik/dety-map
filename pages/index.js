import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Plus, Search, Settings, Info, X, MapPin, Navigation } from 'lucide-react';

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

      {/* ABOUT MODAL */}
      {isAboutOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-xl animate-fade-in">
          <div className="bg-slate-900 border border-white/10 rounded-[56px] p-12 max-w-4xl w-full relative shadow-2xl overflow-hidden">
            <button onClick={() => setIsAboutOpen(false)} className="absolute top-8 right-8 p-3.5 bg-white/5 rounded-full hover:bg-white/10 text-slate-400">
              <X size={28} />
            </button>
            <div className="flex flex-col md:flex-row items-center gap-8 mb-12 relative z-10">
               <div className="w-32 h-32 bg-yellow-400 rounded-[40px] p-1.5 flex items-center justify-center overflow-hidden shrink-0">
                  <img src="/img/logo.PNG" className="w-full h-full object-cover rounded-[36px]" alt="Logo Large" />
               </div>
               <div>
                  <h2 className="text-6xl font-black italic uppercase tracking-tighter text-white leading-none">DETY MAP</h2>
                  <p className="text-slate-400 mt-2 flex items-center gap-2"><MapPin size={18} /> Карта активних просторів Дніпра</p>
               </div>
            </div>
            <p className="text-slate-300 text-xl leading-relaxed max-w-2xl relative z-10">Ми зібрали всі молодіжні хаби, коворкінги та NGO на одній платформі, щоб допомогти тобі знайти місце для розвитку.</p>
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