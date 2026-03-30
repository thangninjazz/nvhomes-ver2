"use client";

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import PhoneModal from '@/components/modals/PhoneModal';
import { useRouter } from 'next/navigation';
import { api } from '@/services/api';

export default function ProductDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [modalConfig, setModalConfig] = useState<{isOpen: boolean, title: string, source: string}>({
    isOpen: false,
    title: "",
    source: ""
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/products/${slug}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Lỗi tải thông tin sản phẩm:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-stone-200 border-t-stone-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <h1 className="text-2xl font-black text-stone-900 mb-4 uppercase tracking-widest">Không tìm thấy sản phẩm</h1>
        <Link href="/" className="text-stone-500 hover:text-stone-900 font-bold border-b border-stone-200">Quay lại trang chủ</Link>
      </div>
    );
  }

  const images = product.images ? product.images.split(',') : ['/placeholder.jpg'];

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart.push({
      id: product.id,
      name: product.name,
      price: product.discountPrice || product.originalPrice,
      image: images[0]
    });
    localStorage.setItem('cart', JSON.stringify(cart));
    
    setModalConfig({
      isOpen: true,
      title: "Thêm vào giỏ hàng",
      source: "Cart"
    });
  };

  const handleConsult = () => {
    setModalConfig({
      isOpen: true,
      title: "Tư vấn thiết kế",
      source: "Consultation"
    });
  };

  // Hàm giải mã HTML Entities an toàn (giải mã đa tầng nếu bị mã hóa nhiều lần)
  const decodeHtml = (html: string) => {
    if (!html) return "";
    let decoded = html;
    let prev = "";
    const txt = document.createElement("textarea");
    
    // Giải mã tối đa 3 lần để tránh vòng lặp vô tận (đề phòng dữ liệu cực đoan)
    for (let i = 0; i < 3; i++) {
        txt.innerHTML = decoded;
        decoded = txt.value;
        if (decoded === prev) break;
        prev = decoded;
    }
    
    // Khắc phục quan trọng: Thay thế tất cả khoảng trắng không ngắt (nbsp) \u00a0 thành khoảng trắng thường
    // Điều này cho phép trình duyệt ngắt dòng tự nhiên thay vì coi cả đoạn văn là một 'từ' siêu dài.
    return decoded.replace(/\u00a0/g, ' ').replace(/&nbsp;/g, ' ');
  };

  return (
    <div className="bg-white min-h-screen pt-28 pb-20">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex text-xs text-stone-400 font-bold mb-10 uppercase tracking-widest">
            <Link href="/" className="hover:text-stone-900 transition-colors">Trang Chủ</Link>
            <span className="mx-3">/</span>
            <span className="hover:text-stone-900 transition-colors">Sản Phẩm</span>
            <span className="mx-3">/</span>
            <span className="text-stone-900 truncate max-w-[200px]">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24">
            {/* Left: Product Image Gallery */}
            <div className="space-y-6">
                <div className="aspect-[4/5] md:aspect-square bg-stone-50 rounded-[2rem] overflow-hidden shadow-sm border border-stone-100 flex items-center justify-center relative group">
                    <img src={images[activeImage]} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    {product.discountPrice > 0 && product.discountPrice < product.originalPrice && (
                        <div className="absolute top-6 left-6 z-10 bg-red-600 text-white text-[11px] font-black px-4 py-2 rounded-full tracking-widest uppercase shadow-lg">
                            GIẢM GIÁ SỐC
                        </div>
                    )}
                </div>
                
                {/* Thumbnails */}
                {images.length > 1 && (
                  <div className="grid grid-cols-4 gap-4 md:gap-6">
                      {images.map((img: string, idx: number) => (
                          <button 
                              key={idx} 
                              onClick={() => setActiveImage(idx)}
                              className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-300 relative ${activeImage === idx ? 'border-stone-900 shadow-md ring-4 ring-stone-900/10 scale-[1.02]' : 'border-transparent hover:border-stone-300 opacity-60 hover:opacity-100 bg-stone-50'}`}
                          >
                              <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                          </button>
                      ))}
                  </div>
                )}
            </div>

            {/* Right: Product Details & Action Funnel */}
            <div className="flex flex-col pt-4">
                <span className="text-[11px] font-black text-white bg-red-600 px-4 py-1.5 rounded-full w-max uppercase tracking-widest shadow-md mb-6">🎉 Ưu Đãi Nội Thất NVHome</span>
                
                <h1 className="text-4xl md:text-5xl lg:text-5xl font-black text-stone-900 mb-6 tracking-tight leading-[1.1] capitalize">
                    {product.name}
                </h1>
                
                <div className="flex items-end gap-5 mb-10 pb-10 border-b border-stone-100">
                    <span className="text-5xl font-black text-red-600 tracking-tighter">
                      {(product.discountPrice || product.originalPrice).toLocaleString('vi-VN')} đ
                    </span>
                    {product.discountPrice > 0 && product.discountPrice < product.originalPrice && (
                      <span className="text-xl font-bold text-stone-400 line-through mb-1">
                        {product.originalPrice.toLocaleString('vi-VN')} đ
                      </span>
                    )}
                </div>

                {/* Specifications Section */}
                {product.specifications && product.specifications.length > 0 && (
                  <div className="mb-12 pt-10 border-t border-stone-100">
                    <h3 className="text-xs font-black text-stone-400 uppercase tracking-widest mb-6">Thông Số Kỹ Thuật</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                      {product.specifications.map((spec: any, idx: number) => (
                        <div key={idx} className="spec-item-row py-3 border-b border-stone-50">
                          <span className="text-stone-500 text-sm font-bold uppercase tracking-wider min-w-[120px]">{spec.key}</span>
                          <span className="text-stone-900 text-sm font-black text-right md:text-left flex-1 break-words">{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mb-12 text-stone-600 leading-relaxed font-medium">
                    <div 
                      className="product-rich-text"
                      dangerouslySetInnerHTML={{ __html: decodeHtml(product.description) }}
                    />
                </div>

                {/* Call to Actions (Funnel) */}
                <div className="mt-auto space-y-5 bg-stone-50 p-6 rounded-3xl border border-stone-100">
                    <button 
                      onClick={handleAddToCart}
                      className="w-full bg-stone-900 text-white font-black uppercase tracking-widest py-5 rounded-2xl hover:bg-black transition-all hover:scale-[1.02] shadow-[0_10px_30px_rgba(0,0,0,0.15)] flex justify-center items-center gap-3">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                        Đặt Hàng / Thêm Vào Giỏ
                    </button>
                    <button 
                      onClick={handleConsult}
                      className="w-full bg-white text-stone-900 font-black border-2 border-stone-200 uppercase tracking-widest py-5 rounded-2xl hover:border-stone-900 hover:bg-stone-50 transition-colors flex justify-center items-center gap-3 shadow-sm">
                        <svg className="w-5 h-5 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                        Tư Vấn Thiết Kế Theo Yêu Cầu
                    </button>
                </div>
            </div>
        </div>
      </div>

      <PhoneModal 
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig({...modalConfig, isOpen: false})}
        title={modalConfig.title}
        source={modalConfig.source}
        onSuccess={() => {
          if (modalConfig.source === 'Cart') {
            router.push('/cart');
          }
        }}
      />
    </div>
  );
}
