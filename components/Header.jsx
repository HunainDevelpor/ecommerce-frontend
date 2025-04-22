"use client"

import { useState, useEffect } from "react"
import { ShoppingBag, Search, Menu, X, Sun, Moon, Heart, User } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useTheme } from "@/contexts/ThemeContext"
import { useCart } from "@/contexts/CartContext"
import { useWishlist } from "@/contexts/WishlistContext"
import { sampleProducts } from "@/data/products"

export default function Header() {
  const { theme, toggleTheme } = useTheme()
  const { cartItems } = useCart()
  const { wishlistItems } = useWishlist()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchSuggestions, setSearchSuggestions] = useState([])
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showSearch, setShowSearch] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (searchQuery.length > 1) {
      const filtered = sampleProducts
        .filter((product) => product.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .slice(0, 5)
      setSearchSuggestions(filtered)
    } else {
      setSearchSuggestions([])
    }
  }, [searchQuery])

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? `${theme === "dark" ? "bg-gray-800/95 backdrop-blur-sm" : "bg-white/95 backdrop-blur-sm"} shadow-md`
          : theme === "dark"
            ? "bg-gray-800"
            : "bg-white"
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button className="md:hidden mr-4" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <Link href="/" className="flex items-center">
              <ShoppingBag className="h-8 w-8 text-emerald-600" />
              <span className="ml-2 text-xl font-bold">TechMart</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="hover:text-emerald-600 transition-colors">
              Home
            </Link>
            <Link href="/products" className="hover:text-emerald-600 transition-colors">
              Products
            </Link>
            <Link href="/deals" className="hover:text-emerald-600 transition-colors">
              Deals
            </Link>
            <Link href="/about" className="hover:text-emerald-600 transition-colors">
              About
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <AnimatePresence>
                {showSearch ? (
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: "auto", opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    className="relative"
                  >
                    <input
                      type="text"
                      placeholder="Search products..."
                      className={`pl-10 pr-4 py-2 rounded-full w-full md:w-64 focus:outline-none ${
                        theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"
                      }`}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onBlur={() => {
                        if (searchQuery === "") {
                          setShowSearch(false)
                        }
                      }}
                    />
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <button
                      className="absolute right-3 top-2.5"
                      onClick={() => {
                        setSearchQuery("")
                        setShowSearch(false)
                      }}
                    >
                      <X className="h-5 w-5 text-gray-400" />
                    </button>

                    {searchSuggestions.length > 0 && (
                      <div
                        className={`absolute mt-1 w-full rounded-md shadow-lg ${
                          theme === "dark" ? "bg-gray-800" : "bg-white"
                        }`}
                      >
                        <ul className="py-1">
                          {searchSuggestions.map((product) => (
                            <li key={product.id}>
                              <Link
                                href={`/product/${product.id}`}
                                className={`block px-4 py-2 hover:bg-emerald-100 hover:text-emerald-900 ${
                                  theme === "dark" ? "hover:bg-gray-700" : ""
                                }`}
                                onClick={() => {
                                  setSearchSuggestions([])
                                  setSearchQuery("")
                                  setShowSearch(false)
                                }}
                              >
                                {product.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <button
                    onClick={() => setShowSearch(true)}
                    className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    <Search className="h-5 w-5" />
                  </button>
                )}
              </AnimatePresence>
            </div>

            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <Link href="/wishlist" className="relative p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
              <Heart className="h-5 w-5" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            <Link href="/cart" className="relative p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
              <ShoppingBag className="h-5 w-5" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Link>

            <Link href="/account" className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 hidden md:block">
              <User className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={`md:hidden ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}
          >
            <div className="px-4 py-2 space-y-1">
              <Link
                href="/products"
                className="block py-2 hover:text-emerald-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                href="/categories"
                className="block py-2 hover:text-emerald-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                Categories
              </Link>
              <Link
                href="/deals"
                className="block py-2 hover:text-emerald-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                Deals
              </Link>
              <Link
                href="/about"
                className="block py-2 hover:text-emerald-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/account"
                className="block py-2 hover:text-emerald-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                My Account
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
