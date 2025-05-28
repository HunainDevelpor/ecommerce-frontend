"use client"

import { useEffect, useState } from "react"
import { ChevronRight, Check } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useTheme } from "@/contexts/ThemeContext"
import { useCart } from "@/contexts/CartContext"
import {toast,ToastContainer} from 'react-toastify' // ✅ Import toast
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios"
export default function CheckoutPage() {
  const { theme } = useTheme()
  const { cartItems, cartTotal,refreshCart } = useCart()
  useEffect(() => {
    refreshCart()
  }, [refreshCart])

  const [activeStep, setActiveStep] = useState(1)
  const [formData, setFormData] = useState({
    // Shipping Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Pakistan",

    // Payment Information
    cardName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",

    // Additional
    saveInfo: false,
    sameAsBilling: true,
  })

  const [errors, setErrors] = useState({})
  const [orderComplete, setOrderComplete] = useState(false)
  const [orderNumber, setOrderNumber] = useState("")

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))

    // Clear error when field is updated
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateStep = (step) => {
    const newErrors = {}

    if (step === 1) {
      if (!formData.firstName) newErrors.firstName = "First name is required"
      if (!formData.lastName) newErrors.lastName = "Last name is required"
      if (!formData.email) newErrors.email = "Email is required"
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid"
      if (!formData.phone) newErrors.phone = "Phone number is required"
      if (!formData.address) newErrors.address = "Address is required"
      if (!formData.city) newErrors.city = "City is required"
      if (!formData.state) newErrors.state = "State is required"
      if (!formData.zipCode) newErrors.zipCode = "ZIP code is required"
    }

    if (step === 2) {
      if (!formData.cardName) newErrors.cardName = "Name on card is required"
      if (!formData.cardNumber) newErrors.cardNumber = "Card number is required"
      else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, "")))
        newErrors.cardNumber = "Card number must be 16 digits"
      if (!formData.expiryDate) newErrors.expiryDate = "Expiry date is required"
      else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) newErrors.expiryDate = "Expiry date must be in MM/YY format"
      if (!formData.cvv) newErrors.cvv = "CVV is required"
      else if (!/^\d{3,4}$/.test(formData.cvv)) newErrors.cvv = "CVV must be 3 or 4 digits"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNextStep = () => {
    if (validateStep(activeStep)) {
      setActiveStep(activeStep + 1)
      window.scrollTo(0, 0)
    }
  }

  const handlePrevStep = () => {
    setActiveStep(activeStep - 1)
    window.scrollTo(0, 0)
  }

  const handleSubmitOrder = async () => {
  if (validateStep(activeStep)) {
    try {
      const response = await axios.post("http://localhost:8000/api/orders", {
        shippingInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        },
        paymentInfo: {
          cardName: formData.cardName,
          cardNumber: formData.cardNumber,
          expiryDate: formData.expiryDate,
          cvv: formData.cvv,
        },
        items: cartItems,
        totalAmount: total,
      },{
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  }
    )

      // Handle success (order placed)
      setOrderNumber(response.data.orderId || `ORD-${Math.floor(100000 + Math.random() * 900000)}`)
      setOrderComplete(true)
      toast.success("Order placed successfully!")
    } catch (error) {
      console.error("Order failed:", error)
      toast.error("There was an error placing your order. Please try again.")
    }
  }
}

  const subtotal = cartTotal
  const shipping = cartTotal > 100 ? 0 : 10
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  if (orderComplete) {
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
    return (
      <div className={`min-h-screen ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-6 flex justify-center">
              <div className={`rounded-full p-4 ${theme === "dark" ? "bg-emerald-900" : "bg-emerald-100"}`}>
                <Check size={48} className="text-emerald-600" />
              </div>
            </div>

            <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
            <p className="text-lg mb-2">Thank you for your purchase.</p>
            <p className="text-gray-500 mb-6">
              Your order number is: <span className="font-bold">{orderNumber}</span>
            </p>

            <div className={`p-6 rounded-lg mb-8 ${theme === "dark" ? "bg-gray-800" : "bg-gray-100"}`}>
              <h2 className="font-bold mb-4">Order Details</h2>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="font-medium mb-2">Shipping Address</h3>
                <p>
                  {formData.firstName} {formData.lastName}
                </p>
                <p>{formData.address}</p>
                <p>
                  {formData.city}, {formData.state} {formData.zipCode}
                </p>
                <p>{formData.country}</p>
              </div>

              <div>
                <h3 className="font-medium mb-2">Payment Method</h3>
                <p>Credit Card ending in {formData.cardNumber.slice(-4)}</p>
              </div>
            </div>

            <p className="mb-6">
              We've sent a confirmation email to <span className="font-medium">{formData.email}</span> with all the
              details of your order.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="px-6 py-3 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-colors"
              >
                Back to Home
              </Link>
              <Link
                href="/account/orders"
                className={`px-6 py-3 rounded-md ${
                  theme === "dark" ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-200 hover:bg-gray-300"
                } font-medium transition-colors`}
              >
                View Orders
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center text-sm mb-6">
          <Link href="/" className="hover:text-emerald-600 transition-colors">
            Home
          </Link>
          <ChevronRight size={16} className="mx-2" />
          <Link href="/cart" className="hover:text-emerald-600 transition-colors">
            Cart
          </Link>
          <ChevronRight size={16} className="mx-2" />
          <span className="text-gray-500">Checkout</span>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold mb-8">Checkout</h1>

        {/* Checkout Steps */}
        <div className="flex justify-between mb-8 relative">
          <div
            className={`absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`}
          ></div>

          {[1, 2, 3].map((step) => (
            <div key={step} className="relative z-10 flex flex-col items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  step < activeStep
                    ? "bg-emerald-600 text-white"
                    : step === activeStep
                      ? theme === "dark"
                        ? "bg-gray-700 border-2 border-emerald-600 text-white"
                        : "bg-white border-2 border-emerald-600 text-emerald-600"
                      : theme === "dark"
                        ? "bg-gray-700 text-gray-400"
                        : "bg-white border border-gray-300 text-gray-400"
                }`}
              >
                {step < activeStep ? <Check size={18} /> : step}
              </div>
              <span
                className={`mt-2 text-sm ${step === activeStep ? "font-medium text-emerald-600" : "text-gray-500"}`}
              >
                {step === 1 ? "Shipping" : step === 2 ? "Payment" : "Review"}
              </span>
            </div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Form Section */}
          <div className="lg:w-2/3">
            <div className={`rounded-lg ${theme === "dark" ? "bg-gray-800" : "bg-white"} shadow-md p-6 mb-6`}>
              {/* Step 1: Shipping Information */}
              {activeStep === 1 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                  <h2 className="text-lg font-bold mb-6">Shipping Information</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium mb-1">First Name*</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 rounded-md ${
                          theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                        } ${errors.firstName ? "border border-red-500" : ""}`}
                      />
                      {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Last Name*</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 rounded-md ${
                          theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                        } ${errors.lastName ? "border border-red-500" : ""}`}
                      />
                      {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Email Address*</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 rounded-md ${
                          theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                        } ${errors.email ? "border border-red-500" : ""}`}
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Phone Number*</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 rounded-md ${
                          theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                        } ${errors.phone ? "border border-red-500" : ""}`}
                      />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-1">Address*</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 rounded-md ${
                        theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                      } ${errors.address ? "border border-red-500" : ""}`}
                    />
                    {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium mb-1">City*</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 rounded-md ${
                          theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                        } ${errors.city ? "border border-red-500" : ""}`}
                      />
                      {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">State/Province*</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 rounded-md ${
                          theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                        } ${errors.state ? "border border-red-500" : ""}`}
                      />
                      {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">ZIP/Postal Code*</label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 rounded-md ${
                          theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                        } ${errors.zipCode ? "border border-red-500" : ""}`}
                      />
                      {errors.zipCode && <p className="text-red-500 text-xs mt-1">{errors.zipCode}</p>}
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-1">Country*</label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 rounded-md ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"}`}
                    >
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Australia">Australia</option>
                      <option value="Germany">Germany</option>
                      <option value="Pakistan">Pakistan</option>
                    </select>
                  </div>

                  <div className="flex justify-between">
                    <Link
                      href="/cart"
                      className={`px-6 py-2 rounded-md ${
                        theme === "dark" ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"
                      } transition-colors`}
                    >
                      Back to Cart
                    </Link>
                    <button
                      onClick={handleNextStep}
                      className="px-6 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                    >
                      Continue to Payment
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Payment Information */}
              {activeStep === 2 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                  <h2 className="text-lg font-bold mb-6">Payment Information</h2>

                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-1">Name on Card*</label>
                    <input
                      type="text"
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 rounded-md ${
                        theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                      } ${errors.cardName ? "border border-red-500" : ""}`}
                    />
                    {errors.cardName && <p className="text-red-500 text-xs mt-1">{errors.cardName}</p>}
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-1">Card Number*</label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      placeholder="XXXX XXXX XXXX XXXX"
                      className={`w-full px-3 py-2 rounded-md ${
                        theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                      } ${errors.cardNumber ? "border border-red-500" : ""}`}
                    />
                    {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium mb-1">Expiry Date*</label>
                      <input
                        type="text"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleChange}
                        placeholder="MM/YY"
                        className={`w-full px-3 py-2 rounded-md ${
                          theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                        } ${errors.expiryDate ? "border border-red-500" : ""}`}
                      />
                      {errors.expiryDate && <p className="text-red-500 text-xs mt-1">{errors.expiryDate}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">CVV*</label>
                      <input
                        type="text"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleChange}
                        placeholder="XXX"
                        className={`w-full px-3 py-2 rounded-md ${
                          theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                        } ${errors.cvv ? "border border-red-500" : ""}`}
                      />
                      {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>}
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="sameAsBilling"
                        checked={formData.sameAsBilling}
                        onChange={handleChange}
                        className="mr-2 h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      Billing address same as shipping address
                    </label>
                  </div>

                  <div className="mb-6">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="saveInfo"
                        checked={formData.saveInfo}
                        onChange={handleChange}
                        className="mr-2 h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      Save payment information for future purchases
                    </label>
                  </div>

                  <div className="flex justify-between">
                    <button
                      onClick={handlePrevStep}
                      className={`px-6 py-2 rounded-md ${
                        theme === "dark" ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"
                      } transition-colors`}
                    >
                      Back
                    </button>
                    <button
                      onClick={handleNextStep}
                      className="px-6 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                    >
                      Review Order
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Review Order */}
              {activeStep === 3 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                  <h2 className="text-lg font-bold mb-6">Review Your Order</h2>

                  <div className="mb-6">
                    <h3 className="font-medium mb-2">Shipping Information</h3>
                    <div className={`p-4 rounded-md ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"}`}>
                      <p>
                        {formData.firstName} {formData.lastName}
                      </p>
                      <p>{formData.address}</p>
                      <p>
                        {formData.city}, {formData.state} {formData.zipCode}
                      </p>
                      <p>{formData.country}</p>
                      <p className="mt-2">{formData.email}</p>
                      <p>{formData.phone}</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="font-medium mb-2">Payment Method</h3>
                    <div className={`p-4 rounded-md ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"}`}>
                      <p>{formData.cardName}</p>
                      <p>Card ending in {formData.cardNumber.slice(-4)}</p>
                      <p className="text-red-600">Expires {formData.expiryDate}</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="font-medium mb-2">Order Summary</h3>
                    <div className={`p-4 rounded-md ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"}`}>
                      <div className="space-y-4 mb-4">
                        {cartItems.map((item) => (
                          <div key={item.id} className="flex justify-between">
                            <div>
                              <span className="font-medium">{item.name}</span>
                              <span className="text-gray-500 ml-2">x{item.quantity}</span>
                            </div>
                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>

                      <div className="border-t pt-4 space-y-2">
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
                        <div className="flex justify-between font-bold pt-2 border-t">
                          <span>Total</span>
                          <span>${total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <button
                      onClick={handlePrevStep}
                      className={`px-6 py-2 rounded-md ${
                        theme === "dark" ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"
                      } transition-colors`}
                    >
                      Back
                    </button>
                    <button
                      onClick={handleSubmitOrder}
                      className="px-6 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                    >
                      Place Order
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className={`rounded-lg ${theme === "dark" ? "bg-gray-800" : "bg-white"} shadow-md p-6 sticky top-24`}>
              <h2 className="text-lg font-bold mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-start">
                    <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0 mr-4">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 mb-6">
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

                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <div className={`p-4 rounded-md ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"} text-sm`}>
                  <p className="mb-2">
                    <span className="font-medium">Shipping:</span> Standard (3-5 business days)
                  </p>
                  <p>
                    <span className="font-medium">Free shipping</span> on orders over $100
                  </p>
                </div>
              </div>

              <div>
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
      </div>
    </div>
  )
}
