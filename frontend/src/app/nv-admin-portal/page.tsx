"use client";

import { useEffect, useState } from "react";
import { api } from "@/services/api";

interface CrmStats {
  totalCustomers: number;
  newLeads: number;
  inProgress: number;
  closedDeals: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    projects: 0,
    leads: 0
  });
  const [crmStats, setCrmStats] = useState<CrmStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [crmLoading, setCrmLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [prodRes, catRes, projRes, leadRes] = await Promise.allSettled([
          api.get('/products'),
          api.get('/categories'),
          api.get('/projects'),
          api.get('/customers')
        ]);

        setStats({
          products: prodRes.status === 'fulfilled' ? prodRes.value.data.length : 0,
          categories: catRes.status === 'fulfilled' ? catRes.value.data.length : 0,
          projects: projRes.status === 'fulfilled' ? (Array.isArray(projRes.value.data) ? projRes.value.data.length : (projRes.value.data.value?.length || 0)) : 0,
          leads: leadRes.status === 'fulfilled' ? (leadRes.value.data.total ?? leadRes.value.data.items?.length ?? 0) : 0
        });
      } catch (err) {
        console.error("Lỗi fetch stats:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchCrmStats = async () => {
      try {
        setCrmLoading(true);
        const res = await api.get('/crm/dashboard');
        setCrmStats(res.data);
      } catch (err) {
        console.error("Lỗi fetch CRM dashboard:", err);
      } finally {
        setCrmLoading(false);
      }
    };

    fetchStats();
    fetchCrmStats();
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-4xl font-black mb-10 text-stone-900 tracking-tight">Tổng Quan Hệ Thống</h1>
      
      {/* Metric Cards - System */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm hover:shadow-lg transition-shadow">
          <p className="text-xs font-black text-stone-400 uppercase tracking-widest mb-3">Yêu Cầu Tư Vấn (Leads)</p>
          <p className="text-5xl font-black text-stone-900">{crmLoading ? "..." : (crmStats?.newLeads ?? 0)}</p>
          <p className="text-sm font-bold text-stone-400 mt-4">Thông tin khách hàng từ web</p>
        </div>
        
        <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm hover:shadow-lg transition-shadow">
          <p className="text-xs font-black text-stone-400 uppercase tracking-widest mb-3">Danh Mục (Categories)</p>
          <p className="text-5xl font-black text-stone-900">{loading ? "..." : stats.categories}</p>
          <p className="text-sm font-bold text-stone-400 mt-4">Phân loại sản phẩm & menu</p>
        </div>
        
        <div className="bg-stone-900 text-white p-6 rounded-3xl border border-stone-800 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
          <p className="text-xs font-black text-stone-400 uppercase tracking-widest mb-3 relative z-10">Tổng Sản Phẩm</p>
          <p className="text-5xl font-black text-white relative z-10">{loading ? "..." : stats.products}</p>
          <p className="text-sm font-semibold text-stone-400 mt-4 relative z-10">Sản phẩm đang hiển thị.</p>
        </div>
        
        <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm hover:shadow-lg transition-shadow">
          <p className="text-xs font-black text-stone-400 uppercase tracking-widest mb-3">Dự Án Portfolio</p>
          <p className="text-5xl font-black text-stone-900">{loading ? "..." : stats.projects}</p>
          <p className="text-sm font-semibold text-stone-500 mt-4">Công trình đã thực hiện</p>
        </div>
      </div>

      {/* CRM Dashboard Section */}
      <div className="mt-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-stone-900 tracking-tight">📊 CRM Dashboard</h2>
          <span className="text-xs font-bold text-stone-400 uppercase tracking-widest bg-stone-100 px-4 py-2 rounded-full">Dữ liệu thực từ Database</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm hover:shadow-lg transition-shadow">
            <p className="text-xs font-black text-stone-400 uppercase tracking-widest mb-3">Tổng Khách Quan Tâm</p>
            <p className="text-5xl font-black text-stone-900">
              {crmLoading ? <span className="inline-block w-8 h-8 border-4 border-stone-200 border-t-stone-600 rounded-full animate-spin" /> : (crmStats?.totalCustomers ?? 0)}
            </p>
            <p className="text-sm font-bold text-stone-400 mt-4">Tổng tất cả khách hàng</p>
          </div>

          <div className="bg-red-50 p-6 rounded-3xl border border-red-100 shadow-sm hover:shadow-lg transition-shadow">
            <p className="text-xs font-black text-red-400 uppercase tracking-widest mb-3">Y/c Mới (Chưa Check)</p>
            <p className="text-5xl font-black text-red-600">
              {crmLoading ? <span className="inline-block w-8 h-8 border-4 border-red-200 border-t-red-500 rounded-full animate-spin" /> : (crmStats?.newLeads ?? 0)}
            </p>
            <p className="text-sm font-bold text-red-300 mt-4">Cần liên hệ ngay</p>
          </div>

          <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100 shadow-sm hover:shadow-lg transition-shadow">
            <p className="text-xs font-black text-amber-500 uppercase tracking-widest mb-3">Đang Trong Quá Trình</p>
            <p className="text-5xl font-black text-amber-600">
              {crmLoading ? <span className="inline-block w-8 h-8 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin" /> : (crmStats?.inProgress ?? 0)}
            </p>
            <p className="text-sm font-bold text-amber-400 mt-4">Đang chăm sóc khách</p>
          </div>

          <div className="bg-green-50 p-6 rounded-3xl border border-green-100 shadow-sm hover:shadow-lg transition-shadow">
            <p className="text-xs font-black text-green-500 uppercase tracking-widest mb-3">Đã Ký Hợp Đồng</p>
            <p className="text-5xl font-black text-green-600">
              {crmLoading ? <span className="inline-block w-8 h-8 border-4 border-green-200 border-t-green-500 rounded-full animate-spin" /> : (crmStats?.closedDeals ?? 0)}
            </p>
            <p className="text-sm font-bold text-green-400 mt-4">Khớp lệnh thành công</p>
          </div>
        </div>
      </div>
      
      {/* System Status Table */}
      <div className="mt-12 bg-white rounded-3xl border border-stone-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-stone-100 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-stone-900">Trạng thái API & System Config</h2>
            <span className="bg-green-100 text-green-700 px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full">All Systems Active</span>
        </div>
        <div className="p-8">
            <div className="space-y-6 text-stone-600">
            <div className="flex items-start gap-4 pb-6 border-b border-stone-50">
                <div className="w-12 h-12 bg-stone-100 rounded-xl flex items-center justify-center shrink-0 border border-stone-200">🗄️</div>
                <div>
                    <p className="font-bold text-lg text-stone-900">Database Core (PostgreSQL)</p>
                    <p className="text-stone-500">Hoạt động ổn định. Đã kết nối qua Connection String trong appsettings.json.</p>
                </div>
            </div>
            <div className="flex items-start gap-4 pb-6 border-b border-stone-50">
                <div className="w-12 h-12 bg-stone-100 rounded-xl flex items-center justify-center shrink-0 border border-stone-200">🌳</div>
                <div>
                    <p className="font-bold text-lg text-stone-900">Dynamic Menu & Category Tree</p>
                    <p className="text-stone-500">Dữ liệu phân tầng từ DB đang được load trực tiếp cho Client & Admin.</p>
                </div>
            </div>
            <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-stone-100 rounded-xl flex items-center justify-center shrink-0 border border-stone-200">🌐</div>
                <div>
                    <p className="font-bold text-lg text-stone-900">Admin CMS Panel</p>
                    <p className="text-stone-500">Đã gỡ bỏ Mock Mode. Hệ thống hiện đang chạy hoàn toàn trên API thật.</p>
                </div>
            </div>
            </div>
        </div>
      </div>
    </div>
  );
}
