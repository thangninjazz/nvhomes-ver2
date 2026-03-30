"use client";

import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { Modal } from "@/components/common/Modal";

export default function ProjectCategoryManager() {
  const [loading, setLoading] = useState(true);
  const [tree, setTree] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    parentId: "",
    isVisible: true,
    orderIndex: 0,
    type: "Project"
  });

  const fetchTree = async () => {
    try {
      setLoading(true);
      // Fetch specifically for Project type
      const res = await api.get(`/categories/tree?type=Project&includeHidden=true&t=${Date.now()}`);
      setTree(res.data);
    } catch (err: any) {
      console.error("Lỗi fetch hạng mục dự án:", err);
      const msg = err.response?.data?.message || err.message || "Không thể tải danh sách hạng mục.";
      alert("Lỗi: " + msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTree();
  }, []);

  const openAddModal = (parentId: string | null = null) => {
    setEditingItem(null);
    setFormData({ name: "", slug: "", parentId: parentId || "", isVisible: true, orderIndex: 0, type: "Project" });
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditingItem(item);
    setFormData({ 
      name: item.name, 
      slug: item.slug, 
      parentId: item.parentId || "", 
      isVisible: item.isVisible, 
      orderIndex: item.orderIndex || 0,
      type: "Project"
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...formData,
        parentId: formData.parentId === "" ? null : formData.parentId
      };

      if (editingItem) {
        await api.put(`/categories/${editingItem.id}`, dataToSend);
        alert("Cập nhật hạng mục thành công!");
      } else {
        await api.post('/categories', dataToSend);
        alert("Thêm hạng mục dự án mới thành công!");
      }
      setIsModalOpen(false);
      fetchTree();
    } catch (err: any) {
      console.error("Lỗi lưu hạng mục:", err);
      const msg = err.response?.data?.message || err.response?.data || err.message || "Đã có lỗi xảy ra.";
      alert("Lỗi: " + (typeof msg === 'string' ? msg : JSON.stringify(msg)));
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa hạng mục này?")) {
      try {
        await api.delete(`/categories/${id}`);
        alert("Xóa hạng mục thành công!");
        fetchTree();
      } catch (err: any) {
        console.error("Lỗi xóa hạng mục:", err);
        const msg = err.response?.data?.message || err.message || "Không thể xóa hạng mục.";
        alert("Lỗi: " + msg);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-10">
        <div>
            <h1 className="text-3xl font-black text-stone-900 tracking-tight mb-2">Quản Lý Hạng Mục Dự Án</h1>
            <p className="text-stone-500 font-medium text-sm italic">Ví dụ: Phòng khách, Phòng ngủ, Biệt thự, Chung cư...</p>
        </div>
        <button 
          onClick={() => openAddModal()}
          className="bg-red-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-700 shadow-lg transition-all"
        >
          + Thêm Hạng Mục Dự Án
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-4 overflow-hidden">
        {loading ? (
          <div className="animate-pulse space-y-4 p-4">
            <div className="h-12 bg-stone-100 rounded-xl"></div>
            <div className="h-12 bg-stone-100 rounded-xl ml-8"></div>
            <div className="h-12 bg-stone-100 rounded-xl"></div>
          </div>
        ) : tree.length === 0 ? (
          <div className="p-10 text-center text-stone-400 font-bold border-2 border-dashed border-stone-100 rounded-3xl">Chưa có hạng mục dự án nào.</div>
        ) : (
          <div className="space-y-4">
            {tree.map(node => (
              <div key={node.id} className="border border-stone-200 rounded-2xl overflow-hidden hover:border-stone-300 transition-colors bg-white">
                <div className="p-5 flex justify-between items-center bg-stone-50/50">
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-black text-stone-900 uppercase tracking-wider">{node.name}</span>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${node.isVisible ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {node.isVisible ? 'Hiển thị' : 'Đang ẩn'}
                    </span>
                  </div>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => openAddModal(node.id)}
                      className="text-xs font-bold text-stone-400 hover:text-stone-900"
                    >
                      + Thêm Con
                    </button>
                    <button 
                      onClick={() => openEditModal(node)}
                      className="text-sm font-bold text-blue-600"
                    >
                      Sửa
                    </button>
                    <button 
                      onClick={() => handleDelete(node.id)}
                      className="text-sm font-bold text-red-500"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
                {node.children && node.children.length > 0 && (
                  <div className="p-4 bg-white border-t border-stone-100 space-y-4 pl-10 border-l-4 border-l-red-50 ml-4">
                     <CategoryBranch 
                        children={node.children} 
                        openEdit={openEditModal} 
                        openAdd={openAddModal} 
                        onDelete={handleDelete} 
                     />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingItem ? "Cập Nhật Hạng Mục Dự Án" : "Thêm Hạng Mục Dự Án Mới"}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-black text-stone-400 uppercase tracking-widest mb-3">Tên Hạng Mục</label>
              <input 
                type="text" 
                required
                className="w-full bg-stone-50 border border-stone-200 px-5 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900 font-bold"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-black text-stone-400 uppercase tracking-widest mb-3">Đường Dẫn (Slug)</label>
              <input 
                type="text" 
                required
                placeholder="phong-ngu"
                className="w-full bg-stone-50 border border-stone-200 px-5 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900 font-bold"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-black text-stone-400 uppercase tracking-widest mb-3">Sắp Xếp (Order)</label>
              <input 
                type="number" 
                className="w-full bg-stone-50 border border-stone-200 px-5 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900 font-bold"
                value={formData.orderIndex}
                onChange={(e) => setFormData({ ...formData, orderIndex: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div>
              <label className="block text-xs font-black text-stone-400 uppercase tracking-widest mb-3">Trạng Thái</label>
              <select 
                className="w-full bg-stone-50 border border-stone-200 px-5 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900 font-bold"
                value={formData.isVisible ? "true" : "false"}
                onChange={(e) => setFormData({ ...formData, isVisible: e.target.value === "true" })}
              >
                <option value="true">Hiển Thị</option>
                <option value="false">Ẩn Hạng Mục</option>
              </select>
            </div>
          </div>

          <div className="pt-8 border-t border-stone-100 flex gap-4">
            <button 
              type="button" 
              onClick={() => setIsModalOpen(false)}
              className="flex-1 py-4 bg-stone-100 text-stone-500 font-bold rounded-2xl hover:bg-stone-200 transition-colors uppercase tracking-widest text-xs"
            >
              Hủy Bỏ
            </button>
            <button 
              type="submit" 
              className="flex-[2] py-4 bg-stone-900 text-white font-black rounded-2xl hover:bg-black transition-all shadow-xl uppercase tracking-widest text-xs"
            >
              Lưu Thay Đổi
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

function CategoryBranch({ children, openEdit, openAdd, onDelete }: any) {
  return (
    <div className="space-y-3">
      {children.map((child: any) => (
        <div key={child.id} className="space-y-3">
          <div className="flex justify-between items-center p-4 border border-stone-100 rounded-2xl bg-stone-50/30 hover:bg-stone-50 transition-all shadow-sm group">
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-red-300 group-hover:bg-red-600 transition-colors" />
              <div>
                <p className="font-bold text-stone-800">{child.name}</p>
                {!child.isVisible && <span className="text-[9px] font-black text-red-400 uppercase tracking-widest">Đang ẩn</span>}
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={() => openAdd(child.id)} className="text-[10px] font-black text-stone-400 hover:text-stone-900 uppercase">Thêm Con</button>
              <button onClick={() => openEdit(child)} className="text-[10px] font-black text-blue-500 hover:text-blue-700 uppercase">Sửa</button>
              <button onClick={() => onDelete(child.id)} className="text-[10px] font-black text-red-400 hover:text-red-600 uppercase">Xóa</button>
            </div>
          </div>
          {child.children && child.children.length > 0 && (
            <div className="pl-8 border-l-2 border-red-100/50 ml-5">
              <CategoryBranch 
                children={child.children} 
                openEdit={openEdit} 
                openAdd={openAdd} 
                onDelete={onDelete} 
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
