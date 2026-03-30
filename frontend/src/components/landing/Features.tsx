"use client";

import { Shield, Factory, Pencil, Sparkles, Clock, CheckCircle2 } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Vật Liệu Chuẩn An Cường",
    description: "Chúng tôi cam kết 100% sử dụng ván gỗ công nghiệp An Cường cao cấp, đảm bảo độ bền và an toàn sức khỏe cho cả gia đình.",
    highlight: "Cam kết đền 200% nếu phát hiện gỗ giả",
  },
  {
    icon: Factory,
    title: "Xưởng Sản Xuất Trực Tiếp",
    description: "Sở hữu xưởng quy mô lớn tại Thanh Đa - Phúc Thọ, NV Homes giúp bạn tiết kiệm tới 30% chi phí do không qua trung gian.",
    highlight: "Quản lý khép kín, đảm bảo đúng tiến độ",
  },
  {
    icon: Pencil,
    title: "Thiết Kế Độc Bản",
    description: "Đội ngũ KTS dày dặn kinh nghiệm luôn lắng nghe và hiện thực hóa phong cách cá nhân của bạn vào từng góc nhỏ ngôi nhà.",
    highlight: "Báo giá chi tiết, tuyệt đối không phát sinh",
  },
];

const stats = [
  { value: "500+", label: "Dự án hoàn thành" },
  { value: "10+", label: "Năm kinh nghiệm" },
  { value: "100%", label: "Khách hàng hài lòng" },
  { value: "30%", label: "Chi phí tiết kiệm" },
];

export function Features() {
  return (
    <section className="py-24 lg:py-32 bg-white relative overflow-hidden">
      {/* Subtle Background Decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-stone-50 rounded-full blur-3xl -mr-48 -mt-48 opacity-50" />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <p className="text-sm tracking-[0.3em] uppercase text-red-500 mb-4 font-bold">Tại sao chọn NV Homes</p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-6 text-balance text-stone-900 leading-tight">
            Giải Pháp <span className="italic font-light">Trọn Gói</span> Hoàn Hảo
          </h2>
          <p className="text-stone-500 max-w-2xl mx-auto text-lg leading-relaxed font-medium">
            Chúng tôi mang đến giải pháp nội thất toàn diện, từ thiết kế đến thi công với cam kết chất lượng cao nhất trực tiếp từ xưởng sản xuất.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12 mb-24">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="group p-10 bg-stone-50 border border-stone-100 hover:border-red-500/20 hover:bg-white hover:shadow-2xl transition-all duration-500 rounded-2xl"
            >
              <div className="w-16 h-16 bg-white shadow-sm flex items-center justify-center mb-8 rounded-2xl group-hover:bg-red-500 group-hover:text-white transition-all duration-300 group-hover:-translate-y-2">
                <feature.icon className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-2xl mb-4 text-stone-900 uppercase tracking-tight">{feature.title}</h3>
              <p className="text-stone-500 leading-relaxed mb-6 font-medium">{feature.description}</p>
              
              <div className="flex items-center gap-2 pt-6 border-t border-stone-200/60">
                <CheckCircle2 className="w-4 h-4 text-red-500" />
                <p className="text-xs font-bold text-stone-900 uppercase tracking-wider">{feature.highlight}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-16 border-t border-stone-100">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <p className="font-serif text-5xl lg:text-6xl mb-2 text-stone-900">{stat.value}</p>
              <p className="text-xs text-stone-400 tracking-[0.2em] uppercase font-bold">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
