import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, Clipboard, Trash2, Plus, Save, Image as ImageIcon, MapPin, Type, Link as LinkIcon, Tag, X, Edit3 } from 'lucide-react';

export default function AdminEditor() {
  const [locations, setLocations] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showExport, setShowExport] = useState(false);

  // 1. Завантажуємо поточні дані при вході
  useEffect(() => {
    fetch('/locations.json')
      .then(res => res.json())
      .then(data => setLocations(data))
      .catch(err => console.error("Помилка завантаження:", err));
  }, []);

  // 2. Функція для додавання нової порожньої мітки
  const addNewLocation = () => {
    const newLoc = {
      id: Date.now(),
      name: "Нова локація",
      category: "МЦ",
      lat: 48.46,
      lng: 35.04,
      image: "",
      description: "",
      address: "",
      link: ""
    };
    setLocations([newLoc, ...locations]);
    setEditingId(newLoc.id); // Одразу відкриваємо редагування
  };

  // 3. Оновлення даних у масиві
  const updateLocation = (id, field, value) => {
    setLocations(locations.map(loc => 
      loc.id === id ? { ...loc, [field]: value } : loc
    ));
  };

  // 4. Видалення
  const deleteLocation = (id) => {
    if (confirm("Видалити цю мітку?")) {
      setLocations(locations.filter(loc => loc.id !== id));
    }
  };

  const copyFullJson = () => {
    // Перетворюємо координати в числа перед копіюванням
    const cleanedData = locations.map(loc => ({
      ...loc,
      lat: parseFloat(loc.lat),
      lng: parseFloat(loc.lng)
    }));
    navigator.clipboard.writeText(JSON.stringify(cleanedData, null, 2));
    alert("Весь код скопійовано! Встав його в locations.json");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-yellow-400 transition-all uppercase font-black italic tracking-widest text-[10px] mb-4">
              <ChevronLeft size={16} /> Назад до мапи
            </Link>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">Редактор Бази Даних</h1>
          </div>
          
          <div className="flex gap-4 w-full md:w-auto">
            <button 
              onClick={addNewLocation}
              className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-500 text-white px-6 py-4 rounded-2xl font-black uppercase italic text-sm flex items-center justify-center gap-2 transition-all shadow-xl shadow-blue-900/20"
            >
              <Plus size={20} /> Додати нову
            </button>
            <button 
              onClick={() => setShowExport(true)}
              className="flex-1 md:flex-none bg-yellow-400 hover:bg-white text-black px-8 py-4 rounded-2xl font-black uppercase italic text-sm flex items-center justify-center gap-2 transition-all shadow-xl shadow-yellow-400/20"
            >
              <Save size={20} /> Отримати код файлу
            </button>
          </div>
        </div>

        {/* LIST OF LOCATIONS */}
        <div className="grid grid-cols-1 gap-4">
          {locations.map((loc) => (
            <div key={loc.id} className={`bg-slate-900/50 border ${editingId === loc.id ? 'border-yellow-400 shadow-yellow-400/10' : 'border-white/5'} rounded-[32px] p-6 transition-all`}>
              
              {/* Рядок заголовку (завжди видимий) */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 truncate">
                  <div className="w-12 h-12 rounded-xl bg-slate-800 overflow-hidden shrink-0 border border-white/10">
                    <img src={loc.image || "https://ui-avatars.com/api/?name=?"} className="w-full h-full object-cover" />
                  </div>
                  <div className="truncate">
                    <h3 className="font-black uppercase italic text-lg truncate leading-tight">{loc.name || "Без назви"}</h3>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{loc.category} • {loc.address || "Адреса не вказана"}</span>
                  </div>
                </div>
                
                <div className="flex gap-2 shrink-0">
                  <button 
                    onClick={() => setEditingId(editingId === loc.id ? null : loc.id)}
                    className={`p-3 rounded-xl transition-all ${editingId === loc.id ? 'bg-yellow-400 text-black' : 'bg-white/5 text-white hover:bg-white/10'}`}
                  >
                    {editingId === loc.id ? <X size={20} /> : <Edit3 size={20} />}
                  </button>
                  <button onClick={() => deleteLocation(loc.id)} className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all">
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>

              {/* ФОРМА РЕДАГУВАННЯ (розгортається) */}
              {editingId === loc.id && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 pt-8 border-t border-white/5 animate-fade-in">
                  <div className="space-y-4">
                    <div>
                      <label className="text-[9px] font-black uppercase text-slate-500 mb-1 block tracking-widest">Назва</label>
                      <input type="text" value={loc.name} onChange={(e) => updateLocation(loc.id, 'name', e.target.value)} className="w-full bg-black/30 border border-white/10 p-3 rounded-xl outline-none focus:border-yellow-400 font-bold" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div>
                        <label className="text-[9px] font-black uppercase text-slate-500 mb-1 block tracking-widest">Категорія</label>
                        <select value={loc.category} onChange={(e) => updateLocation(loc.id, 'category', e.target.value)} className="w-full bg-black/30 border border-white/10 p-3 rounded-xl outline-none focus:border-yellow-400 font-bold appearance-none">
                          {['МЦ', 'NGO', 'ОСВІТА', 'КОВОРКІНГ', 'СПОРТ', 'КУЛЬТУРА', 'ВОЛОНТЕРСТВО'].map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-[9px] font-black uppercase text-slate-500 mb-1 block tracking-widest">Адреса</label>
                        <input type="text" value={loc.address} onChange={(e) => updateLocation(loc.id, 'address', e.target.value)} className="w-full bg-black/30 border border-white/10 p-3 rounded-xl outline-none focus:border-yellow-400 font-bold" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[9px] font-black uppercase text-slate-500 mb-1 block tracking-widest">Широта (Lat)</label>
                        <input type="number" step="any" value={loc.lat} onChange={(e) => updateLocation(loc.id, 'lat', e.target.value)} className="w-full bg-black/30 border border-white/10 p-3 rounded-xl outline-none focus:border-yellow-400 font-bold font-mono" />
                      </div>
                      <div>
                        <label className="text-[9px] font-black uppercase text-slate-500 mb-1 block tracking-widest">Довгота (Lng)</label>
                        <input type="number" step="any" value={loc.lng} onChange={(e) => updateLocation(loc.id, 'lng', e.target.value)} className="w-full bg-black/30 border border-white/10 p-3 rounded-xl outline-none focus:border-yellow-400 font-bold font-mono" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-[9px] font-black uppercase text-slate-500 mb-1 block tracking-widest">Посилання на фото</label>
                      <input type="text" value={loc.image} onChange={(e) => updateLocation(loc.id, 'image', e.target.value)} className="w-full bg-black/30 border border-white/10 p-3 rounded-xl outline-none focus:border-yellow-400 font-bold text-xs" />
                    </div>
                    <div>
                      <label className="text-[9px] font-black uppercase text-slate-500 mb-1 block tracking-widest">Сайт/Посилання</label>
                      <input type="text" value={loc.link} onChange={(e) => updateLocation(loc.id, 'link', e.target.value)} className="w-full bg-black/30 border border-white/10 p-3 rounded-xl outline-none focus:border-yellow-400 font-bold text-xs" />
                    </div>
                    <div>
                      <label className="text-[9px] font-black uppercase text-slate-500 mb-1 block tracking-widest">Опис</label>
                      <textarea rows="2" value={loc.description} onChange={(e) => updateLocation(loc.id, 'description', e.target.value)} className="w-full bg-black/30 border border-white/10 p-3 rounded-xl outline-none focus:border-yellow-400 font-medium text-sm resize-none" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* MODAL EXPORT */}
      {showExport && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-6 bg-slate-950/95 backdrop-blur-xl overflow-y-auto">
          <div className="bg-slate-900 border border-white/10 rounded-[48px] p-8 md:p-12 max-w-4xl w-full shadow-2xl relative my-auto">
            <button onClick={() => setShowExport(false)} className="absolute top-8 right-8 text-slate-500 hover:text-white p-2">
              <X size={32} />
            </button>
            <h2 className="text-3xl font-black uppercase italic mb-2 text-yellow-400 leading-none">Оновлений JSON код</h2>
            <p className="text-slate-500 text-sm mb-8 font-bold uppercase tracking-widest">Скопіюй все нижче та заміни вміст locations.json</p>
            
            <div className="relative group">
              <pre className="bg-black/60 p-8 rounded-[32px] overflow-auto max-h-[50vh] text-[10px] text-green-400 font-mono border border-white/5 scrollbar-thin scrollbar-thumb-white/10">
                {JSON.stringify(locations, null, 2)}
              </pre>
              <button 
                onClick={copyFullJson}
                className="absolute top-4 right-4 bg-white/10 hover:bg-white hover:text-black text-white p-4 rounded-2xl transition-all flex items-center gap-2 font-black uppercase text-xs backdrop-blur-md"
              >
                <Clipboard size={18} /> Копіювати все
              </button>
            </div>

            <div className="mt-8 p-6 bg-blue-500/10 border border-blue-500/20 rounded-3xl text-blue-300 text-xs font-bold leading-relaxed">
              💡 Порада: Після копіювання відкрий файл <code className="text-white bg-white/10 px-1 rounded">public/locations.json</code>, видали все що там є, встав цей код і збережи файл.
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
}