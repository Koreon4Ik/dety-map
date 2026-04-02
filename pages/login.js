import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ChevronLeft, Lock } from 'lucide-react';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    // Ми відправляємо запит до нашого маленького API
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD_LOCAL || password === 'твій_тимчасовий_пароль_для_тестів') {
      localStorage.setItem('admin_auth', password);
      router.push('/admin');
    } else {
      setError('Невірний пароль!');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-white font-sans">
      <div className="max-w-md w-full bg-slate-900 border border-white/10 rounded-[40px] p-10 shadow-2xl">
        <Link href="/" className="text-slate-500 hover:text-yellow-400 flex items-center gap-2 mb-8 transition-colors">
          <ChevronLeft size={18} /> На мапу
        </Link>
        
        <div className="bg-yellow-400 w-16 h-16 rounded-2xl flex items-center justify-center text-black mb-6 shadow-xl shadow-yellow-400/20">
          <Lock size={30} />
        </div>

        <h1 className="text-3xl font-black uppercase italic mb-2">Вхід в адмінку</h1>
        <p className="text-slate-400 text-sm mb-8">Введіть пароль доступу до бази даних.</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-slate-800 border border-white/5 rounded-2xl p-5 outline-none focus:border-yellow-400 transition-all font-bold"
            placeholder="Ваш пароль..."
          />
          {error && <p className="text-red-500 text-xs font-bold ml-2">{error}</p>}
          <button className="w-full bg-white text-black h-16 rounded-2xl font-black uppercase italic hover:bg-yellow-400 transition-all shadow-xl">
            Увійти
          </button>
        </form>
      </div>
    </div>
  );
}