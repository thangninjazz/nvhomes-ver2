"use client";

import { useState } from "react";
import { api } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Phone, MapPin, CheckCircle2, ChevronRight } from "lucide-react";

export function ContactForm() {
  const [form, setForm] = useState({ name: "", phone: "", address: "", needs: "" });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await api.post("/customers", {
        phoneNumber: form.phone,
        name: form.name,
        source: "LandingPage"
      });
      setSuccess(true);
    } catch {
      setError("Gửi thất bại. Vui lòng thử lại hoặc gọi hotline 0966.245.396.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 lg:py-32 bg-stone-900 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute bottom-0 right-0 w-full h-[60%] bg-gradient-to-t from-red-500/10 to-transparent pointer-events-none" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-red-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:items-center">
          {/* Text Content */}
          <div className="text-white">
            <p className="text-sm tracking-[0.3em] uppercase text-red-500 mb-6 font-bold">Liên hệ ngay</p>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-7xl mb-8 leading-tight text-balance uppercase font-light">
              Bạn Đã <span className="italic font-normal">Sẵn Sàng</span> <br /> Thay Đổi?
            </h2>
            <p className="text-stone-400 text-lg md:text-xl leading-relaxed mb-12 max-w-xl">
              Để lại thông tin, chuyên gia của NV Homes sẽ liên hệ tư vấn và khảo sát hiện trạng miễn phí cho bạn trong vòng 24h.
            </p>

            <div className="space-y-8">
              <div className="flex items-center gap-6 group">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-red-500 group-hover:border-red-500 transition-all duration-300">
                  <Phone className="w-6 h-6 text-red-500 group-hover:text-white" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-stone-500 uppercase tracking-widest mb-1">Hotline 24/7</p>
                  <p className="text-2xl font-serif tracking-tight group-hover:text-red-500 transition-colors">0966.245.396</p>
                </div>
              </div>
              <div className="flex items-center gap-6 group">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-red-500 group-hover:border-red-500 transition-all duration-300">
                  <MapPin className="w-6 h-6 text-red-500 group-hover:text-white" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-stone-500 uppercase tracking-widest mb-1">Xưởng sản xuất</p>
                  <p className="text-lg font-serif tracking-tight text-stone-300">Thanh Đa — Phúc Thọ — Hà Nội</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="bg-white/5 backdrop-blur-md rounded-[2.5rem] p-10 lg:p-14 border border-white/10 shadow-2xl relative overflow-hidden">
            {success ? (
              <div className="text-center py-12 animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-500/30">
                  <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>
                <h3 className="font-serif text-3xl text-white mb-4 uppercase tracking-tight">Gửi Thành Công!</h3>
                <p className="text-stone-400 mb-10">Chúng tôi sẽ liên hệ tư vấn cho bạn vào thời gian sớm nhất.</p>
                <Button 
                  onClick={() => setSuccess(false)}
                  variant="outline"
                  className="rounded-full border-white/20 text-white hover:bg-white/10"
                >
                  Gửi lại yêu cầu
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <input
                      type="text"
                      className="w-full bg-stone-800/50 border border-white/5 rounded-2xl px-6 py-5 text-white placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-red-600 transition-all font-medium"
                      placeholder="Họ & Tên *"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <input
                      type="tel"
                      className="w-full bg-stone-800/50 border border-white/5 rounded-2xl px-6 py-5 text-white placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-red-600 transition-all font-medium"
                      placeholder="Số Điện Thoại *"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                  </div>
                </div>
                <input
                  type="text"
                  className="w-full bg-stone-800/50 border border-white/5 rounded-2xl px-6 py-5 text-white placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-red-600 transition-all font-medium"
                  placeholder="Địa chỉ dự án"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                />
                <textarea
                  className="w-full bg-stone-800/50 border border-white/5 rounded-2xl px-6 py-5 text-white placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all font-medium min-h-[120px] resize-none"
                  placeholder="Nhu cầu: Vd: Thiết kế căn hộ 3 phòng ngủ, nội thất gỗ tự nhiên..."
                  value={form.needs}
                  onChange={(e) => setForm({ ...form, needs: e.target.value })}
                />
                
                {error && <p className="text-red-500 text-sm font-bold">{error}</p>}

                <Button 
                  type="submit"
                  disabled={submitting}
                  className="w-full py-8 text-lg rounded-2xl bg-red-500 text-white hover:bg-red-600 shadow-2xl transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50"
                >
                  {submitting ? "Đang gửi..." : "Đăng Ký Tư Vấn Miễn Phí"}
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
                
                <p className="text-center text-stone-500 text-xs mt-6">
                  Chúng tôi bảo mật 100% thông tin khách hàng.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
