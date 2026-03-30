"use client";

import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-20 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2000')`,
          }}
        />
        <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-[2px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 lg:px-8 py-24 lg:py-32">
        <div className="max-w-4xl">
          <p className="text-sm md:text-base tracking-[0.3em] uppercase text-white/80 mb-6 font-medium animate-in fade-in slide-in-from-bottom-4 duration-700">
            Nội Thất NV Homes — Xưởng Gỗ Phúc Thọ
          </p>
          
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white leading-[1.1] mb-8 text-balance animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-100 uppercase font-light">
            Kiến Tạo <span className="font-normal italic">Đẳng Cấp</span> <br /> Cho Ngôi Nhà Bạn
          </h1>
          
          <p className="text-lg md:text-xl text-white/90 mb-12 max-w-2xl leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            Thiết kế sáng tạo — Thi công tận tâm — Chất lượng từ tâm. 
            Sở hữu không gian sống mơ ước với chi phí tối ưu trực tiếp từ xưởng sản xuất.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
            <Link 
              href="/contact"
              className={cn(
                buttonVariants({ size: "lg" }),
                "rounded-full px-10 py-7 text-base bg-red-500 text-white hover:bg-red-600 group border-none shadow-2xl transition-all hover:-translate-y-1"
              )}
            >
              Nhận Báo Giá Ngay
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/projects"
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                "rounded-full px-10 py-7 text-base border-white/30 text-white hover:bg-white/10 backdrop-blur-md transition-all hover:-translate-y-1"
              )}
            >
              Xem Mẫu Thiết Kế
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="flex flex-col items-center gap-3 text-white/50">
          <span className="text-[10px] tracking-[0.3em] uppercase font-bold">Cuộn xuống</span>
          <div className="w-px h-12 bg-gradient-to-b from-white/50 to-transparent" />
        </div>
      </div>
    </section>
  );
}
