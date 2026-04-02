import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, Clipboard, Image as ImageIcon, MapPin, Type, Link as LinkIcon, AlignLeft, Tag, X } from 'lucide-react';

export default function AdminAddLocation() {
  const [formData, setFormData] = useState({
    name: '',
    category: 'МЦ',
    lat: '',
    lng: '',
    image: '',
    description: '',
    address: '',
    link: ''
  });

  const [generatedJson, setGeneratedJson] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Формуємо об'єкт так само, як він має бути в JSON
    const newLocation = {
      ...formData,
      id: Date.now(),
      lat: parseFloat(formData.lat) || 0,
      lng: parseFloat(formData.lng) || 0
    };

    setGeneratedJson(JSON.stringify(newLocation, null, 2));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedJson);
    alert("Скопійовано! Тепер встав це у свій locations.json");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans p-6 md:p-12 relative">
      <div className="max-w-4xl mx-auto">
        
        {/* HEADER */}
        <div className="flex items-center justify-between mb-12">
          <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-yellow-400 transition-colors uppercase font-black italic tracking-widest text-xs">
            <ChevronLeft size={20} /> Назад до мапи
          </Link>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter text-yellow-400">JSON Генератор</h1>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-900/50 border border-white/10 p-8 md:p-12 rounded-[48px] backdrop-blur-xl shadow-2xl">
          
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
              <Type size={14} /> Назва закладу
            </label>
            <input 
              required
              type="text"
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-yellow-400 transition-all font-bold"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
              <Tag size={14} /> Категорія
            </label>
            <select 
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-yellow-400 transition-all font-bold appearance-none cursor-pointer"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
            >
              {['МЦ', 'NGO', 'ОСВІТА', 'КОВОРКІНГ', 'СПОРТ', 'КУЛЬТУРА', 'ВОЛОНТЕРСТВО'].map(c => (
                <option key={c} value={c} className="bg-slate-900">{c}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
              <MapPin size={14} /> Широта (Lat)
            </label>
            <input 
              required
              type="text"
              placeholder="48.46..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-yellow-400 transition-all font-bold"
              value={formData.lat}
              onChange={(e) => setFormData({...formData, lat: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
              <MapPin size={14} /> Довгота (Lng)
            </label>
            <input 
              required
              type="text"
              placeholder="35.04..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-yellow-400 transition-all font-bold"
              value={formData.lng}
              onChange={(e) => setFormData({...formData, lng: e.target.value})}
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
              <ImageIcon size={14} /> Посилання на фото (URL)
            </label>
            <input 
              type="text"
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-yellow-400 transition-all font-bold"
              value={formData.image}
              onChange={(e) => setFormData({...formData, image: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
              <MapPin size={14} /> Адреса
            </label>
            <input 
              type="text"
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-yellow-400 transition-all font-bold"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
              <LinkIcon size={14} /> Сайт/Instagram
            </label>
            <input 
              type="text"
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-yellow-400 transition-all font-bold"
              value={formData.link}
              onChange={(e) => setFormData({...formData, link: e.target.value})}
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
              <AlignLeft size={14} /> Опис
            </label>
            <textarea 
              rows="3"
              className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 outline-none focus:border-yellow-400 transition-all font-medium resize-none"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="md:col-span-2 pt-4">
            <button 
              type="submit"
              className="w-full bg-yellow-400 text-black py-6 rounded-[32px] font-black uppercase italic tracking-widest flex items-center justify-center gap-3 hover:bg-white transition-all shadow-2xl active:scale-95"
            >
              Згенерувати код для JSON
            </button>
          </div>
        </form>
      </div>

      {/* МОДАЛЬНЕ ВІКНО З ГОТОВИМ КОДОМ */}
      {generatedJson && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-md">
          <div className="bg-slate-900 border border-white/10 rounded-[40px] p-8 max-w-2xl w-full shadow-2xl relative">
            <button onClick={() => setGeneratedJson(null)} className="absolute top-6 right-6 text-slate-500 hover:text-white">
              <X size={24} />
            </button>
            <h2 className="text-xl font-black uppercase italic mb-4 text-yellow-400">Готово! Скопіюй цей блок:</h2>
            <pre className="bg-black/50 p-6 rounded-2xl overflow-x-auto text-xs text-green-400 font-mono mb-6 border border-white/5">
              {generatedJson}
            </pre>
            <button 
              onClick={copyToClipboard}
              className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase flex items-center justify-center gap-2 hover:bg-yellow-400 transition-all"
            >
              <Clipboard size={20} /> Скопіювати код
            </button>
          </div>
        </div>
      )}
    </div>
  );
}