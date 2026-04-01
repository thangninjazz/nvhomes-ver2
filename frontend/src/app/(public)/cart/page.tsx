"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/services/api";

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "" });
  const [success, setSuccess] = useState(false);

  const syncCart = (newItems: CartItem[]) => {
    setItems(newItems);
    const flatCart: any[] = [];
    newItems.forEach(item => {
      for(let i=0; i<item.quantity; i++) flatCart.push({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image
      });
    });
    localStorage.setItem('cart', JSON.stringify(flatCart));
    window.dispatchEvent(new CustomEvent('cart-updated'));
  };

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
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

  const updateQuantity = (id: string, delta: number) => {
    const newItems = items.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    });
    syncCart(newItems);
  };

  const removeItem = (id: string) => {
    const newItems = items.filter(item => item.id !== id);
    syncCart(newItems);
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert("Vui lòng nhập đầy đủ Họ tên và Số điện thoại.");
      return;
    }

    try {
      setLoading(true);
      // Tạo chuỗi ghi chú sản phẩm
      const productNote = items.map(item => `${item.name} (${item.quantity} cái)`).join(", ");
      
      await api.post('/customers', {
        name: formData.name,
        phoneNumber: formData.phone,
        note: `ĐẶT HÀNG: ${productNote}`,
        address: "Đặt từ giỏ hàng trực tuyến"
      });

      setSuccess(true);
      localStorage.removeItem('cart');
      window.dispatchEvent(new CustomEvent('cart-updated'));
      setItems([]);
    } catch (err) {
      console.error("Lỗi đặt hàng:", err);
      alert("Đã có lỗi xảy ra khi gửi đơn hàng. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-stone-50 min-h-screen pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-2xl text-center">
            <div className="bg-white p-12 md:p-20 rounded-[3rem] shadow-xl border border-stone-100">
                <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-8 animate-bounce">✓</div>
                <h2 className="text-3xl font-black text-stone-900 uppercase tracking-tighter mb-4">Đặt hàng thành công!</h2>
                <p className="text-stone-500 font-bold mb-10 leading-relaxed">Cảm ơn {formData.name} đã tin tưởng NVHome. Chúng tôi sẽ sớm liên hệ với bạn qua số {formData.phone} để xác nhận đơn hàng.</p>
                <Link href="/" className="inline-block px-10 py-5 bg-stone-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-black transition-all">
                    Quay lại trang chủ
                </Link>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-stone-50 min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Left side: Cart items */}
            <div className="flex-1">
                <h1 className="text-4xl font-black text-stone-900 uppercase tracking-tighter mb-10">Giỏ hàng ({items.length})</h1>

                {items.length === 0 ? (
                <div className="bg-white p-12 md:p-20 rounded-[3rem] text-center shadow-sm border border-stone-100">
                    <div className="text-6xl mb-6 opacity-30">🛒</div>
                    <p className="text-stone-500 font-bold mb-8 text-xl">Giỏ hàng của bạn đang trống...</p>
                    <Link href="/" className="inline-block px-10 py-5 bg-stone-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg hover:-translate-y-1">
                        Tiếp tục tìm sản phẩm
                    </Link>
                </div>
                ) : (
                <div className="space-y-4">
                    {items.map((item) => (
                    <div key={item.id} className="bg-white rounded-3xl p-4 md:p-6 shadow-sm border border-stone-100 flex items-center gap-4 md:gap-8 group transition-all hover:shadow-md">
                        <div className="w-20 h-20 md:w-28 md:h-28 bg-stone-50 rounded-2xl overflow-hidden shrink-0">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <Link href={`/product/${item.id}`} className="block text-base md:text-xl font-black text-stone-900 uppercase tracking-tight mb-1 hover:text-red-600 transition-colors truncate">
                                {item.name}
                            </Link>
                            <p className="text-red-600 font-black text-sm md:text-lg">{item.price.toLocaleString()} đ</p>
                            
                            {/* Mobile only controls */}
                            <div className="flex md:hidden items-center gap-3 mt-3">
                                <button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center text-lg font-bold hover:bg-stone-900 hover:text-white transition-colors">-</button>
                                <span className="font-black text-sm">{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center text-lg font-bold hover:bg-stone-900 hover:text-white transition-colors">+</button>
                            </div>
                        </div>

                        {/* Desktop only controls */}
                        <div className="hidden md:flex items-center gap-6">
                            <div className="flex items-center bg-stone-50 rounded-full p-1 border border-stone-100">
                                <button 
                                    onClick={() => updateQuantity(item.id, -1)}
                                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold hover:bg-white hover:shadow-sm transition-all"
                                >
                                    -
                                </button>
                                <span className="w-10 text-center font-black">{item.quantity}</span>
                                <button 
                                    onClick={() => updateQuantity(item.id, 1)}
                                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold hover:bg-white hover:shadow-sm transition-all"
                                >
                                    +
                                </button>
                            </div>
                            <div className="w-32 text-right">
                                <p className="text-xl font-black text-stone-900">{(item.price * item.quantity).toLocaleString()} đ</p>
                            </div>
                        </div>

                        <button 
                            onClick={() => removeItem(item.id)}
                            className="p-2 text-stone-300 hover:text-red-500 transition-colors"
                            title="Xóa sản phẩm"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                    </div>
                    ))}
                </div>
                )}
            </div>

            {/* Right side: Checkout Info */}
            {items.length > 0 && (
                <div className="w-full lg:w-[400px]">
                    <div className="sticky top-32">
                        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-stone-100 mb-6">
                            <h2 className="text-xl font-black text-stone-900 uppercase tracking-widest mb-8 flex items-center gap-3">
                                <span className="w-8 h-8 bg-stone-900 text-white rounded-lg flex items-center justify-center text-xs">01</span>
                                Thông tin liên hệ
                            </h2>

                            <form onSubmit={handleCheckout} className="space-y-5">
                                <div>
                                    <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2 ml-1">Họ và tên của bạn</label>
                                    <input 
                                        type="text" 
                                        required
                                        placeholder="VD: Nguyễn Văn A"
                                        className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-stone-900 font-bold transition-colors"
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2 ml-1">Số điện thoại liên hệ</label>
                                    <input 
                                        type="tel" 
                                        required
                                        placeholder="VD: 0987xxxxxx"
                                        className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-stone-900 font-bold transition-colors"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                    />
                                </div>

                                <div className="pt-6 border-t border-stone-100 mt-8">
                                    <div className="flex justify-between items-center mb-6">
                                        <span className="text-stone-400 font-black uppercase tracking-widest text-[11px]">Tổng giá trị</span>
                                        <span className="text-3xl font-black text-red-600 tracking-tighter">{total.toLocaleString()} đ</span>
                                    </div>
                                    <button 
                                        type="submit"
                                        disabled={loading}
                                        className={`w-full py-6 rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex justify-center items-center gap-3 shadow-xl ${loading ? 'bg-stone-400 cursor-not-allowed' : 'bg-stone-900 text-white hover:bg-black hover:-translate-y-1'}`}
                                    >
                                        {loading ? (
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <>
                                                Gửi yêu cầu đặt hàng
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                            </>
                                        )}
                                    </button>
                                    <p className="text-center text-[10px] text-stone-400 font-bold mt-6 leading-relaxed">Bằng việc nhấn đặt hàng, bạn đồng ý với các Điều khoản bảo mật của NVHome.</p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

        </div>
      </div>
    </div>
  );
}
