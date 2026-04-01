"use client";

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import PhoneModal from '@/components/modals/PhoneModal';
import { useRouter } from 'next/navigation';
import { api } from '@/services/api';
import { ImageLightbox } from '@/components/ui/image-lightbox';

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
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [showCartToast, setShowCartToast] = useState(false);

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
    
    // Kích hoạt sự kiện để Navbar cập nhật số lượng badge
    window.dispatchEvent(new CustomEvent('cart-updated'));
    
    // Hiển thị Shopee style Toast
    setShowCartToast(true);
    setTimeout(() => {
        setShowCartToast(false);
    }, 2000);
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
    <>
      <div className="bg-white min-h-screen pt-24 md:pt-32 pb-20">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Sticky Breadcrumb Bar */}
        <div className="sticky top-16 z-40 bg-white/95 backdrop-blur-md border-b border-stone-100 -mx-4 px-4 mb-8 py-4 shadow-sm">
          <nav className="flex items-center gap-2 text-[10px] md:text-xs text-stone-400 font-bold uppercase tracking-widest overflow-x-auto whitespace-nowrap custom-scrollbar">
              <Link href="/" className="hover:text-stone-900 transition-colors flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                Trang Chủ
              </Link>
              {product.parentCategoryName && (
                <>
                  <span className="text-[10px] opacity-30">/</span>
                  <Link 
                    href={`/category/${product.parentCategorySlug}`} 
                    className="hover:text-stone-900 transition-colors"
                  >
                    {product.parentCategoryName}
                  </Link>
                </>
              )}
              <span className="text-[10px] opacity-30">/</span>
              <Link 
                href={`/category/${product.categorySlug}`} 
                className="hover:text-stone-900 transition-colors"
              >
                {product.categoryName}
              </Link>
              <span className="text-[10px] opacity-30">/</span>
              <span className="text-stone-900 truncate max-w-[150px] md:max-w-none">{product.name}</span>
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24">
            {/* Left: Product Image Gallery */}
            <div className="space-y-6">
                <div 
                    className="aspect-square bg-stone-50 rounded-[2rem] overflow-hidden shadow-inner border border-stone-100 flex items-center justify-center relative group cursor-zoom-in"
                    onClick={() => {
                        setLightboxIndex(activeImage);
                        setLightboxOpen(true);
                    }}
                >
                    <img 
                      src={images[activeImage]} 
                      alt={product.name} 
                      className="w-full h-full object-contain p-4 transition-transform duration-700 group-hover:scale-105" 
                    />
                    <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-xl opacity-0 group-hover:opacity-100 transition-opacity">
                       <svg className="w-5 h-5 text-stone-900" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
                    </div>
                </div>
                
                {/* Thumbnails */}
                {images.length > 1 && (
                  <div className="flex gap-4 overflow-x-auto pb-4 px-1 custom-scrollbar">
                      {images.map((img: string, idx: number) => (
                          <button 
                               key={idx} 
                              onClick={() => setActiveImage(idx)}
                              className={`flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all duration-300 relative ${activeImage === idx ? 'border-stone-900 shadow-md scale-[1.05]' : 'border-transparent hover:border-stone-200 bg-stone-50'}`}
                          >
                              <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-contain p-1" />
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
                
                <div className="flex flex-col mb-8 p-6 bg-stone-50 rounded-3xl border border-stone-100">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      <span className="text-[10px] font-black text-stone-500 uppercase tracking-widest">Sẵn hàng tại kho NVHome</span>
                    </div>
                    <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                        <span className="text-4xl md:text-5xl font-black text-red-600 tracking-tighter">
                          {(product.discountPrice || product.originalPrice).toLocaleString('vi-VN')} đ
                        </span>
                        {product.discountPrice > 0 && product.discountPrice < product.originalPrice && (
                          <span className="text-lg md:text-xl font-bold text-stone-300 line-through decoration-stone-300">
                            {product.originalPrice.toLocaleString('vi-VN')} đ
                          </span>
                        )}
                    </div>
                </div>

                {/* Main Call to Actions (Desktop Only) */}
                <div className="hidden sm:flex flex-row gap-0 mb-12 rounded-xl overflow-hidden border border-red-200 shadow-sm">
                    <button 
                      onClick={handleAddToCart}
                      className="flex-1 bg-red-50 text-red-600 font-extrabold uppercase tracking-widest py-5 hover:bg-red-100 transition-all flex justify-center items-center gap-3 text-sm border-r border-red-200">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        Thêm Vào Giỏ Hàng
                    </button>
                    <button 
                      onClick={handleConsult}
                      className="flex-1 bg-red-600 text-white font-extrabold uppercase tracking-widest py-5 hover:bg-red-700 transition-all flex justify-center items-center gap-3 text-sm">
                        Tư Vấn Với Chuyên Viên
                    </button>
                </div>

                {/* Trust Badges - Fills the visual gap */}
                <div className="grid grid-cols-3 gap-4 py-10 border-y border-stone-100 mb-10">
                  <div className="flex flex-col items-center text-center group">
                    <div className="w-12 h-12 bg-stone-50 rounded-full flex items-center justify-center mb-3 group-hover:bg-stone-900 group-hover:text-white transition-all duration-500">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-stone-400 group-hover:text-stone-900 transition-colors">Bảo Hành 2 Năm</span>
                  </div>
                  <div className="flex flex-col items-center text-center group">
                    <div className="w-12 h-12 bg-stone-50 rounded-full flex items-center justify-center mb-3 group-hover:bg-stone-900 group-hover:text-white transition-all duration-500">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-stone-400 group-hover:text-stone-900 transition-colors">Vận Chuyển Nhanh</span>
                  </div>
                  <div className="flex flex-col items-center text-center group">
                    <div className="w-12 h-12 bg-stone-50 rounded-full flex items-center justify-center mb-3 group-hover:bg-stone-900 group-hover:text-white transition-all duration-500">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-stone-400 group-hover:text-stone-900 transition-colors">Tư Vấn Tận Tâm</span>
                  </div>
                </div>

            </div>
        </div>
        
        {/* Full-width Specificatons and Description Section */}
        <div className="mt-20 border-t border-stone-100 pt-16">
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-stone-100">
                {/* Specifications Section */}
                {product.specifications && product.specifications.length > 0 && (
                  <div className="mb-16">
                    <h3 className="text-xl inline-block font-black text-stone-900 uppercase tracking-widest mb-8 border-b-4 border-red-600 pb-2">Đặc Tính Sản Phẩm</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 bg-stone-50 p-6 md:p-8 rounded-2xl border border-stone-100">
                      {product.specifications.map((spec: any, idx: number) => (
                        <div key={idx} className="spec-item-row py-3 flex justify-between border-b border-stone-200/50 last:border-0 md:odd:[&:nth-last-child(1)]:border-0 md:even:[&:nth-last-child(2)]:border-0 md:even:[&:nth-last-child(1)]:border-0">
                          <span className="text-stone-500 text-sm font-bold uppercase tracking-wider">{spec.key}</span>
                          <span className="text-stone-900 text-sm font-black text-right break-words pl-4">{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <h3 className="text-xl inline-block font-black text-stone-900 uppercase tracking-widest mb-8 border-b-4 border-red-600 pb-2">Mô Tả Sản Phẩm</h3>
                <div className="text-stone-600 leading-relaxed font-medium">
                    <div 
                      className="product-rich-text"
                      dangerouslySetInnerHTML={{ __html: decodeHtml(product.description) }}
                    />
                </div>
            </div>
        </div>
      </div>

      {/* Shopee-style Mobile Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-stone-100 sm:hidden shadow-[0_-5px_20px_rgba(0,0,0,0.05)] safe-area-pb">
        <div className="flex items-center h-14">
          <button 
            onClick={handleAddToCart}
            className="flex-1 bg-red-50 text-red-600 h-full font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-2 active:bg-red-100 transition-all border-r border-red-200"
          >
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            Thêm Vào Giỏ
          </button>

          <button 
            onClick={handleConsult}
            className="flex-1 bg-red-600 text-white h-full font-black uppercase tracking-widest text-[10px] sm:text-[11px] flex items-center justify-center gap-1.5 active:bg-red-700 transition-all text-center leading-tight px-1"
          >
            Tư Vấn Chuyên Viên
          </button>
        </div>
      </div>

      {/* Shopee-style Success Toast */}
      {showCartToast && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center pointer-events-none">
          <div className="bg-black/70 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center w-40 h-40 animate-in fade-in zoom-in duration-200 shadow-2xl">
             <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center mb-4 shadow-lg ring-4 ring-green-500/30">
               <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                 <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
               </svg>
             </div>
             <span className="text-white text-xs font-bold text-center px-4 leading-relaxed tracking-wide">Sản phẩm đã được<br/>thêm vào giỏ</span>
          </div>
        </div>
      )}

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

      <ImageLightbox 
        images={images}
        initialIndex={lightboxIndex}
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
      />
    </div>
    </>
  );
}
