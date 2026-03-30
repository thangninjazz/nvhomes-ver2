"use client";

import { useState } from "react";
import { api } from "@/services/api";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    needs: "",
    message: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await api.post("/customers", {
        phoneNumber: formData.phone,
        name: formData.name,
        source: "Contact"
      });
      setSuccess(true);
      setFormData({ name: "", phone: "", address: "", needs: "", message: "" });
    } catch {
      setError("Có lỗi xảy ra, vui lòng thử lại hoặc gọi hotline 0966.245.396.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Left Side: Info */}
          <div>
            <h1 className="text-5xl font-black text-stone-900 uppercase tracking-tighter mb-8 leading-tight">
              Liên Hệ <br/> <span className="text-red-500">NV Homes</span>
            </h1>
            <p className="text-stone-500 text-lg font-medium leading-relaxed mb-12">
              Chúng tôi luôn sẵn sàng lắng nghe và biến những ý tưởng về không gian sống của bạn thành hiện thực. Hãy liên hệ ngay hôm nay!
            </p>

            <div className="space-y-10">
              <div className="flex items-start gap-6">
                 <div className="w-14 h-14 bg-stone-900 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                 </div>
                 <div>
                    <h4 className="font-black uppercase tracking-widest text-xs text-stone-400 mb-2">Xưởng Sản Xuất</h4>
                    <p className="text-stone-900 font-bold">Thanh Đa - Phúc Thọ - Hà Nội</p>
                 </div>
              </div>

              <div className="flex items-start gap-6">
                 <div className="w-14 h-14 bg-stone-900 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                 </div>
                 <div>
                    <h4 className="font-black uppercase tracking-widest text-xs text-stone-400 mb-2">Đường dây nóng</h4>
                    <p className="text-stone-900 font-bold">0966.245.396</p>
                    <p className="text-stone-400 text-sm">Hỗ trợ 24/7 cả ngày lễ</p>
                 </div>
              </div>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="bg-stone-50 rounded-[3rem] p-12 border border-stone-100 shadow-sm">
             <h3 className="text-2xl font-black text-stone-900 uppercase tracking-tight mb-8">Gửi yêu cầu tư vấn</h3>
             
             {success ? (
               <div className="py-20 text-center">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <h4 className="text-2xl font-black text-stone-900 uppercase mb-4">Gửi thành công!</h4>
                  <p className="text-stone-500 font-medium mb-10">Cảm ơn bạn đã quan tâm. NV Homes sẽ liên hệ lại trong thời gian sớm nhất.</p>
                  <button onClick={() => setSuccess(false)} className="text-red-500 font-black uppercase text-sm tracking-widest">Gửi yêu cầu khác</button>
               </div>
             ) : (
               <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-4">Họ và tên *</label>
                       <input 
                         type="text" 
                         required
                         className="w-full px-6 py-4 rounded-2xl bg-white border-none text-stone-900 font-bold focus:ring-4 focus:ring-red-500/10 placeholder:text-stone-200"
                         placeholder="Vd: Nguyễn Văn A"
                         value={formData.name}
                         onChange={e => setFormData({...formData, name: e.target.value})}
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-4">Số điện thoại *</label>
                       <input 
                         type="tel" 
                         required
                         className="w-full px-6 py-4 rounded-2xl bg-white border-none text-stone-900 font-bold focus:ring-4 focus:ring-red-500/10 placeholder:text-stone-200"
                         placeholder="Vd: 0966..."
                         value={formData.phone}
                         onChange={e => setFormData({...formData, phone: e.target.value})}
                       />
                    </div>
                  </div>

                  <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-4">Nhu cầu cụ thể</label>
                      <textarea 
                        rows={4}
                        className="w-full px-6 py-4 rounded-2xl bg-white border-none text-stone-900 font-bold focus:ring-4 focus:ring-red-500/10 placeholder:text-stone-200 resize-none"
                        placeholder="Vd: Tôi muốn tư vấn thiết kế nội thất chung cư 3 phòng ngủ..."
                        value={formData.message}
                        onChange={e => setFormData({...formData, message: e.target.value})}
                      />
                  </div>

                  {error && <p className="text-red-500 text-xs font-bold text-center">{error}</p>}

                  <button 
                    disabled={submitting}
                    className="w-full py-6 bg-stone-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
                  >
                    {submitting ? (
                      <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Đang gửi...</>
                    ) : "Gửi thông tin ngay"}
                  </button>
               </form>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
