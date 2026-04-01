"use client";

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { api } from '@/services/api';
import { useRouter } from 'next/navigation';

export interface MenuCategory {
  id: string;
  name: string;
  slug: string;
  children: MenuCategory[];
}

export function Navbar() {
  const [menuTree, setMenuTree] = useState<MenuCategory[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isCartBouncing, setIsCartBouncing] = useState(false);
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartCount(cart.length);
    setIsCartBouncing(true);
    setTimeout(() => setIsCartBouncing(false), 600);
  };

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await api.get('/categories/tree');
        setMenuTree(response.data);
      } catch (error) {
        console.error("Lỗi khi kết nối Backend:", error);
        setMenuTree([]);
      }
    };
    fetchMenu();
    updateCartCount();

    // Lắng nghe sự kiện cập nhật giỏ hàng từ các component khác
    window.addEventListener('cart-updated', updateCartCount);
    return () => window.removeEventListener('cart-updated', updateCartCount);
  }, []);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-[0_2px_20px_rgba(0,0,0,0.03)] transition-all">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-[72px] items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="text-2xl font-black tracking-tighter text-stone-900 flex items-center gap-2 shrink-0">
            NV HOMES<span className="text-red-500">.</span>
          </Link>
          
          {/* Desktop Menu - Centered */}
          <div className="hidden lg:flex flex-1 justify-center items-center h-full px-8">
            <div className="flex items-center h-full">
              <Link href="/" className="px-4 text-[13px] font-bold text-stone-600 hover:text-stone-900 uppercase tracking-widest transition-colors">Trang Chủ</Link>
              <Link href="/about" className="px-4 text-[13px] font-bold text-stone-600 hover:text-stone-900 uppercase tracking-widest transition-colors">Giới Thiệu</Link>
              
              {/* Dynamic Categories */}
              {menuTree.map(item => (
                <div 
                  key={item.id} 
                  className="relative group h-full flex items-center px-4 cursor-pointer"
                  onMouseEnter={() => setActiveMenuId(item.id)}
                  onMouseLeave={() => setActiveMenuId(null)}
                >
                  <Link 
                    href={`/category/${item.slug}`} 
                    className="text-[13px] font-bold text-stone-600 group-hover:text-stone-900 transition-colors flex items-center gap-1.5 uppercase tracking-widest"
                  >
                    {item.name}
                    {item.children.length > 0 && (
                      <svg className="w-3 h-3 text-stone-400 group-hover:rotate-180 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                    )}
                  </Link>
                  
                  {item.children.length > 0 && activeMenuId === item.id && (
                    <div className="absolute top-[72px] left-0 min-w-[240px] bg-white border border-stone-100 shadow-2xl rounded-b-2xl overflow-hidden py-4 animate-in fade-in slide-in-from-top-2 duration-200">
                      {item.children.map(child => (
                        <Link 
                          key={child.id} 
                          href={`/category/${child.slug}`}
                          className="block px-6 py-3 text-[14px] text-stone-600 hover:bg-stone-50 hover:text-stone-900 font-bold transition-colors border-l-2 border-transparent hover:border-red-500"
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <Link href="/projects" className="px-4 text-[13px] font-bold text-stone-600 hover:text-stone-900 uppercase tracking-widest transition-colors">Dự Án</Link>
              <Link href="/contact" className="px-4 text-[13px] font-bold text-stone-600 hover:text-stone-900 uppercase tracking-widest transition-colors">Liên Hệ</Link>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 lg:gap-5 shrink-0">
            {/* Shopee-style Cart Icon with Badge - Moved to before Search for visibility */}
            <Link 
              href="/cart" 
              className={`flex items-center gap-2 px-2 py-2 text-stone-700 hover:bg-stone-100 rounded-2xl transition-all relative group z-[60] ${isCartBouncing ? 'nav-cart-pop' : ''}`}
            >
               <div className="relative">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {cartCount > 0 && (
                    <span className={`absolute -top-1.5 -right-1.5 bg-[#ee4d2d] text-white text-[10px] font-black min-w-[20px] h-[20px] px-1.5 flex items-center justify-center rounded-full shadow-lg border-2 border-white transition-all ${isCartBouncing ? 'scale-125' : 'scale-100'}`}>
                      {cartCount}
                    </span>
                  )}
               </div>
               <span className="hidden xl:inline text-[11px] font-black uppercase tracking-widest text-stone-700 group-hover:text-red-600 transition-colors">Giỏ hàng</span>
            </Link>

            {/* Search Toggle */}
            <div className="relative z-[50]">
              {!isSearchOpen ? (
                <button 
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 text-stone-700 hover:bg-stone-100 rounded-full transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </button>
              ) : (
                <form onSubmit={handleSearch} className="flex items-center bg-stone-100 rounded-full px-4 py-2 animate-in fade-in zoom-in-95 duration-200">
                  <input 
                    ref={searchInputRef}
                    type="text" 
                    placeholder="Tìm kiếm..."
                    className="bg-transparent border-none outline-none text-sm font-bold w-32 md:w-64 text-stone-900"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onBlur={() => !searchQuery && setIsSearchOpen(false)}
                  />
                </form>
              )}
            </div>

            <style jsx>{`
              @keyframes nav-cart-pop {
                0% { transform: scale(1); }
                50% { transform: scale(1.3); }
                100% { transform: scale(1); }
              }
              .nav-cart-pop {
                animation: nav-cart-pop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                color: #ef4444 !important;
              }
            `}</style>

            <Link href="/contact" className="hidden lg:flex bg-stone-900 text-white px-7 py-3 rounded-full font-black text-[11px] tracking-widest uppercase shadow-[0_10px_20px_rgba(0,0,0,0.1)] hover:bg-stone-800 transition-all hover:-translate-y-0.5">
              Nhận Báo Giá
            </Link>
            
            <button 
              className="lg:hidden p-2 text-stone-900 rounded-lg" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-100 bg-white max-h-[85vh] overflow-y-auto w-full absolute top-[72px] shadow-2xl animate-in fade-in slide-in-from-top-4">
          <div className="flex flex-col p-6 space-y-2">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="py-3 font-black text-stone-800 uppercase tracking-widest border-b border-stone-50">Trang Chủ</Link>
            <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="py-3 font-black text-stone-800 uppercase tracking-widest border-b border-stone-50">Giới Thiệu</Link>
            
            {menuTree.map(item => (
              <div key={item.id} className="border-b border-stone-50 last:border-0">
                <div 
                  className="flex justify-between items-center py-3 font-black text-stone-800 uppercase tracking-widest"
                  onClick={() => setActiveMenuId(activeMenuId === item.id ? null : item.id)}
                >
                  <Link href={`/category/${item.slug}`} onClick={() => item.children.length === 0 && setIsMobileMenuOpen(false)}>
                    {item.name}
                  </Link>
                  {item.children.length > 0 && (
                    <svg className={`w-4 h-4 transition-transform ${activeMenuId === item.id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  )}
                </div>
                {item.children.length > 0 && activeMenuId === item.id && (
                  <div className="pl-6 flex flex-col pb-4 border-l-2 border-stone-100 ml-2">
                    {item.children.map(child => (
                      <Link 
                        key={child.id} 
                        href={`/category/${child.slug}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="py-2 text-[14px] font-bold text-stone-500 hover:text-stone-900"
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            <Link href="/projects" onClick={() => setIsMobileMenuOpen(false)} className="py-3 font-black text-stone-800 uppercase tracking-widest border-b border-stone-50">Dự Án</Link>
            <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="py-3 font-black text-stone-800 uppercase tracking-widest">Liên Hệ</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
