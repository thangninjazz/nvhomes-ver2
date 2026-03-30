"use client";

import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { Modal } from "@/components/common/Modal";
import { ImageUpload } from "@/components/common/ImageUpload";
import { MultiImageUpload } from "@/components/common/MultiImageUpload";

export default function ProjectManager() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    tags: "",
    videoUrl: "",
    description: "",
    content: "",
    thumbnail: "",
    gallery: [] as string[],
    categoryId: ""
  });

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await api.get('/projects');
      setProjects(Array.isArray(res.data) ? res.data : (res.data.value || []));
    } catch (err: any) {
      console.error("Lỗi fetch dự án:", err);
      const msg = err.response?.data?.message || err.message || "Không thể tải danh sách dự án.";
      alert("Lỗi: " + msg);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get(`/categories?type=Project&t=${Date.now()}`);
      setCategories(res.data || []);
    } catch (err) {
      console.error("Lỗi fetch categories:", err);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchCategories();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({ 
      title: "", slug: "", tags: "", videoUrl: "", description: "", content: "", 
      thumbnail: "", gallery: [], categoryId: "" 
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      slug: item.slug,
      tags: item.tags || "",
      videoUrl: item.videoUrl || "",
      description: item.description || "",
      content: item.content || "",
      thumbnail: item.thumbnail || "",
      gallery: item.gallery || [],
      categoryId: item.categoryId || ""
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.put(`/projects/${editingItem.id}`, formData);
        alert("Cập nhật dự án thành công!");
      } else {
        await api.post('/projects', formData);
        alert("Đăng dự án mới thành công!");
      }
      setIsModalOpen(false);
      fetchProjects();
    } catch (err: any) {
      console.error("Lỗi lưu dự án:", err);
      const msg = err.response?.data?.message || err.response?.data || err.message || "Đã có lỗi xảy ra.";
      alert("Lỗi: " + (typeof msg === 'string' ? msg : JSON.stringify(msg)));
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Xác nhận xóa dự án này khỏi Portfolio?")) {
      try {
        await api.delete(`/projects/${id}`);
        alert("Xóa dự án thành công!");
        fetchProjects();
      } catch (err: any) {
        console.error("Lỗi xóa dự án:", err);
        const msg = err.response?.data?.message || err.message || "Không thể xóa dự án.";
        alert("Lỗi: " + msg);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-10">
        <div>
            <h1 className="text-3xl font-black text-stone-900 tracking-tight mb-2">Quản Lý Portfolio & Dự Án Thiết Kế</h1>
            <p className="text-stone-500 font-medium">Biên tập nội dung bài viết Portfolio và tích hợp video thi công thực tế.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-stone-900 text-white px-7 py-3.5 rounded-xl font-bold tracking-wide uppercase text-sm hover:bg-black shadow-[0_5px_15px_rgba(0,0,0,0.15)] transition-all flex items-center gap-2"
        >
          <span>+ Đăng Dự Án Mới</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {loading ? (
             <div className="col-span-full text-center py-20 text-stone-400 font-bold border-2 border-dashed border-stone-200 rounded-3xl">Đang tải Portfolio...</div>
        ) : projects.length === 0 ? (
             <div className="col-span-full text-center py-20 text-stone-400 font-bold border-2 border-dashed border-stone-100 rounded-3xl">Chưa có dự án nào trong Portfolio.</div>
        ) : projects.map(p => (
            <div key={p.id} className="bg-white border border-stone-200 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col">
                <div className="aspect-video bg-stone-100 flex items-center justify-center relative overflow-hidden">
                    {p.images ? (
                      <img src={p.images} alt={p.title} className="absolute inset-0 w-full h-full object-cover" />
                    ) : (
                      <div className="absolute inset-0 pattern-dots pattern-stone-200 pattern-size-4" />
                    )}
                    {p.videoUrl && (
                        <div className="absolute top-4 left-4 z-20 bg-red-600 text-white text-[9px] font-black px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg tracking-widest uppercase">
                            ▶ VIDEO
                        </div>
                    )}
                </div>
                <div className="p-8 flex-1 flex flex-col">
                    <div className="flex gap-2 mb-4">
                        {p.categoryName && (
                          <span className="text-[10px] font-black text-white bg-red-600 px-3 py-1 rounded-md uppercase tracking-widest">{p.categoryName}</span>
                        )}
                        <span className="text-[10px] font-black text-stone-400 border border-stone-200 px-3 py-1 rounded-md uppercase tracking-widest bg-stone-50">{p.tags}</span>
                    </div>
                    <h3 className="text-xl font-black text-stone-900 mb-6 line-clamp-2 leading-snug">{p.title}</h3>
                    
                    <div className="flex justify-between items-center pt-6 border-t border-stone-100 mt-auto">
                        <span className="text-[10px] font-bold text-stone-400">Tạo: {new Date(p.createdAt).toLocaleDateString('vi-VN')}</span>
                        <div className="flex gap-2">
                            <button 
                              onClick={() => openEditModal(p)}
                              className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-wider hover:bg-blue-600 hover:text-white transition-colors"
                            >
                              Sửa
                            </button>
                            <button 
                              onClick={() => handleDelete(p.id)}
                              className="px-4 py-1.5 bg-red-50 text-red-600 rounded-lg text-[10px] font-black uppercase tracking-wider hover:bg-red-600 hover:text-white transition-colors"
                            >
                              Xóa
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        ))}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingItem ? "Sửa Bài Viết Dự Án" : "Đăng Dự Án Mới"}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-xs font-black text-stone-400 uppercase tracking-widest mb-3">Tiêu Đề Dự Án</label>
              <input 
                type="text" 
                required
                className="w-full bg-stone-50 border border-stone-200 px-5 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900 font-bold"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-black text-stone-400 uppercase tracking-widest mb-3">Slug (Đường dẫn)</label>
              <input 
                type="text" 
                required
                className="w-full bg-stone-50 border border-stone-200 px-5 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900 font-bold"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-black text-stone-400 uppercase tracking-widest mb-3">Thẻ (Tags)</label>
              <input 
                type="text" 
                placeholder="Vd: Biệt thự, Hiện đại, Gỗ óc chó"
                className="w-full bg-stone-50 border border-stone-200 px-5 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900 font-bold"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ImageUpload 
              label="Hình Ảnh Đại Diện (Thumbnail)"
              value={formData.thumbnail}
              onChange={(url) => setFormData({ ...formData, thumbnail: url })}
            />
            <div>
              <label className="block text-xs font-black text-stone-400 uppercase tracking-widest mb-3">Hạng mục Dự Án</label>
              <select 
                className="w-full bg-stone-50 border border-stone-200 px-5 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900 font-bold appearance-none cursor-pointer"
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              >
                <option value="">-- Chọn Hạng Mục --</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          <MultiImageUpload 
            label="Bộ Sưu Tập Ảnh Chi Tiết (Gallery)"
            value={formData.gallery}
            onChange={(urls) => setFormData({ ...formData, gallery: urls })}
          />

          <div>
            <label className="block text-xs font-black text-stone-400 uppercase tracking-widest mb-3">Link Video (YouTube/mp4 URL)</label>
            <input 
              type="text" 
              className="w-full bg-stone-50 border border-stone-200 px-5 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900 font-bold"
              value={formData.videoUrl}
              onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-black text-stone-400 uppercase tracking-widest mb-3">Mô Tả Ngắn</label>
            <textarea 
              className="w-full bg-stone-50 border border-stone-200 px-5 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900 font-medium min-h-[80px]"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-black text-stone-400 uppercase tracking-widest mb-3">Nội Dung Chi Tiết (HTML/Markdown)</label>
            <textarea 
              className="w-full bg-stone-50 border border-stone-200 px-5 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900 font-mono text-sm min-h-[160px]"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            />
          </div>

          <div className="pt-8 border-t border-stone-100 flex gap-4">
            <button 
              type="button" 
              onClick={() => setIsModalOpen(false)}
              className="flex-1 py-4 bg-stone-100 text-stone-500 font-bold rounded-2xl hover:bg-stone-200 uppercase tracking-widest text-[11px]"
            >
              Hủy
            </button>
            <button 
              type="submit" 
              className="flex-[2] py-4 bg-stone-900 text-white font-black rounded-2xl hover:bg-black uppercase tracking-widest text-[11px] shadow-xl"
            >
              Lưu Bài Viết
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

