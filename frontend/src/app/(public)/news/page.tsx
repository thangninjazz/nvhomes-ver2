"use client";

import { useEffect, useState } from "react";
import { api } from "@/services/api";
import Link from "next/link";
import { Calendar, User, ArrowRight, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  thumbnail: string | null;
  authorName: string;
  createdAt: string;
}

export default function NewsPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await api.get("/blogs");
        setBlogs(res.data);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách tin tức:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div className="bg-stone-50 min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-stone-900 mb-6 uppercase tracking-tighter">
            Tin Tức & <span className="text-red-500">Kiến Thức</span>
          </h1>
          <p className="text-stone-500 font-medium text-lg max-w-2xl mx-auto">
            Chia sẻ những kinh nghiệm hữu ích, xu hướng thiết kế và các dự án mới nhất từ đội ngũ kiến trúc sư NV Homes.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="w-12 h-12 text-red-500 animate-spin mb-4" />
            <p className="text-stone-400 font-bold uppercase tracking-widest text-xs">Đang tải tin tức...</p>
          </div>
        ) : blogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {blogs.map((blog) => (
              <article key={blog.id} className="bg-white rounded-3xl border border-stone-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 group flex flex-col">
                <Link href={`/news/${blog.slug}`} className="block aspect-[16/10] overflow-hidden relative">
                   <img 
                     src={blog.thumbnail || "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=600"} 
                     alt={blog.title} 
                     className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                   />
                   <div className="absolute top-4 left-4 bg-red-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                      Kiến thức
                   </div>
                </Link>
                
                <div className="p-8 flex-1 flex flex-col">
                   <div className="flex items-center gap-4 text-[11px] font-black text-stone-400 uppercase tracking-widest mb-4">
                      <div className="flex items-center gap-1.5">
                         <Calendar className="w-3.5 h-3.5 text-red-500" />
                         {format(new Date(blog.createdAt), "dd/MM/yyyy", { locale: vi })}
                      </div>
                      <div className="flex items-center gap-1.5">
                         <User className="w-3.5 h-3.5 text-red-500" />
                         {blog.authorName.split('@')[0]}
                      </div>
                   </div>
                   
                   <h2 className="text-xl font-bold text-stone-900 mb-4 group-hover:text-red-500 transition-colors leading-tight line-clamp-2">
                     <Link href={`/news/${blog.slug}`}>{blog.title}</Link>
                   </h2>
                   
                   <p className="text-stone-500 font-medium text-sm leading-relaxed mb-8 line-clamp-3">
                      {/* Xử lý tóm tắt từ content HTML nếu cần, ở đây giả sử blogResponse trả về content thô */}
                      {blog.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                   </p>
                   
                   <div className="mt-auto pt-6 border-t border-stone-50">
                      <Link href={`/news/${blog.slug}`} className="inline-flex items-center gap-2 text-stone-900 font-black text-xs uppercase tracking-widest hover:text-red-500 transition-colors">
                        Đọc tiếp <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                   </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="py-32 text-center bg-white rounded-[3rem] border border-stone-100">
             <p className="text-stone-400 font-bold text-xl uppercase tracking-widest">Hiện tại chưa có bài viết nào.</p>
             <Link href="/" className="inline-block mt-8 text-red-500 font-black uppercase tracking-widest text-sm underline decoration-2 underline-offset-8 transition-colors hover:text-stone-900">Quay về trang chủ</Link>
          </div>
        )}
      </div>
    </div>
  );
}
