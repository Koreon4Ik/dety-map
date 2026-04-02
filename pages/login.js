import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ChevronLeft, Lock, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Отримуємо пароль зі змінних оточення
  const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // ЛОГ ДЛЯ ТЕСТУ (потім можна видалити)
    console.log("Введено:", password);
    console.log("Очікується:", ADMIN_PASSWORD);

    if (!ADMIN_PASSWORD) {
      setError('Помилка конфігурації: Пароль не встановлено в системі.');
      setIsLoading(false);
      return;
    }

    if (password === ADMIN_PASSWORD) {
      localStorage.setItem('admin_auth', password);
      console.log("Пароль вірний! Перенаправлення...");
      router.push('/admin');
    } else {
      setError('Невірний пароль. Спробуйте ще раз.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-white font-sans">
      <div className="max-w-md w-full bg-slate-900 border border-white/10 rounded-[40px] p-10 shadow-2xl relative overflow-hidden">
        
        {/* Декор */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-yellow-400/10 rounded-full blur-3xl"></div>

        <Link href="/" className="text-slate-500 hover:text-yellow-400 flex items-center gap-2 mb-8 transition-colors relative z-10">
          <ChevronLeft size={18} /> На мапу
        </Link>
        
        <div className="bg-yellow-400 w-16 h-16 rounded-2xl flex items-center justify-center text-black mb-6 shadow-xl shadow-yellow-400/20 relative z-10">
          <Lock size={30} />
        </div>

        <h1 className="text-3xl font-black uppercase italic mb-2 relative z-10">Вхід</h1>
        <p className="text-slate-400 text-sm mb-8 relative z-10">Доступ лише для адміністраторів проекту.</p>

        <form onSubmit={handleLogin} className="space-y-4 relative z-10">
          <div className="relative">
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full bg-slate-800 border ${error ? 'border-red-500' : 'border-white/5'} rounded-2xl p-5 outline-none focus:border-yellow-400 transition-all font-bold tracking-widest`}
              placeholder="••••••••"
              autoFocus
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-500 text-xs font-bold ml-2 animate-shake">
              <AlertCircle size={14} />
              {error}
            </div>
          )}

          <button 
            disabled={isLoading}
            className="w-full bg-white text-black h-16 rounded-2xl font-black uppercase italic hover:bg-yellow-400 disabled:bg-slate-700 disabled:text-slate-500 transition-all shadow-xl active:scale-95"
          >
            {isLoading ? 'Завантаження...' : 'Підтвердити вхід'}
          </button>
        </form>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
      `}</style>
    </div>
  );
}