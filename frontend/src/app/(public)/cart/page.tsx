"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    // Tự động gom nhóm các sản phẩm trùng id
    const groupedCart: CartItem[] = cart.reduce((acc: CartItem[], curr: any) => {
      const existing = acc.find(i => i.id === curr.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        acc.push({ ...curr, quantity: 1 });
      }
      return acc;
    }, []);
    setItems(groupedCart);
  }, []);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const removeItem = (id: string) => {
    const newItems = items.filter(item => item.id !== id);
    setItems(newItems);
    // Cập nhật lại localStorage đơn giản (không gom nhóm)
    const flatCart: any[] = [];
    newItems.forEach(item => {
      for(let i=0; i<item.quantity; i++) flatCart.push(item);
    });
    localStorage.setItem('cart', JSON.stringify(flatCart));
  };

  return (
    <div className="bg-stone-50 min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-black text-stone-900 uppercase tracking-tighter mb-10">Giỏ hàng của bạn</h1>

        {items.length === 0 ? (
          <div className="bg-white p-20 rounded-[3rem] text-center shadow-sm border border-stone-100">
             <div className="text-6xl mb-6">🛒</div>
             <p className="text-stone-500 font-bold mb-8 text-xl">Giỏ hàng trống trơn...</p>
             <Link href="/" className="px-10 py-5 bg-stone-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-black transition-all">
                Tiếp tục mua sắm
             </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-[3rem] p-8 shadow-sm border border-stone-100">
              <div className="divide-y divide-stone-100">
                {items.map((item) => (
                  <div key={item.id} className="py-8 flex items-center gap-8">
                    <div className="w-24 h-24 bg-stone-50 rounded-2xl overflow-hidden shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-black text-stone-900 uppercase tracking-tight mb-1">{item.name}</h3>
                      <p className="text-stone-400 font-bold uppercase text-[10px] tracking-widest">Số lượng: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-black text-red-600">{(item.price * item.quantity).toLocaleString()} đ</p>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-stone-300 hover:text-red-500 text-xs font-bold uppercase tracking-widest mt-2"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-stone-900 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
               <div className="relative z-10 flex justify-between items-center mb-10">
                  <span className="text-stone-400 font-black uppercase tracking-widest">Tổng cộng thanh toán</span>
                  <span className="text-4xl font-black text-white">{total.toLocaleString()} đ</span>
               </div>
               <Link href="/contact" className="relative z-10 w-full bg-red-500 hover:bg-red-600 text-white py-6 rounded-2xl font-black uppercase tracking-widest transition-all flex justify-center items-center shadow-xl">
                  Gửi yêu cầu báo giá trọn gói
               </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
