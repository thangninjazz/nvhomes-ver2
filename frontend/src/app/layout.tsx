import { Metadata } from 'next'
import { Playfair_Display, Be_Vietnam_Pro } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import Script from 'next/script'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['vietnamese'],
  variable: '--font-serif',
  display: 'swap',
})

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['vietnamese'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'NV Homes | Thiết Kế & Thi Công Nội Thất Cao Cấp',
  description: 'Kiến tạo đẳng cấp cho ngôi nhà bạn - Thiết kế sáng tạo, thi công tận tâm, chất lượng từ tâm',
  generator: 'v0.app',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/logo.png',
  },
}

import { ThemeProvider } from '@/components/landing/theme-provider'
import { ThemeToggleFixed } from '@/components/landing/theme-toggle-fixed'
import { FloatingCTA } from '@/components/landing/floating-cta'
import { AntiCopy } from '@/components/security/anti-copy'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" className={`${playfair.variable} ${beVietnamPro.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <AntiCopy />
          <ThemeToggleFixed />
          <Analytics />
          <Script 
            src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '6LdI0ZwsAAAAAAgRP6zInmBZ_F06PVNtns4fl7LN'}`} 
            strategy="afterInteractive" 
          />
        </ThemeProvider>
      </body>
    </html>
  )
}
