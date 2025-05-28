"use client"

import { useEffect, useState } from "react"
import { Trash2, ShoppingBag, ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { useTheme } from "@/contexts/ThemeContext"
import axios from "axios"
import {toast,ToastContainer} from 'react-toastify' // ✅ Import toast
import 'react-toastify/dist/ReactToastify.css';

export default function CartPage() {
  const { theme } = useTheme()
  const [couponCode, setCouponCode] = useState("")
  const [couponApplied, setCouponApplied] = useState(false)
  const [discount, setDiscount] = useState(0)
  const [cartTotal, setCartTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [cartItems, setCartItems] = useState([])

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        setLoading(true)
        setError("")
        const response = await axios.get("http://localhost:8000/api/cart", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        setCartItems(response.data.items)
      } catch (err) {
        toast.error("Failed to fetch cart items")

      } finally {
        setLoading(false)
      }
    }

    fetchCartItems()
  }, [])

  useEffect(() => {
    const total = cartItems.reduce((sum, item) => {
      const priceAfterDiscount = item.price * (1 - (item.discount || 0) / 100)
      return sum + priceAfterDiscount * item.quantity
    }, 0)
    setCartTotal(total)
  }, [cartItems])

  const handleApplyCoupon = () => {
    if (couponCode.toLowerCase() === "discount10") {
      setCouponApplied(true)
      setDiscount(cartTotal * 0.1)
      toast.success("Coupon applied successfully!")
    } else {
      toast.error("Invalid coupon code")
    }
  }

  const handleQuantityChange = async (productId, newQuantity) => {
    try {
      await axios.put(
        `http://localhost:8000/api/cart/${productId}`,
        { quantity: Number(newQuantity) },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )

      setCartItems((prev) =>
        prev.map((item) =>
          item.id === productId ? { ...item, quantity: Number(newQuantity) } : item
        )
      )
      toast.success("Quantity updated")
    } catch (err) {
      toast.error("Failed to update quantity")
    }
  }

  const handleRemoveItem = async (productId) => {
    try {
      await axios.delete(`http://localhost:8000/api/cart/${productId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      setCartItems((prev) => prev.filter((item) => item.id !== productId))
      toast.success("Item removed from cart")
    } catch (err) {
      toast.error("Failed to remove item")
    }
  }

  const clearCart = async () => {
    try {
      await axios.post(
        "http://localhost:8000/api/cart/clear",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      setCartItems([])
      toast.success("Cart cleared successfully")
    } catch (err) {
 
      toast.error("Failed to clear cart")
    }
  }

  const subtotal = cartTotal
  const shipping = cartTotal > 100 ? 0 : 10
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax - discount

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    <div
      className={`min-h-screen ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      <div className="container mx-auto px-4 py-8">

        {loading && <div className="text-center text-gray-500">Loading cart...</div>}

        <h1 className="text-2xl md:text-3xl font-bold mb-8">Shopping Cart</h1>

        {cartItems.length === 0 && !loading ? (
          <div className="text-center py-12">
            <div className="flex justify-center mb-4">
              <ShoppingBag size={64} className="text-gray-400" />
            </div>
            <h2 className="text-xl font-medium mb-4">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Looks like you haven't added any products to your cart yet.</p>
            <Link
              href="/products"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="lg:w-2/3">
              <div
                className={`rounded-lg overflow-hidden ${theme === "dark" ? "bg-gray-800" : "bg-white"} shadow-md mb-6`}
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold">Cart Items ({cartItems.length})</h2>
                    <button onClick={clearCart} className="text-red-500 hover:text-red-700 text-sm font-medium">
                      Clear Cart
                    </button>
                  </div>

                  <div className="divide-y">
                    {cartItems.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="py-4 flex flex-col sm:flex-row gap-4"
                      >
                        <div className="sm:w-24 h-24 relative rounded-md overflow-hidden">
                          <Image
                            src={item.image || "/placeholder.svg?height=100&width=100"}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>

                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row justify-between">
                            <div>
                              <h3 className="font-medium">{item.name}</h3>
                              <p className="text-sm text-gray-500">{item.category}</p>
                              {item.colors && item.colors[0] && (
                                <div className="flex items-center mt-1">
                                  <span className="text-sm text-gray-500 mr-2">Color:</span>
                                  <span
                                    className="inline-block w-4 h-4 rounded-full"
                                    style={{ backgroundColor: item.colors[0] }}
                                  ></span>
                                </div>
                              )}
                            </div>

                            <div className="mt-2 sm:mt-0 flex flex-col items-start sm:items-end">
                              <div className="flex items-center">
                                {item.discount > 0 ? (
                                  <>
                                    <span className="font-bold">
                                      ${(item.price * (1 - item.discount / 100)).toFixed(2)}
                                    </span>
                                    <span className="ml-2 text-sm line-through text-gray-500">
                                      ${Number(item.price).toFixed(2)}
                                    </span>
                                  </>
                                ) : (
                                  <span className="font-bold">${Number(item.price).toFixed(2)}</span>
                                )}
                              </div>

                              <div className="flex items-center mt-2">
                                <select
                                  value={item.quantity}
                                  onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                                  className={`p-1 rounded-md text-sm ${
                                    theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                                  }`}
                                >
                                  {Array.from({ length: Math.min(10, item.stock) }, (_, i) => i + 1).map((num) => (
                                    <option key={num} value={num}>
                                      {num}
                                    </option>
                                  ))}
                                </select>

                                <button
                                  onClick={() => handleRemoveItem(item.id)}
                                  className="ml-4 text-red-500 hover:text-red-700"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              <Link href="/products" className="flex items-center text-emerald-600 hover:text-emerald-700 font-medium">
                <ArrowLeft size={16} className="mr-2" />
                Continue Shopping
              </Link>
            </div>

            {/* Order Summary */}
            <div className="lg:w-1/3">
              <div
                className={`rounded-lg ${theme === "dark" ? "bg-gray-800" : "bg-white"} shadow-md p-6 sticky top-24`}
              >
                <h2 className="text-lg font-bold mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>

                  {couponApplied && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Discount</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Coupon Code</label>
                  <div className="flex">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      disabled={couponApplied}
                      placeholder="Enter coupon code"
                      className={`flex-1 px-3 py-2 rounded-l-md ${
                        theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                      } focus:outline-none ${couponApplied ? "opacity-50" : ""}`}
                    />
                    <button
                      onClick={handleApplyCoupon}
                      disabled={couponApplied || !couponCode}
                      className={`px-4 py-2 rounded-r-md ${
                        couponApplied || !couponCode
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-emerald-600 hover:bg-emerald-700"
                      } text-white transition-colors`}
                    >
                      Apply
                    </button>
                  </div>
                  {couponApplied && <p className="text-sm text-emerald-600 mt-1">Coupon applied successfully!</p>}
                </div>

                <Link
                  href="/checkout"
                  className="block w-full bg-emerald-600 hover:bg-emerald-700 text-white text-center px-6 py-3 rounded-md font-medium transition-colors"
                >
                  Proceed to Checkout
                </Link>

                <div className="mt-6">
                  <h3 className="font-medium mb-2">We Accept</h3>
                  <div className="flex space-x-2">
                    {["Visa", "Mastercard", "Amex", "PayPal"].map((payment) => (
                      <div
                        key={payment}
                        className={`px-2 py-1 rounded ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"} text-xs`}
                      >
                        {payment}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  )
}
