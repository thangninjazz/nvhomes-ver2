"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import dynamic from "next/dynamic";
import { api } from "@/services/api";
import { MultiImageUpload } from "@/components/common/MultiImageUpload";
import "react-quill-new/dist/quill.snow.css"; 

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function ProductManager() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const quillRef = useRef<any>(null);
  const [isEditingView, setIsEditingView] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategoryId, setFilterCategoryId] = useState("");
  
  const [formData, setFormData] = useState({
    name: "", slug: "", categoryId: "", originalPrice: 0, discountPrice: 0, 
    description: "", images: [] as string[], 
    imageNotes: [] as { topLeft: string; topRight: string }[],
    videoUrl: "",
    specifications: [] as { key: string; value: string }[],
    features: [] as string[],
    hasVariations: false,
    variationsData: "",
    rating: 5.0,
    reviewCount: 0,
    soldCount: 0
  });

  const [categoryTree, setCategoryTree] = useState<any[]>([]);
  const [selectedParentId, setSelectedParentId] = useState<string>("");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/products');
      setProducts(res.data);
    } catch (err: any) {
      alert("Lỗi: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories/tree?type=Product');
      setCategoryTree(res.data || []);
      const flattened: any[] = [];
      const flatten = (items: any[]) => {
        items.forEach(cat => {
          flattened.push(cat);
          if (cat.children && cat.children.length > 0) flatten(cat.children);
        });
      };
      flatten(res.data);
      setCategories(flattened);
    } catch (err) {}
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);
  
  const filteredProducts = useMemo(() => {
    if (!filterCategoryId) return products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const getDescendantIds = (catId: string): string[] => {
      const ids = [catId];
      categories.filter(c => c.parentId === catId).forEach(child => ids.push(...getDescendantIds(child.id)));
      return ids;
    };
    const allowedCategoryIds = getDescendantIds(filterCategoryId);
    return products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) && allowedCategoryIds.includes(p.categoryId));
  }, [products, searchTerm, filterCategoryId, categories]);

  const openAddView = () => {
    setEditingItem(null);
    setFormData({ 
      name: "", slug: "", categoryId: "", originalPrice: 0, discountPrice: 0, 
      description: "", images: [], imageNotes: [], videoUrl: "", specifications: [], features: [],
      hasVariations: false, variationsData: "", rating: 5.0, reviewCount: 0, soldCount: 0
    });
    setSelectedParentId("");
    setIsEditingView(true);
  };

  const openEditView = (item: any) => {
    setEditingItem(item);
    const currentCat = categories.find(c => c.id === item.categoryId);
    setSelectedParentId(currentCat?.parentId || "");
    setFormData({
      name: item.name, slug: item.slug, categoryId: item.categoryId || "",
      originalPrice: item.originalPrice || 0, discountPrice: item.discountPrice || 0,
      description: item.description || "", images: item.images ? item.images.split(',') : [],
      imageNotes: (() => { try { return item.imageNotes ? JSON.parse(item.imageNotes) : []; } catch(e) { return []; } })(),
      videoUrl: item.videoUrl || "",
      specifications: item.specifications || [], features: item.features || [],
      hasVariations: item.hasVariations || false, variationsData: item.variationsData || "",
      rating: item.rating || 5.0, reviewCount: item.reviewCount || 0, soldCount: item.soldCount || 0
    });
    setIsEditingView(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.categoryId) return alert("Vui lòng chọn danh mục con.");
    if (!formData.name || !formData.slug) return alert("Vui lòng điền đầy đủ tên và đường dẫn SEO.");
    try {
      const dataToSend = { ...formData, images: formData.images.join(','), imageNotes: JSON.stringify(formData.imageNotes) };
      if (editingItem) {
        await api.put(`/products/${editingItem.id}`, dataToSend);
        alert("Cập nhật sản phẩm thành công!");
      } else {
        await api.post('/products', dataToSend);
        alert("Thêm sản phẩm mới thành công!");
      }
      setIsEditingView(false);
      fetchProducts();
    } catch (err: any) {
      alert("Lỗi: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      try {
        await api.delete(`/products/${id}`);
        fetchProducts();
      } catch (err: any) {
        alert("Lỗi: " + (err.response?.data?.message || err.message));
      }
    }
  };

  // ... Helper functions for fields
  const addSpecification = () => setFormData({ ...formData, specifications: [...formData.specifications, { key: "", value: "" }] });
  const removeSpecification = (idx: number) => setFormData(prev => { const n = [...prev.specifications]; n.splice(idx,1); return {...prev, specifications: n}; });
  const updateSpecification = (idx: number, f: 'key'|'value', v: string) => setFormData(p => { const n = [...p.specifications]; n[idx] = {...n[idx], [f]: v}; return {...p, specifications: n}; });

  const addFeature = () => setFormData(p => ({ ...p, features: [...p.features, ""] }));
  const removeFeature = (idx: number) => setFormData(p => { const n = [...p.features]; n.splice(idx,1); return {...p, features: n}; });
  const updateFeature = (idx: number, v: string) => setFormData(p => { const n = [...p.features]; n[idx] = v; return {...p, features: n}; });

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
        } catch (err) { alert("Lỗi khi upload ảnh."); }
      }
    };
  };

  const quillModules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['link', 'image'],
        ['clean']
      ],
      handlers: { image: imageHandler }
    },
  }), []);

  return (
    <div className="max-w-7xl mx-auto pb-24">
      {!isEditingView ? (
        <>
          <div className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-3xl font-black text-stone-900 tracking-tight mb-2">Quản Lý Sản Phẩm</h1>
                <p className="text-stone-500 font-medium">Hệ thống phân loại E-Commerce tiêu chuẩn Shopee.</p>
            </div>
            <button 
              onClick={openAddView}
              className="bg-stone-900 text-white px-7 py-3.5 rounded-xl font-bold tracking-wide uppercase text-sm hover:bg-black shadow-[0_5px_15px_rgba(0,0,0,0.15)] transition-all flex items-center gap-2"
            >
              <span>+ Thêm Sản Phẩm Mới</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden mb-12">
            <div className="p-6 border-b border-stone-100 flex flex-col md:flex-row gap-4 bg-stone-50/30">
                <input 
                  type="text" 
                  placeholder="Tìm kiếm tên sản phẩm..." 
                  className="flex-1 border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-stone-900 font-medium" 
                  value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select 
                  className="w-full md:w-64 border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-stone-900 font-bold bg-white"
                  value={filterCategoryId} onChange={(e) => setFilterCategoryId(e.target.value)}
                >
                  <option value="">Tất cả danh mục</option>
                  {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
            </div>
            
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-stone-50 text-stone-400 font-black text-[10px] uppercase tracking-widest border-b border-stone-100">
                        <th className="p-6">Sản Phẩm</th>
                        <th className="p-6">Phân Loại</th>
                        <th className="p-6 text-right">Giá Bán</th>
                        <th className="p-6 text-center w-40">Thao Tác</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                    {loading ? (
                        <tr><td colSpan={4} className="p-10 text-center text-stone-400">Đang tải...</td></tr>
                    ) : filteredProducts.length === 0 ? (
                        <tr><td colSpan={4} className="p-10 text-center text-stone-400">Không tìm thấy.</td></tr>
                    ) : filteredProducts.map(p => (
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
                                  {p.categoryName || categories.find(c => c.id === p.categoryId)?.name || 'Trống'}
                                </span>
                            </td>
                            <td className="p-6">
                                <div className="flex flex-col items-end">
                                    <span className="font-black text-red-600 text-lg tracking-tight">{p.discountPrice ? p.discountPrice.toLocaleString('vi-VN') : p.originalPrice.toLocaleString('vi-VN')} đ</span>
                                </div>
                            </td>
                            <td className="p-6">
                               <div className="flex justify-center gap-3">
                                <button onClick={() => openEditView(p)} className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase hover:bg-blue-600 hover:text-white transition-all shadow-sm">Sửa</button>
                                <button onClick={() => handleDelete(p.id)} className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-[10px] font-black uppercase hover:bg-red-600 hover:text-white transition-all shadow-sm">Xóa</button>
                               </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
          </div>
        </>
      ) : (
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex justify-between items-center bg-white/95 backdrop-blur-md p-4 rounded-3xl border border-stone-200 shadow-sm sticky top-4 z-40 mb-8">
             <div className="flex items-center gap-4">
                <button type="button" onClick={() => setIsEditingView(false)} className="text-stone-400 hover:text-stone-900 font-black p-2 bg-stone-50 rounded-xl">← Quay lại</button>
                <h1 className="text-xl font-black text-stone-900">{editingItem ? "Sửa Cấu Hình Sản Phẩm" : "Thêm Sản Phẩm Mới"}</h1>
             </div>
             <button type="submit" className="px-10 py-3 bg-stone-900 text-white font-black rounded-xl hover:bg-black uppercase tracking-widest text-xs shadow-lg">Lưu Ký & Hiển Thị</button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             <div className="lg:col-span-2 space-y-8">
                {/* THÔNG TIN CƠ BẢN */}
                <div className="bg-white p-8 rounded-[2rem] border border-stone-200 shadow-sm">
                   <h2 className="text-sm font-black text-stone-900 uppercase tracking-widest mb-6 border-b border-stone-100 pb-4">1. Thông tin cơ bản</h2>
                   <div className="space-y-6">
                      <div>
                        <label className="block text-[11px] font-black text-stone-400 uppercase tracking-widest mb-3">Tên Sản Phẩm *</label>
                        <input type="text" required className="w-full bg-stone-50 border border-stone-200 px-5 py-3.5 rounded-xl focus:ring-2 focus:ring-stone-900 font-bold" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                      </div>
                      <div>
                        <label className="block text-[11px] font-black text-stone-400 uppercase tracking-widest mb-3">Đường Dẫn SEO (Slug) *</label>
                        <input type="text" required className="w-full bg-stone-50 border border-stone-200 px-5 py-3.5 rounded-xl focus:ring-2 focus:ring-stone-900 font-bold" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-black text-stone-400 uppercase tracking-widest mb-3">Danh Mục Chính</label>
                          <select required className="w-full bg-stone-50 border border-stone-200 px-4 py-3.5 rounded-xl focus:ring-2 focus:ring-stone-900 font-bold" value={selectedParentId} onChange={(e) => { setSelectedParentId(e.target.value); setFormData({ ...formData, categoryId: "" }); }}>
                            <option value="">Chọn...</option>
                            {categoryTree.filter(cat => !cat.parentId).map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] font-black text-stone-400 uppercase tracking-widest mb-3">Danh Mục Con</label>
                          <select required disabled={!selectedParentId} className="w-full bg-stone-50 border border-stone-200 px-4 py-3.5 rounded-xl focus:ring-2 focus:ring-stone-900 font-bold disabled:opacity-50" value={formData.categoryId} onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}>
                            <option value="">Chọn...</option>
                            {categoryTree.find(c => c.id === selectedParentId)?.children?.map((sub: any) => <option key={sub.id} value={sub.id}>{sub.name}</option>)}
                          </select>
                        </div>
                      </div>
                   </div>
                </div>

                {/* THÔNG TIN BÁN HÀNG */}
                <div className="bg-white p-8 rounded-[2rem] border border-stone-200 shadow-sm relative overflow-hidden">
                   <h2 className="text-sm font-black text-stone-900 uppercase tracking-widest mb-6 border-b border-stone-100 pb-4">2. Thông tin bán hàng</h2>
                   
                   <div className="flex items-center gap-4 mb-8 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                     <span className="text-sm font-bold text-blue-900 flex-1">Bật "Phân Loại Hàng" (Shopee Variations)</span>
                     <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked={formData.hasVariations} onChange={(e) => setFormData({ ...formData, hasVariations: e.target.checked })} />
                        <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                     </label>
                   </div>

                   {!formData.hasVariations ? (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-black text-stone-400 uppercase tracking-widest mb-3">Giá Bán Gốc (VNĐ)</label>
                          <input type="number" className="w-full bg-stone-50 border border-stone-200 px-5 py-3.5 rounded-xl font-bold text-stone-900" value={formData.originalPrice} onChange={(e) => setFormData({ ...formData, originalPrice: parseInt(e.target.value) || 0 })} />
                        </div>
                        <div>
                          <label className="block text-[11px] font-black text-stone-400 uppercase tracking-widest mb-3">Giá Khuyến Mãi (VNĐ)</label>
                          <input type="number" className="w-full bg-stone-50 border border-stone-200 px-5 py-3.5 rounded-xl font-black text-red-600" value={formData.discountPrice} onChange={(e) => setFormData({ ...formData, discountPrice: parseInt(e.target.value) || 0 })} />
                        </div>
                      </div>
                   ) : (
                      <div className="space-y-4">
                        <label className="block text-[11px] font-black text-stone-400 uppercase tracking-widest mb-3">Bảng Cấu Hình Biến Thể (JSON / Kích Thước - Màu Sắc - Giá)</label>
                        <textarea 
                           className="w-full bg-stone-900 text-stone-300 font-mono text-xs border border-stone-800 p-5 rounded-xl min-h-[150px]" 
                           placeholder='Ví dụ: [{"name": "Màu Đỏ", "price": 1000000}, {"name": "Màu Xanh", "price": 1200000}]'
                           value={formData.variationsData} onChange={(e) => setFormData({ ...formData, variationsData: e.target.value })} 
                        />
                        <p className="text-[10px] text-stone-500 font-bold uppercase tracking-widest">Tính năng đang trong giai đoạn Beta. Nhập JSON Array thay vì UI phức tạp.</p>
                      </div>
                   )}
                </div>

                {/* HÌNH ẢNH & TRUYỀN THÔNG */}
                <div className="bg-white p-8 rounded-[2rem] border border-stone-200 shadow-sm space-y-8">
                   <div>
                     <h2 className="text-sm font-black text-stone-900 uppercase tracking-widest mb-6 border-b border-stone-100 pb-4">3. Quản lý Hình Ảnh & Truyền Thông</h2>
                     <MultiImageUpload 
                       label="Lưới Ảnh (Hình đầu tiên là Thumbnail. Ghi chú ảnh để hiển thị icon tư vấn trên ảnh)" 
                       value={formData.images} 
                       onChange={(urls) => setFormData({ ...formData, images: urls })} 
                       notes={formData.imageNotes}
                       onChangeNotes={(newNotes) => setFormData({ ...formData, imageNotes: newNotes })}
                     />
                   </div>
                   
                   <div>
                     <label className="block text-[11px] font-black text-stone-400 uppercase tracking-widest mb-3">Video Youtube (Tuỳ chọn)</label>
                     <input 
                       type="text" 
                       placeholder="VD: https://www.youtube.com/watch?v=..." 
                       className="w-full bg-stone-50 border border-stone-200 px-5 py-3.5 rounded-xl focus:ring-2 focus:ring-stone-900 font-medium text-blue-600" 
                       value={formData.videoUrl} 
                       onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })} 
                     />
                   </div>
                </div>

                {/* NỘI DUNG CHI TIẾT */}
                <div className="bg-white p-8 rounded-[2rem] border border-stone-200 shadow-sm flex flex-col">
                   <div className="mb-6 border-b border-stone-100 pb-4">
                     <h2 className="text-sm font-black text-stone-900 uppercase tracking-widest mb-2">4. Mô Tả Chi Tiết Sản Phẩm</h2>
                     <p className="text-[11px] font-medium text-stone-500">Mô tả sản phẩm chi tiết định dạng Rich Text giúp khách hàng hiểu rõ hơn về sản phẩm, từ đó tăng tỷ lệ mua hàng. Công cụ soạn thảo chuyên nghiệp cho phép bạn định dạng văn bản, chèn hình ảnh và liên kết dễ dàng.</p>
                   </div>
                   
                   <div className="rich-text-wrapper border-2 border-stone-100 rounded-2xl overflow-hidden focus-within:border-stone-900 focus-within:ring-4 focus-within:ring-stone-100 transition-all bg-white relative">
                     <ReactQuill 
                        // @ts-ignore
                        ref={quillRef}
                        theme="snow" 
                        value={formData.description} 
                        onChange={(val) => setFormData({ ...formData, description: val })} 
                        modules={quillModules} 
                        className="quill-premium"
                        placeholder="Nhập mô tả chi tiết sản phẩm của bạn tại đây... (Nên bao gồm đặc điểm nổi bật, thông số chi tiết, và hướng dẫn sử dụng)"
                     />
                   </div>

                   <div className="mt-5 flex justify-between items-center text-[11px] text-stone-400 font-bold uppercase tracking-widest">
                     <div className="flex gap-4">
                       <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500"></span> Hỗ trợ ảnh tối đa 5MB</span>
                       <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Kéo thả hoặc dán ảnh trực tiếp</span>
                     </div>
                     <span>{formData.description.replace(/<[^>]*>?/gm, '').length} ký tự</span>
                   </div>
                </div>
             </div>

             <div className="space-y-8">
                {/* CHỈ SỐ BÁN HÀNG ẢO */}
                <div className="bg-white p-6 rounded-[2rem] border border-stone-200 shadow-sm">
                   <h2 className="text-xs font-black text-stone-900 uppercase tracking-widest mb-6 border-b border-stone-100 pb-4">Marketing & Chỉ Số</h2>
                   <div className="space-y-4">
                     <div>
                       <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2">Đánh Giá (Sao)</label>
                       <input type="number" step="0.1" className="w-full bg-stone-50 border border-stone-200 px-4 py-2.5 rounded-lg font-bold text-yellow-500" value={formData.rating} onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) || 0 })} />
                     </div>
                     <div>
                       <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2">Số Lượng Lượt Đánh Giá</label>
                       <input type="number" className="w-full bg-stone-50 border border-stone-200 px-4 py-2.5 rounded-lg font-bold text-stone-900" value={formData.reviewCount} onChange={(e) => setFormData({ ...formData, reviewCount: parseInt(e.target.value) || 0 })} />
                     </div>
                     <div>
                       <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2">Số Lượng Đã Bán</label>
                       <input type="number" className="w-full bg-stone-50 border border-stone-200 px-4 py-2.5 rounded-lg font-bold text-stone-900" value={formData.soldCount} onChange={(e) => setFormData({ ...formData, soldCount: parseInt(e.target.value) || 0 })} />
                     </div>
                   </div>
                </div>

                {/* THÔNG SỐ KỸ THUẬT */}
                <div className="bg-white p-6 rounded-[2rem] border border-stone-200 shadow-sm">
                   <div className="flex justify-between items-center mb-6 border-b border-stone-100 pb-4">
                      <h2 className="text-xs font-black text-stone-900 uppercase tracking-widest">Bảng Thông Số</h2>
                      <button type="button" onClick={addSpecification} className="text-stone-900 font-bold text-[10px] uppercase">Thêm Dòng +</button>
                   </div>
                   <div className="space-y-3">
                     {formData.specifications.map((spec, index) => (
                       <div key={index} className="flex gap-2">
                          <input placeholder="Key (VD: Kích thước)" className="w-1/3 bg-stone-50 border border-stone-200 px-3 py-2 rounded-lg text-xs font-bold" value={spec.key} onChange={(e) => updateSpecification(index, 'key', e.target.value)} />
                          <input placeholder="Value (VD: 2m x 1m)" className="flex-1 bg-stone-50 border border-stone-200 px-3 py-2 rounded-lg text-xs" value={spec.value} onChange={(e) => updateSpecification(index, 'value', e.target.value)} />
                          <button type="button" onClick={() => removeSpecification(index)} className="text-red-400 font-bold px-2">✕</button>
                       </div>
                     ))}
                   </div>
                </div>

                {/* ĐẶC ĐIỂM NỔI BẬT */}
                <div className="bg-white p-6 rounded-[2rem] border border-stone-200 shadow-sm">
                   <div className="flex justify-between items-center mb-6 border-b border-stone-100 pb-4">
                      <h2 className="text-xs font-black text-stone-900 uppercase tracking-widest">Điểm Nhấn (Bullet)</h2>
                      <button type="button" onClick={addFeature} className="text-stone-900 font-bold text-[10px] uppercase">Thêm Dòng +</button>
                   </div>
                   <div className="space-y-3">
                     {formData.features.map((feature, index) => (
                       <div key={index} className="flex gap-2 items-center">
                          <div className="w-1.5 h-1.5 bg-stone-400 rounded-full" />
                          <input placeholder="VD: Bảo hành 5 năm" className="flex-1 bg-stone-50 border border-stone-200 px-3 py-2 rounded-lg text-xs" value={feature} onChange={(e) => updateFeature(index, e.target.value)} />
                          <button type="button" onClick={() => removeFeature(index)} className="text-red-400 font-bold px-2">✕</button>
                       </div>
                     ))}
                   </div>
                </div>
             </div>
          </div>
        </form>
      )}

      {/* Global styles for Quill Editor for Premium UI */}
      <style dangerouslySetInnerHTML={{ __html: `
        .quill-premium .ql-toolbar {
          border: none !important;
          border-bottom: 2px solid #f5f5f4 !important;
          background-color: #fafaf9;
          padding: 12px 16px !important;
          position: sticky;
          top: 0;
          z-index: 10;
          font-family: inherit;
          border-radius: 1rem 1rem 0 0;
        }
        .quill-premium .ql-container {
          border: none !important;
          font-family: inherit !important;
          font-size: 15px !important;
          min-height: 450px !important;
          border-radius: 0 0 1rem 1rem;
          background-color: #ffffff;
        }
        .quill-premium .ql-editor {
          padding: 32px 24px;
          min-height: 450px !important;
          color: #1c1917;
          line-height: 1.8;
        }
        .quill-premium .ql-editor.ql-blank::before {
          font-style: normal;
          color: #a8a29e;
          font-weight: 500;
        }
        .quill-premium .ql-editor p {
          margin-bottom: 1rem;
        }
        .quill-premium .ql-editor img {
          border-radius: 0.75rem;
          margin: 1.5rem 0;
          max-width: 100%;
          border: 1px solid #f5f5f4;
        }
      `}} />
    </div>
  );
}
