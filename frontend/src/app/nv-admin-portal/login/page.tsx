"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { api, setAuthToken } from '@/services/api';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { setAuth } = useAuthStore();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Gọi API Đăng nhập .NET Backend
      const res = await api.post('/auth/login', { email, password });
      
      // Lưu thông tin User vào State (Token đã được Backend lưu vào HttpOnly Cookie)
      setAuth(null as any, { email: res.data.email, role: res.data.role });
      
      // Nhảy vào CMS Dashboard
      router.push('/nv-admin-portal');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Email hoặc mật khẩu không chính xác.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      <div className="absolute top-0 -left-1/4 w-96 h-96 bg-stone-200 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute -bottom-1/4 -right-1/4 w-96 h-96 bg-stone-300 rounded-full blur-3xl opacity-50"></div>
      
      <div className="bg-white max-w-md w-full p-10 rounded-[2.5rem] shadow-xl border border-stone-200 relative z-10 text-center">
        <h1 className="text-4xl font-black text-stone-900 tracking-widest uppercase mb-2">NV<span className="text-red-600">.</span>CMS</h1>
        <p className="text-sm font-bold text-stone-400 mb-10 uppercase tracking-[0.2em]">Hệ Thống Đăng Nhập Quản Trị</p>
        
        {error && (
            <div className="bg-red-50 text-red-600 border border-red-200 p-4 rounded-2xl mb-6 text-sm font-bold text-left shadow-sm">
                ⚠ {error}
            </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6 text-left">
          <div>
            <label className="block text-[11px] font-black text-stone-500 uppercase tracking-widest mb-3">Tài Khoản Email Admin</label>
            <input 
              type="email" 
              required
              placeholder="admin@nvhome.com"
              className="w-full bg-stone-50 border border-stone-200 px-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent font-bold text-stone-700 transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-[11px] font-black text-stone-500 uppercase tracking-widest mb-3">Mật Khẩu Phân Quyền</label>
            <input 
              type="password" 
              required
              placeholder="••••••••"
              className="w-full bg-stone-50 border border-stone-200 px-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent font-bold text-stone-700 transition-all font-mono"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-stone-900 text-white font-black tracking-widest uppercase py-5 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] hover:bg-black transition-all hover:-translate-y-1 active:translate-y-0 disabled:opacity-70 disabled:hover:translate-y-0 flex items-center justify-center gap-3 mt-4"
          >
            {loading ? "Đang Xác Thực Thông Tin..." : "Truy Cập Quản Trị Hệ Sinh Thái"}
          </button>
        </form>
        
      </div>
    </div>
  );
}
