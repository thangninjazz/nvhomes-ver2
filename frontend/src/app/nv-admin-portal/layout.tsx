"use client";

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { Menu as HamburgerIcon, X as CloseIcon } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { token, user, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    // Client-side Route Guard: Chỉ kiểm tra trên trình duyệt
    if (typeof window !== 'undefined') {
        const isLoginRoute = pathname === '/nv-admin-portal/login';
        
        if (!user && !isLoginRoute) {
            router.push('/nv-admin-portal/login');
        } else if (user && isLoginRoute) {
            router.push('/nv-admin-portal'); // Đã login rồi thì ko vào trang login nữa
        } else {
            setIsAuthorized(true);
        }
    }
  }, [token, pathname, router]);

  // Nếu đang ở trang login, render component bình thường (không có Sidebar của Admin)
  if (pathname === '/nv-admin-portal/login') {
    return <>{children}</>;
  }

  // Nếu chưa xác thực xong, hiển thị màn hình chờ (tránh lọt nội dung)
  if (!isAuthorized) {
      return (
          <div className="min-h-screen flex flex-col items-center justify-center bg-stone-100">
              <div className="w-12 h-12 border-4 border-stone-300 border-t-stone-900 rounded-full animate-spin mb-4"></div>
              <p className="font-bold text-stone-500 uppercase tracking-widest text-xs">🛡 Kiểm Tra Hệ Thống Phân Quyền...</p>
          </div>
      );
  }

  // Render Admin Dashboard khi đã đăng nhập
  return (
    <div className="flex h-screen bg-stone-100 overflow-hidden text-stone-900 font-sans">
      {/* Sidebar Navigation */}
      <aside 
        className={`bg-stone-900 text-stone-300 flex flex-col shrink-0 shadow-2xl z-20 transition-all duration-300 ease-in-out relative overflow-hidden ${
          isSidebarOpen ? "w-72" : "w-0"
        }`}
      >
        <div className={`transition-opacity duration-300 ${isSidebarOpen ? "opacity-100" : "opacity-0 invisible pointer-events-none"}`}>
          <div className="h-[72px] flex items-center justify-center border-b border-stone-800 shrink-0">
            <Link href="/nv-admin-portal" className="text-2xl font-black text-white tracking-widest uppercase truncate px-4">NV.CMS</Link>
          </div>
          <nav className="flex-1 overflow-y-auto py-8 flex flex-col gap-2 px-5 min-w-[288px]">
            <p className="text-xs font-bold tracking-widest uppercase text-stone-500 mb-2 pl-2">System Config</p>
            <Link href="/nv-admin-portal" className={`px-5 py-3.5 rounded-xl hover:bg-stone-800 hover:text-white font-medium transition-colors ${pathname === '/nv-admin-portal' ? 'bg-stone-800 text-white' : ''}`}>
              Tổng Quan (Dashboard)
            </Link>
            <Link href="/nv-admin-portal/menu" className={`px-5 py-3.5 rounded-xl hover:bg-stone-800 hover:text-white font-medium transition-colors ${pathname === '/nv-admin-portal/menu' ? 'bg-stone-800 text-white' : ''}`}>
              Hạng mục Sản phẩm
            </Link>
            
            <p className="text-xs font-bold tracking-widest uppercase text-stone-500 mb-2 mt-6 pl-2">E-Commerce</p>
            <Link href="/nv-admin-portal/products" className={`px-5 py-3.5 rounded-xl hover:bg-stone-800 hover:text-white font-medium transition-colors ${pathname === '/nv-admin-portal/products' ? 'bg-stone-800 text-white' : ''}`}>
              Quản Lý Sản Phẩm
            </Link>
            <Link href="/nv-admin-portal/projects" className={`px-5 py-3.5 rounded-xl hover:bg-stone-800 hover:text-white font-medium transition-colors ${pathname === '/nv-admin-portal/projects' ? 'bg-stone-800 text-white' : ''}`}>
              Portfolio Dự Án
            </Link>
            <Link href="/nv-admin-portal/project-categories" className={`px-5 py-3.5 rounded-xl hover:bg-stone-800 hover:text-white font-medium transition-colors ${pathname === '/nv-admin-portal/project-categories' ? 'bg-stone-800 text-white' : ''}`}>
              Hạng mục Dự án
            </Link>
            
            <p className="text-xs font-bold tracking-widest uppercase text-stone-500 mb-2 mt-6 pl-2">CRM</p>
            <Link href="/nv-admin-portal/customers" className={`px-5 py-3.5 rounded-xl hover:bg-stone-800 hover:text-white font-medium transition-colors ${pathname === '/nv-admin-portal/customers' ? 'bg-stone-800 text-white' : ''}`}>
              CRM Khách Hàng
            </Link>
          </nav>
          <div className="p-6 border-t border-stone-800 bg-stone-950/50 flex flex-col gap-3 min-w-[288px]">
            <button onClick={() => { logout(); router.push('/nv-admin-portal/login'); }} className="flex items-center justify-center gap-2 w-full py-3 bg-red-600/10 text-red-500 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-red-600 hover:text-white transition-colors">
              Đăng Xuất
            </button>
            <Link href="/" className="flex items-center justify-center gap-2 w-full py-3 bg-stone-800 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-stone-700 transition-colors text-white text-center">
              Trở Về Web Client
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden bg-stone-50/50 z-10 relative">
        <header className="h-[72px] bg-white border-b border-stone-200 flex items-center justify-between px-6 lg:px-10 shrink-0 shadow-sm">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-stone-100 rounded-lg transition-colors text-stone-600"
              aria-label="Toggle Sidebar"
            >
              <HamburgerIcon className="w-6 h-6" />
            </button>
            <h2 className="text-lg lg:text-xl font-bold text-stone-800 truncate">Trình Quản Trị Hệ Sinh Thái</h2>
          </div>
          
          <div className="flex items-center gap-4 lg:gap-8">
            <div className="hidden sm:flex flex-col items-end">
                <span className="text-[10px] font-black tracking-widest uppercase text-stone-400 leading-none mb-1">{user?.role || 'Administrator'}</span>
                <span className="text-sm font-bold text-stone-800 leading-none">{user?.email?.split('@')[0] || 'Admin'}</span>
            </div>
            <div className="w-10 h-10 bg-gradient-to-tr from-stone-800 to-stone-400 rounded-full shadow-md border-2 border-white cursor-pointer hover:scale-105 transition-transform flex-shrink-0"></div>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-6 lg:p-10">
          {children}
        </div>
      </main>
    </div>
  );
}
