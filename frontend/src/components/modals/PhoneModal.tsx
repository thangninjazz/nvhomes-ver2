"use client";

import { useState } from "react";
import { api } from "@/services/api";

interface PhoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  source: string;
  productId?: string;
  onSuccess?: () => void;
}

export default function PhoneModal({ isOpen, onClose, title, source, productId, onSuccess }: PhoneModalProps) {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await api.post("/customers", {
        phoneNumber: phone,
        name: name || "Ẩn danh",
        source: source, // 'Cart', 'Consultation', 'Chat', 'Contact'
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setPhone("");
        setName("");
        onClose();
        if (onSuccess) onSuccess();
      }, 2000);
    } catch {
      setError("Có lỗi xảy ra, vui lòng thử lại sau.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden relative shadow-2xl animate-in fade-in zoom-in duration-300">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-stone-400 hover:text-stone-900 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className="p-10">
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
          </div>

          <h3 className="text-2xl font-black text-stone-900 uppercase tracking-tight mb-2">{title}</h3>
          <p className="text-stone-500 mb-8 font-medium">Vui lòng để lại số điện thoại, chúng tôi sẽ liên hệ tư vấn ngay cho bạn!</p>

          {success ? (
            <div className="text-center py-6">
               <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
               </div>
               <p className="text-green-600 font-bold">Gửi thành công! Cảm ơn bạn.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Họ và tên"
                className="w-full px-6 py-4 bg-stone-50 border-none rounded-2xl focus:ring-4 focus:ring-red-500/10 placeholder:text-stone-400 font-bold text-stone-900 transition-all text-sm"
                value={name}
                onChange={e => setName(e.target.value)}
              />
              <input
                type="tel"
                placeholder="Số điện thoại *"
                required
                className="w-full px-6 py-4 bg-stone-100 border-none rounded-2xl focus:ring-4 focus:ring-red-500/10 placeholder:text-stone-500 font-black text-stone-900 transition-all text-lg"
                value={phone}
                onChange={e => setPhone(e.target.value)}
              />
              {error && <p className="text-red-500 text-xs font-bold">{error}</p>}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-5 bg-red-500 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-red-500/20 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Đang xử lý...</>
                ) : "Xác nhận ngay"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
