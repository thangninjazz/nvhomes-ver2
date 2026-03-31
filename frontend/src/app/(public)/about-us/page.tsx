"use client";

import Link from "next/link";
import { Users, Target, Heart, Award } from "lucide-react";

export default function AboutUsPage() {
  return (
    <div className="bg-white min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-4">
        {/* Story Section */}
        <div className="max-w-4xl mx-auto text-center mb-24">
          <h1 className="text-5xl md:text-7xl font-black text-stone-900 mb-8 uppercase tracking-tighter">
            Về Chúng <span className="text-red-500">Tôi</span>
          </h1>
          <p className="text-xl md:text-2xl text-stone-500 font-medium leading-relaxed">
            NV Homes khởi nguồn từ niềm đam mê kiến tạo những không gian sống đích thực, kết hợp tinh hoa thủ công truyền thống và công nghệ nội thất hiện đại.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center mb-32">
          <div className="order-2 md:order-1">
             <h2 className="text-4xl font-black text-stone-900 mb-8 leading-tight">Sứ Mệnh Của NV Homes</h2>
             <p className="text-stone-600 text-lg mb-6 leading-relaxed font-medium">
               Không chỉ dừng lại ở việc đóng những món đồ nội thất đẹp, sứ mệnh của chúng tôi là tạo ra "Tổ ấm" - nơi mỗi thành viên trong gia đình cảm thấy thực sự thư thái và tự hào khi trở về. 
             </p>
             <p className="text-stone-600 text-lg leading-relaxed font-medium">
               Chúng tôi cam kết sử dụng những nguồn vật liệu sạch, an toàn cho sức khỏe và quy trình sản xuất bền vững để bảo vệ môi trường và cộng đồng.
             </p>
          </div>
          <div className="order-1 md:order-2 aspect-video rounded-[3rem] overflow-hidden shadow-2xl relative">
             <img 
               src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1000" 
               alt="Modern Interior" 
               className="w-full h-full object-cover"
             />
             <div className="absolute inset-0 bg-red-500/10 mix-blend-multiply"></div>
          </div>
        </div>

        {/* Pillars Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-32">
           {[
             { icon: Heart, title: "Tận Tâm", desc: "Luôn đặt lợi ích và mong muốn của khách hàng lên hàng đầu trong mọi quyết định." },
             { icon: Target, title: "Chính Xác", desc: "Sản xuất chuẩn xác từng mm dựa trên bản vẽ kỹ thuật chi tiết nhất." },
             { icon: Users, title: "Đồng Hành", desc: "Hỗ trợ khách hàng trước, trong và sau khi hoàn thiện công trình trọn đời." },
             { icon: Award, title: "Chất Lượng", desc: "Chỉ sử dụng vật liệu từ các thương hiệu uy tín hàng đầu như An Cường, Hafele." }
           ].map((item, i) => (
             <div key={i} className="group p-10 bg-stone-50 rounded-[2.5rem] border border-stone-100 hover:bg-stone-900 hover:text-white transition-all duration-500 hover:-translate-y-2">
                <item.icon className="w-12 h-12 text-red-500 mb-6 group-hover:scale-110 transition-transform" />
                <h4 className="text-xl font-black mb-4 uppercase tracking-wider">{item.title}</h4>
                <p className="text-stone-500 group-hover:text-stone-300 font-medium leading-relaxed">{item.desc}</p>
             </div>
           ))}
        </div>

        {/* Vision Section */}
        <div className="bg-stone-900 rounded-[4rem] p-12 md:p-24 relative overflow-hidden text-center">
           <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
           <h2 className="text-4xl md:text-6xl font-black text-white mb-12 relative z-10 uppercase tracking-tighter">
             Tầm Nhìn Đến <br/> Năm <span className="text-red-500">2030</span>
           </h2>
           <p className="text-stone-400 text-xl font-medium max-w-2xl mx-auto mb-12 relative z-10 leading-relaxed">
             Trở thành hệ sinh thái nội thất khép kín hàng đầu Việt Nam - từ thiết kế, sản xuất đến cung ứng thiết bị gia dụng thông minh Smart Home.
           </p>
           <div className="relative z-10 flex flex-wrap justify-center gap-6">
              <Link href="/projects" className="bg-white text-stone-900 px-10 py-5 rounded-full font-black uppercase text-sm tracking-widest hover:bg-red-500 hover:text-white transition-all">Xem dự án</Link>
              <Link href="/contact" className="border-2 border-white/20 text-white px-10 py-5 rounded-full font-black uppercase text-sm tracking-widest hover:bg-white/10 transition-all">Gửi yêu cầu ngay</Link>
           </div>
        </div>
      </div>
    </div>
  );
}
