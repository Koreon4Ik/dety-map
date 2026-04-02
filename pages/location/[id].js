import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { ChevronLeft, MapPin, Globe } from 'lucide-react';

export default function LocationPage({ location }) {
  if (!location) return <div className="min-h-screen bg-slate-950 text-white p-10">Точку не знайдено...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      <div className="max-w-3xl mx-auto p-6 pt-12">
        <Link href="/" className="text-slate-500 hover:text-yellow-400 flex items-center gap-2 mb-8 transition-colors">
          <ChevronLeft size={20} /> Назад до мапи
        </Link>

        <div className="bg-slate-900 border border-white/10 rounded-[40px] p-8 md:p-12 shadow-2xl">
          <span className="bg-yellow-400 text-black px-4 py-1.5 rounded-full text-xs font-black uppercase italic mb-6 inline-block">
            {location.category}
          </span>
          
          <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-6">
            {location.name}
          </h1>

          <p className="text-slate-400 text-lg leading-relaxed mb-10">
            {location.description}
          </p>

          <div className="flex flex-col md:flex-row gap-4">
            <a 
              href={`https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`}
              target="_blank" 
              className="flex-1 bg-white text-black h-16 rounded-2xl font-black uppercase italic flex items-center justify-center gap-2 hover:bg-yellow-400 transition-all"
            >
              <MapPin size={20} /> Маршрут
            </a>
            
            {location.link && location.link !== "#" && (
              <a 
                href={location.link}
                target="_blank"
                className="flex-1 bg-slate-800 text-white h-16 rounded-2xl font-black uppercase italic flex items-center justify-center gap-2 hover:bg-slate-700 transition-all"
              >
                <Globe size={20} /> Соцмережі
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getStaticPaths() {
  const filePath = path.join(process.cwd(), 'public', 'locations.json');
  const jsonData = fs.readFileSync(filePath, 'utf8');
  const locations = JSON.parse(jsonData);

  const paths = locations.map((loc) => ({
    params: { id: loc.id.toString() },
  }));

  return { paths, fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
  const filePath = path.join(process.cwd(), 'public', 'locations.json');
  const jsonData = fs.readFileSync(filePath, 'utf8');
  const locations = JSON.parse(jsonData);
  const location = locations.find((loc) => loc.id.toString() === params.id);

  if (!location) return { notFound: true };

  return { props: { location }, revalidate: 10 };
}