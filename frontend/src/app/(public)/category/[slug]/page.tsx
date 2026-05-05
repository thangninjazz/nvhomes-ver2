"use client";

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/services/api';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
           const getPriority = (name: string) => {
             const lower = (name || "").toLowerCase();
             if (lower.includes("inox acrylic")) return 1;
             if (lower.includes("nhựa acrylic")) return 2;
             if (lower.includes("inox cánh kính")) return 3;
             return 99;
           };
           const sortedCats = allCatsRes.data.sort((a: any, b: any) => getPriority(a.name) - getPriority(b.name));
           setAllCategories(sortedCats);
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
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-8 bg-transparent p-0 relative z-20">
        
        {/* Category Dropdown */}
        <div className="w-full sm:w-[320px]">
          <Select 
            value={slug}
            onValueChange={(val) => {
              if (val === 'all') router.push('/category/all');
              else router.push(`/category/${val}`);
            }}
          >
            <SelectTrigger className="w-full h-14 bg-stone-900 text-white border-stone-900 rounded-full font-black uppercase tracking-[0.15em] text-[11px] md:text-xs shadow-2xl hover:scale-[1.02] transition-all focus:ring-0">
              <SelectValue placeholder="Khám phá sản phẩm" />
            </SelectTrigger>
            <SelectContent className="rounded-[2rem] border-stone-100 shadow-[0_20px_60px_rgba(0,0,0,0.1)] max-h-[60vh] p-2 bg-white/95 backdrop-blur-xl">
              <SelectItem value="all" className="font-black uppercase tracking-widest text-xs py-4 px-6 text-red-500 rounded-2xl hover:bg-red-50 focus:bg-red-50 cursor-pointer transition-colors mb-2">Khám phá sản phẩm</SelectItem>
              {allCategories
                .filter(c => !c.parentId && (!category?.id || c.id === (category.parentId || category.id)))
                .map(parent => (
                <SelectGroup key={parent.id} className="mb-2">
                  <SelectLabel className="font-black uppercase tracking-[0.2em] text-[10px] text-stone-400 bg-stone-50 py-3 px-6 rounded-t-2xl border-b border-stone-100">{parent.name}</SelectLabel>
                  <SelectItem value={parent.slug} className="py-3 px-6 font-bold text-xs cursor-pointer focus:bg-stone-50 focus:text-stone-900 rounded-xl mt-1">➤ {parent.name} (Tất cả)</SelectItem>
                  {allCategories.filter(c => c.parentId === parent.id).map(child => (
                     <SelectItem key={child.id} value={child.slug} className="py-3 px-6 font-medium text-xs cursor-pointer text-stone-500 focus:bg-stone-50 focus:text-stone-900 rounded-xl ml-4">
                       • {child.name}
                     </SelectItem>
                  ))}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Dynamic Sorting Input */}
        <div className="w-full sm:w-[240px]">
          <Select 
            value={sortOrder}
            onValueChange={setSortOrder}
          >
            <SelectTrigger className="w-full h-14 bg-white border-stone-200 text-stone-900 rounded-full font-bold uppercase tracking-[0.15em] text-[11px] md:text-xs shadow-sm hover:border-stone-400 hover:shadow-md transition-all focus:ring-0">
              <SelectValue placeholder="Sắp xếp" />
            </SelectTrigger>
            <SelectContent className="rounded-3xl border-stone-100 shadow-[0_20px_60px_rgba(0,0,0,0.1)] p-2">
              <SelectItem value="newest" className="py-4 px-6 font-bold text-xs cursor-pointer uppercase tracking-widest focus:bg-stone-50 focus:text-stone-900 rounded-xl">Mới Nhất</SelectItem>
              <SelectItem value="price_asc" className="py-4 px-6 font-bold text-xs cursor-pointer uppercase tracking-widest focus:bg-stone-50 focus:text-stone-900 rounded-xl">Giá: Thấp Đến Cao</SelectItem>
              <SelectItem value="price_desc" className="py-4 px-6 font-bold text-xs cursor-pointer uppercase tracking-widest focus:bg-stone-50 focus:text-stone-900 rounded-xl">Giá: Cao Đến Thấp</SelectItem>
              <SelectItem value="popular" className="py-4 px-6 font-bold text-xs cursor-pointer uppercase tracking-widest focus:bg-stone-50 focus:text-stone-900 rounded-xl">Bán Chạy Nhất</SelectItem>
            </SelectContent>
          </Select>
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
