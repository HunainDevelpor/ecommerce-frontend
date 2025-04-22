"use client"

import { useState } from "react"
import { ChevronRight, Heart, ShoppingCart } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { useTheme } from "@/contexts/ThemeContext"
import { useCart } from "@/contexts/CartContext"
import { useWishlist } from "@/contexts/WishlistContext"
import { useToast } from "@/contexts/ToastContext"
import LoadingIndicator from "@/components/LoadingIndicator"

export default function WishlistPage() {
  const { theme } = useTheme()
  const { addToCart } = useCart()
  const { wishlistItems, removeFromWishlist } = useWishlist()
  const { showToast } = useToast()
  const [isAddingToCart, setIsAddingToCart] = useState({})
  const [isRemoving, setIsRemoving] = useState({})

  const handleAddToCart = (product) => {
    setIsAddingToCart((prev) => ({ ...prev, [product.id]: true }))

    // Simulate a delay to show loading state
    setTimeout(() => {
      addToCart(product)
      setIsAddingToCart((prev) => ({ ...prev, [product.id]: false }))
      showToast(`${product.name} added to cart`, "success")
    }, 500)
  }

  const handleRemoveFromWishlist = (product) => {
    setIsRemoving((prev) => ({ ...prev, [product.id]: true }))

    // Simulate a delay to show loading state
    setTimeout(() => {
      removeFromWishlist(product.id)
      setIsRemoving((prev) => ({ ...prev, [product.id]: false }))
      showToast(`${product.name} removed from wishlist`, "info")
    }, 500)
  }

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <div className="flex items-center text-sm mb-6">
          <Link href="/" className="hover:text-emerald-600 transition-colors">
            Home
          </Link>
          <ChevronRight size={16} className="mx-2" />
          <span className="text-gray-500">Wishlist</span>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold mb-8">My Wishlist</h1>

        {wishlistItems.length === 0 ? (
          <div className={`rounded-lg p-8 ${theme === "dark" ? "bg-gray-800" : "bg-white"} shadow-sm text-center`}>
            <Heart className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium mb-2">Your wishlist is empty</h3>
            <p className={`mb-6 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
              Items added to your wishlist will appear here
            </p>
            <Link
              href="/products"
              className="inline-block px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`rounded-lg overflow-hidden ${theme === "dark" ? "bg-gray-800" : "bg-white"} shadow-sm`}
              >
                <Link href={`/product/${item.id}`} className="block">
                  <div className="relative aspect-square">
                    <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    {item.discount > 0 && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        {item.discount}% OFF
                      </div>
                    )}
                  </div>
                </Link>
                <div className="p-4">
                  <Link href={`/product/${item.id}`}>
                    <h3 className="font-medium mb-1 hover:text-emerald-600 transition-colors">{item.name}</h3>
                  </Link>
                  <div className="flex items-center mb-4">
                    {item.discount > 0 ? (
                      <>
                        <span className="font-bold">${(item.price * (1 - item.discount / 100)).toFixed(2)}</span>
                        <span className="ml-2 text-sm line-through text-gray-500">${item.price.toFixed(2)}</span>
                      </>
                    ) : (
                      <span className="font-bold">${item.price.toFixed(2)}</span>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleAddToCart(item)}
                      disabled={isAddingToCart[item.id]}
                      className={`flex-1 flex items-center justify-center px-3 py-2 ${
                        isAddingToCart[item.id]
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-emerald-600 hover:bg-emerald-700"
                      } text-white rounded-md transition-colors`}
                    >
                      {isAddingToCart[item.id] ? (
                        <svg
                          className="animate-spin h-5 w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      ) : (
                        <>
                          <ShoppingCart size={18} className="mr-1" /> Add to Cart
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleRemoveFromWishlist(item)}
                      disabled={isRemoving[item.id]}
                      className={`px-3 py-2 ${
                        isRemoving[item.id]
                          ? "bg-gray-400 cursor-not-allowed text-white"
                          : "border border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                      } rounded-md transition-colors`}
                    >
                      {isRemoving[item.id] ? (
                        <svg
                          className="animate-spin h-5 w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      ) : (
                        <Heart size={18} />
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Loading Indicator */}
      <LoadingIndicator
        isLoading={Object.values(isAddingToCart).some(Boolean) || Object.values(isRemoving).some(Boolean)}
        message="Processing..."
      />
    </div>
  )
}
