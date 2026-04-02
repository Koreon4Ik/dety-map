import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Check, Trash2, MapPin, ChevronLeft, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function AdminPanel() {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPending();
  }, []);

  async function fetchPending() {
    setLoading(true);
    setError(null);
    try {
      const { data, error: supabaseError } = await supabase
        .from('locations')
        .select('*')
        .eq('verified', false)
        .order('created_at', { ascending: false });

      if (supabaseError) throw supabaseError;
      setPending(data || []);
    } catch (err) {
      console.error('Помилка завантаження:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function approvePoint(id) {
    const { error } = await supabase
      .from('locations')
      .update({ verified: true })
      .eq('id', id);
    if (!error) fetchPending();
  }

  async function deletePoint(id) {
    if (confirm('Видалити цю заявку?')) {
      const { error } = await supabase.from('locations').delete().eq('id', id);
      if (!error) fetchPending();
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-yellow-400 transition mb-6 text-sm">
          <ChevronLeft size={16} /> На головну
        </Link>
        <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-2 italic">Адмін-панель</h1>
        <p className="text-slate-400 mb-10 font-medium">Модерація нових заявок на мапу</p>

        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/50 rounded-2xl flex items-center gap-3 text-red-500 text-sm font-bold uppercase italic tracking-tight">
            <AlertCircle size={20} /> Помилка: {error}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center py-20 gap-4">
            <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-yellow-400 font-black uppercase text-[10px] tracking-widest italic">Зв'язок з базою...</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {pending.map(item => (
              <div key={item.id} className="bg-slate-900 border border-white/5 p-6 rounded-[32px] flex flex-col md:flex-row justify-between gap-6 hover:border-yellow-400/30 transition-all shadow-2xl">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="bg-yellow-400 text-black text-[9px] font-black px-3 py-1 rounded-full uppercase italic">
                      {item.category}
                    </span>
                    <span className="text-slate-600 text-[10px] font-mono">#{item.id}</span>
                  </div>
                  <h3 className="text-2xl font-black mb-2 uppercase tracking-tighter italic">{item.name}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed font-medium">{item.description}</p>
                  <div className="flex items-center gap-2 mt-5 text-slate-500 text-xs font-mono bg-white/5 w-fit px-3 py-1.5 rounded-lg">
                    <MapPin size={14} className="text-yellow-400" /> {item.lat}, {item.lng}
                  </div>
                </div>
                
                <div className="flex md:flex-col gap-3 justify-center min-w-[80px]">
                  <button 
                    onClick={() => approvePoint(item.id)}
                    className="flex-1 bg-green-500 hover:bg-green-400 text-black p-5 rounded-3xl transition-all shadow-lg shadow-green-500/20 active:scale-95"
                    title="Опублікувати на мапі"
                  >
                    <Check size={28} strokeWidth={4} />
                  </button>
                  <button 
                    onClick={() => deletePoint(item.id)}
                    className="flex-1 bg-white/5 hover:bg-red-500/20 hover:text-red-500 text-slate-500 p-5 rounded-3xl transition-all active:scale-95"
                    title="Видалити"
                  >
                    <Trash2 size={28} />
                  </button>
                </div>
              </div>
            ))}
            {pending.length === 0 && !error && (
              <div className="text-center py-24 border-2 border-dashed border-white/5 rounded-[50px] bg-white/[0.01]">
                <p className="text-slate-600 font-black uppercase italic text-sm tracking-widest">Нових заявок немає. Все чисто! 🤘</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}