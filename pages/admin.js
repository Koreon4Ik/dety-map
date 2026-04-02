import React, { useState, useEffect } from 'react';
import { MapPin, ChevronLeft, Table, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import Papa from 'papaparse';

export default function AdminPanel() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  // ПОСИЛАННЯ НА ТВОЮ ТАБЛИЦЮ (CSV)
  const csvUrl = "ТВОЄ_ПОСИЛАННЯ_CSV"; 
  // ПОСИЛАННЯ ДЛЯ РЕДАГУВАННЯ (Звичайна адреса таблиці в браузері)
  const editUrl = "ПОСИЛАННЯ_НА_САМУ_ТАБЛИЦЮ";

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const response = await fetch(csvUrl);
      const csvText = await response.text();
      
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          setLocations(results.data || []);
          setLoading(false);
        }
      });
    } catch (err) {
      console.error('Помилка завантаження:', err);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-start mb-10">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-yellow-400 transition mb-6 text-sm">
              <ChevronLeft size={16} /> На головну
            </Link>
            <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-2 italic text-white">Список локацій</h1>
            <p className="text-slate-400 font-medium italic uppercase text-xs tracking-widest">Дані з Google Sheets</p>
          </div>
          
          <a href={editUrl} target="_blank" rel="noreferrer" className="bg-yellow-400 text-black px-6 py-4 rounded-2xl font-black uppercase italic text-xs flex items-center gap-2 hover:bg-white transition-all active:scale-95 shadow-xl shadow-yellow-400/10">
            <ExternalLink size={16} /> Редагувати таблицю
          </a>
        </div>

        {loading ? (
          <div className="flex flex-col items-center py-20 gap-4">
            <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-yellow-400 font-black uppercase text-[10px] tracking-widest italic">Синхронізація з таблицею...</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {locations.map((item, index) => (
              <div key={index} className="bg-slate-900 border border-white/5 p-6 rounded-[32px] flex flex-col md:flex-row justify-between gap-6 hover:border-white/20 transition-all">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="bg-white/10 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase italic">
                      {item.category}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black mb-2 uppercase tracking-tighter italic">{item.name}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed font-medium">{item.description}</p>
                  <div className="flex items-center gap-2 mt-5 text-slate-500 text-xs font-mono bg-white/5 w-fit px-3 py-1.5 rounded-lg border border-white/5">
                    <MapPin size={14} className="text-yellow-400" /> {item.lat}, {item.lng}
                  </div>
                </div>
              </div>
            ))}
            
            {locations.length === 0 && (
              <div className="text-center py-24 border-2 border-dashed border-white/5 rounded-[50px] bg-white/[0.01]">
                <p className="text-slate-600 font-black uppercase italic text-sm tracking-widest">Таблиця порожня або не опублікована 🔌</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}