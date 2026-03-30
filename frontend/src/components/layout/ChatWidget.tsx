"use client";

import { useState, useEffect } from "react";
import { api } from "@/services/api";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [messages, setMessages] = useState<{ text: string, isBot: boolean }[]>([
    { text: "Dạ vâng, để tiện xưng hô và hỗ trợ, anh/chị vui lòng nhập số điện thoại giúp em nhé!", isBot: true }
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSendPhone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    
    setMessages(prev => [...prev, { text: phone, isBot: false }]);
    setSubmitting(true);
    
    try {
      await api.post("/customers", {
        phoneNumber: phone,
        name: "Khách từ Chat",
        source: "Chat"
      });
      setIsSaved(true);
      setMessages(prev => [...prev, { 
        text: "Cảm ơn anh/chị! Chuyên viên của NV Homes sẽ gọi lại ngay lập tức qua số " + phone + ".", 
        isBot: true 
      }]);
    } catch {
      setMessages(prev => [...prev, { text: "Có lỗi xảy ra. Bạn vui lòng gọi hotline 0966.245.396 nhé!", isBot: true }]);
    } finally {
      setSubmitting(false);
      setPhone("");
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[90] flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 mr-16 w-72 md:w-80 bg-white rounded-[1.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.2)] overflow-hidden border border-stone-100 animate-in slide-in-from-bottom-10 duration-500">
           <div className="bg-stone-900 p-4 text-white flex justify-between items-center">
              <div>
                <h4 className="font-black uppercase tracking-tighter text-sm">Chuyên viên tư vấn</h4>
                <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">Hotline: 0966.245.396</p>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-stone-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
           </div>
           
           <div className="h-56 overflow-y-auto p-4 space-y-3 bg-stone-50">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.isBot ? 'justify-start' : 'justify-end'}`}>
                   <div className={`max-w-[80%] p-4 rounded-2xl text-sm font-medium shadow-sm ${m.isBot ? 'bg-white text-stone-900 rounded-tl-none border border-stone-100' : 'bg-red-500 text-white rounded-tr-none'}`}>
                     {m.text}
                   </div>
                </div>
              ))}
           </div>
           
           {!isSaved && (
             <form onSubmit={handleSendPhone} className="p-4 bg-white border-t border-stone-100 flex gap-2">
                <input
                  type="tel"
                  placeholder="Nhập số điện thoại..."
                  className="flex-1 px-4 py-3 bg-stone-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-red-500/20"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  disabled={submitting}
                />
                <button 
                  type="submit"
                  disabled={submitting}
                  className="bg-red-500 text-white p-3 rounded-xl hover:bg-red-600 transition-colors shadow-lg active:scale-95 disabled:opacity-50"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
             </form>
           )}
        </div>
      )}

      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-4 bg-white hover:bg-stone-50 text-stone-900 px-8 py-5 rounded-full shadow-2xl border border-stone-100 transition-all hover:scale-105 active:scale-95 group"
      >
        <span className="text-sm font-black uppercase tracking-widest">Chat với tư vấn viên!</span>
        <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg group-hover:rotate-12 transition-transform">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
        </div>
      </button>
    </div>
  );
}
