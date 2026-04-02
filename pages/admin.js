import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, ChevronLeft, Copy, Check } from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const [locations, setLocations] = useState([]);
  const [status, setStatus] = useState('');
  const [copied, setCopied] = useState(false);

  // Завантажуємо поточні локації з твого locations.json
  useEffect(() => {
    const loadData = async () => {
      if (typeof window !== 'undefined') {
        try {
          const res = await fetch('/locations.json');
          if (res.ok) {
            const data = await res.json();
            setLocations(data);
          }
        } catch (err) {
          console.error("Помилка завантаження файлу:", err);
        }
      }
    };
    loadData();
  }, []);

  const addRow = () => {
    const newId = locations.length > 0 ? Math.max(...locations.map(l => l.id)) + 1 : 1;
    setLocations([...locations, { 
      id: newId, 
      name: '', 
      lat: 48.4647, 
      lng: 35.0462, 
      category: 'МЦ', 
      description: '', 
      link: '#' 
    }]);
  };

  const updateRow = (index, field, value) => {
    const newLocs = [...locations];
    newLocs[index][field] = value;
    setLocations(newLocs);
  };

  const deleteRow = (index) => {
    setLocations(locations.filter((_, i) => i !== index));
  };

  const copyToClipboard = () => {
    const jsonString = JSON.stringify(locations, null, 2);
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setStatus('JSON скопійовано! Заміни вміст locations.json цим кодом.');
    setTimeout(() => {
      setCopied(false);
      setStatus('');
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <Link href="/" className="text-slate-500 hover:text-yellow-400 text-sm flex items-center gap-2 mb-2 transition-colors">
              <ChevronLeft size={16} /> На головну мапу
            </Link>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">Редактор Бази Даних</h1>
          </div>
          
          <button 
            onClick={copyToClipboard}
            className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-black uppercase italic transition-all shadow-xl ${
              copied ? 'bg-green-500 text-white' : 'bg-yellow-400 text-black hover:bg-white shadow-yellow-400/10'
            }`}
          >
            {copied ? <Check size={20} /> : <Copy size={20} />}
            {copied ? 'Скопійовано!' : 'Копіювати код для файлу'}
          </button>
        </div>

        {status && (
          <div className="mb-6 p-4 bg-yellow-400/10 border border-yellow-400/50 rounded-2xl text-yellow-400 text-sm font-bold animate-pulse">
            {status}
          </div>
        )}

        <div className="bg-slate-900 border border-white/5 rounded-[32px] overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead className="bg-white/5 text-[10px] uppercase font-black tracking-widest text-slate-500">
                <tr>
                  <th className="p-5 w-16">ID</th>
                  <th className="p-5">Назва та Опис</th>
                  <th className="p-5 w-48">Координати</th>
                  <th className="p-5 w-40">Категорія</th>
                  <th className="p-5 w-20"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {locations.map((loc, index) => (
                  <tr key={loc.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 text-slate-600 font-mono text-xs text-center">{loc.id}</td>
                    <td className="p-4 space-y-2">
                      <input 
                        value={loc.name} 
                        onChange={(e) => updateRow(index, 'name', e.target.value)}
                        className="bg-slate-800 border border-white/5 rounded-xl px-4 py-2 w-full outline-none focus:border-yellow-400 text-sm font-bold"
                        placeholder="Назва простору (напр. Active Hub)"
                      />
                      <input 
                        value={loc.description} 
                        onChange={(e) => updateRow(index, 'description', e.target.value)}
                        className="bg-slate-800 border border-white/5 rounded-xl px-4 py-2 w-full outline-none focus:border-yellow-400 text-xs text-slate-400"
                        placeholder="Короткий опис..."
                      />
                      <input 
                        value={loc.link} 
                        onChange={(e) => updateRow(index, 'link', e.target.value)}
                        className="bg-slate-800 border border-white/5 rounded-xl px-4 py-2 w-full outline-none focus:border-yellow-400 text-[10px] text-blue-400 font-mono"
                        placeholder="Посилання (https://...)"
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 bg-slate-800 rounded-xl px-3 py-1 border border-white/5">
                          <span className="text-[9px] font-black text-slate-500 uppercase">Lat</span>
                          <input 
                            type="number" step="0.0001" value={loc.lat} 
                            onChange={(e) => updateRow(index, 'lat', parseFloat(e.target.value))}
                            className="bg-transparent w-full outline-none text-xs font-mono"
                          />
                        </div>
                        <div className="flex items-center gap-2 bg-slate-800 rounded-xl px-3 py-1 border border-white/5">
                          <span className="text-[9px] font-black text-slate-500 uppercase">Lng</span>
                          <input 
                            type="number" step="0.0001" value={loc.lng} 
                            onChange={(e) => updateRow(index, 'lng', parseFloat(e.target.value))}
                            className="bg-transparent w-full outline-none text-xs font-mono"
                          />
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <select 
                        value={loc.category} 
                        onChange={(e) => updateRow(index, 'category', e.target.value)}
                        className="bg-slate-800 border border-white/10 rounded-xl px-4 py-2 w-full outline-none focus:border-yellow-400 text-xs font-black uppercase italic"
                      >
                        {['МЦ', 'NGO', 'Освіта', 'Коворкінг', 'Волонтерство', 'Спорт', 'Культура'].map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => deleteRow(index)} 
                        className="text-slate-600 hover:text-red-500 transition-colors p-2"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <button 
            onClick={addRow}
            className="w-full p-6 bg-white/5 hover:bg-white/10 text-yellow-400 font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 transition-all border-t border-white/5"
          >
            <Plus size={18} /> Додати нову точку в базу
          </button>
        </div>
      </div>
    </div>
  );
}