import { useRouter } from 'next/router';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import { ChevronLeft, MapPin, ExternalLink, Info, Tag } from 'lucide-react';

export default function LocationPage({ location }) {
  const router = useRouter();

  if (!location) return (
    <div className="h-screen bg-slate-950 flex items-center justify-center text-white font-black uppercase italic tracking-tighter">
      Локацію не знайдено
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans pb-20">
      
      {/* HEADER IMAGE / BANNER */}
      <div className="relative h-[45vh] w-full overflow-hidden">
        {location.image ? (
          <img 
            src={location.image} 
            alt={location.name} 
            className="w-full h-full object-cover animate-fade-in"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-slate-700">
             <MapPin size={100} strokeWidth={1} />
          </div>
        )}
        
        {/* Градієнт на фото */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>

        {/* Кнопка назад */}
        <Link href="/" className="absolute top-8 left-8 z-10 bg-black/30 backdrop-blur-md border border-white/10 p-4 rounded-2xl hover:bg-white hover:text-black transition-all group">
          <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* CONTENT CARD */}
      <div className="max-w-4xl mx-auto px-6 -mt-32 relative z-10">
        <div className="bg-slate-900/90 backdrop-blur-2xl border border-white/10 rounded-[48px] p-8 md:p-12 shadow-2xl">
          
          {/* Badge Категорії */}
          <div className="inline-flex items-center gap-2 bg-yellow-400 text-black px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
            <Tag size={12} /> {location.category}
          </div>

          <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-4 leading-none">
            {location.name}
          </h1>

          <div className="flex items-center gap-3 text-slate-400 mb-10 text-sm md:text-base">
            <div className="bg-white/5 p-2 rounded-lg"><MapPin size={20} className="text-yellow-400" /></div>
            {location.address}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Опис */}
            <div className="md:col-span-2 space-y-6">
              <div className="flex items-center gap-2 text-white font-black uppercase italic tracking-wider text-sm border-b border-white/10 pb-2">
                <Info size={18} className="text-yellow-400" /> Про простір
              </div>
              <p className="text-slate-300 text-lg leading-relaxed font-medium">
                {location.description}
              </p>
            </div>

            {/* Дії / Посилання */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-white font-black uppercase italic tracking-wider text-sm border-b border-white/10 pb-2">
                Дії
              </div>
              <a 
                href={location.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 bg-white text-black w-full py-5 rounded-3xl font-black uppercase italic hover:bg-yellow-400 transition-all shadow-xl active:scale-95"
              >
                Відвідати сайт <ExternalLink size={20} />
              </a>
              <button 
                onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`)}
                className="flex items-center justify-center gap-3 bg-slate-800 text-white w-full py-5 rounded-3xl font-black uppercase italic hover:bg-slate-700 transition-all border border-white/5"
              >
                Маршрут
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; filter: blur(10px); }
          to { opacity: 1; filter: blur(0); }
        }
        .animate-fade-in { animation: fade-in 1s ease-out forwards; }
      `}</style>
    </div>
  );
}

// Функція для отримання даних сервера
export async function getStaticPaths() {
  const filePath = path.join(process.cwd(), 'public', 'locations.json');
  const jsonData = fs.readFileSync(filePath);
  const locations = JSON.parse(jsonData);

  const paths = locations.map((loc) => ({
    params: { id: loc.id.toString() },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const filePath = path.join(process.cwd(), 'public', 'locations.json');
  const jsonData = fs.readFileSync(filePath);
  const locations = JSON.parse(jsonData);

  const location = locations.find((loc) => loc.id.toString() === params.id);

  return { props: { location } };
}