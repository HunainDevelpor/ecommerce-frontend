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
import axios from "axios"
export default function ProductCard({ product }) {
  const { theme } = useTheme()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const { showToast } = useToast()
  const [isHovered, setIsHovered] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false)

  const handleAddToCart = async (e) => {
  e.preventDefault()
  setIsAddingToCart(true)
  const gettoken = localStorage.getItem("token")
  if (!gettoken) {    
    showToast("Please login to add items to cart", "error")
    setIsAddingToCart(false)
    return
  }
  try {
    const response = await axios.post("http://localhost:8000/api/cart/add", {
      productId: product.id,
      quantity: 1,
    },
    {
      headers: {
        Authorization: `Bearer ${gettoken}`,
      },
    }
  
  )
    if (response.status === 200) {
      showToast(`${product.name} added to cart`, "success")
      setIsAddingToCart(false)
      
    }
  } catch (error) {
    console.error("Add to cart failed:", error)
    showToast(`Failed to add ${product.name} to cart`, "error")
    setIsAddingToCart(false)
  }

}


 const handleToggleWishlist = async (e) => {
  e.preventDefault()
  setIsTogglingWishlist(true)

  const token = localStorage.getItem("token")
  if (!token) {
    showToast("Please login to manage wishlist", "error")
    setIsTogglingWishlist(false)
    return
  }

  try {
    if (isInWishlist(product.id)) {
      // Remove from wishlist
      await axios.delete(`http://localhost:8000/api/wishlist/${product.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      removeFromWishlist(product.id)
      showToast(`${product.name} removed from wishlist`, "info")
    } else {
      // Add to wishlist
      await axios.post(`http://localhost:8000/api/wishlist/${product.id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      })
      addToWishlist(product)
      showToast(`${product.name} added to wishlist`, "success")
    }
  } catch (error) {
    console.error("Wishlist toggle error:", error)
    showToast("An error occurred while updating wishlist", "error")
  }

  setIsTogglingWishlist(false)
}


  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className={`rounded-lg overflow-hidden ${theme === "dark" ? "bg-gray-800" : "bg-white"} shadow-md`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/product/${product.id}`} className="block">
        <div className="relative">
          <div className="aspect-square relative overflow-hidden">
            <Image
              src={product.image || "/placeholder.svg?height=300&width=300"}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
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

          <div
            className={`absolute bottom-0 left-0 right-0 p-2 flex justify-between items-center transition-opacity duration-200 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0 || isAddingToCart}
              className={`p-2 rounded-full ${
                isAddingToCart
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-emerald-600 text-white hover:bg-emerald-700"
              } transition-colors`}
            >
              {isAddingToCart ? (
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <ShoppingCart size={18} />
              )}
            </button>

            <button
              onClick={handleToggleWishlist}
              disabled={isTogglingWishlist}
              className={`p-2 rounded-full ${
                isTogglingWishlist
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : isInWishlist(product.id)
                    ? "bg-red-500 text-white"
                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              } transition-colors`}
            >
              {isTogglingWishlist ? (
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
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
          </div>
        </div>

        <div className="p-4">
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

          <h3 className="font-medium mb-1 line-clamp-2">{product.name}</h3>

          <div className="flex items-center">
            {product.discount > 0 ? (
              <>
             <span className="font-bold text-lg">
      ${Number(product.price * (1 - product.discount / 100)).toFixed(2)}
      </span>
      <span className="ml-2 text-sm line-through text-gray-500">
      ${Number(product.price).toFixed(2)}
      </span>
 </>
            ) : (
              <span className="font-bold text-lg">${Number(product.price).toFixed(2)}</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
