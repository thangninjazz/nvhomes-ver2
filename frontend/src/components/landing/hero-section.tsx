"use client"

import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function HeroSection() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-20">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/images/hero-interior.jpg')`,
          }}
        />
        <div className="absolute inset-0 bg-foreground/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-24 lg:py-32">
        <div className="max-w-3xl">
          <p className="text-sm md:text-base tracking-[0.3em] uppercase text-background/80 mb-6 font-medium">
            Thiết kế & Thi công nội thất
          </p>
          
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-background leading-tight mb-8 text-balance">
            Kiến Tạo Đẳng Cấp Cho Ngôi Nhà Bạn
          </h1>
          
          <p className="text-lg md:text-xl text-background/90 mb-12 max-w-xl leading-relaxed">
            Thiết kế sáng tạo — Thi công chuyên nghiệp — Chất lượng từ tâm. Sở hữu không gian sống mơ ước với chi phí tối ưu.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg" 
              className="rounded-none px-8 py-6 text-base bg-background text-foreground hover:bg-background/90 group"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Nhận Báo Giá Ngay
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Link href="/projects">
              <Button 
                size="lg" 
                className="rounded-none px-8 py-6 text-base bg-background text-foreground hover:bg-background/90 group w-full sm:w-auto shadow-xl"
              >
                Xem Mẫu Thiết Kế
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <div className="flex flex-col items-center gap-2 text-background/70">
          <span className="text-xs tracking-widest uppercase">Cuộn xuống</span>
          <div className="w-px h-12 bg-background/50 animate-pulse" />
        </div>
      </div>
    </section>
  )
}
