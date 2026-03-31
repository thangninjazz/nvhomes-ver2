"use client";

import { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { api } from "@/services/api";
import { Modal } from "@/components/common/Modal";
import { ImageUpload } from "@/components/common/ImageUpload";
import "react-quill-new/dist/quill.snow.css"; 
import { format } from "date-fns";
import { vi } from "date-fns/locale";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function BlogManager() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    thumbnail: ""
  });

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/blogs');
      setBlogs(res.data);
    } catch (err: any) {
      console.error("Lỗi fetch tin tức:", err);
      alert("Không thể tải danh sách bài viết.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({ title: "", slug: "", content: "", thumbnail: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      slug: item.slug,
      content: item.content || "",
      thumbnail: item.thumbnail || ""
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.slug) return alert("Vui lòng nhập tiêu đề và đường dẫn.");

    try {
      if (editingItem) {
        await api.put(`/blogs/${editingItem.id}`, formData);
        alert("Cập nhật thành công!");
      } else {
        await api.post('/blogs', formData);
        alert("Đăng bài thành công!");
      }
      setIsModalOpen(false);
      fetchBlogs();
    } catch (err: any) {
      console.error("Lỗi lưu bài viết:", err);
      alert("Đã xảy ra lỗi khi lưu.");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Bạn có chắc muốn xóa bài viết này?")) {
      try {
        await api.delete(`/blogs/${id}`);
        alert("Đã xóa bài viết.");
        fetchBlogs();
      } catch (err) {
        alert("Lỗi khi xóa.");
      }
    }
  };

  const quillModules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ],
  }), []);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-black text-stone-900 tracking-tight mb-2">Quản Lý Tin Tức & Blog</h1>
            <p className="text-stone-500 font-medium">Đăng bài viết chia sẻ kiến thức, xu hướng và tin tức công ty.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-stone-900 text-white px-7 py-3.5 rounded-xl font-bold uppercase text-sm hover:bg-black shadow-lg transition-all"
        >
          + Đăng bài mới
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
            <thead>
                <tr className="bg-stone-50 text-stone-400 font-black text-[10px] uppercase tracking-widest border-b border-stone-100">
                    <th className="p-6">Bài viết</th>
                    <th className="p-6">Tác giả</th>
                    <th className="p-6">Ngày đăng</th>
                    <th className="p-6 text-center">Thao tác</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
                {loading ? (
                    <tr><td colSpan={4} className="p-10 text-center font-medium text-stone-400">Đang tải...</td></tr>
                ) : blogs.length === 0 ? (
                    <tr><td colSpan={4} className="p-10 text-center font-medium text-stone-400">Chưa có bài viết nào.</td></tr>
                ) : blogs.map(b => (
                    <tr key={b.id} className="hover:bg-stone-50/50 transition-colors group">
                        <td className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-10 bg-stone-100 rounded-lg overflow-hidden border border-stone-200 shrink-0">
                                    {b.thumbnail && <img src={b.thumbnail} alt="" className="w-full h-full object-cover" />}
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold text-stone-800 line-clamp-1">{b.title}</span>
                                    <span className="text-[10px] text-stone-400 font-medium italic">/{b.slug}</span>
                                </div>
                            </div>
                        </td>
                        <td className="p-6 text-sm font-bold text-stone-600">{b.authorName.split('@')[0]}</td>
                        <td className="p-6 text-sm text-stone-400 font-medium">
                            {format(new Date(b.createdAt), "dd/MM/yyyy", { locale: vi })}
                        </td>
                        <td className="p-6">
                            <div className="flex justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => openEditModal(b)} className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">Sửa</button>
                                <button onClick={() => handleDelete(b.id)} className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all">Xóa</button>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingItem ? "Chỉnh sửa bài viết" : "Đăng bài viết mới"}
        maxWidth="max-w-5xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6 max-h-[75vh] overflow-y-auto px-1 pr-2 custom-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-black text-stone-400 uppercase tracking-widest mb-3">Tiêu đề bài viết</label>
                    <input 
                      type="text" required
                      className="w-full bg-stone-50 border border-stone-200 px-5 py-3 rounded-xl focus:ring-2 focus:ring-stone-900 font-bold"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-xs font-black text-stone-400 uppercase tracking-widest mb-3">Đường dẫn SEO (Slug)</label>
                    <input 
                      type="text" required
                      className="w-full bg-stone-50 border border-stone-200 px-5 py-3 rounded-xl focus:ring-2 focus:ring-stone-900 font-bold"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                    <ImageUpload 
                      label="Ảnh đại diện (Thumbnail)"
                      value={formData.thumbnail}
                      onChange={(url) => setFormData({ ...formData, thumbnail: url })}
                    />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-xs font-black text-stone-400 uppercase tracking-widest mb-3">Nội dung bài viết</label>
                    <div className="bg-stone-50 rounded-2xl overflow-hidden border border-stone-200">
                        <ReactQuill 
                          theme="snow"
                          value={formData.content}
                          onChange={(val) => setFormData({ ...formData, content: val })}
                          modules={quillModules}
                          className="min-h-[300px] bg-white"
                        />
                    </div>
                </div>
            </div>

            <div className="flex gap-4 pt-6 border-t border-stone-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-stone-100 text-stone-500 font-bold rounded-2xl hover:bg-stone-200 uppercase tracking-widest text-xs transition-all">Hủy</button>
                <button type="submit" className="flex-[2] py-4 bg-stone-900 text-white font-black rounded-2xl hover:bg-black uppercase tracking-widest text-xs shadow-xl transition-all">Lưu bài viết</button>
            </div>
        </form>
      </Modal>
    </div>
  );
}
