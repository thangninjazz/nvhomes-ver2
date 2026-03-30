"use client";

import { useState, useEffect } from "react";
import { api } from "@/services/api";

interface Customer {
  id: string;
  phoneNumber: string;
  name: string;
  address: string;
  status: string; // "CAN_LIEN_HE", "DANG_CHAM_SOC", "DA_CHOT_HOP_DONG"
  note: string;
  createdAt: string;
}

interface Stats {
  totalCustomers: number;
  newLeads: number;
  inProgress: number;
  closedDeals: number;
}

const STATUS_LABELS: Record<string, string> = {
  "CAN_LIEN_HE": "Cần Liên Hệ",
  "DANG_CHAM_SOC": "Đang Chăm Sóc",
  "DA_CHOT_HOP_DONG": "Đã Chốt HĐ",
};

const STATUS_BADGE: Record<string, string> = {
  "CAN_LIEN_HE": "bg-red-100 text-red-600",
  "DANG_CHAM_SOC": "bg-amber-100 text-amber-600",
  "DA_CHOT_HOP_DONG": "bg-green-100 text-green-600",
};

export default function CustomersAdmin() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState<Stats | null>(null);

  // Modals state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ phoneNumber: "", name: "", address: "", status: "CAN_LIEN_HE", note: "" });
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addForm, setAddForm] = useState({ phoneNumber: "", name: "", address: "", note: "" });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [customersResp, statsResp] = await Promise.all([
        api.get(`/customers?search=${search}&page=${page}&pageSize=10`),
        api.get("/crm/dashboard")
      ]);
      setCustomers(customersResp.data.items);
      setTotal(customersResp.data.total);
      setStats(statsResp.data);
    } catch {
      console.error("Lỗi lấy dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, search]);

  const handleEdit = (c: Customer) => {
    setEditingId(c.id);
    setEditForm({ 
      phoneNumber: c.phoneNumber, 
      name: c.name, 
      address: c.address || "",
      status: c.status, 
      note: c.note || "" 
    });
  };

  const handleSaveEdit = async () => {
    try {
      await api.put(`/customers/${editingId}`, editForm);
      setEditingId(null);
      fetchData();
    } catch {
      alert("Lỗi khi lưu!");
    }
  };

  const handleAddCustomer = async () => {
    try {
      await api.post("/customers", addForm);
      setIsAddModalOpen(false);
      setAddForm({ phoneNumber: "", name: "", address: "", note: "" });
      fetchData();
    } catch {
      alert("Lỗi khi thêm!");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa khách hàng này không?")) return;
    try {
      await api.delete(`/customers/${id}`);
      fetchData();
    } catch {
      alert("Lỗi khi xóa!");
    }
  };

  const handleExportCsv = () => {
    const link = document.createElement("a");
    link.href = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/customers/export`;
    link.download = "customers.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black text-stone-900 uppercase tracking-tighter">CRM Khách Hàng</h1>
          <p className="text-stone-400 font-bold text-xs uppercase tracking-widest mt-1">Quản lý data từ Giỏ hàng, Chat & Form</p>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-5 py-3 bg-stone-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-black transition-colors shadow-lg active:scale-95"
          >
            ➕ Thêm khách hàng
          </button>

          <button
            onClick={handleExportCsv}
            className="flex items-center gap-2 px-5 py-3 bg-green-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-green-700 transition-colors shadow-lg active:scale-95"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            Xuất File Excel (CSV)
          </button>

          <div className="relative">
            <input 
              type="text" 
              placeholder="Tìm SĐT hoặc Tên..."
              className="pl-12 pr-6 py-3 bg-white border border-stone-200 rounded-2xl text-sm font-bold w-72 focus:ring-4 focus:ring-stone-100 transition-all"
              value={search}
              onChange={(e) => {setSearch(e.target.value); setPage(1);}}
            />
            <svg className="w-5 h-5 text-stone-300 absolute left-4 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
        </div>
      </div>

      {/* CRM Funnel Statistics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="p-6 rounded-[2rem] bg-stone-100 text-stone-800 shadow-sm relative overflow-hidden border border-stone-200">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 block opacity-80 leading-relaxed">Tổng Khách Quan Tâm</span>
            <p className="text-5xl font-black">{loading ? "..." : stats?.totalCustomers || 0}</p>
        </div>
        <div className="p-6 rounded-[2rem] bg-red-50 text-red-600 border border-red-100 shadow-sm relative overflow-hidden">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 block opacity-80 leading-relaxed">Y/c Mới (Chưa Check)</span>
            <p className="text-5xl font-black">{loading ? "..." : stats?.newLeads || 0}</p>
        </div>
        <div className="p-6 rounded-[2rem] bg-blue-50 text-blue-700 border border-blue-100 shadow-sm relative overflow-hidden">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 block opacity-80 leading-relaxed">Đang Tư Vấn</span>
            <p className="text-5xl font-black">{loading ? "..." : stats?.inProgress || 0}</p>
        </div>
        <div className="p-6 rounded-[2rem] bg-green-50 text-green-700 border border-green-100 shadow-sm relative overflow-hidden">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 block opacity-80 leading-relaxed">Đã Chốt Hợp Đồng</span>
            <p className="text-5xl font-black">{loading ? "..." : stats?.closedDeals || 0}</p>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-stone-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-100">
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-stone-400">Khách hàng</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-stone-400 text-center">Trạng thái</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-stone-400">Ghi chú (Nhu cầu)</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-stone-400 text-right">Ngày tạo</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-stone-400 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {loading ? (
              <tr><td colSpan={5} className="px-8 py-20 text-center text-stone-400 font-bold italic">Đang tải...</td></tr>
            ) : customers.length === 0 ? (
              <tr><td colSpan={5} className="px-8 py-20 text-center text-stone-400 font-bold italic">Không tìm thấy khách hàng nào.</td></tr>
            ) : (
              customers.map(c => (
                <tr key={c.id} className="hover:bg-stone-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <p className="font-black text-stone-900">{c.phoneNumber}</p>
                    <p className="text-[11px] text-stone-800 font-bold uppercase">{c.name || "Chưa có tên"}</p>
                    {c.address && <p className="text-[10px] text-blue-600 font-bold uppercase mt-1">🏠 Đ/C: {c.address}</p>}
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest border transition-all ${STATUS_BADGE[c.status] || 'bg-stone-100 text-stone-500'}`}>
                      {STATUS_LABELS[c.status] || c.status || "N/A"}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-sm text-stone-500 font-medium max-w-xs truncate">
                    {c.note || "---"}
                  </td>
                  <td className="px-8 py-6 text-right text-xs text-stone-400 font-bold whitespace-nowrap">
                    {new Date(c.createdAt).toLocaleString('vi-VN', { 
                        day: '2-digit', 
                        month: '2-digit', 
                        year: 'numeric', 
                        hour: '2-digit', 
                        minute: '2-digit' 
                    })}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-center gap-4">
                        <button 
                            onClick={() => handleEdit(c)}
                            className="p-2 text-stone-400 hover:text-stone-900 transition-colors"
                            title="Chỉnh sửa"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                        <button 
                            onClick={() => handleDelete(c.id)}
                            className="p-2 text-stone-400 hover:text-red-600 transition-colors"
                            title="Xóa"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="p-8 bg-stone-50 flex justify-between items-center border-t border-stone-100">
          <p className="text-xs text-stone-400 font-bold uppercase tracking-widest">Hiển thị {customers.length} / {total} kết quả</p>
          <div className="flex gap-2">
            <button 
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="px-4 py-2 bg-white border border-stone-200 rounded-xl text-xs font-black uppercase disabled:opacity-30"
            >
              Sau
            </button>
            <button 
              disabled={page * 10 >= total}
              onClick={() => setPage(p => p + 1)}
              className="px-4 py-2 bg-white border border-stone-200 rounded-xl text-xs font-black uppercase disabled:opacity-30"
            >
              Tiếp
            </button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editingId && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 text-left">
          <div className="bg-white rounded-[2.5rem] p-10 w-full max-w-lg shadow-2xl">
            <h3 className="text-2xl font-black text-stone-900 uppercase tracking-tight mb-8">Cập nhật thông tin</h3>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-4">Họ tên</label>
                    <input 
                      type="text"
                      className="w-full px-6 py-4 bg-stone-50 rounded-2xl border-none font-bold"
                      value={editForm.name}
                      onChange={e => setEditForm({...editForm, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-4">Số điện thoại</label>
                    <input 
                      type="text"
                      className="w-full px-6 py-4 bg-stone-50 rounded-2xl border-none font-bold"
                      value={editForm.phoneNumber}
                      onChange={e => setEditForm({...editForm, phoneNumber: e.target.value})}
                    />
                  </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-4">Địa chỉ</label>
                <input 
                  type="text"
                  className="w-full px-6 py-4 bg-stone-50 rounded-2xl border-none font-bold"
                  value={editForm.address}
                  onChange={e => setEditForm({...editForm, address: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-4">Trạng thái</label>
                <select 
                  className="w-full px-6 py-4 bg-stone-50 rounded-2xl border-none font-bold"
                  value={editForm.status}
                  onChange={e => setEditForm({...editForm, status: e.target.value})}
                >
                  <option value="CAN_LIEN_HE">🔴 Cần Liên Hệ</option>
                  <option value="DANG_CHAM_SOC">🟡 Đang Chăm Sóc</option>
                  <option value="DA_CHOT_HOP_DONG">🟢 Đã Chốt Hợp Đồng</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-4">Ghi chú / Nhu cầu</label>
                <textarea 
                  rows={4}
                  className="w-full px-6 py-4 bg-stone-50 rounded-2xl border-none font-bold resize-none"
                  value={editForm.note}
                  onChange={e => setEditForm({...editForm, note: e.target.value})}
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button onClick={() => setEditingId(null)} className="flex-1 py-4 border-2 border-stone-200 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-stone-50 transition-colors">Hủy</button>
                <button onClick={handleSaveEdit} className="flex-1 py-4 bg-stone-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-black transition-all shadow-xl">Lưu thay đổi</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 text-left">
          <div className="bg-white rounded-[2.5rem] p-10 w-full max-w-lg shadow-2xl">
            <h3 className="text-2xl font-black text-stone-900 uppercase tracking-tight mb-8">Thêm khách hàng mới</h3>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-4">Họ tên khách hàng</label>
                    <input 
                      type="text"
                      placeholder="Vd: Nguyễn Văn An"
                      className="w-full px-6 py-4 bg-stone-50 rounded-2xl border-none font-bold"
                      value={addForm.name}
                      onChange={e => setAddForm({...addForm, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-4">Số điện thoại</label>
                    <input 
                      type="text"
                      placeholder="090..."
                      className="w-full px-6 py-4 bg-stone-50 rounded-2xl border-none font-bold"
                      value={addForm.phoneNumber}
                      onChange={e => setAddForm({...addForm, phoneNumber: e.target.value})}
                    />
                  </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-4">Địa chỉ</label>
                <input 
                  type="text"
                  placeholder="Vd: Quận 1, TP.HCM"
                  className="w-full px-6 py-4 bg-stone-50 rounded-2xl border-none font-bold"
                  value={addForm.address}
                  onChange={e => setAddForm({...addForm, address: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-4">Nhu cầu cụ thể</label>
                <textarea 
                  rows={4}
                  placeholder="Vd: Tư vấn nội thất phòng khách biệt thự..."
                  className="w-full px-6 py-4 bg-stone-50 rounded-2xl border-none font-bold resize-none"
                  value={addForm.note}
                  onChange={e => setAddForm({...addForm, note: e.target.value})}
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button onClick={() => setIsAddModalOpen(false)} className="flex-1 py-4 border-2 border-stone-200 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-stone-50 transition-colors">Hủy</button>
                <button onClick={handleAddCustomer} className="flex-1 py-4 bg-stone-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-black transition-all shadow-xl">Thêm khách hàng</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
