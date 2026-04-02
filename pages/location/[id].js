import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, MapPin, Instagram, Share2 } from 'lucide-react';

export default function LocationPage() {
  const router = useRouter();
  const { id } = router.query;
  const [point, setPoint] = useState(null);

  useEffect(() => {
    if (id) {
      import('../../locations.json').then(m => {
        const found = m.default.find(p => p.id === parseInt(id));
        setPoint(found);
      });
    }
  }, [id]);

  if (!point) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Завантаження...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      {/* Top Bar */}
      <div className="p-6 flex justify-between items-center sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md">
        <Link href="/" className="p-3 bg-slate-800 rounded-2xl hover:bg-slate-700 transition">
          <ChevronLeft size={24} />
        </Link>
        <button onClick={() => navigator.share({title: point.name, url: window.location.href})} className="p-3 bg-slate-800 rounded-2xl hover:bg-slate-700 transition">
          <Share2 size={24} className="text-yellow-400" />
        </button>
      </div>

      <main className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Cover Image */}
        <div className="h-64 sm:h-96 w-full rounded-[40px] overflow-hidden relative border border-white/10 shadow-2xl">
          <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
          <div className="absolute bottom-8 left-8">
            <span className="px-4 py-1 bg-yellow-400 text-black text-xs font-black rounded-full uppercase tracking-widest">{point.category}</span>
            <h1 className="text-4xl sm:text-6xl font-black mt-2 tracking-tighter">{point.name}</h1>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-slate-300">
          <div className="md:col-span-2 space-y-6">
            <h3 className="text-xl font-bold text-white uppercase tracking-tight">Про простір</h3>
            <p className="text-lg leading-relaxed">{point.description}</p>
            <div className="p-6 bg-slate-900 rounded-[30px] border border-white/5 space-y-4">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-yellow-400"><MapPin size={20}/></div>
                  <span className="font-medium text-white">Адреса уточнюється у менеджера</span>
               </div>
            </div>
          </div>

          <div className="space-y-4">
            <a href={point.link} target="_blank" className="block w-full py-5 bg-white text-black text-center font-black rounded-[25px] hover:bg-yellow-400 transition-all text-xl uppercase italic tracking-tighter">
              Instagram
            </a>
            <button className="block w-full py-5 bg-slate-800 text-white text-center font-bold rounded-[25px] hover:bg-slate-700 transition-all uppercase tracking-widest text-xs">
              Запитати в Telegram
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}