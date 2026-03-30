"use client";

import { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { api } from "@/services/api";
import { Modal } from "@/components/common/Modal";
import { MultiImageUpload } from "@/components/common/MultiImageUpload";
import "react-quill-new/dist/quill.snow.css"; 

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function ProductManager() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    categoryId: "",
    originalPrice: 0,
    discountPrice: 0,
    description: "",
    images: [] as string[],
    specifications: [] as { key: string; value: string }[],
    features: [] as string[]
  });

  const [categoryTree, setCategoryTree] = useState<any[]>([]);
  const [selectedParentId, setSelectedParentId] = useState<string>("");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/products');
      setProducts(res.data);
    } catch (err: any) {
      console.error("Lỗi fetch sản phẩm:", err);
      const msg = err.response?.data?.message || err.message || "Không thể tải danh sách sản phẩm.";
      alert("Lỗi: " + msg);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories/tree?type=Product');
      setCategoryTree(res.data || []);
      
      // Khởi tạo flattened categories cho việc hiển thị tên trong bảng
      const flattened: any[] = [];
      const flatten = (items: any[]) => {
        items.forEach(cat => {
          flattened.push(cat);
          if (cat.children && cat.children.length > 0) {
            flatten(cat.children);
          }
        });
      };
      flatten(res.data);
      setCategories(flattened);
    } catch (err) {
      console.error("Lỗi fetch danh mục:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({ 
      name: "", slug: "", categoryId: "", originalPrice: 0, discountPrice: 0, 
      description: "", images: [], specifications: [], features: [] 
    });
    setSelectedParentId("");
    setIsModalOpen(true);
    setIsPreviewMode(false);
  };

  const openEditModal = (item: any) => {
    setEditingItem(item);
    
    // Tìm ParentId của category hiện tại
    const currentCat = categories.find(c => c.id === item.categoryId);
    setSelectedParentId(currentCat?.parentId || "");

    setFormData({
      name: item.name,
      slug: item.slug,
      categoryId: item.categoryId || "",
      originalPrice: item.originalPrice || 0,
      discountPrice: item.discountPrice || 0,
      description: item.description || "",
      images: item.images ? item.images.split(',') : [],
      specifications: item.specifications || [],
      features: item.features || []
    });
    setIsModalOpen(true);
    setIsPreviewMode(false);
  };

  const addSpecification = () => {
    setFormData({
      ...formData,
      specifications: [...formData.specifications, { key: "", value: "" }]
    });
  };

  const removeSpecification = (index: number) => {
    const newSpecs = [...formData.specifications];
    newSpecs.splice(index, 1);
    setFormData({ ...formData, specifications: newSpecs });
  };

  const updateSpecification = (index: number, field: 'key' | 'value', value: string) => {
    setFormData(prev => {
      const newSpecs = [...prev.specifications];
      newSpecs[index] = { ...newSpecs[index], [field]: value };
      return { ...prev, specifications: newSpecs };
    });
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, ""]
    }));
  };

  const removeFeature = (index: number) => {
    setFormData(prev => {
      const newFeatures = [...prev.features];
      newFeatures.splice(index, 1);
      return { ...prev, features: newFeatures };
    });
  };

  const updateFeature = (index: number, value: string) => {
    setFormData(prev => {
      const newFeatures = [...prev.features];
      newFeatures[index] = value;
      return { ...prev, features: newFeatures };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.categoryId) {
      alert("Vui lòng chọn danh mục con.");
      return;
    }

    if (!formData.name || !formData.slug) {
      alert("Vui lòng điền đầy đủ tên và đường dẫn SEO.");
      return;
    }

    try {
      const dataToSend = {
        ...formData,
        images: formData.images.join(',')
      };

      if (editingItem) {
        await api.put(`/products/${editingItem.id}`, dataToSend);
        alert("Cập nhật sản phẩm thành công!");
      } else {
        await api.post('/products', dataToSend);
        alert("Thêm sản phẩm mới thành công!");
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (err: any) {
      console.error("Lỗi lưu sản phẩm:", err);
      const msg = err.response?.data?.message || err.response?.data || err.message || "Đã có lỗi xảy ra.";
      alert("Lỗi: " + (typeof msg === 'string' ? msg : JSON.stringify(msg)));
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      try {
        await api.delete(`/products/${id}`);
        alert("Xóa sản phẩm thành công!");
        fetchProducts();
      } catch (err: any) {
        console.error("Lỗi xóa sản phẩm:", err);
        const msg = err.response?.data?.message || err.message || "Không thể xóa sản phẩm.";
        alert("Lỗi: " + msg);
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
            <h1 className="text-3xl font-black text-stone-900 tracking-tight mb-2">Quản Lý Sản Phẩm (E-Commerce)</h1>
            <p className="text-stone-500 font-medium">Hỗ trợ thông số kỹ thuật động, trình soạn thảo Rich Text và SEO tối ưu.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-stone-900 text-white px-7 py-3.5 rounded-xl font-bold tracking-wide uppercase text-sm hover:bg-black shadow-[0_5px_15px_rgba(0,0,0,0.15)] transition-all flex items-center gap-2"
        >
          <span>+ Thêm Sản Phẩm</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden mb-12">
        <div className="p-6 border-b border-stone-100 flex gap-4 bg-stone-50/30">
            <input type="text" placeholder="Tìm kiếm tên sản phẩm..." className="flex-1 border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-stone-900 transition-all font-medium text-stone-700 bg-white" />
        </div>
        
        <table className="w-full text-left border-collapse">
            <thead>
                <tr className="bg-stone-50 text-stone-400 font-black text-[10px] uppercase tracking-widest border-b border-stone-100">
                    <th className="p-6">Tên Sản Phẩm / Hình ảnh</th>
                    <th className="p-6">Phân Loại (Category)</th>
                    <th className="p-6 text-right">Giá Bán Cấu Hình</th>
                    <th className="p-6 text-center w-40">Thao Tác</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
                {loading ? (
                    <tr>
                        <td colSpan={4} className="p-10 text-center text-stone-400 font-medium">Đang tải danh sách...</td>
                    </tr>
                ) : products.length === 0 ? (
                    <tr>
                        <td colSpan={4} className="p-10 text-center text-stone-400 font-medium">Không có sản phẩm nào.</td>
                    </tr>
                ) : products.map(p => (
                    <tr key={p.id} className="hover:bg-stone-50/50 transition-colors group">
                        <td className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-stone-100 rounded-xl shrink-0 border border-stone-200 overflow-hidden">
                                  {p.images && <img src={p.images.split(',')[0]} alt={p.name} className="w-full h-full object-cover" />}
                                </div>
                                <span className="font-bold text-stone-800 line-clamp-2">{p.name}</span>
                            </div>
                        </td>
                        <td className="p-6">
                            <span className="bg-stone-100 border border-stone-200 text-stone-600 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider">
                              {p.categoryName || categories.find(c => c.id === p.categoryId)?.name || 'Chưa phân loại'}
                            </span>
                        </td>
                        <td className="p-6">
                            <div className="flex flex-col items-end">
                                <span className="font-black text-red-600 text-lg tracking-tight">{p.discountPrice ? p.discountPrice.toLocaleString('vi-VN') : p.originalPrice.toLocaleString('vi-VN')} đ</span>
                                {p.discountPrice > 0 && p.discountPrice < p.originalPrice && (
                                    <span className="text-[10px] text-stone-400 font-bold line-through">{p.originalPrice.toLocaleString('vi-VN')} đ</span>
                                )}
                            </div>
                        </td>
                        <td className="p-6">
                           <div className="flex justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => openEditModal(p)}
                              className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                            >
                              Sửa
                            </button>
                            <button 
                              onClick={() => handleDelete(p.id)}
                              className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-sm"
                            >
                              Xóa
                            </button>
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
        title={editingItem ? "Sửa Sản Phẩm" : "Thêm Sản Phẩm Mới"}
        maxWidth="max-w-4xl"
      >
        <div className="flex gap-4 mb-6 border-b border-stone-100 pb-4">
          <button 
            onClick={() => setIsPreviewMode(false)}
            className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${!isPreviewMode ? 'bg-stone-900 text-white shadow-md' : 'bg-stone-100 text-stone-400 hover:bg-stone-200'}`}
          >
            Chỉnh sửa
          </button>
          <button 
            onClick={() => setIsPreviewMode(true)}
            className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${isPreviewMode ? 'bg-stone-900 text-white shadow-md' : 'bg-stone-100 text-stone-400 hover:bg-stone-200'}`}
          >
            Xem trước
          </button>
        </div>

        {isPreviewMode ? (
          <div className="space-y-8 bg-stone-50 p-8 rounded-2xl max-h-[70vh] overflow-y-auto border border-stone-200">
            <div className="flex gap-6">
              <div className="w-1/3 aspect-square bg-white rounded-2xl shadow-sm overflow-hidden border border-stone-100">
                {formData.images.length > 0 ? (
                  <img src={formData.images[0]} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone-300 font-bold uppercase text-[10px]">No Image</div>
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-black text-stone-900 mb-2">{formData.name || "Tên sản phẩm"}</h2>
                <div className="text-red-600 font-black text-xl mb-4">
                  {formData.discountPrice ? formData.discountPrice.toLocaleString('vi-VN') : formData.originalPrice.toLocaleString('vi-VN')} đ
                </div>
                
                {formData.features.length > 0 && (
                  <ul className="space-y-2 mb-6">
                    {formData.features.filter(f => f.trim()).map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-stone-600 text-sm font-medium">
                        <div className="w-1.5 h-1.5 bg-stone-900 rounded-full" />
                        {f}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {formData.specifications.length > 0 && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
                <h3 className="text-xs font-black text-stone-400 uppercase tracking-widest mb-4">Thông số kỹ thuật</h3>
                <div className="grid grid-cols-2 gap-4">
                  {formData.specifications.filter(s => s.key.trim()).map((s, i) => (
                    <div key={i} className="flex justify-between border-b border-stone-50 pb-2">
                      <span className="text-stone-400 text-xs font-bold">{s.key}</span>
                      <span className="text-stone-900 text-xs font-black">{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="prose prose-stone prose-sm max-w-none bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
               <h3 className="text-xs font-black text-stone-400 uppercase tracking-widest mb-4">Mô tả chi tiết</h3>
               <div dangerouslySetInnerHTML={{ __html: formData.description || "Chưa có mô tả." }} />
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto px-1 pr-4 custom-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-xs font-black text-stone-400 uppercase tracking-widest mb-3">Tên Sản Phẩm (Validate: Không rỗng)</label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-stone-50 border border-stone-200 px-5 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900 font-bold"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-black text-stone-400 uppercase tracking-widest mb-3">Đường Dẫn SEO (Slug)</label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-stone-50 border border-stone-200 px-5 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900 font-bold"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-stone-400 uppercase tracking-widest mb-3">Danh Mục</label>
                  <select 
                    required
                    className="w-full bg-stone-50 border border-stone-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900 font-bold"
                    value={selectedParentId}
                    onChange={(e) => {
                      setSelectedParentId(e.target.value);
                      setFormData({ ...formData, categoryId: "" });
                    }}
                  >
                    <option value="">Chính...</option>
                    {categoryTree.filter(cat => !cat.parentId).map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black text-stone-400 uppercase tracking-widest mb-3">&nbsp;</label>
                  <select 
                    required
                    disabled={!selectedParentId}
                    className="w-full bg-stone-50 border border-stone-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900 font-bold disabled:opacity-50"
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  >
                    <option value="">Con...</option>
                    {categoryTree.find(c => c.id === selectedParentId)?.children?.map((sub: any) => (
                      <option key={sub.id} value={sub.id}>{sub.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-black text-stone-400 uppercase tracking-widest mb-3">Giá Gốc (VNĐ)</label>
                <input 
                  type="number" 
                  className="w-full bg-stone-50 border border-stone-200 px-5 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900 font-bold text-red-600"
                  value={formData.originalPrice}
                  onChange={(e) => setFormData({ ...formData, originalPrice: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <label className="block text-xs font-black text-stone-400 uppercase tracking-widest mb-3">Giá Giảm (Nếu có)</label>
                <input 
                  type="number" 
                  className="w-full bg-stone-50 border border-stone-200 px-5 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900 font-bold"
                  value={formData.discountPrice}
                  onChange={(e) => setFormData({ ...formData, discountPrice: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>

            <MultiImageUpload 
              label="Hình Ảnh Sản Phẩm (Gallery)"
              value={formData.images}
              onChange={(urls) => setFormData({ ...formData, images: urls })}
            />

            {/* Thông số kỹ thuật */}
            <div className="space-y-4 pt-4 border-t border-stone-100">
               <div className="flex justify-between items-center">
                  <label className="block text-xs font-black text-stone-400 uppercase tracking-widest">Thông số kỹ thuật (Key - Value)</label>
                  <button type="button" onClick={addSpecification} className="text-stone-900 hover:text-black font-black text-xs uppercase tracking-widest flex items-center gap-1">+ Thêm dòng</button>
               </div>
               {formData.specifications.map((spec, index) => (
                 <div key={index} className="flex gap-3 items-center">
                    <input 
                      placeholder="Tên thông số (VD: Chất liệu)"
                      className="flex-1 bg-stone-50 border border-stone-200 px-4 py-2 rounded-lg focus:outline-none font-bold text-sm"
                      value={spec.key}
                      onChange={(e) => updateSpecification(index, 'key', e.target.value)}
                    />
                    <input 
                      placeholder="Giá trị (VD: Gỗ Sồi)"
                      className="flex-1 bg-stone-50 border border-stone-200 px-4 py-2 rounded-lg focus:outline-none font-medium text-sm"
                      value={spec.value}
                      onChange={(e) => updateSpecification(index, 'value', e.target.value)}
                    />
                    <button type="button" onClick={() => removeSpecification(index)} className="text-red-400 hover:text-red-600 font-bold px-2">✕</button>
                 </div>
               ))}
            </div>

            {/* Đặc điểm nổi bật */}
            <div className="space-y-4 pt-4 border-t border-stone-100">
               <div className="flex justify-between items-center">
                  <label className="block text-xs font-black text-stone-400 uppercase tracking-widest">Đặc điểm nổi bật (Bullet List)</label>
                  <button type="button" onClick={addFeature} className="text-stone-900 hover:text-black font-black text-xs uppercase tracking-widest flex items-center gap-1">+ Thêm dòng</button>
               </div>
               {formData.features.map((feature, index) => (
                 <div key={index} className="flex gap-3 items-center">
                    <div className="w-1.5 h-1.5 bg-stone-400 rounded-full shrink-0" />
                    <input 
                      placeholder="VD: Thiết kế hiện đại, tinh tế"
                      className="flex-1 bg-stone-50 border border-stone-200 px-4 py-2 rounded-lg focus:outline-none font-medium text-sm"
                      value={feature}
                      onChange={(e) => updateFeature(index, e.target.value)}
                    />
                    <button type="button" onClick={() => removeFeature(index)} className="text-red-400 hover:text-red-600 font-bold px-2">✕</button>
                 </div>
               ))}
            </div>

            {/* Mô tả chi tiết (Rich Text) */}
            <div className="space-y-4 pt-4 border-t border-stone-100">
              <label className="block text-xs font-black text-stone-400 uppercase tracking-widest mb-3">Mô tả chi tiết (Rich Text Editor)</label>
              <div className="rich-text-container bg-stone-50 rounded-2xl overflow-hidden border border-stone-200">
                <ReactQuill 
                  theme="snow"
                  value={formData.description}
                  onChange={(val) => setFormData({ ...formData, description: val })}
                  modules={quillModules}
                  className="min-h-[250px] bg-white"
                />
              </div>
            </div>

            <div className="sticky bottom-0 pt-8 border-t border-stone-100 flex gap-4 bg-white pb-2 z-10">
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
                Xác Nhận Lưu
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}

