import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, MapPin, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const [locations, setLocations] = useState([]);
  const [status, setStatus] = useState('');

  // Завантажуємо поточні локації з файлу
  useEffect(() => {
    fetch('/locations.json')
      .then(res => res.json())
      .then(data => setLocations(data))
      .catch(() => setLocations([]));
  }, []);

  const addRow = () => {
    setLocations([...locations, { name: '', category: 'МЦ', description: '', lat: 48.46, lng: 35.04 }]);
  };

  const updateRow = (index, field, value) => {
    const newLocs = [...locations];
    newLocs[index][field] = value;
    setLocations(newLocs);
  };

  const deleteRow = (index) => {
    setLocations(locations.filter((_, i) => i !== index));
  };

  const saveToClipboard = () => {
    const json = JSON.stringify(locations, null, 2);
    navigator.clipboard.writeText(json);
    setStatus('JSON скопійовано! Просто встав його у файл locations.json на GitHub.');
    setTimeout(() => setStatus(''), 5000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <Link href="/" className="text-slate-500 hover:text-yellow-400 text-sm flex items-center gap-2 mb-2">
              <ChevronLeft size={16} /> На мапу
            </Link>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter">Керування точками</h1>
          </div>
          <button 
            onClick={saveToClipboard}
            className="bg-yellow-400 text-black px-8 py-4 rounded-2xl font-black uppercase italic hover:bg-white transition-all shadow-xl shadow-yellow-400/20 flex items-center gap-2"
          >
            <Save size={20} /> Зберегти зміни
          </button>
        </div>

        {status && <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-xl text-green-400 text-sm font-bold animate-bounce">{status}</div>}

        <div className="bg-slate-900 border border-white/10 rounded-[32px] overflow-hidden shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white/5 text-[10px] uppercase font-black tracking-widest text-slate-500">
              <tr>
                <th className="p-5">Назва</th>
                <th className="p-5">Категорія</th>
                <th className="p-5">Координати (Lat, Lng)</th>
                <th className="p-5">Дії</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {locations.map((loc, index) => (
                <tr key={index} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4">
                    <input 
                      value={loc.name} 
                      onChange={(e) => updateRow(index, 'name', e.target.value)}
                      className="bg-slate-800 border border-white/5 rounded-xl px-4 py-2 w-full outline-none focus:border-yellow-400 transition-all text-sm"
                      placeholder="Назва простору"
                    />
                  </td>
                  <td className="p-4">
                    <select 
                      value={loc.category} 
                      onChange={(e) => updateRow(index, 'category', e.target.value)}
                      className="bg-slate-800 border border-white/5 rounded-xl px-4 py-2 outline-none focus:border-yellow-400 text-sm"
                    >
                      {['МЦ', 'NGO', 'Освіта', 'Коворкінг', 'Волонтерство', 'Спорт', 'Культура'].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </td>
                  <td className="p-4 flex gap-2">
                    <input 
                      type="number" step="0.0001" value={loc.lat} 
                      onChange={(e) => updateRow(index, 'lat', parseFloat(e.target.value))}
                      className="bg-slate-800 border border-white/5 rounded-xl px-4 py-2 w-24 text-sm"
                    />
                    <input 
                      type="number" step="0.0001" value={loc.lng} 
                      onChange={(e) => updateRow(index, 'lng', parseFloat(e.target.value))}
                      className="bg-slate-800 border border-white/5 rounded-xl px-4 py-2 w-24 text-sm"
                    />
                  </td>
                  <td className="p-4">
                    <button onClick={() => deleteRow(index)} className="text-slate-600 hover:text-red-500 transition-colors p-2"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button 
            onClick={addRow}
            className="w-full p-6 bg-white/5 hover:bg-white/10 text-slate-400 font-bold uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 transition-all"
          >
            <Plus size={16} /> Додати новий рядок
          </button>
        </div>
      </div>
    </div>
  );
}і