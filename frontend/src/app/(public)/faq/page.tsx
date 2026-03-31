"use client";

import { useState } from "react";
import { Plus, Minus, HelpCircle, MessageCircle } from "lucide-react";

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "Quy trình làm việc của NV Homes như thế nào?",
      answer: "Quy trình gồm 5 bước: (1) Khảo sát & Tư vấn miễn phí, (2) Thiết kế 3D & Kỹ thuật, (3) Sản xuất tại xưởng, (4) Thi công lắp đặt tại nhà, (5) Nghiệm thu & Bảo trì."
    },
    {
      question: "NV Homes có xưởng sản xuất trực tiếp không?",
      answer: "Có, chúng tôi sở hữu xưởng sản xuất trực tiếp quy mô 1000m2 tại Thanh Đa - Phúc Thọ - Hà Nội, giúp khách hàng tiết kiệm 20-30% chi phí trung gian và đảm bảo tiến độ."
    },
    {
      question: "Thời gian hoàn thiện một công trình thường là bao lâu?",
      answer: "Thông thường từ 15-25 ngày làm việc tùy thuộc vào khối lượng công trình và độ phức tạp của thiết kế."
    },
    {
      question: "NV Homes sử dụng chất liệu gỗ gì?",
      answer: "Chúng tôi chuyên sử dụng gỗ công nghiệp cao cấp (An Cường, Minh Long) và các loại gỗ tự nhiên nhập khẩu (Sồi, Óc Chó, Tần Bì) theo tiêu chuẩn chất lượng cao nhất."
    },
    {
      question: "Có mất phí thiết kế 3D không?",
      answer: "Nếu khách hàng ký hợp đồng thi công trọn gói, NV Homes sẽ hoàn trả 100% chi phí thiết kế ban đầu cho quý khách."
    }
  ];

  return (
    <div className="bg-stone-50 min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-16">
           <div className="inline-flex items-center gap-2 bg-red-100 text-red-500 px-4 py-1.5 rounded-full mb-6">
              <HelpCircle className="w-4 h-4" />
              <span className="text-xs font-black uppercase tracking-widest">Hỏi đáp</span>
           </div>
           <h1 className="text-4xl md:text-5xl font-black text-stone-900 mb-6 uppercase tracking-tighter">
             Câu Hỏi <span className="text-red-500">Thường Gặp</span>
           </h1>
           <p className="text-stone-500 font-medium text-lg">
             Tìm thấy câu trả lời nhanh nhất cho những thắc mắc phổ biến về dịch vụ nội thất.
           </p>
        </div>

        <div className="space-y-4">
           {faqs.map((faq, index) => (
             <div 
               key={index} 
               className={`bg-white border rounded-3xl transition-all duration-300 ${openIndex === index ? 'border-red-500/20 shadow-xl' : 'border-stone-100 hover:border-red-500/30 shadow-sm'}`}
             >
               <button 
                 onClick={() => setOpenIndex(openIndex === index ? null : index)}
                 className="w-full text-left p-6 md:p-8 flex items-center justify-between group"
               >
                 <span className={`text-lg font-bold transition-colors ${openIndex === index ? 'text-stone-900' : 'text-stone-700 group-hover:text-red-500'}`}>
                   {faq.question}
                 </span>
                 <div className={`p-2 rounded-full transition-colors ${openIndex === index ? 'bg-red-500 text-white' : 'bg-stone-50 text-stone-400 group-hover:bg-red-100 group-hover:text-red-500'}`}>
                    {openIndex === index ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                 </div>
               </button>
               
               {openIndex === index && (
                 <div className="px-6 md:px-8 pb-8 animate-in fade-in slide-in-from-top-2">
                    <div className="h-px bg-stone-100 mb-6"></div>
                    <p className="text-stone-500 font-medium leading-relaxed m-0">{faq.answer}</p>
                 </div>
               )}
             </div>
           ))}
        </div>

        <div className="mt-20 p-12 bg-white rounded-[2.5rem] border border-stone-100 shadow-sm text-center">
           <MessageCircle className="w-12 h-12 text-red-500 mx-auto mb-6" />
           <h3 className="text-2xl font-black text-stone-900 mb-4 tracking-tight">Vẫn còn thắc mắc khác?</h3>
           <p className="text-stone-500 font-medium mb-10 max-w-sm mx-auto">
             Chúng tôi luôn sẵn sàng trả lời mọi câu hỏi của bạn qua Zalo hoặc điện thoại trực tiếp.
           </p>
           <div className="flex flex-col sm:flex-row justify-center gap-4">
             <a href="https://zalo.me/0966245396" className="bg-[#0068ff] text-white px-8 py-4 rounded-full font-bold shadow-lg hover:opacity-90 transition-all">Zalo: 0966.245.396</a>
             <a href="tel:0966245396" className="bg-stone-900 text-white px-8 py-4 rounded-full font-bold shadow-lg hover:bg-stone-800 transition-all tracking-wide">Gọi trực tiếp</a>
           </div>
        </div>
      </div>
    </div>
  );
}
