"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/services/api";
import Link from "next/link";

export default function ProjectDetailPage() {
  const { slug } = useParams();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await api.get(`/projects/${slug}`);
        setProject(res.data);
      } catch (err) {
        console.error("Lỗi tải chi tiết dự án:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-500"></div>
    </div>
  );

  if (!project) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 text-center">
      <h1 className="text-3xl font-black text-stone-900 mb-4 uppercase">Không tìm thấy dự án</h1>
      <Link href="/projects" className="text-red-500 font-black uppercase tracking-widest text-sm underline decoration-2 underline-offset-8">Quay lại danh sách</Link>
    </div>
  );

  return (
    <div className="bg-white min-h-screen pt-24">
      {/* Header Section */}
      <div className="container mx-auto px-4 mb-20">
        <div className="flex flex-col lg:flex-row gap-12 items-end justify-between border-b border-stone-100 pb-16">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-black text-stone-900 mb-10 leading-[1.05] uppercase tracking-tighter">
              {project.title}
            </h1>
            <div className="flex flex-wrap gap-8 items-center">
               <div>
                  <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mb-2">Loại hình</p>
                  <p className="text-lg font-bold text-stone-900 uppercase tracking-widest">{project.tags?.split(',')[0] || "Dự án"}</p>
               </div>
               <div className="w-px h-10 bg-stone-200 hidden md:block"></div>
               <div>
                  <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mb-2">Hoàn thành</p>
                  <p className="text-lg font-bold text-stone-900 uppercase tracking-widest">
                    {new Date(project.createdAt).toLocaleDateString('vi-VN', { month: '2-digit', year: 'numeric' })}
                  </p>
               </div>
               <div className="w-px h-10 bg-stone-200 hidden md:block"></div>
               <div>
                  <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mb-2">Phong cách</p>
                  <p className="text-lg font-bold text-stone-900 uppercase tracking-widest">{project.tags?.split(',')[1] || "Hiện Đại"}</p>
               </div>
            </div>
          </div>
          <div className="lg:mb-2 italic text-stone-400 font-medium max-w-sm text-right">
             "{project.description}"
          </div>
        </div>
      </div>

      {/* Main Image / Hero */}
      <div className="relative h-[85vh] w-full mb-24 overflow-hidden">
        <img 
          src={project.thumbnail || (project.gallery?.[0]) || "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1600"} 
          alt={project.title} 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content & Video Section */}
      <div className="container mx-auto px-4 mb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          <div className="lg:col-span-12 prose prose-stone prose-xl max-w-none prose-headings:font-black prose-headings:uppercase prose-p:text-stone-600 prose-p:font-medium prose-p:leading-relaxed">
             <div dangerouslySetInnerHTML={{ __html: project.content || "" }} />
          </div>
        </div>

        {project.videoUrl && (
          <div className="mt-24 aspect-video rounded-[3rem] overflow-hidden shadow-2xl bg-stone-100">
             {project.videoUrl.includes('youtube.com') || project.videoUrl.includes('youtu.be') ? (
               <iframe 
                className="w-full h-full"
                src={project.videoUrl.replace('watch?v=', 'embed/').split('&')[0]} 
                title={project.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
             ) : (
               <video src={project.videoUrl} controls className="w-full h-full object-cover"></video>
             )}
          </div>
        )}
      </div>

      {/* Gallery Section */}
      {project.gallery && project.gallery.length > 0 && (
        <section className="bg-stone-50 py-32 mb-32">
          <div className="container mx-auto px-4">
            <h2 className="text-sm font-black text-red-500 uppercase tracking-[0.2em] mb-4 text-center">BỘ SƯU TẬP</h2>
            <h3 className="text-4xl font-black text-stone-900 mb-20 text-center uppercase tracking-tighter">Hình Ảnh Thực Tế Công Trình</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {project.gallery.map((img: string, i: number) => (
                 <div key={i} className={`rounded-3xl overflow-hidden shadow-lg ${i % 3 === 0 ? 'md:col-span-2 aspect-[21/9]' : 'aspect-square md:aspect-video'}`}>
                    <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                 </div>
               ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Products Section */}
      {project.relatedProducts && project.relatedProducts.length > 0 && (
        <div className="container mx-auto px-4 mb-32">
           <h3 className="text-2xl font-black text-stone-900 mb-10 uppercase tracking-widest flex items-center gap-4">
             <span className="w-10 h-1 bg-red-500"></span> Sản Phẩm Sử Dụng
           </h3>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {project.relatedProducts.map((p: any) => (
                <Link key={p.id} href={`/product/${p.slug}`} className="group block">
                  <div className="aspect-square bg-stone-50 rounded-3xl overflow-hidden mb-6 p-8 border border-stone-100 group-hover:shadow-xl transition-all">
                     <img 
                        src={p.images ? p.images.split(',')[0] : "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=400"} 
                        alt={p.name} 
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" 
                     />
                  </div>
                  <h4 className="font-bold text-stone-900 group-hover:text-red-500 transition-colors mb-2 text-sm">{p.name}</h4>
                  <p className="text-red-500 font-black tracking-widest uppercase text-xs">
                    {p.discountPrice ? p.discountPrice.toLocaleString('vi-VN') : p.originalPrice.toLocaleString('vi-VN')}₫
                  </p>
                </Link>
              ))}
           </div>
        </div>
      )}

      {/* CTA Section */}
      <div className="container mx-auto px-4 pb-32">
        <div className="bg-stone-900 rounded-[3rem] p-16 text-center text-white relative overflow-hidden">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-30"></div>
           <h3 className="text-4xl font-black mb-8 relative z-10 uppercase tracking-tighter">Bạn Thích Không Gian Này?</h3>
           <p className="text-stone-400 mb-12 relative z-10 font-medium max-w-xl mx-auto">Liên hệ ngay với NV Homes để nhận tư vấn và báo giá thi công nội thất cho căn hộ của bạn.</p>
           <Link href="/contact" className="relative z-10 inline-block bg-white text-stone-900 px-10 py-5 rounded-full font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-2xl">
              Nhận Tư Vấn Miễn Phí
           </Link>
        </div>
      </div>
    </div>
  );
}
