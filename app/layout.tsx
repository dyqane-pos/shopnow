import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/context/AuthContext'
import { CartProvider } from '@/context/CartContext'
import { ToastProvider } from '@/context/ToastContext'
import { WishlistProvider } from '@/context/WishlistContext'
import { LanguageProvider } from '@/context/LanguageContext'

export const metadata: Metadata = {
  title: 'ShopNow — Dyqani juaj online',
  description: 'Veshje, këpucë dhe aksesore premium për burra dhe gra.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sq">
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          try {
            var t = localStorage.getItem('theme');
            if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
              document.documentElement.setAttribute('data-theme', 'dark');
            }
          } catch(e) {}
        `}} />
      </head>
      <body>
        <LanguageProvider>
          <AuthProvider>
            <WishlistProvider>
              <CartProvider>
                <ToastProvider>
                  {children}
                </ToastProvider>
              </CartProvider>
            </WishlistProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
