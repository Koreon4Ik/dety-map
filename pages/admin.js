import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, Save, Image as ImageIcon, MapPin, Type, Link as LinkIcon, AlignLeft } from 'lucide-react';

export default function AdminAddLocation() {
  const [formData, setFormData] = useState({
    name: '',
    category: 'МЦ',
    lat: '',
    lng: '',
    image: '', // Нове поле для фото
    description: '',
    address: '',
    link: ''
  });

  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Зберігаємо...');

    try {
      const res = await fetch('/api/save-location', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, id: Date.now() }),
      });

      if (res.ok) {
        setStatus('Успішно збережено!');
        setFormData({ name: '', category: 'МЦ', lat: '', lng: '', image: '', description: '', address: '', link: '' });
      } else {
        setStatus('Помилка при збереженні');
      }
    } catch (err) {
      setStatus('Помилка сервера');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        
        {/* HEADER */}
        <div className="flex items-center justify-between mb-12">
          <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-yellow-400 transition-colors uppercase font-black italic tracking-widest text-xs">
            <ChevronLeft size={20} /> Назад до мапи
          </Link>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter">Додати простір</h1>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-900/50 border border-white/10 p-8 md:p-12 rounded-[48px] backdrop-blur-xl shadow-2xl">
          
          {/* НАЗВА */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
              <Type size={14} /> Назва закладу
            </label>
            <input 
              required
              type="text"
              placeholder="Наприклад: Хаб 12"
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-yellow-400 transition-all font-bold"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          {/* КАТЕГОРІЯ */}
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

          {/* КООРДИНАТИ */}
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

          {/* ФОТО (НОВЕ ПОЛЕ) */}
          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
              <ImageIcon size={14} /> Посилання на фото (URL)
            </label>
            <div className="relative">
              <input 
                type="text"
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pr-24 outline-none focus:border-yellow-400 transition-all font-bold"
                value={formData.image}
                onChange={(e) => setFormData({...formData, image: e.target.value})}
              />
              {formData.image && (
                <div className="absolute right-2 top-2 h-10 w-16 rounded-lg overflow-hidden border border-white/10">
                  <img src={formData.image} className="w-full h-full object-cover" alt="Прев'ю" />
                </div>
              )}
            </div>
            <p className="text-[9px] text-slate-600 uppercase font-bold tracking-widest italic">Пряме посилання на картинку (jpg, png або unsplash)</p>
          </div>

          {/* АДРЕСА ТА САЙТ */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
              <MapPin size={14} /> Адреса
            </label>
            <input 
              type="text"
              placeholder="вул. Центральна, 1"
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-yellow-400 transition-all font-bold"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
              <LinkIcon size={14} /> Посилання на сайт/Instagram
            </label>
            <input 
              type="text"
              placeholder="https://..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-yellow-400 transition-all font-bold"
              value={formData.link}
              onChange={(e) => setFormData({...formData, link: e.target.value})}
            />
          </div>

          {/* ОПИС */}
          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
              <AlignLeft size={14} /> Опис простору
            </label>
            <textarea 
              rows="4"
              placeholder="Розкажіть про можливості закладу..."
              className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 outline-none focus:border-yellow-400 transition-all font-medium leading-relaxed resize-none"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          {/* КНОПКА ЗБЕРЕЖЕННЯ */}
          <div className="md:col-span-2 pt-4">
            <button 
              type="submit"
              className="w-full bg-yellow-400 text-black py-6 rounded-[32px] font-black uppercase italic tracking-widest flex items-center justify-center gap-3 hover:bg-white transition-all shadow-2xl shadow-yellow-400/20 active:scale-95"
            >
              <Save size={24} /> {status || 'Зберегти локацію'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

// Допоміжний компонент іконки тега (який я забув імпортувати зверху)
function Tag({ size, className }) {
  return <path className={className} size={size} />; 
}