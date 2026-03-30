"use client";

import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { Modal } from "@/components/common/Modal";

export default function MenuManager() {
  const [loading, setLoading] = useState(true);
  const [tree, setTree] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    parentId: "",
    isVisible: true,
    orderIndex: 0
  });

  const fetchTree = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/categories/tree?includeHidden=true&t=${Date.now()}`);
      setTree(res.data);
    } catch (err: any) {
      console.error("Lỗi fetch menu:", err);
      const msg = err.response?.data?.message || err.message || "Không thể tải danh sách danh mục.";
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
    setFormData({ name: "", slug: "", parentId: parentId || "", isVisible: true, orderIndex: 0 });
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditingItem(item);
    setFormData({ 
      name: item.name, 
      slug: item.slug, 
      parentId: item.parentId || "", 
      isVisible: item.isVisible, 
      orderIndex: item.orderIndex || 0 
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
        alert("Cập nhật danh mục thành công!");
      } else {
        await api.post('/categories', dataToSend);
        alert("Thêm danh mục mới thành công!");
      }
      setIsModalOpen(false);
      fetchTree();
    } catch (err: any) {
      console.error("Lỗi lưu danh mục:", err);
      const msg = err.response?.data?.message || err.response?.data || err.message || "Đã có lỗi xảy ra.";
      alert("Lỗi: " + (typeof msg === 'string' ? msg : JSON.stringify(msg)));
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa danh mục này? Hệ thống sẽ xóa vĩnh viễn khỏi database nếu danh mục này không còn mục con hoặc sản phẩm/dự án liên quan.")) {
      try {
        await api.delete(`/categories/${id}`);
        alert("Xóa danh mục thành công và đã làm sạch database!");
        fetchTree();
      } catch (err: any) {
        console.error("Lỗi xóa danh mục:", err);
        const data = err.response?.data;
        const msg = data?.message || data?.Message || (typeof data === 'string' ? data : null) || err.message || "Không thể xóa danh mục.";
        alert("Lỗi: " + msg);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-black text-stone-900 tracking-tight">Quản Lý Menu Động (Dynamic Tree)</h1>
        <button 
          onClick={() => openAddModal()}
          className="bg-stone-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-black shadow-[0_5px_15px_rgba(0,0,0,0.1)] transition-all"
        >
          + Thêm Danh Mục
        </button>
      </div>

      <div className="bg-stone-50 border border-stone-200 text-stone-600 p-6 rounded-2xl mb-10 flex gap-4 text-sm shadow-inner">
        <div className="w-10 h-10 bg-white rounded-full flex justify-center items-center shadow-sm shrink-0 font-bold border border-stone-100">ℹ</div>
        <p className="leading-relaxed">Tính năng thêm và sửa menu đã được kết nối với Backend. Mọi thay đổi sẽ được cập nhật trực tiếp lên database.</p>
      </div>

      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-4 overflow-hidden">
        {loading ? (
          <div className="animate-pulse space-y-4 p-4">
            <div className="h-12 bg-stone-100 rounded-xl"></div>
            <div className="h-12 bg-stone-100 rounded-xl ml-8"></div>
            <div className="h-12 bg-stone-100 rounded-xl"></div>
          </div>
        ) : tree.length === 0 ? (
          <div className="p-10 text-center text-stone-400 font-bold border-2 border-dashed border-stone-100 rounded-3xl">Chưa có danh mục nào.</div>
        ) : (
          <div className="space-y-4">
            {tree.map(node => (
              <div key={node.id} className="border border-stone-200 rounded-2xl overflow-hidden hover:border-stone-300 transition-colors bg-white">
                <div className="p-5 flex justify-between items-center bg-stone-50/50">
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-black text-stone-900 uppercase tracking-wider">{node.name}</span>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${node.isVisible ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
                      {node.isVisible ? 'Hiển thị' : 'Đang ẩn'}
                    </span>
                  </div>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => openAddModal(node.id)}
                      className="text-xs font-bold text-stone-400 hover:text-stone-900 transition-colors"
                    >
                      + Thêm Con
                    </button>
                    <button 
                      onClick={() => openEditModal(node)}
                      className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      Sửa
                    </button>
                    <button 
                      onClick={() => handleDelete(node.id)}
                      className="text-sm font-bold text-red-500 hover:text-red-700 transition-colors"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
                {node.children && node.children.length > 0 && (
                  <div className="p-4 bg-white border-t border-stone-100 space-y-4 pl-10 border-l-4 border-l-stone-50 ml-4">
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
        title={editingItem ? "Cập Nhật Danh Mục" : "Thêm Danh Mục Mới"}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-black text-stone-400 uppercase tracking-widest mb-3">Tên Danh Mục</label>
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
                placeholder="van-phong"
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
                <option value="false">Ẩn Danh Mục</option>
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
              <div className="w-2 h-2 rounded-full bg-stone-300 group-hover:bg-stone-900 transition-colors" />
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
            <div className="pl-8 border-l-2 border-stone-100/50 ml-5">
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

