"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api } from '@/services/api';

export function Footer() {
  const [parentCategories, setParentCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories/tree');
        // Chỉ lấy các danh mục cha (cấp cao nhất)
        setParentCategories(res.data || []);
      } catch (err) {
        console.error("Lỗi lấy danh mục footer:", err);
      }
    };
    fetchCategories();
  }, []);

  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <span className="text-2xl font-black text-white tracking-tight uppercase">NV Homes</span>
            <p className="mt-4 text-sm text-stone-400 leading-relaxed font-medium">
              Nội Thất NV Homes - Giải pháp nội thất toàn diện, kiến tạo không gian sống tiện nghi, sang trọng, đẳng cấp. Xưởng sản xuất trực tiếp, chất lượng hàng đầu.
            </p>
          </div>
          <div>
            <h3 className="text-xs font-black text-white tracking-[0.2em] uppercase mb-6">Danh mục sản phẩm</h3>
            <ul className="space-y-4 text-sm font-medium">
              {parentCategories.map(cat => (
                <li key={cat.id}>
                  <Link href={`/category/${cat.slug}`} className="hover:text-red-500 transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
              {parentCategories.length === 0 && (
                <>
                  <li><Link href="/category/phong-khach" className="hover:text-white transition">Nội thất phòng khách</Link></li>
                  <li><Link href="/category/phong-bep" className="hover:text-white transition">Nội thất phòng bếp</Link></li>
                  <li><Link href="/category/phong-ngu" className="hover:text-white transition">Nội thất phòng ngủ</Link></li>
                </>
              )}
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-black text-white tracking-[0.2em] uppercase mb-6">Thông tin hỗ trợ</h3>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link href="/about-us" className="hover:text-red-500 transition-colors">Về chúng tôi</Link></li>
              <li><Link href="/news" className="hover:text-red-500 transition-colors">Tin tức & Sự kiện</Link></li>
              <li><Link href="/faq" className="hover:text-red-500 transition-colors">Câu hỏi thường gặp</Link></li>
              <li><Link href="/warranty-policy" className="hover:text-red-500 transition-colors">Chính sách bảo hành</Link></li>
              <li><Link href="/terms-of-service" className="hover:text-red-500 transition-colors">Điều khoản dịch vụ</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-black text-white tracking-[0.2em] uppercase mb-6">Liên hệ trực tiếp</h3>
            <ul className="space-y-4 text-sm font-medium">
              <li className="flex flex-col gap-1">
                <span className="text-[10px] text-stone-500 uppercase tracking-widest">Hotline</span>
                <a href="tel:0966245396" className="text-lg font-black text-white hover:text-red-500 transition-colors">0966.245.396</a>
              </li>
              <li className="flex flex-col gap-1">
                <span className="text-[10px] text-stone-500 uppercase tracking-widest">Email</span>
                <span className="text-stone-300">nvhomes68@gmail.com</span>
              </li>
              <li className="flex flex-col gap-1">
                <span className="text-[10px] text-stone-500 uppercase tracking-widest">Địa chỉ</span>
                <span className="text-stone-300">Thanh Đa - Phúc Thọ - Hà Nội</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-16 border-t border-stone-800/50 pt-8 flex flex-col md:flex-row items-center justify-between text-[11px] font-black text-stone-500 uppercase tracking-widest">
          <p>&copy; {new Date().getFullYear()} Nội Thất NV Homes. Bảo lưu mọi quyền.</p>
          <div className="flex gap-8 mt-6 md:mt-0">
            <Link href="/terms-of-service" className="hover:text-white transition-colors">Vận hành</Link>
            <Link href="/warranty-policy" className="hover:text-white transition-colors">Bảo mật</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Bản đồ</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

