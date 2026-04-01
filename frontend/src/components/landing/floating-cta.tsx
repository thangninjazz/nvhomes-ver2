"use client"

import { useState } from "react"
import { Phone, MessageSquare, User, X, Send } from "lucide-react"
import { api } from "@/services/api"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"

export function FloatingCTA() {
  const [isOpen, setIsOpen] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [phone, setPhone] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [phoneError, setPhoneError] = useState("")

  const [phoneSubmitted, setPhoneSubmitted] = useState("")

  const handleSubmitPhone = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const validatePhone = (p: string) => {
      const regex = /^(0|84)(3|5|7|8|9)[0-9]{8}$|^(0|84)2[0-9]{9}$/;
      return regex.test(p.replace(/\s/g, ""));
    };

    if (!validatePhone(phone)) {
      setPhoneError("Số điện thoại không hợp lệ. Vui lòng nhập lại.")
      return
    }

    setPhoneError("")
    const decodeHtml = (html: string) => {
      if (typeof document === 'undefined') return html;
      const txt = document.createElement("textarea");
      txt.innerHTML = html;
      return txt.value.replace(/\u00a0/g, ' ').replace(/&nbsp;/g, ' ');
    };

    setIsSubmitting(true)
    try {
      await api.post("/customers", {
        name: decodeHtml("Khách hàng từ LiveChat"),
        phoneNumber: phone.replace(/\s/g, ""),
        address: decodeHtml("Live Chat Source"),
        note: decodeHtml("Gửi số điện thoại từ khung chat tư vấn")
      })
      setPhoneSubmitted(phone)
      setIsSubmitted(true)
      toast.success("Cảm ơn anh/chị! Chuyên viên của NV Homes sẽ gọi lại ngay lập tức.")
      setTimeout(() => {
        setIsChatOpen(false)
        setIsSubmitted(false)
        setPhone("")
      }, 5000)
    } catch (err) {
      console.error("Error submitting phone:", err)
      toast.error("Đã có lỗi xảy ra, vui lòng thử lại sau.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed bottom-8 right-8 z-[60] flex flex-col gap-4 items-end pointer-events-none">
      {/* Chat Window */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-background border border-border shadow-2xl rounded-2xl w-80 mb-4 overflow-hidden pointer-events-auto"
          >
            <div className="bg-primary p-4 flex items-center justify-between text-primary-foreground">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold">Tư vấn viên NV Home</p>
                  <p className="text-[10px] opacity-80">Đang trực tuyến</p>
                </div>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="hover:bg-white/10 p-1 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              {!isSubmitted ? (
                <>
                  <div className="bg-muted p-4 rounded-2xl rounded-tl-none mb-6">
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      Dạ vâng, để tiện xưng hô và hỗ trợ, anh/chị vui lòng nhập số điện thoại giúp em nhé!
                    </p>
                  </div>
                  
                  <form onSubmit={handleSubmitPhone} className="space-y-3">
                    <div className="relative">
                        <input
                          type="tel"
                          placeholder="Số điện thoại của anh/chị..."
                          value={phone}
                          onChange={(e) => {
                            setPhone(e.target.value);
                            if (phoneError) setPhoneError("");
                          }}
                          className={`w-full bg-muted border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary transition-all outline-none ${phoneError ? 'ring-1 ring-red-500' : ''}`}
                          disabled={isSubmitting}
                        />
                        {phoneError && <p className="text-[10px] font-bold text-red-500 mt-1 ml-1 animate-in fade-in slide-in-from-top-1 duration-200">{phoneError}</p>}
                      </div>
                    <Button 
                      type="submit" 
                      className="w-full rounded-xl py-6 font-bold uppercase tracking-widest text-xs h-12"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Đang gửi..." : "Gửi thông tin"}
                      <Send className="w-4 h-4 ml-2" />
                    </Button>
                  </form>
                </>
              ) : (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden">
                    <Send className="w-8 h-8" />
                  </div>
                  <p className="font-bold text-foreground text-sm px-2">Cảm ơn anh/chị!</p>
                  <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
                    Chuyên viên của NV Homes sẽ gọi lại ngay lập tức qua số <span className="text-primary font-bold">{phoneSubmitted}</span>
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sub-Buttons Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            className="flex flex-col gap-3 items-end pointer-events-none mb-2"
          >
            {/* Chat TVV */}
            <button
              onClick={() => { setIsChatOpen(true); setIsOpen(false); }}
              className="group flex items-center gap-3 pointer-events-auto"
            >
              <span className="bg-stone-800 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-xl uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                Chat với tư vấn viên
              </span>
              <div className="w-12 h-12 bg-stone-800 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                <User className="w-6 h-6" />
              </div>
            </button>

            {/* Zalo */}
            <a
              href="https://zalo.me/0966245396"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 pointer-events-auto"
            >
              <span className="bg-[#0068ff] text-white text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-xl uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                Zalo: 0966.245.396
              </span>
              <div className="w-12 h-12 bg-[#0068ff] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform relative overflow-hidden border border-white/20">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/9/91/Icon_of_Zalo.svg" 
                  alt="Zalo" 
                  className="w-7 h-7 object-contain"
                />
              </div>
            </a>

            {/* Call */}
            <a
              href="tel:0966245396"
              className="group flex items-center gap-3 pointer-events-auto"
            >
              <span className="bg-red-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-xl uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                Gọi ngay: 0966.245.396
              </span>
              <div className="w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                <Phone className="w-6 h-6" />
              </div>
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Trigger Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className={`h-16 px-6 rounded-full flex items-center gap-3 shadow-2xl transition-all duration-300 group relative pointer-events-auto ${
          isOpen ? "bg-stone-800 scale-95" : "bg-primary hover:scale-105"
        }`}
      >
        <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-20 group-hover:opacity-40" />
        {isOpen ? (
          <X className="w-8 h-8 text-white transition-all transform rotate-0 hover:rotate-90" />
        ) : (
          <>
            <MessageSquare className="w-8 h-8 text-primary-foreground drop-shadow-lg" />
            <span className="text-primary-foreground font-black tracking-[0.2em] text-sm uppercase">Liên hệ</span>
          </>
        )}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-600 border-2 border-background text-white text-[11px] font-black flex items-center justify-center rounded-full animate-bounce shadow-lg">
            1
          </span>
        )}
      </button>

      <style jsx>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        .animate-bounce {
          animation: bounce 2s infinite;
        }
      `}</style>
    </div>
  )
}
