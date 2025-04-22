"use client"
import { useState } from "react"
import { Heart, ShoppingCart, Star } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { useTheme } from "@/contexts/ThemeContext"
import { useCart } from "@/contexts/CartContext"
import { useWishlist } from "@/contexts/WishlistContext"
import { useToast } from "@/contexts/ToastContext"

export default function ProductListItem({ product }) {
  const { theme } = useTheme()
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const { showToast } = useToast()
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false)

  const handleAddToCart = (e) => {
    e.preventDefault()
    setIsAddingToCart(true)

    // Simulate a delay to show loading state
    setTimeout(() => {
      addToCart(product)
      setIsAddingToCart(false)
      showToast(`${product.name} added to cart`, "success")
    }, 500)
  }

  const handleToggleWishlist = (e) => {
    e.preventDefault()
    setIsTogglingWishlist(true)

    // Simulate a delay to show loading state
    setTimeout(() => {
      if (isInWishlist(product.id)) {
        removeFromWishlist(product.id)
        showToast(`${product.name} removed from wishlist`, "info")
      } else {
        addToWishlist(product)
        showToast(`${product.name} added to wishlist`, "success")
      }
      setIsTogglingWishlist(false)
    }, 500)
  }

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={`rounded-lg overflow-hidden ${theme === "dark" ? "bg-gray-800" : "bg-white"} shadow-md`}
    >
      <Link href={`/product/${product.id}`} className="flex flex-col md:flex-row">
        <div className="relative md:w-48 lg:w-64">
          <div className="aspect-square relative">
            <Image
              src={product.image || "/placeholder.svg?height=300&width=300"}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>

          {product.discount > 0 && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              {product.discount}% OFF
            </div>
          )}

          {product.stock < 10 && product.stock > 0 && (
            <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded">
              Low Stock
            </div>
          )}

          {product.stock === 0 && (
            <div className="absolute top-2 right-2 bg-gray-700 text-white text-xs font-bold px-2 py-1 rounded">
              Out of Stock
            </div>
          )}
        </div>

        <div className="p-4 flex-1 flex flex-col">
          <div className="flex items-center mb-2">
            <div className="flex text-amber-400">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  size={14}
                  fill={index < product.rating ? "currentColor" : "none"}
                  className={index < product.rating ? "" : "text-gray-300"}
                />
              ))}
            </div>
            <span className="text-xs ml-1 text-gray-500">({product.reviewCount})</span>
          </div>

          <h3 className="font-medium mb-1">{product.name}</h3>

          <p className="text-sm text-gray-500 mb-4 line-clamp-2">{product.description}</p>

          <div className="mt-auto flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center">
              {product.discount > 0 ? (
                <>
                  <span className="font-bold text-lg">
                    ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                  </span>
                  <span className="ml-2 text-sm line-through text-gray-500">${product.price.toFixed(2)}</span>
                </>
              ) : (
                <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
              )}
            </div>

            <div className="flex space-x-2">
              <button
                onClick={handleToggleWishlist}
                disabled={isTogglingWishlist}
                className={`p-2 rounded-full ${
                  isTogglingWishlist
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : isInWishlist(product.id)
                      ? "bg-red-500 text-white"
                      : theme === "dark"
                        ? "bg-gray-700 text-gray-300"
                        : "bg-gray-200 text-gray-600"
                } hover:bg-opacity-90 transition-colors`}
              >
                {isTogglingWishlist ? (
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
                  <Heart size={18} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
                )}
              </button>

              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || isAddingToCart}
                className={`flex items-center px-3 py-2 rounded-md ${
                  product.stock === 0 || isAddingToCart
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-emerald-600 hover:bg-emerald-700"
                } text-white transition-colors`}
              >
                {isAddingToCart ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 mr-2"
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
                    Adding...
                  </>
                ) : (
                  <>
                    <ShoppingCart size={18} className="mr-1" />
                    Add to Cart
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
