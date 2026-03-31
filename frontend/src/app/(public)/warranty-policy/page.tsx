"use client";

import Link from "next/link";
import { ShieldCheck, Clock, FileText, CheckCircle2 } from "lucide-react";

export default function WarrantyPolicyPage() {
  return (
    <div className="bg-white min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-stone-900 mb-6 uppercase tracking-tighter">
            Chính Sách <span className="text-red-500">Bảo Hành</span>
          </h1>
          <p className="text-stone-500 font-medium text-lg">
            NV Homes cam kết mang đến sự an tâm tuyệt đối cho khách hàng với chính sách hậu mãi chu đáo.
          </p>
        </div>

        <div className="prose prose-stone max-w-none space-y-12">
          {/* Section 1 */}
          <section className="bg-stone-50 p-8 rounded-3xl border border-stone-100 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center text-white">
                <Clock className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-stone-900 m-0">Thời Gian Bảo Hành</h2>
            </div>
            <ul className="space-y-4 m-0 p-0 list-none">
              <li className="flex gap-3 items-start">
                <CheckCircle2 className="w-5 h-5 text-red-500 shrink-0 mt-1" />
                <span className="text-stone-600 font-medium">Bảo hành <strong>02 năm</strong> đối với tất cả các sản phẩm nội thất gỗ (rạn nứt, mối mọt, lỗi kỹ thuật sản xuất).</span>
              </li>
              <li className="flex gap-3 items-start">
                <CheckCircle2 className="w-5 h-5 text-red-500 shrink-0 mt-1" />
                <span className="text-stone-600 font-medium">Bảo hành theo tiêu chuẩn nhà sản xuất đối với các phụ kiện (bản lề, ray trượt, bếp, thiết bị điện tử).</span>
              </li>
              <li className="flex gap-3 items-start">
                <CheckCircle2 className="w-5 h-5 text-red-500 shrink-0 mt-1" />
                <span className="text-stone-600 font-medium">Bảo trì trọn đời sản phẩm: Hỗ trợ sửa chữa, thay thế linh kiện với chi phí ưu đãi nhất sau thời gian bảo hành.</span>
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-3xl font-black text-stone-900 mb-6 flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-red-500" /> Điều Kiện Bảo Hành
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4 text-stone-600 font-medium">
                <p className="font-bold text-stone-900">Trường hợp được bảo hành:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Sản phẩm bị lỗi kỹ thuật trong quá trình sản xuất hoặc vận chuyển lắp đặt.</li>
                  <li>Sản phẩm bị cong vênh, rạn nứt tự nhiên của gỗ trong điều kiện sử dụng bình thường.</li>
                  <li>Phụ kiện bị lỗi chức năng (hỏng ray, hỏng bản lề) do lỗi sản xuất.</li>
                </ul>
              </div>
              <div className="space-y-4 text-stone-600 font-medium">
                <p className="font-bold text-stone-900">Trường hợp không được bảo hành:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Khách hàng tự ý tháo dỡ, sửa chữa hoặc di chuyển sản phẩm.</li>
                  <li>Hư hỏng do sử dụng sai mục đích hoặc tác động ngoại lực (va đập, ngập nước, cháy nổ).</li>
                  <li>Sản phẩm bị trầy xước, bong tróc do quá trình sử dụng lâu dài của khách hàng.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="border-t border-stone-100 pt-12">
            <h2 className="text-3xl font-black text-stone-900 mb-6 flex items-center gap-3">
              <FileText className="w-8 h-8 text-red-500" /> Quy Trình Bảo Hành
            </h2>
            <div className="space-y-8">
              {[
                { step: "01", title: "Tiếp nhận thông tin", desc: "Khách hàng liên hệ Hotline 0966.245.396 hoặc gửi ảnh lỗi qua Zalo." },
                { step: "02", title: "Xác minh & Phân loại", desc: "Kỹ thuật viên sẽ gọi điện xác minh lỗi trong vòng 24h làm việc." },
                { step: "03", title: "Xử lý tại chỗ", desc: "NV Homes cử thợ tới bảo hành tại nhà khách hàng trong vòng 48h-72h." },
                { step: "04", title: "Nghiệm thu", desc: "Khách hàng kiểm tra và ký biên bản hoàn tất công tác bảo hành." }
              ].map((item, index) => (
                <div key={index} className="flex gap-6 items-start">
                  <span className="text-4xl font-black text-stone-200">{item.step}</span>
                  <div>
                    <h4 className="text-xl font-bold text-stone-900 mb-1">{item.title}</h4>
                    <p className="text-stone-500 font-medium m-0">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="mt-20 p-12 bg-stone-900 rounded-[2.5rem] text-center text-white">
          <h3 className="text-3xl font-black mb-6">Mọi thắc mắc xin liên hệ</h3>
          <p className="text-stone-400 mb-8 max-w-md mx-auto">Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ quý khách 24/7 để đảm bảo trải nghiệm tốt nhất.</p>
          <a href="tel:0966245396" className="inline-block bg-red-500 text-white px-10 py-5 rounded-full font-black uppercase tracking-widest hover:bg-white hover:text-stone-900 transition-all shadow-xl">
             Hotline: 0966.245.396
          </a>
        </div>
      </div>
    </div>
  );
}
