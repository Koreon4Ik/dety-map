import React from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function AddLocation() {
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col">
      {/* Шапка */}
      <div className="p-6 max-w-4xl mx-auto w-full">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-yellow-400 transition mb-4">
          <ChevronLeft size={20} /> Повернутися до мапи
        </Link>
        <h1 className="text-3xl font-black uppercase italic tracking-tighter">Додати новий простір</h1>
        <p className="text-slate-400 text-sm mt-2">Після перевірки модератором точка з'явиться на мапі.</p>
      </div>

      {/* Контейнер для форми */}
      <div className="flex-1 w-full max-w-4xl mx-auto bg-white rounded-t-[40px] overflow-hidden shadow-2xl mt-4">
        <iframe 
          src="https://docs.google.com/forms/d/e/1FAIpQLSeRzknFb_8YLj96NdpkD3yffgJ4Al86ZGXF2KMjcjdHkrRDuQ/viewform?usp=dialog" 
          className="w-full h-full min-h-[600px] border-none"
          title="Додати точку"
        >
          Завантаження...
        </iframe>
      </div>
    </div>
  );
}