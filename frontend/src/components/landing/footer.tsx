"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Phone } from "lucide-react"
import { api } from "@/services/api"

const FacebookIcon = ({ className }: { className?: string }) => (
// ... (icons remain same, I will use a larger replacement chunk or multi_replace if needed)
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
)

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
)

const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 2.9 2.9 0 0 0-.46-5.33z"/>
    <polygon points="9.75 15.02 9.75 8.48 14.25 11.75 9.75 15.02"/>
  </svg>
)

const socialLinks = [
  { icon: FacebookIcon, href: "https://www.facebook.com/noithatnvhomes.trongoi", label: "Facebook" },
  { icon: TikTokIcon, href: "https://www.tiktok.com/@nvhomes.design?_r=1&_t=ZS-954OPYE1ktV", label: "TikTok" },
  { icon: YoutubeIcon, href: "https://www.youtube.com/channel/UCDipTpzGMcunJwlhl0EA2oQ", label: "Youtube" }
]

export function Footer() {
  const [categories, setCategories] = useState<any[]>([])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories')
        const roots = res.data.filter((c: any) => c.parentId === null)
        setCategories(roots)
      } catch (err) {
        console.error("Error fetching footer categories:", err)
      }
    }
    fetchCategories()
  }, [])

  const footerLinksData = {
    services: categories.map(c => ({ label: c.name, href: `/category/${c.slug}` })),
    company: [
      { label: "Về chúng tôi", href: "#about" },
      { label: "Dự án", href: "#projects" },
      { label: "Tin tức", href: "#" },
      { label: "Tuyển dụng", href: "#" }
    ],
    support: [
      { label: "Liên hệ", href: "#contact" },
      { label: "Chính sách bảo hành", href: "#" },
      { label: "Điều khoản dịch vụ", href: "#" },
      { label: "Câu hỏi thường gặp", href: "#" }
    ]
  }

  return (
    <footer className="bg-primary text-primary-foreground">
      {/* CTA Bar */}
      <div className="border-b border-primary-foreground/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="font-serif text-xl md:text-2xl text-center md:text-left">
              Liên Hệ Ngay: <span className="text-primary-foreground/80">0966.245.396</span>
            </p>
            <a 
              href="tel:0966245396"
              className="flex items-center gap-3 px-8 py-4 bg-primary-foreground text-primary hover:bg-primary-foreground/90 transition-colors"
            >
              <Phone className="w-5 h-5" />
              <span className="font-medium">Gọi Ngay</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6 group">
              <div className="relative w-12 h-12 overflow-hidden rounded-xl border-2 border-primary-foreground/20 group-hover:border-primary-foreground transition-all duration-300">
                <img 
                  src="/logo.png" 
                  alt="NV Homes Logo" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="hidden sm:block">
                <span className="font-serif text-2xl font-semibold text-primary-foreground group-hover:text-primary-foreground/80 transition-colors tracking-tight">NV Homes</span>
                <p className="text-[10px] text-primary-foreground/60 tracking-[0.2em] uppercase font-bold">Nội thất cao cấp</p>
              </div>
            </Link>
            <p className="text-primary-foreground/70 leading-relaxed mb-6 max-w-sm">
              Kiến tạo đẳng cấp cho ngôi nhà bạn với sự tận tâm và chuyên nghiệp từ đội ngũ NV Homes.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon
                return (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-serif text-lg mb-6">Danh mục</h4>
            <ul className="space-y-3">
              {footerLinksData.services.length > 0 ? (
                footerLinksData.services.map((link, index) => (
                  <li key={index}>
                    <Link href={link.href} className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-primary-foreground/50 text-xs italic">Đang tải...</li>
              )}
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg mb-6">Công ty</h4>
            <ul className="space-y-3">
              {footerLinksData.company.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg mb-6">Hỗ trợ</h4>
            <ul className="space-y-3">
              {footerLinksData.support.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Google Maps Section */}
        <div className="mt-16 w-full h-[300px] bg-stone-100 grayscale hover:grayscale-0 transition-all duration-500">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14890.000000000002!2d105.52!3d21.11!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313459c000000001%3A0x0!2zVGhhbmggxJBhLCBQaMO6YyBUaOG7jSwgSMOgIE7hu5lpLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1700000000000!5m2!1svi!2s" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen={true} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Vị trí xưởng NV Homes"
          ></iframe>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-primary-foreground/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-primary-foreground/60">
            <p>© 2026 NV Homes. Tất cả quyền được bảo lưu.</p>
            <p>Xưởng: Thanh Đa - Phúc Thọ - Hà Nội</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
