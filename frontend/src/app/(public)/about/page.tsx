"use client";

import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1600" 
            alt="NV Homes Interior" 
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-[2px]"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter uppercase">
            Kiến Tạo <span className="text-red-500">Giá Trị</span> Sống
          </h1>
          <p className="text-xl md:text-2xl text-stone-200 max-w-2xl mx-auto font-medium leading-relaxed">
            Nội Thất NV Homes - Đơn vị thiết kế và thi công nội thất trọn gói uy tín hàng đầu tại Hà Nội.
          </p>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-24 bg-stone-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-sm font-black text-red-500 uppercase tracking-[0.2em] mb-4">Về chúng tôi</h2>
              <h3 className="text-4xl font-black text-stone-900 mb-8 leading-tight">
                Chặng đường khẳng định thương hiệu <br/> Nội Thất NV Homes
              </h3>
              <div className="space-y-6 text-stone-600 leading-relaxed text-lg">
                <p>
                  Khởi nguồn từ một xưởng sản xuất gỗ truyền thống tại Thanh Đa - Phúc Thọ, NV Homes đã không ngừng vươn mình để trở thành công ty thiết kế và thi công nội thất chuyên nghiệp.
                </p>
                <p>
                  Chúng tôi tin rằng mỗi không gian sống đều có một câu chuyện riêng. Sứ mệnh của NV Homes là lắng nghe và hiện thực hóa những câu chuyện đó thông qua những bản thiết kế tinh xảo và quy trình thi công tận tâm.
                </p>
              </div>
              <div className="mt-10 grid grid-cols-2 gap-8">
                <div>
                  <p className="text-4xl font-black text-stone-900">10+</p>
                  <p className="text-stone-500 font-bold uppercase text-xs tracking-widest mt-2">Năm kinh nghiệm</p>
                </div>
                <div>
                  <p className="text-4xl font-black text-stone-900">500+</p>
                  <p className="text-stone-500 font-bold uppercase text-xs tracking-widest mt-2">Dự án hoàn thành</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000" 
                  alt="Workshop" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 bg-stone-900 p-8 rounded-2xl text-white shadow-xl hidden lg:block">
                <p className="text-2xl font-black italic">"Chất lượng từ tâm, <br/> xứng tầm đẳng cấp"</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 text-center mb-16">
          <h2 className="text-sm font-black text-red-500 uppercase tracking-[0.2em] mb-4">Giá trị cốt lõi</h2>
          <h3 className="text-4xl font-black text-stone-900">Tại sao chọn NV Homes?</h3>
        </div>
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Xưởng Sản Xuất Trực Tiếp", desc: "Sở hữu xưởng quy mô lớn tại Phúc Thọ, giúp tối ưu chi phí và đảm bảo tiến độ thi công." },
            { title: "Thiết Kế Độc Bản", desc: "Mỗi bản thiết kế là duy nhất, phản ánh cá tính và phong cách riêng của từng khách hàng." },
            { title: "Vật Liệu Cao Cấp", desc: "Cam kết sử dụng vật liệu đúng chủng loại, từ gỗ công nghiệp An Cường đến gỗ tự nhiên nhập khẩu." }
          ].map((item, i) => (
            <div key={i} className="p-10 bg-stone-50 rounded-3xl border border-stone-100 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-red-500 rounded-xl mb-6 flex items-center justify-center text-white font-bold text-xl">
                {i + 1}
              </div>
              <h4 className="text-xl font-black text-stone-900 mb-4">{item.title}</h4>
              <p className="text-stone-500 leading-relaxed font-medium">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="bg-stone-900 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <h3 className="text-4xl md:text-5xl font-black text-white mb-8 relative z-10 leading-tight">
              Bạn Đã Sẵn Sàng Kiến Tạo <br/> Không Gian Mơ Ước?
            </h3>
            <div className="flex flex-col md:flex-row justify-center gap-6 relative z-10">
              <Link href="/contact" className="bg-white text-stone-900 px-10 py-5 rounded-full font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-xl">
                Liên Hệ Ngay
              </Link>
              <Link href="/projects" className="bg-transparent border-2 border-white/20 text-white px-10 py-5 rounded-full font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                Xem Dự Án
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
