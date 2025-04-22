import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/contexts/ThemeContext"
import { CartProvider } from "@/contexts/CartContext"
import { WishlistProvider } from "@/contexts/WishlistContext"
import { RecentlyViewedProvider } from "@/contexts/RecentlyViewedContext"
import { ToastProvider } from "@/contexts/ToastContext"
import Header from "@/components/Header"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <CartProvider>
            <WishlistProvider>
              <RecentlyViewedProvider>
                <ToastProvider>
                  <Header />
                  {children}
                </ToastProvider>
              </RecentlyViewedProvider>
            </WishlistProvider>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.dev'
    };
