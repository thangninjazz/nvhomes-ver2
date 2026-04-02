"use client";

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/services/api';

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const { slug } = use(params);
  const [products, setProducts] = useState<any[]>([]);
  const [category, setCategory] = useState<any>(null);
  const [allCategories, setAllCategories] = useState<any[]>([]);
  const [sortOrder, setSortOrder] = useState('newest');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Tự động fetch sản phẩm, truyển tham số sortOrder
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch all categories first
        const allCatsRes = await api.get(`/categories?type=Product`);
        if (allCatsRes.data && Array.isArray(allCatsRes.data)) {
           setAllCategories(allCatsRes.data);
        }

        if (slug !== 'all') {
          const catRes = await api.get(`/categories/byslug/${slug}`);
          setCategory(catRes.data);
        } else {
          setCategory({ name: "Tất cả sản phẩm" });
        }

        // Fetch products
        const res = await api.get(`/products?${slug !== 'all' ? `categorySlug=${slug}&` : ''}sortOrder=${sortOrder}`);
        setProducts(res.data);
      } catch (error) {
        console.error("Lỗi fetch dữ liệu:", error);
        setProducts([]); 
        setCategory({ name: slug === 'all' ? "Tất cả sản phẩm" : "Không tìm thấy" });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [sortOrder, slug]);

  return (
    <div className="container mx-auto px-4 pt-24 md:pt-32 pb-20 lg:px-8">
      {/* HEADER GRID */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 pb-6 border-b border-stone-200">
        <div>
          <nav className="flex text-sm font-semibold text-stone-400 mb-3 tracking-wide items-center">
            <Link href="/" className="hover:text-stone-900 transition-colors">TRANG CHỦ</Link>
            
            {category?.parentName && (
              <>
                <span className="mx-3">/</span>
                <Link href={`/category/${category.parentSlug}`} className="hover:text-stone-900 transition-colors uppercase">
                  {category.parentName}
                </Link>
              </>
            )}

            <span className="mx-3">/</span>
            <span className="text-stone-900 uppercase">{category?.name || slug.replace('-', ' ')}</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-black text-stone-900 tracking-tighter uppercase mb-2">
            {category?.name || slug.replace('-', ' ')}
          </h1>
        </div>

      </div>

      {/* FILTER CONTROLS */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-8 bg-stone-50 p-4 rounded-2xl border border-stone-100 shadow-sm">
        
        {/* Category Dropdown */}
        <div className="flex items-center gap-3 w-full sm:w-auto flex-1">
          <svg className="w-4 h-4 text-stone-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>
          <select 
            className="w-full bg-transparent text-xs font-black text-stone-900 focus:outline-none cursor-pointer uppercase tracking-widest border-none p-0 focus:ring-0"
            value={slug}
            onChange={(e) => {
              if (e.target.value === 'all') {
                router.push('/category/all');
              } else {
                router.push(`/category/${e.target.value}`);
              }
            }}
          >
            <option value="all">Khám phá sản phẩm</option>
            {allCategories
              .filter(c => !c.parentId && (!category?.id || c.id === (category.parentId || category.id)))
              .map(parent => (
              <optgroup key={parent.id} label={parent.name}>
                <option value={parent.slug}>➤ {parent.name} (Tất cả)</option>
                {allCategories.filter(c => c.parentId === parent.id).map(child => (
                   <option key={child.id} value={child.slug}>&nbsp;&nbsp;&nbsp;• {child.name}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        <div className="hidden sm:block w-px h-6 bg-stone-200"></div>

        {/* Dynamic Sorting Input */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <svg className="w-4 h-4 text-stone-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" /></svg>
          <select 
            className="w-full bg-transparent text-xs font-black text-stone-900 focus:outline-none cursor-pointer uppercase tracking-widest border-none p-0 focus:ring-0"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="newest">Mới Nhất</option>
            <option value="price_asc">Giá: Thấp Đến Cao</option>
            <option value="price_desc">Giá: Cao Đến Thấp</option>
            <option value="popular">Bán Chạy Nhất</option>
          </select>
        </div>
      </div>

      {/* PRODUCT GRID */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1,2,3,4].map(i => (
            <div key={i} className="animate-pulse flex flex-col gap-4">
              <div className="w-full aspect-[4/5] bg-stone-200 rounded-3xl"></div>
              <div className="h-6 bg-stone-200 rounded-full w-3/4"></div>
              <div className="h-4 bg-stone-200 rounded-full w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {products.map(product => (
            <Link href={`/product/${product.slug}`} key={product.id} className="group flex flex-col">
              {/* Product Image Frame */}
              <div className="relative w-full aspect-[4/5] bg-stone-100 rounded-3xl overflow-hidden mb-5 border border-stone-200 shadow-sm transition-all hover:shadow-xl">
                {product.discountPercent && (
                  <div className="absolute top-4 left-4 z-10 bg-red-500 text-white text-xs font-black tracking-widest px-4 py-2 rounded-full shadow-lg">
                    -{product.discountPercent}%
                  </div>
                )}
                <div 
                  className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
                  style={{ backgroundImage: `url('${(product.images ? product.images.split(',')[0] : '') || 'https://images.unsplash.com/photo-1532323544230-7191fd51bc1b?w=500'}')` }}
                />
                
                {/* Hover Add to Cart Button */}
                <div className="absolute inset-x-4 bottom-4 translate-y-20 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <button className="w-full py-4 bg-white/90 backdrop-blur-md text-stone-900 rounded-2xl font-black tracking-wide text-sm shadow-[0_10px_30px_rgba(0,0,0,0.1)] hover:bg-stone-900 hover:text-white transition-colors">
                    XEM CHI TIẾT
                  </button>
                </div>
              </div>
              
              {/* Product Info */}
              <h3 className="text-lg font-bold text-stone-900 mb-2 line-clamp-2 group-hover:text-red-500 transition-colors leading-tight">
                {product.name}
              </h3>
              <div className="flex items-center gap-3 mt-auto">
                <span className="text-xl font-black text-red-600 tracking-tight">
                  {product.discountPrice ? product.discountPrice.toLocaleString('vi-VN') : product.originalPrice.toLocaleString('vi-VN')} đ
                </span>
                {product.discountPrice && (
                  <span className="text-sm font-semibold text-stone-400 line-through">
                    {product.originalPrice.toLocaleString('vi-VN')} đ
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
