"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@/services/api";
import Link from "next/link";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<{ products: any[], projects: any[] }>({ products: [], projects: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;
      setLoading(true);
      try {
        const res = await api.get(`/search?q=${encodeURIComponent(query)}`);
        setResults(res.data);
      } catch (err) {
        console.error("Lỗi tìm kiếm:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [query]);

  if (!query) return <div className="container mx-auto px-4 py-20 text-center">Vui lòng nhập từ khóa tìm kiếm.</div>;

  return (
    <div className="container mx-auto px-4 py-20 mt-10">
      <h1 className="text-3xl font-black text-stone-900 mb-2">Kết quả tìm kiếm cho: "{query}"</h1>
      <p className="text-stone-500 mb-12 font-medium">Tìm thấy {results.products.length} sản phẩm và {results.projects.length} dự án.</p>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
        </div>
      ) : (
        <div className="space-y-20">
          {/* Projects Section */}
          {results.projects.length > 0 && (
            <div>
              <h2 className="text-xl font-black text-stone-900 mb-8 uppercase tracking-widest flex items-center gap-3">
                <span className="w-8 h-1 bg-red-500"></span> Dự Án Thiết Kế
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {results.projects.map((p: any) => (
                  <Link key={p.id} href={`/projects/${p.slug}`} className="group block">
                    <div className="aspect-[16/10] rounded-2xl overflow-hidden mb-4 relative shadow-lg">
                      <img 
                        src={p.thumbnail || "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=600"} 
                        alt={p.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                        <span className="text-white font-bold text-sm uppercase tracking-widest">Xem chi tiết ↗</span>
                      </div>
                    </div>
                    <h3 className="text-lg font-black text-stone-900 group-hover:text-red-500 transition-colors uppercase leading-tight mb-2">{p.title}</h3>
                    <div className="flex gap-2">
                       {p.tags?.split(',').map((tag: string) => (
                         <span key={tag} className="text-[10px] font-black text-stone-400 uppercase tracking-widest">{tag.trim()}</span>
                       ))}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Products Section */}
          {results.products.length > 0 && (
            <div>
              <h2 className="text-xl font-black text-stone-900 mb-8 uppercase tracking-widest flex items-center gap-3">
                <span className="w-8 h-1 bg-red-500"></span> Sản Phẩm Nội Thất
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {results.products.map((p: any) => (
                  <Link key={p.id} href={`/product/${p.slug}`} className="group">
                    <div className="aspect-square rounded-2xl bg-white border border-stone-100 overflow-hidden mb-4 relative p-4 group-hover:shadow-xl transition-shadow">
                      <img 
                        src={p.images ? p.images.split(',')[0] : "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=400"} 
                        alt={p.name} 
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <h3 className="text-sm font-bold text-stone-800 group-hover:text-red-500 transition-colors mb-2 truncate">{p.name}</h3>
                    <div className="flex items-center gap-3">
                      <span className="text-red-500 font-black text-base">{p.discountPrice ? p.discountPrice.toLocaleString('vi-VN') : p.originalPrice.toLocaleString('vi-VN')}₫</span>
                      {p.discountPrice && (
                        <span className="text-stone-300 line-through text-xs font-bold">{p.originalPrice.toLocaleString('vi-VN')}₫</span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {results.products.length === 0 && results.projects.length === 0 && (
            <div className="py-20 text-center">
               <p className="text-stone-400 font-bold text-xl">Rất tiếc, không tìm thấy kết quả phù hợp.</p>
               <Link href="/" className="inline-block mt-8 text-red-500 font-black uppercase tracking-widest text-sm underline decoration-2 underline-offset-8 transition-colors hover:text-stone-900">Quay về trang chủ</Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-20 text-center">Đang tải...</div>}>
      <SearchContent />
    </Suspense>
  );
}
