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
    <div className="bg-white min-h-screen py-24 mt-10">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mb-20">
          <h1 className="text-sm font-black text-red-500 uppercase tracking-[0.2em] mb-4">Dự án tiêu biểu</h1>
          <h2 className="text-5xl font-black text-stone-900 mb-8 leading-tight uppercase tracking-tighter">
            Kiến Trúc <span className="text-stone-400">/</span> Nội Thất <br/>
            Đẳng Cấp <span className="text-stone-400">&</span> Tận Tâm
          </h2>
          <p className="text-xl text-stone-500 font-medium leading-relaxed">
            Chúng tôi tự hào mang đến những giải pháp thiết kế sáng tạo, tối ưu công năng và thẩm mỹ cho hàng trăm gia đình Việt.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-4 mb-16">
          <button 
            onClick={() => setSelectedCategory("all")}
            className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
              selectedCategory === "all" ? 'bg-stone-900 text-white shadow-xl translate-y-[-2px]' : 'bg-stone-50 text-stone-400 hover:bg-stone-100'
            }`}
          >
            Tất cả
          </button>
          {categories.map(cat => (
            <button 
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                selectedCategory === cat.id ? 'bg-stone-900 text-white shadow-xl translate-y-[-2px]' : 'bg-stone-50 text-stone-400 hover:bg-stone-100'
              }`}
            >
              {cat.name}
            </button>
          ))}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-20">
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
