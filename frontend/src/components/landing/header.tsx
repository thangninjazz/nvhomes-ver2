"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { api } from "@/services/api"
import { useRouter } from "next/navigation"

interface NavLink {
  href: string;
  label: string;
  children?: { href: string; label: string }[];
}

export function Header() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const [expandedParent, setExpandedParent] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isScrolled, setIsScrolled] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [isCartBouncing, setIsCartBouncing] = useState(false)

  // Sync Cart Count
  useEffect(() => {
    const updateCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]')
      setCartCount(cart.length)
      setIsCartBouncing(true)
      setTimeout(() => setIsCartBouncing(false), 300)
    }
    updateCount()
    window.addEventListener('cart-updated', updateCount)
    window.addEventListener('storage', updateCount)
    return () => {
      window.removeEventListener('cart-updated', updateCount)
      window.removeEventListener('storage', updateCount)
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const fetchTree = async () => {
      try {
        const res = await api.get('/categories/tree')
        const visibleRoots = res.data.filter((c: any) => c.isVisible)
        setCategories(visibleRoots)
      } catch (err) {
        console.error("Error fetching menu tree:", err)
      }
    }
    fetchTree()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setIsOpen(false)
      setSearchQuery("")
      
      // Auto-hide mobile keyboard
      if (typeof document !== 'undefined') {
        (document.activeElement as HTMLElement)?.blur()
      }
    }
  }

  const navLinks: NavLink[] = [
    { href: "/", label: "Trang chủ" },
    ...categories.map(cat => ({
      href: `/category/${cat.slug}`,
      label: cat.name,
      children: cat.children?.filter((child: any) => child.isVisible).map((child: any) => ({
        href: `/category/${child.slug}`,
        label: child.name
      }))
    })),
    { href: "/projects", label: "Dự án" },
  ]

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'glass-header h-16 shadow-lg' : 'bg-white/95 backdrop-blur-md h-24 border-b border-stone-100 shadow-sm'}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 shrink-0 group">
              <div className="relative w-12 h-12 overflow-hidden rounded-xl border-2 border-primary/20 group-hover:border-primary transition-all duration-300">
                <img 
                  src="/logo.png" 
                  alt="NV Homes Logo" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="hidden sm:block">
                <span className="font-serif text-xl font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors">NV Homes</span>
                <p className="text-[10px] text-muted-foreground tracking-[0.2em] uppercase font-bold">Nội thất cao cấp</p>
              </div>
            </Link>
   
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <div key={link.label} className="group relative">
                  <Link
                    href={link.href}
                    className="text-sm tracking-wide text-muted-foreground hover:text-foreground transition-colors duration-300 flex items-center gap-1"
                  >
                    {link.label}
                    {link.children && link.children.length > 0 && (
                      <span className="text-[10px] opacity-30 group-hover:rotate-180 transition-transform duration-300">▼</span>
                    )}
                  </Link>
                  
                  {link.children && link.children.length > 0 && (
                    <div className="absolute top-full left-0 pt-4 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 ease-out z-[60]">
                      <div className="bg-white/95 backdrop-blur-xl border border-stone-200/50 shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-5 min-w-[220px] rounded-2xl grid gap-1">
                         {link.children.map(child => (
                           <Link 
                             key={child.label} 
                             href={child.href}
                             className="text-[13px] py-2.5 px-4 hover:bg-stone-50 text-stone-600 hover:text-stone-900 rounded-xl transition-all font-medium flex items-center justify-between group/item"
                           >
                             {child.label}
                             <div className="w-1 h-1 bg-stone-900 rounded-full opacity-0 group-hover/item:opacity-100 transition-all scale-0 group-hover/item:scale-100" />
                           </Link>
                         ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Actions: Search, Cart, Menu */}
            <div className="flex items-center gap-1 sm:gap-3 lg:gap-4 ml-auto">
              {/* 1. Desktop Search */}
              <form onSubmit={handleSearch} className="relative group hidden lg:block w-[200px] xl:w-[280px]">
                <input
                  type="text"
                  placeholder="Tìm kiếm nội thất..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-stone-100/50 border border-stone-200/30 rounded-full h-11 pl-11 pr-11 text-[13px] font-medium focus:ring-2 focus:ring-stone-900/10 focus:bg-white focus:border-stone-900/20 transition-all outline-none text-stone-900"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 group-focus-within:text-stone-900 transition-colors" />
                <button 
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 bg-stone-900 text-white rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-lg shadow-stone-900/20"
                >
                  <Search className="w-3.5 h-3.5" />
                </button>
              </form>


              {/* 3. Shopee-style Cart Icon */}
              <Link 
                href="/cart" 
                className={`relative p-2.5 text-stone-700 hover:text-stone-900 hover:bg-stone-100 rounded-full transition-all flex flex-col items-center group/cart ${isCartBouncing ? 'nav-cart-pop' : ''}`}
              >
                <div className="relative">
                  <svg className="w-6.5 h-6.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.4} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1.5 bg-[#ee4d2d] text-white text-[9px] font-black min-w-[18px] h-[18px] flex items-center justify-center rounded-full border-2 border-white shadow-md pulse-soft">
                      {cartCount}
                    </span>
                  )}
                </div>
              </Link>

              {/* 4. Hamburger Menu (Mobile/Tablet only) */}
              <div className="lg:hidden h-8 w-px bg-stone-200 mx-1" />
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-2 text-stone-900 hover:bg-stone-100 rounded-full transition-all"
                aria-label="Toggle menu"
              >
                {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
              </button>
            </div>
          </div>

        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Menu Drawer */}
      <div 
        className={`fixed top-0 right-0 z-[110] h-screen w-[75%] sm:w-[50%] bg-white/95 backdrop-blur-2xl shadow-[-15px_0_40px_rgba(0,0,0,0.1)] transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) transform lg:hidden rounded-l-3xl ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ height: '100vh' }}
      >
        <div className="flex flex-col h-full">
          <div className="flex flex-col p-7 border-b border-stone-100 flex-shrink-0 gap-6 bg-white">
            <div className="flex items-center justify-between">
              <span className="font-serif text-xl font-bold text-stone-900 tracking-tight">Thanh Menu</span>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-3 bg-stone-50 hover:bg-stone-100 rounded-full transition-colors text-stone-400"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {/* 🔍 Mobile Search Form inside Menu */}
            <form onSubmit={handleSearch} className="relative w-full">
              <input
                type="text"
                placeholder="Tìm sản phẩm, dự án..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-stone-50 border border-stone-100 rounded-2xl h-13 pl-12 pr-4 text-[14px] font-medium focus:ring-4 focus:ring-stone-900/5 focus:bg-white focus:border-stone-900 transition-all text-stone-900 shadow-sm outline-none"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
              <button 
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-stone-900 text-white rounded-xl flex items-center justify-center hover:scale-105 transition-transform"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>
          
          {/* Navigation Links */}
          <nav className="flex-1 py-6 px-5 overflow-y-auto custom-scrollbar">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <div key={link.label} className="flex flex-col">
                  <div className={`flex items-center justify-between rounded-2xl px-3 transition-all ${expandedParent === link.label ? 'bg-stone-50' : 'hover:bg-stone-50'}`}>
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="text-base py-4 text-stone-800 hover:text-stone-900 transition-colors font-bold flex-1"
                    >
                      {link.label}
                    </Link>
                    {link.children && link.children.length > 0 && (
                      <button 
                        onClick={() => setExpandedParent(expandedParent === link.label ? null : link.label)}
                        className="p-4 text-stone-400 hover:text-stone-900 transition-all"
                      >
                        <span className={`inline-block transition-transform duration-300 ${expandedParent === link.label ? 'rotate-180 text-stone-900' : ''}`}>
                          ▼
                        </span>
                      </button>
                    )}
                  </div>
                  
                  {link.children && link.children.length > 0 && expandedParent === link.label && (
                    <div className="ml-6 mr-2 flex flex-col gap-1 border-l-2 border-stone-900/10 mt-1 mb-4 animate-in slide-in-from-top-2 duration-300 bg-stone-50/30 rounded-r-2xl p-3">
                      {link.children.map(child => (
                        <Link
                          key={child.label}
                          href={child.href}
                          onClick={() => setIsOpen(false)}
                          className="text-sm py-3 px-4 text-stone-600 hover:text-stone-900 hover:bg-white rounded-xl transition-all font-medium"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </nav>
          
          {/* Drawer Footer */}
          <div className="p-7 border-t border-stone-100 bg-stone-50/50 flex-shrink-0">
            <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-5">Liên hệ tư vấn viên</p>
            <div className="flex flex-col gap-3">
              <a href="tel:0966245396" className="w-full bg-stone-900 text-white py-4 px-6 flex items-center justify-center gap-3 rounded-2xl hover:bg-stone-800 transition-all shadow-lg shadow-stone-900/20 active:scale-95">
                <span className="text-xl">📞</span>
                <span className="text-sm font-bold uppercase tracking-wide">0966.245.396</span>
              </a>
              <a href="https://zalo.me/0966245396" className="w-full bg-[#0068ff] text-white py-4 px-6 flex items-center justify-center gap-3 rounded-2xl hover:opacity-90 transition-all shadow-lg shadow-blue-500/20 active:scale-95">
                <span className="text-sm font-bold uppercase tracking-wider">Tư vấn qua Zalo</span>
              </a>
            </div>
            <p className="mt-8 text-center text-[9px] text-stone-400 font-medium">© 2026 NV Homes. All rights reserved.</p>
          </div>
        </div>
      </div>
    </>
  )
}
