"use client";

import { FileText, CheckCircle2, AlertCircle, HelpCircle } from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <div className="bg-white min-h-screen pt-32 pb-24 font-sans">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-stone-900 mb-6 uppercase tracking-tight">
            Điều Khoản <span className="text-primary italic">Dịch Vụ</span>
          </h1>
          <p className="text-stone-500 font-medium text-lg max-w-2xl mx-auto">
            Vui lòng đọc kỹ các điều khoản bên dưới khi sử dụng dịch vụ tư vấn, thiết kế và thi công của NV Homes.
          </p>
        </div>

        <div className="space-y-12">
          {/* Section 1: Introduction */}
          <section className="bg-stone-50 p-10 rounded-3xl border border-stone-100">
            <h2 className="text-2xl font-bold text-stone-900 mb-6 flex items-center gap-3">
              <FileText className="w-7 h-7 text-red-500" /> 1. Quy định chung
            </h2>
            <p className="text-stone-600 leading-relaxed font-medium">
              Khi khách hàng truy cập vào trang web nvhomes.vn hoặc đăng ký dịch vụ của chúng tôi, đồng nghĩa với việc khách hàng đã đọc, hiểu và đồng ý với các điều khoản vận hành, thanh toán và bảo mật thông tin do NV Homes đưa ra.
            </p>
          </section>

          {/* Section 2: Pricing & Payment */}
          <section>
            <h2 className="text-2xl font-bold text-stone-900 mb-8 flex items-center gap-3">
              <CheckCircle2 className="w-7 h-7 text-red-500" /> 2. Giá cả và Thanh toán
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-6 border border-stone-100 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg font-bold text-stone-800 mb-4 tracking-tight">Quy trình báo giá</h3>
                <p className="text-stone-500 text-sm leading-relaxed m-0">
                  Báo giá dựa trên khối lượng thực tế và đơn giá đã thỏa thuận trong hợp đồng. Mọi thay đổi về vật liệu, kiểu dáng sẽ được cập nhật bằng biên bản bổ sung.
                </p>
              </div>
              <div className="p-6 border border-stone-100 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg font-bold text-stone-800 mb-4 tracking-tight">Tiến độ thanh toán</h3>
                <p className="text-stone-500 text-sm leading-relaxed m-0">
                  Thông thường được chia làm 3 đợt: Đợt 1 (Tạm ứng ký hợp đồng), Đợt 2 (Thi công sản xuất), Đợt 3 (Hoàn thiện nghiệm thu bàn giao).
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: Responsibilities */}
          <section className="bg-stone-50 p-10 rounded-3xl border border-stone-100">
            <h2 className="text-2xl font-bold text-stone-900 mb-8 flex items-center gap-3">
              <AlertCircle className="w-7 h-7 text-red-500" /> 3. Trách nhiệm các bên
            </h2>
            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                 <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2.5 shrink-0"></div>
                 <p className="text-stone-600 m-0 font-medium">Bên NV Homes: Có trách nhiệm thi công đúng bản vẽ kỹ thuật, đảm bảo chất lượng vật liệu và bàn giao đúng tiến độ đã ký kết.</p>
              </div>
              <div className="flex gap-4 items-start">
                 <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2.5 shrink-0"></div>
                 <p className="text-stone-600 m-0 font-medium">Khách hàng: Có trách nhiệm bàn giao mặt bằng thi công đúng tiến độ và thanh toán đầy đủ các đợt theo quy định trong hợp đồng.</p>
              </div>
            </div>
          </section>

          {/* Section 4: Customer Support */}
          <section className="text-center pt-8 border-t border-stone-100">
            <h2 className="text-2xl font-bold text-stone-900 mb-6 flex items-center justify-center gap-3">
              <HelpCircle className="w-7 h-7 text-red-500" /> 4. Giải đáp thắc mắc
            </h2>
            <p className="text-stone-500 font-medium mb-10 max-w-xl mx-auto">
              Mọi tranh chấp phát sinh trong quá trình thực hiện hợp đồng sẽ được hai bên ưu tiên đàm phán dựa trên tinh thần hợp tác và công bằng nhất.
            </p>
            <div className="flex justify-center gap-4">
               <a href="tel:0966245396" className="bg-stone-900 text-white px-8 py-4 rounded-xl font-bold text-sm tracking-wide">Gọi trực tiếp</a>
               <a href="mailto:nvhomes68@gmail.com" className="bg-stone-100 text-stone-600 px-8 py-4 rounded-xl font-bold text-sm tracking-wide">Gửi Email</a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
