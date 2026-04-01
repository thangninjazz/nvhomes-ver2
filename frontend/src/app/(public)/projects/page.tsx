"use client";

import { useEffect, useState } from "react";
import { api } from "@/services/api";
import Link from "next/link";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [projRes, catRes] = await Promise.all([
          api.get('/projects'),
          api.get('/categories?type=Project')
        ]);
        setProjects(projRes.data);
        setCategories(catRes.data || []);
      } catch (err) {
        console.error("Lỗi tải dữ liệu:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredProjects = selectedCategory === "all" 
    ? projects 
    : projects.filter(p => p.categoryId === selectedCategory);

  return (
    <div className="bg-white min-h-screen pt-24 md:pt-32 pb-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mb-10 md:mb-20">
          <h1 className="text-sm font-black text-red-500 uppercase tracking-[0.2em] mb-4">Dự án tiêu biểu</h1>
          <h2 className="text-3xl md:text-5xl font-black text-stone-900 mb-6 md:mb-8 leading-tight uppercase tracking-tight md:tracking-tighter">
            Kiến Trúc <span className="text-stone-400">/</span> Nội Thất <br className="hidden md:block" />
            Đẳng Cấp <span className="text-stone-400">&</span> Tận Tâm
          </h2>
          <p className="text-lg md:text-xl text-stone-500 font-medium leading-relaxed">
            Chúng tôi tự hào mang đến những giải pháp thiết kế sáng tạo, tối ưu công năng và thẩm mỹ cho hàng trăm gia đình Việt.
          </p>
        </div>

        {/* Filter & Sort Bar */}
        <div className="flex flex-col gap-6 mb-12 pb-8 border-b border-stone-100">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">Danh mục & Sắp xếp</span>
            <div className="flex items-center gap-2 bg-stone-50 py-2 px-3 rounded-xl border border-stone-100 flex-shrink-0 shadow-sm">
               <svg className="w-4 h-4 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" /></svg>
               <select 
                 className="bg-transparent text-[11px] font-black text-stone-900 focus:outline-none cursor-pointer uppercase tracking-wider w-full"
                 onChange={(e) => {
                   const val = e.target.value;
                   const sorted = [...projects];
                   if (val === 'newest') sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                   if (val === 'oldest') sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
                   setProjects(sorted);
                 }}
               >
                 <option value="newest">Mới nhất</option>
                 <option value="oldest">Cũ nhất</option>
                 <option value="name">Tên A-Z</option>
               </select>
            </div>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-4 custom-scrollbar w-full">
              <button 
                onClick={() => setSelectedCategory("all")}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex-shrink-0 border border-stone-100 ${
                  selectedCategory === "all" ? 'bg-stone-900 text-white shadow-lg border-stone-900' : 'bg-stone-50 text-stone-400 hover:bg-stone-100 hover:text-stone-900'
                }`}
              >
                Tất cả
              </button>
              {categories.map(cat => (
                <button 
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex-shrink-0 border border-stone-100 ${
                    selectedCategory === cat.id ? 'bg-stone-900 text-white shadow-lg border-stone-900' : 'bg-stone-50 text-stone-400 hover:bg-stone-100 hover:text-stone-900'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[16/9] bg-stone-100 rounded-[2.5rem] mb-6"></div>
                <div className="h-8 bg-stone-100 rounded-lg w-3/4 mb-4"></div>
                <div className="h-4 bg-stone-100 rounded-lg w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12 md:gap-y-20">
            {filteredProjects.map((p, idx) => (
              <Link key={p.id} href={`/projects/${p.slug}`} className="group block">
                <div className="relative aspect-[16/9] rounded-[2.5rem] overflow-hidden mb-8 shadow-2xl shadow-stone-200/50">
                  <img 
                    src={p.thumbnail || "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200"} 
                    alt={p.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-stone-900 shadow-xl scale-0 group-hover:scale-100 transition-transform duration-500">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </div>
                  </div>
                  <div className="absolute top-8 left-8">
                     <span className="bg-white/90 backdrop-blur-md text-stone-900 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                       Dự Án #{idx + 1}
                     </span>
                  </div>
                </div>
                
                <div className="flex justify-between items-start gap-6">
                  <div className="flex-1">
                    <h3 className="text-3xl font-black text-stone-900 mb-4 group-hover:text-red-500 transition-colors uppercase leading-[1.1] tracking-tight">{p.title}</h3>
                    <div className="flex gap-4">
                      {p.tags?.split(',').map((tag: string) => (
                        <span key={tag} className="text-xs font-black text-stone-400 uppercase tracking-widest">{tag.trim()}</span>
                      ))}
                    </div>
                  </div>
                  <div className="pt-2 text-stone-300 group-hover:text-red-500 transition-colors">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Floating Contact Component will be added later */}
      </div>
    </div>
  );
}
