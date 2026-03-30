"use client";

import { ClipboardCheck, PencilRuler, Hammer, Home } from "lucide-react";

const steps = [
  {
    icon: ClipboardCheck,
    title: "Khảo Sát & Tư Vấn",
    description: "Chuyên gia của NV Homes sẽ đến trực tiếp khảo sát hiện trạng và tư vấn giải pháp tối ưu nhất cho không gian của bạn.",
  },
  {
    icon: PencilRuler,
    title: "Thiết Kế 3D",
    description: "Kiến trúc sư sẽ hiện thực hóa ý tưởng của bạn qua bản vẽ 3D sắc nét, giúp bạn hình dung ngôi nhà tương lai.",
  },
  {
    icon: Hammer,
    title: "Thi Công Hoàn Thiện",
    description: "Đội ngũ thợ tay nghề cao từ xưởng sản xuất trực tiếp thi công, lắp đặt với độ chính xác và thẩm mỹ cao nhất.",
  },
  {
    icon: Home,
    title: "Bàn Giao & Bảo Hành",
    description: "Chúng tôi bàn giao không gian sống hoàn hảo và cam kết bảo hành dài hạn, đồng hành cùng tổ ấm của bạn.",
  },
];

export function Process() {
  return (
    <section className="py-24 lg:py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <p className="text-sm tracking-[0.3em] uppercase text-red-500 mb-4 font-bold">Quy trình làm việc</p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-stone-900 leading-tight">
            Từ Ý Tưởng Đến <span className="italic font-light">Tổ Ấm</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px bg-stone-100 -translate-y-12 z-0" />
          
          {steps.map((step, index) => (
            <div key={index} className="relative z-10 group text-center">
              <div className="w-24 h-24 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-stone-100 group-hover:bg-stone-900 group-hover:text-white transition-all duration-500 transform group-hover:-translate-y-2 group-hover:scale-110 shadow-sm">
                <step.icon className="w-10 h-10" />
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold border-2 border-white">
                  0{index + 1}
                </div>
              </div>
              <h3 className="font-serif text-xl mb-4 text-stone-900 uppercase tracking-tight group-hover:text-red-500 transition-colors">
                {step.title}
              </h3>
              <p className="text-stone-500 text-sm leading-relaxed font-medium px-4">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
