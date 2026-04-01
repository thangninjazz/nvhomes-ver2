"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, CheckCircle2, ChevronDown, Sparkles } from "lucide-react";
import { api } from "@/services/api";
import { Button } from "@/components/ui/button";

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES = [
  "Trọn Gói (Thi công toàn bộ)",
  "Tủ Bếp Nhựa Đặc, Cánh Acrylic",
  "Tủ Bếp Inox Cánh Kính",
  "Vách Tivi / Phòng Khách",
  "Phòng Ngủ / Tủ Quần Áo",
  "Thiết Kế Riêng Theo Yêu Cầu",
];

export function ConsultationModal({ isOpen, onClose }: ConsultationModalProps) {
  const [form, setForm] = useState({ 
    name: "", 
    phone: "", 
    address: "", 
    category: CATEGORIES[0] 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const validatePhone = (p: string) => {
    const regex = /^(0|84)(3|5|7|8|9)[0-9]{8}$|^(0|84)2[0-9]{9}$/;
    return regex.test(p.replace(/\s/g, ""));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validatePhone(form.phone)) {
      setError("Số điện thoại không hợp lệ. Vui lòng nhập lại.");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post("/customers", {
        name: form.name,
        phoneNumber: form.phone.replace(/\s/g, ""),
        address: form.address,
        note: `HẠNG MỤC: ${form.category}`,
        source: "PopUp_Quote"
      });
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
        setForm({ name: "", phone: "", address: "", category: CATEGORIES[0] });
      }, 5000);
    } catch {
      setError("Gửi yêu cầu thất bại. Vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-stone-900/60 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden pointer-events-auto"
          >
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 bg-stone-100 hover:bg-stone-200 rounded-full transition-colors z-20"
            >
              <X className="w-5 h-5 text-stone-500" />
            </button>

            <div className="flex flex-col md:flex-row h-full">
              {/* Left Side: Professional Incentives */}
              <div className="hidden md:flex md:w-[35%] bg-stone-900 p-10 flex-col justify-center text-white relative border-r border-white/5">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-[url('/images/pattern.png')] bg-repeat" />
                
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500 mb-6">Đặc quyền NVHome</p>
                
                <div className="space-y-8 relative z-10">
                  <div className="flex flex-col gap-1">
                    <span className="text-xl font-serif text-white/40 italic">01.</span>
                    <h4 className="text-lg font-black uppercase tracking-tight leading-tight">Miễn phí<br/><span className="text-red-500">Thiết kế 3D</span></h4>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xl font-serif text-white/40 italic">02.</span>
                    <h4 className="text-lg font-black uppercase tracking-tight leading-tight">Khảo sát &<br/><span className="text-amber-500 font-serif lowercase italic font-normal text-2xl">Đo đạc</span> tại công trình</h4>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xl font-serif text-white/40 italic">03.</span>
                    <h4 className="text-lg font-black uppercase tracking-tight leading-tight text-white/60 lowercase font-medium">Báo giá chi tiết 24h</h4>
                  </div>
                </div>
              </div>

              {/* Right Side: Form */}
              <div className="flex-1 p-8 md:p-12">
                {isSuccess ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-6 shadow-sm">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-black text-stone-900 uppercase tracking-tight mb-2">Đăng Ký Thành Công!</h3>
                    <p className="text-stone-500 font-medium text-sm px-6">NV Homes sẽ liên hệ tư vấn và gửi báo giá cho quý khách sớm nhất có thể.</p>
                  </div>
                ) : (
                  <div className="flex flex-col h-full">
                    <div className="mb-10 text-center md:text-left animate-in fade-in slide-in-from-top-4 duration-700">
                        <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                           <Sparkles className="w-4 h-4 text-red-600 animate-pulse shrink-0" />
                           <span className="text-[11px] font-black uppercase tracking-[0.2em] text-red-600">Ưu đãi hôm nay</span>
                        </div>
                        
                        <h3 className="text-2xl sm:text-4xl font-black text-stone-900 uppercase tracking-tighter leading-[1.1] mb-4 text-balance">
                          Miễn phí <span className="text-red-500">Thiết kế 3d</span>, <br className="hidden sm:block" /> Đo đạc tận nơi
                        </h3>
                        
                        <p className="text-stone-400 text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em] leading-relaxed max-w-sm mx-auto md:mx-0">
                          Đăng ký để chuyên viên <span className="text-stone-900">NVHomes</span> liên hệ trong <span className="text-stone-900">15 phút</span>
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      {/* Category Selector */}
                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-widest text-stone-400 ml-4">Hạng mục quan tâm *</label>
                        <div className="relative group">
                          <select
                            required
                            className="w-full bg-stone-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-stone-900 focus:ring-4 focus:ring-stone-100 transition-all appearance-none cursor-pointer outline-none"
                            value={form.category}
                            onChange={(e) => setForm({ ...form, category: e.target.value })}
                          >
                            {CATEGORIES.map(cat => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 group-hover:text-stone-900 transition-colors pointer-events-none" />
                        </div>
                      </div>

                      {/* Họ tên */}
                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-widest text-stone-400 ml-4">Họ và tên *</label>
                        <input
                          type="text"
                          required
                          placeholder="Vd: Nguyễn Văn A"
                          className="w-full bg-stone-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-stone-900 focus:ring-4 focus:ring-stone-100 transition-all outline-none placeholder:text-stone-300"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                        />
                      </div>

                      {/* Thông tin liên hệ Side-by-Side on Desktop */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[9px] font-black uppercase tracking-widest text-stone-400 ml-4">Số điện thoại *</label>
                          <input
                            type="tel"
                            required
                            placeholder="Vd: 0912..."
                            className={`w-full bg-stone-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-stone-900 focus:ring-4 transition-all outline-none ${error && error.includes("điện thoại") ? 'ring-2 ring-red-500' : 'focus:ring-stone-100'}`}
                            value={form.phone}
                            onChange={(e) => {
                                setForm({ ...form, phone: e.target.value });
                                if (error) setError("");
                            }}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-black uppercase tracking-widest text-stone-400 ml-4">Địa chỉ dự án</label>
                          <input
                            type="text"
                            placeholder="Vd: Hà Đông, Hà Nội..."
                            className="w-full bg-stone-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-stone-900 focus:ring-4 focus:ring-stone-100 transition-all outline-none placeholder:text-stone-300"
                            value={form.address}
                            onChange={(e) => setForm({ ...form, address: e.target.value })}
                          />
                        </div>
                      </div>

                      {/* Error Display */}
                      {error && (
                        <p className="text-[10px] font-black text-red-500 uppercase tracking-widest ml-4 animate-in fade-in slide-in-from-left-2 duration-300">
                          ⚠ {error}
                        </p>
                      )}

                      {/* Submit Button */}
                      <div className="pt-4">
                        <Button
                          disabled={isSubmitting}
                          className="w-full py-8 bg-stone-900 text-white rounded-[1.5rem] font-black uppercase tracking-widest shadow-xl hover:bg-black transition-all group active:scale-95 disabled:opacity-50"
                        >
                          {isSubmitting ? "Đang xử lý..." : "Đăng Ký Nhận Ưu Đãi Ngay"}
                          <Send className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-all" />
                        </Button>
                      </div>
                      
                      <p className="text-center text-stone-400 text-[9px] font-bold uppercase tracking-widest">NV Homes Bảo mật 100% dữ liệu khách hàng</p>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
