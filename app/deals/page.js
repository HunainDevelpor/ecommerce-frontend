"use client"

import { useState, useEffect } from "react"
import { ChevronRight, Tag, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { useTheme } from "@/contexts/ThemeContext"
import { sampleProducts } from "@/data/products"
import ProductCard from "@/components/ProductCard"

export default function DealsPage() {
  const { theme } = useTheme()
  const [discountedProducts, setDiscountedProducts] = useState([])
  const [flashSaleProducts, setFlashSaleProducts] = useState([])
  const [clearanceProducts, setClearanceProducts] = useState([])
  const [timeLeft, setTimeLeft] = useState({
    hours: 5,
    minutes: 30,
    seconds: 0,
  })

  useEffect(() => {
    // Get all products with discounts
    const allDiscounted = sampleProducts.filter((product) => product.discount > 0)

    // Sort by discount percentage (highest first)
    const sortedByDiscount = [...allDiscounted].sort((a, b) => b.discount - a.discount)

    setDiscountedProducts(allDiscounted)

    // Flash sale - top 4 discounted products
    setFlashSaleProducts(sortedByDiscount.slice(0, 4))

    // Clearance - random selection of discounted products
    setClearanceProducts(allDiscounted.sort(() => 0.5 - Math.random()).slice(0, 3))
  }, [])

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newSeconds = prev.seconds - 1

        if (newSeconds < 0) {
          const newMinutes = prev.minutes - 1

          if (newMinutes < 0) {
            const newHours = prev.hours - 1

            if (newHours < 0) {
              // Timer finished
              clearInterval(timer)
              return { hours: 0, minutes: 0, seconds: 0 }
            }

            return { hours: newHours, minutes: 59, seconds: 59 }
          }

          return { ...prev, minutes: newMinutes, seconds: 59 }
        }

        return { ...prev, seconds: newSeconds }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <div className="flex items-center text-sm mb-6">
          <Link href="/" className="hover:text-emerald-600 transition-colors">
            Home
          </Link>
          <ChevronRight size={16} className="mx-2" />
          <span className="text-gray-500">Deals</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-8">Special Deals & Offers</h1>

        {/* Flash Sale Banner */}
        <div className={`rounded-lg overflow-hidden mb-12 ${theme === "dark" ? "bg-gray-800" : "bg-emerald-600"}`}>
          <div className="relative">
            <div className="p-8 md:p-12 flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-6 md:mb-0">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="inline-block px-4 py-2 bg-red-600 text-white rounded-full text-sm font-bold mb-4">
                    Flash Sale
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Up to 50% Off Top Electronics</h2>
                  <p className="text-white text-lg mb-6 opacity-90">
                    Limited time offer. Grab the best deals before they're gone!
                  </p>

                  {/* Countdown Timer */}
                  <div className="flex space-x-4 mb-6">
                    <div className="bg-white bg-opacity-20 rounded-lg p-3 text-center min-w-[70px]">
                      <div className="text-2xl font-bold text-white">{timeLeft.hours.toString().padStart(2, "0")}</div>
                      <div className="text-xs text-white uppercase">Hours</div>
                    </div>
                    <div className="bg-white bg-opacity-20 rounded-lg p-3 text-center min-w-[70px]">
                      <div className="text-2xl font-bold text-white">
                        {timeLeft.minutes.toString().padStart(2, "0")}
                      </div>
                      <div className="text-xs text-white uppercase">Minutes</div>
                    </div>
                    <div className="bg-white bg-opacity-20 rounded-lg p-3 text-center min-w-[70px]">
                      <div className="text-2xl font-bold text-white">
                        {timeLeft.seconds.toString().padStart(2, "0")}
                      </div>
                      <div className="text-xs text-white uppercase">Seconds</div>
                    </div>
                  </div>

                  <Link
                    href="#flash-sale"
                    className="inline-block px-6 py-3 bg-white text-emerald-600 rounded-md font-medium hover:bg-gray-100 transition-colors"
                  >
                    Shop Now
                  </Link>
                </motion.div>
              </div>

              <div className="md:w-1/2 flex justify-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="relative h-64 w-64 md:h-80 md:w-80"
                >
                  <Image
                    src="https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?q=80&w=500&auto=format&fit=crop"
                    alt="Flash Sale"
                    fill
                    className="object-cover rounded-lg"
                  />
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Flash Sale Products */}
        <section id="flash-sale" className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold flex items-center">
              <Tag size={24} className="mr-2 text-red-500" />
              Flash Sale
            </h2>
            <Link href="/products" className="text-emerald-600 hover:text-emerald-700 flex items-center">
              View All <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {flashSaleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Deal Categories */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Shop Deals By Category</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                name: "Headphones",
                image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=300&auto=format&fit=crop",
                discount: "Up to 30% Off",
              },
              {
                name: "Smartwatches",
                image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=300&auto=format&fit=crop",
                discount: "Up to 25% Off",
              },
              {
                name: "Speakers",
                image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=300&auto=format&fit=crop",
                discount: "Up to 20% Off",
              },
              {
                name: "Accessories",
                image: "https://images.unsplash.com/photo-1625723044792-44de16ccb4e9?q=80&w=300&auto=format&fit=crop",
                discount: "Up to 15% Off",
              },
            ].map((category, index) => (
              <Link
                href={`/products?category=${category.name.toLowerCase()}`}
                key={index}
                className={`relative rounded-lg overflow-hidden group ${theme === "dark" ? "hover:shadow-emerald-900/30" : "hover:shadow-lg"} transition-all duration-300 hover:-translate-y-1`}
              >
                <div className="aspect-square relative">
                  <Image
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                    <h3 className="text-white font-bold">{category.name}</h3>
                    <p className="text-emerald-400 text-sm font-medium">{category.discount}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Clearance Section */}
        <section className="mb-12">
          <div className={`rounded-lg overflow-hidden ${theme === "dark" ? "bg-gray-800" : "bg-amber-50"} p-6 md:p-8`}>
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/3 mb-6 md:mb-0">
                <h2 className="text-2xl md:text-3xl font-bold mb-3">Clearance Sale</h2>
                <p className={`mb-4 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                  Last chance to grab these items at unbelievable prices. Limited stock available!
                </p>
                <Link
                  href="/products?sort=discount"
                  className="inline-block px-4 py-2 bg-amber-500 text-white rounded-md font-medium hover:bg-amber-600 transition-colors"
                >
                  View All Clearance
                </Link>
              </div>

              <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {clearanceProducts.map((product) => (
                  <Link href={`/product/${product.id}`} key={product.id} className="group">
                    <div
                      className={`rounded-lg overflow-hidden ${theme === "dark" ? "bg-gray-700" : "bg-white"} p-4 transition-transform group-hover:-translate-y-1 duration-300`}
                    >
                      <div className="relative h-32 mb-3">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover rounded"
                        />
                        <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-bl">
                          {product.discount}% OFF
                        </div>
                      </div>
                      <h3 className="font-medium text-sm line-clamp-1">{product.name}</h3>
                      <div className="flex items-center mt-1">
                        <span className="font-bold text-red-500">
                          ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                        </span>
                        <span className="ml-2 text-xs line-through text-gray-500">${product.price.toFixed(2)}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* All Discounted Products */}
        <section>
          <h2 className="text-2xl font-bold mb-6">All Current Deals</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {discountedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Newsletter for Deals */}
        <section className="mt-12">
          <div className={`rounded-lg ${theme === "dark" ? "bg-gray-800" : "bg-emerald-50"} p-8 text-center`}>
            <h2 className="text-2xl font-bold mb-3">Get Exclusive Deals</h2>
            <p className="mb-6 max-w-2xl mx-auto">
              Subscribe to our newsletter and be the first to know about flash sales, exclusive discounts, and special
              offers.
            </p>

            <form className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className={`flex-grow px-4 py-3 rounded-md focus:outline-none ${
                  theme === "dark" ? "bg-gray-700 text-white" : "bg-white"
                }`}
                required
              />
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  )
}
