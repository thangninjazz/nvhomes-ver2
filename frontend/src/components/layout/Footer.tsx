import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <span className="text-2xl font-bold text-white tracking-tight">NV Homes</span>
            <p className="mt-4 text-sm text-stone-400">
              Nội Thất NV Homes - Giải pháp nội thất toàn diện, kiến tạo không gian sống tiện nghi, sang trọng, đẳng cấp. Xưởng sản xuất trực tiếp, chất lượng hàng đầu.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Sản Phẩm</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/category/phong-khach" className="hover:text-white transition">Nội thất phòng khách</Link></li>
              <li><Link href="/category/phong-bep" className="hover:text-white transition">Nội thất phòng bếp</Link></li>
              <li><Link href="/category/van-phong" className="hover:text-white transition">Đồ trang trí</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Dịch Vụ</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/contact" className="hover:text-white transition">Tư vấn thiết kế</Link></li>
              <li><Link href="/projects" className="hover:text-white transition">Thi công nội thất</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">Báo giá theo yêu cầu</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Liên Hệ</h3>
            <ul className="space-y-3 text-sm">
              <li>Hotline: 0966245396</li>
              <li>Email: nvhomes68@gmail.com</li>
              <li>Địa chỉ: Thanh Đa - Phúc Thọ - Hà Nội</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-stone-800 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-stone-500">
          <p>&copy; {new Date().getFullYear()} Nội Thất NV Homes. Tất cả bản quyền được bảo hộ.</p>
          <div className="space-x-4 mt-4 md:mt-0">
            <Link href="/" className="hover:text-white">Chính sách bảo mật</Link>
            <Link href="/" className="hover:text-white">Điều khoản vận hành</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

