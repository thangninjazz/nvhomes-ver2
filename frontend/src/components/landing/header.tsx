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
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
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
                      <span className="text-[10px] opacity-50 group-hover:rotate-180 transition-transform">▼</span>
                    )}
                  </Link>
                  
                  {link.children && link.children.length > 0 && (
                    <div className="absolute top-full left-0 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                      <div className="bg-white border border-border/50 shadow-xl p-4 min-w-[200px] grid gap-2">
                         {link.children.map(child => (
                           <Link 
                             key={child.label} 
                             href={child.href}
                             className="text-xs py-2 px-3 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
                           >
                             {child.label}
                           </Link>
                         ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Search bar & Mobile Menu Button */}
            <div className="flex items-center flex-1 lg:flex-initial justify-end gap-2 sm:gap-4">
              <form onSubmit={handleSearch} className="relative group w-full max-w-[120px] sm:max-w-[200px] lg:max-w-[250px] hidden sm:block">
                <input
                  type="text"
                  placeholder="Tìm sản phẩm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-secondary/50 border-none rounded-full h-10 pl-10 pr-4 text-xs font-bold focus:ring-2 focus:ring-primary transition-all placeholder:text-muted-foreground/50 text-foreground"
                />
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50 group-hover:text-primary transition-colors" />
              </form>

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-2 text-foreground/80 hover:text-primary transition-colors"
                aria-label="Toggle menu"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
        className={`fixed top-0 right-0 z-[110] h-screen w-[70%] sm:w-[50%] bg-white shadow-[-10px_0_30px_rgba(0,0,0,0.1)] transition-transform duration-300 ease-out transform lg:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ height: '100vh' }}
      >
        <div className="flex flex-col h-full bg-white">
          {/* Drawer Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100 flex-shrink-0">
            <span className="font-serif text-xl font-bold text-gray-900">Danh mục</span>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {/* Search Box in Mobile Menu */}
          <div className="px-6 pt-6 flex-shrink-0 sm:hidden">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Tìm sản phẩm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl h-12 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-primary transition-all text-gray-900"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </form>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 py-4 px-4 overflow-y-auto custom-scrollbar">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <div key={link.label} className="flex flex-col">
                  <div className={`flex items-center justify-between rounded-xl px-2 transition-all ${expandedParent === link.label ? 'bg-gray-50' : 'hover:bg-gray-50'}`}>
                    <Link
                      href={link.href}
                      onClick={() => !link.children && setIsOpen(false)}
                      className="text-base py-4 px-2 text-gray-800 hover:text-primary transition-colors font-bold flex-1"
                    >
                      {link.label}
                    </Link>
                    {link.children && link.children.length > 0 && (
                      <button 
                        onClick={() => setExpandedParent(expandedParent === link.label ? null : link.label)}
                        className="p-4 text-gray-400 hover:text-primary transition-all"
                      >
                        <span className={`inline-block transition-transform duration-300 ${expandedParent === link.label ? 'rotate-180 text-primary' : ''}`}>
                          ▼
                        </span>
                      </button>
                    )}
                  </div>
                  
                  {link.children && link.children.length > 0 && expandedParent === link.label && (
                    <div className="ml-6 mr-2 flex flex-col gap-1 border-l-2 border-primary/20 mt-1 mb-4 animate-in slide-in-from-top-2 duration-300 bg-gray-50/50 rounded-r-xl p-2">
                      {link.children.map(child => (
                        <Link
                          key={child.label}
                          href={child.href}
                          onClick={() => setIsOpen(false)}
                          className="text-sm py-3 px-4 text-gray-600 hover:text-primary hover:bg-white rounded-lg transition-all font-medium"
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
          <div className="p-6 border-t border-gray-100 bg-gray-50 flex-shrink-0">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Kết nối với chúng tôi</p>
            <div className="flex gap-4">
              <a href="tel:0966245396" className="flex-1 bg-white border border-gray-200 py-3 px-4 flex items-center justify-center gap-2 rounded-xl hover:text-primary hover:border-primary transition-all shadow-sm group">
                <span className="text-lg">📞</span>
                <span className="text-xs font-bold text-gray-700">Gọi ngay</span>
              </a>
              <a href="https://zalo.me/0966245396" className="flex-1 bg-[#0068ff] text-white py-3 px-4 flex items-center justify-center gap-2 rounded-xl hover:opacity-90 transition-all shadow-sm">
                <span className="text-xs font-bold uppercase tracking-wider">Zalo</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
