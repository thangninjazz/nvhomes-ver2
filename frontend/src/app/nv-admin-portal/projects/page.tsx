"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import dynamic from "next/dynamic";
import { api } from "@/services/api";
import { ImageUpload } from "@/components/common/ImageUpload";
import { MultiImageUpload } from "@/components/common/MultiImageUpload";
import "react-quill-new/dist/quill.snow.css"; 

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function ProjectManager() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditingView, setIsEditingView] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const quillRef = useRef<any>(null);

  const [formData, setFormData] = useState({
    title: "", slug: "", tags: "", videoUrl: "", description: "", content: "", 
    thumbnail: "", gallery: [] as string[], categoryId: "",
    completionDate: ""
  });

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await api.get('/projects');
      setProjects(Array.isArray(res.data) ? res.data : (res.data.value || []));
    } catch (err: any) {
      alert("Lỗi: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get(`/categories?type=Project&t=${Date.now()}`);
      setCategories(res.data || []);
    } catch (err) {}
  };

  useEffect(() => {
    fetchProjects();
    fetchCategories();
  }, []);

  const openAddView = () => {
    setEditingItem(null);
    setFormData({ 
      title: "", slug: "", tags: "", videoUrl: "", description: "", content: "", 
      thumbnail: "", gallery: [], categoryId: "",
      completionDate: ""
    });
    setIsEditingView(true);
  };

  const openEditView = (item: any) => {
    setEditingItem(item);
    setFormData({
      title: item.title, slug: item.slug, tags: item.tags || "",
      videoUrl: item.videoUrl || "", description: item.description || "",
      content: item.content || "", thumbnail: item.thumbnail || "",
      gallery: item.gallery || [], categoryId: item.categoryId || "",
      completionDate: item.completionDate ? item.completionDate.split('T')[0] : ""
    });
    setIsEditingView(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Chuẩn hóa data
      const payload = {
         ...formData,
         completionDate: formData.completionDate ? new Date(formData.completionDate).toISOString() : null
      };

      if (editingItem) {
        await api.put(`/projects/${editingItem.id}`, payload);
        alert("Cập nhật dự án thành công!");
      } else {
        await api.post('/projects', payload);
        alert("Đăng dự án mới thành công!");
      }
      setIsEditingView(false);
      fetchProjects();
    } catch (err: any) {
      alert("Lỗi: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Xác nhận xóa dự án này khỏi Portfolio?")) {
      try {
        await api.delete(`/projects/${id}`);
        fetchProjects();
      } catch (err: any) {
        alert("Lỗi: " + (err.response?.data?.message || err.message));
      }
    }
  };

  const imageHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file"); input.setAttribute("accept", "image/*"); input.click();
    input.onchange = async () => {
      const file = input.files?.[0];
      if (file) {
        const fd = new FormData(); fd.append("file", file);
        try {
          const res = await api.post("/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
          let quill = quillRef.current?.getEditor ? quillRef.current.getEditor() : null;
          if (!quill) {
            const container = document.querySelector('.ql-container');
            if (container) quill = (window as any).Quill ? (window as any).Quill.find(container) : null;
          }
          if (quill) {
            const range = quill.getSelection(true);
            quill.insertEmbed(range.index, "image", res.data.url);
            quill.setSelection(range.index + 1);
          }
        } catch (err) { alert("Lỗi tải ảnh"); }
      }
    };
  };

  const quillModules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['link', 'image'], ['clean']
      ],
      handlers: { image: imageHandler }
    },
  }), []);

  return (
    <div className="max-w-7xl mx-auto pb-24">
      {!isEditingView ? (
        <>
          <div className="flex justify-between items-center mb-10">
            <div>
                <h1 className="text-3xl font-black text-stone-900 tracking-tight mb-2">Quản Lý Kiến Trúc / Portfolio</h1>
                <p className="text-stone-500 font-medium">Bố cục trang nhã như tạp chí kiến trúc.</p>
            </div>
            <button 
              onClick={openAddView}
              className="bg-stone-900 text-white px-7 py-3.5 rounded-xl font-bold tracking-wide uppercase text-sm hover:bg-black shadow-[0_5px_15px_rgba(0,0,0,0.15)] transition-all flex items-center gap-2"
            >
              <span>+ Đăng Dự Án Mới</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {loading ? (
                 <div className="col-span-full text-center py-20 text-stone-400 font-bold border-2 border-dashed border-stone-200 rounded-3xl">Đang tải Portfolio...</div>
            ) : projects.length === 0 ? (
                 <div className="col-span-full text-center py-20 text-stone-400 font-bold border-2 border-dashed border-stone-100 rounded-3xl">Chưa có dự án nào.</div>
            ) : projects.map(p => (
                <div key={p.id} className="bg-white border border-stone-200 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col">
                    <div className="aspect-video bg-stone-100 relative overflow-hidden">
                        {p.thumbnail ? (
                          <img src={p.thumbnail} alt={p.title} className="absolute inset-0 w-full h-full object-cover" />
                        ) : (
                          <div className="absolute inset-0 pattern-dots pattern-stone-200 pattern-size-4" />
                        )}
                        {p.videoUrl && (
                            <div className="absolute top-4 left-4 z-20 bg-red-600 text-white text-[9px] font-black px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg tracking-widest uppercase">▶ VIDEO</div>
                        )}
                    </div>
                    <div className="p-8 flex-1 flex flex-col">
                        <div className="flex gap-2 mb-4">
                            {p.categoryName && <span className="text-[10px] font-black text-white bg-red-600 px-3 py-1 rounded-md uppercase tracking-widest">{p.categoryName}</span>}
                            <span className="text-[10px] font-black text-stone-400 border border-stone-200 px-3 py-1 rounded-md uppercase tracking-widest bg-stone-50 line-clamp-1">{p.tags}</span>
                        </div>
                        <h3 className="text-xl font-black text-stone-900 mb-6 line-clamp-2 leading-snug">{p.title}</h3>
                        
                        <div className="flex justify-between items-center pt-6 border-t border-stone-100 mt-auto">
                            <span className="text-[10px] font-bold text-stone-400">Hoàn thành: {p.completionDate ? new Date(p.completionDate).toLocaleDateString('vi-VN') : 'Mới nhất'}</span>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => openEditView(p)} className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase hover:bg-blue-600 hover:text-white transition-colors">Sửa</button>
                                <button onClick={() => handleDelete(p.id)} className="px-4 py-1.5 bg-red-50 text-red-600 rounded-lg text-[10px] font-black uppercase hover:bg-red-600 hover:text-white transition-colors">Xóa</button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
          </div>
        </>
      ) : (
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex justify-between items-center bg-white/95 backdrop-blur-md p-4 rounded-3xl border border-stone-200 shadow-sm sticky top-4 z-40 mb-8">
             <div className="flex items-center gap-4">
                <button type="button" onClick={() => setIsEditingView(false)} className="text-stone-400 hover:text-stone-900 font-black p-2 bg-stone-50 rounded-xl">← Quay lại</button>
                <h1 className="text-xl font-black text-stone-900">{editingItem ? "Sửa Bài Viết Tạp Chí" : "Tạo Ấn Phẩm Dự Án"}</h1>
             </div>
             <button type="submit" className="px-10 py-3 bg-stone-900 text-white font-black rounded-xl hover:bg-black uppercase tracking-widest text-xs shadow-lg">Lưu Ký & Hiển Thị</button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             <div className="lg:col-span-2 space-y-8">
                {/* 1. THÔNG TIN BÀI VIẾT */}
                <div className="bg-white p-8 rounded-[2rem] border border-stone-200 shadow-sm">
                   <h2 className="text-sm font-black text-stone-900 uppercase tracking-widest mb-6 border-b border-stone-100 pb-4">1. Chi Tiết Ấn Phẩm</h2>
                   <div className="space-y-6">
                      <div>
                        <label className="block text-[11px] font-black text-stone-400 uppercase tracking-widest mb-3">Tên Dự Án (Tiêu Đề) *</label>
                        <input type="text" required className="w-full bg-stone-50 border border-stone-200 px-5 py-3.5 rounded-xl font-bold focus:ring-2 focus:ring-stone-900 text-xl" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-black text-stone-400 uppercase tracking-widest mb-3">Slug (Đường Dẫn SEO)</label>
                          <input type="text" required className="w-full bg-stone-50 border border-stone-200 px-5 py-3.5 rounded-xl font-bold text-stone-500" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} />
                        </div>
                        <div>
                          <label className="block text-[11px] font-black text-stone-400 uppercase tracking-widest mb-3">Nhãn Tag (Keywords)</label>
                          <input type="text" placeholder="Phân cách bằng dấu phẩy" className="w-full bg-stone-50 border border-stone-200 px-5 py-3.5 rounded-xl font-bold" value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[11px] font-black text-stone-400 uppercase tracking-widest mb-3">Đoạn Mô Tả Ngắn (Catchphrase)</label>
                        <textarea className="w-full bg-stone-50 border border-stone-200 px-5 py-4 rounded-xl font-medium focus:ring-2 focus:ring-stone-900 min-h-[100px]" placeholder="Câu chuyện truyền cảm hứng..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                      </div>
                   </div>
                </div>

                {/* 2. MEDIA COVER */}
                <div className="bg-white p-8 rounded-[2rem] border border-stone-200 shadow-sm">
                   <h2 className="text-sm font-black text-stone-900 uppercase tracking-widest mb-6 border-b border-stone-100 pb-4">2. Visual & Media</h2>
                   <div className="space-y-6">
                      <ImageUpload label="Ảnh Bìa Chính (Hero Cover)" value={formData.thumbnail} onChange={(url) => setFormData({ ...formData, thumbnail: url })} />
                      <MultiImageUpload label="Bộ Ảnh Thực Tế Công Trình (Gallery Mode)" value={formData.gallery} onChange={(urls) => setFormData({ ...formData, gallery: urls })} />
                      <div>
                        <label className="block text-[11px] font-black text-stone-400 uppercase tracking-widest mb-3">Link Video Trải Nghiệm (YouTube/MP4)</label>
                        <input type="url" className="w-full bg-stone-50 border border-stone-200 px-5 py-3.5 rounded-xl text-blue-600 font-bold" placeholder="https://" value={formData.videoUrl} onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })} />
                      </div>
                   </div>
                </div>

                {/* 3. BÀI VIẾT NỘI DUNG (RICH TEXT) */}
                <div className="bg-white p-8 rounded-[2rem] border border-stone-200 shadow-sm">
                   <h2 className="text-sm font-black text-stone-900 uppercase tracking-widest mb-6 border-b border-stone-100 pb-4">3. Bài Viết Chuyên Sâu</h2>
                   <div className="rich-text-container bg-stone-50 rounded-2xl overflow-hidden border border-stone-200">
                     <ReactQuill theme="snow" value={formData.content} onChange={(val) => setFormData({ ...formData, content: val })} modules={quillModules} className="min-h-[500px] bg-white" />
                   </div>
                </div>
             </div>

             <div className="space-y-8">
                {/* SETTING BỔ SUNG */}
                <div className="bg-white p-6 rounded-[2rem] border border-stone-200 shadow-sm">
                   <h2 className="text-xs font-black text-stone-900 uppercase tracking-widest mb-6 border-b border-stone-100 pb-4">Phân Loại Tổ Chức</h2>
                   <div className="space-y-6">
                     <div>
                       <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2">Chuyên Mục</label>
                       <select className="w-full bg-stone-50 border border-stone-200 px-4 py-3 rounded-lg font-bold" value={formData.categoryId} onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}>
                         <option value="">Chọn Nhóm...</option>
                         {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                       </select>
                     </div>
                     <div>
                       <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2">Ngày Hoàn Thành Thực Tế</label>
                       <input type="date" className="w-full bg-stone-50 border border-stone-200 px-4 py-3 rounded-lg font-bold text-stone-900" value={formData.completionDate} onChange={(e) => setFormData({ ...formData, completionDate: e.target.value })} />
                     </div>
                   </div>
                </div>
             </div>
          </div>
        </form>
      )}
    </div>
  );
}
