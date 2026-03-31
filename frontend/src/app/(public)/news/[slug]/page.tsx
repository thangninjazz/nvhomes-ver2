"use client";

import { useEffect, useState, use } from "react";
import { api } from "@/services/api";
import { ArrowLeft, Calendar, User, Clock, Share2, Facebook, Twitter, Link2 } from "lucide-react";
import Link from "next/link";
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

export default function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await api.get("/blogs");
        const found = res.data.find((b: BlogPost) => b.slug === slug);
        if (found) {
          setBlog(found);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Lỗi lấy bài viết:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-stone-50"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div></div>;
  if (error || !blog) return <div className="min-h-screen flex items-center justify-center bg-stone-50 text-stone-500">Không tìm thấy bài viết.</div>;

  return (
    <div className="bg-white min-h-screen pt-32 pb-24 font-sans">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Link 
          href="/news" 
          className="inline-flex items-center gap-2 text-stone-400 hover:text-red-500 font-black uppercase tracking-widest text-[10px] mb-12 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Quay lại tin tức
        </Link>

        {/* Article Header */}
        <div className="max-w-4xl mx-auto mb-16 text-center">
           <h1 className="text-4xl md:text-6xl font-black text-stone-900 mb-8 leading-tight tracking-tighter">
             {blog.title}
           </h1>
           
           <div className="flex flex-wrap items-center justify-center gap-6 text-[11px] font-black text-stone-400 uppercase tracking-widest border-y border-stone-100 py-6 mb-12">
              <div className="flex items-center gap-2">
                 <Calendar className="w-4 h-4 text-red-500" />
                 {format(new Date(blog.createdAt), "dd MMMM, yyyy", { locale: vi })}
              </div>
              <div className="flex items-center gap-2">
                 <User className="w-4 h-4 text-red-500" />
                 {blog.authorName.split('@')[0]}
              </div>
              <div className="flex items-center gap-2">
                 <Clock className="w-4 h-4 text-red-500" />
                 5 phút đọc
              </div>
           </div>

           {blog.thumbnail && (
             <div className="aspect-[21/9] rounded-[3rem] overflow-hidden shadow-2xl mb-16">
                <img src={blog.thumbnail} alt={blog.title} className="w-full h-full object-cover" />
             </div>
           )}
        </div>

        {/* Article Content */}
        <div className="max-w-3xl mx-auto relative">
           {/* Social Share (Desktop Sidebar) */}
           <div className="hidden lg:flex flex-col gap-4 absolute -left-20 top-0">
               <button className="p-3 bg-stone-50 rounded-full hover:bg-stone-900 hover:text-white transition-all"><Facebook className="w-4 h-4" /></button>
               <button className="p-3 bg-stone-50 rounded-full hover:bg-stone-900 hover:text-white transition-all"><Twitter className="w-4 h-4" /></button>
               <button className="p-3 bg-stone-50 rounded-full hover:bg-stone-900 hover:text-white transition-all"><Share2 className="w-4 h-4" /></button>
           </div>

           <div 
             className="prose prose-stone prose-lg max-w-none prose-headings:font-black prose-headings:text-stone-900 prose-p:text-stone-600 prose-p:leading-relaxed prose-p:font-medium prose-img:rounded-3xl prose-img:shadow-xl"
             dangerouslySetInnerHTML={{ __html: blog.content }}
           />

           {/* Tags / Footer */}
           <div className="mt-20 pt-10 border-t border-stone-100 flex flex-wrap items-center justify-between gap-6">
              <div className="flex gap-2">
                 <span className="bg-stone-50 px-4 py-1.5 rounded-full text-[10px] font-black text-stone-400 uppercase tracking-widest">Nội thất</span>
                 <span className="bg-stone-50 px-4 py-1.5 rounded-full text-[10px] font-black text-stone-400 uppercase tracking-widest">Xu hướng</span>
              </div>
              
              <div className="flex items-center gap-4 text-stone-400">
                 <span className="text-[10px] font-black uppercase tracking-widest">Chia sẻ nhanh:</span>
                 <div className="flex gap-4">
                    <Facebook className="w-4 h-4 hover:text-red-500 cursor-pointer" />
                    <Link2 className="w-4 h-4 hover:text-red-500 cursor-pointer" />
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
