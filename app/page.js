"use client"

import { useState, useEffect } from "react"
import { ChevronRight } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import ProductCard from "@/components/ProductCard"
import FeaturedCarousel from "@/components/FeaturedCarousel"
import { useTheme } from "@/contexts/ThemeContext"
import { sampleProducts } from "@/data/products"
import axios from "axios"
export default function Home() {
  const { theme } = useTheme()
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [newArrivals, setNewArrivals] = useState([])


useEffect(() => {
  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/products/get")
      const products = res.data

      // Filter featured products
      const featured = products.filter((product) => product.featured).slice(0, 6)
      setFeaturedProducts(featured)

      // Get new arrivals
      const newArrivals = [...products]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 4)
      setNewArrivals(newArrivals)
    } catch (error) {
      console.error("Error fetching products:", error)
    }
  }

  fetchProducts()
}, [])


  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
      <main>
        {/* Hero Section */}
        <section className={`py-12 ${theme === "dark" ? "bg-gray-800" : "bg-emerald-50"}`}>
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-8 md:mb-0">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h1 className="text-4xl md:text-5xl font-bold mb-4">Tech That Empowers Your Lifestyle</h1>
                  <p className="text-lg mb-6 opacity-80">
                    Discover the latest gadgets and electronics at unbeatable prices.
                  </p>
                  <div className="flex space-x-4">
                    <Link
                      href="/products"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
                    >
                      Shop Now
                    </Link>
                    <Link
                      href="/deals"
                      className={`border ${theme === "dark" ? "border-gray-600 hover:bg-gray-700" : "border-emerald-600 hover:bg-emerald-50"} px-6 py-3 rounded-md font-medium transition-colors`}
                    >
                      View Deals
                    </Link>
                  </div>
                </motion.div>
              </div>
              <div className="md:w-1/2">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="relative h-64 md:h-96"
                >
                  <Image
                    src="https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=500&auto=format&fit=crop"
                    alt="Latest tech gadgets"
                    fill
                    className="object-cover rounded-lg shadow-lg"
                  />
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products Carousel */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-8">Featured Products</h2>
            <FeaturedCarousel products={featuredProducts} />
          </div>
        </section>

        {/* Promotional Banner */}
        <section className={`py-12 ${theme === "dark" ? "bg-gray-800" : "bg-emerald-600"} text-white`}>
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-6 md:mb-0">
                <h2 className="text-2xl md:text-3xl font-bold mb-2">Summer Sale</h2>
                <p className="text-lg opacity-90">Up to 40% off on selected items</p>
              </div>
              <Link
                href="/deals"
                className={`px-6 py-3 rounded-md font-medium ${
                  theme === "dark" ? "bg-gray-700 hover:bg-gray-600" : "bg-white text-emerald-600 hover:bg-emerald-50"
                } transition-colors`}
              >
                Shop the Sale
              </Link>
            </div>
          </div>
        </section>

        {/* New Arrivals */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold">New Arrivals</h2>
              <Link
                href="/products?sort=newest"
                className="flex items-center text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                View all <ChevronRight className="h-5 w-5 ml-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newArrivals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className={`py-12 ${theme === "dark" ? "bg-gray-800" : "bg-gray-100"}`}>
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-8">Shop by Category</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  name: "Earbuds",
                  image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=300&auto=format&fit=crop",
                },
                {
                  name: "Smart Watches",
                  image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=300&auto=format&fit=crop",
                },
                {
                  name: "Chargers",
                  image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?q=80&w=300&auto=format&fit=crop",
                },
                {
                  name: "Headphones",
                  image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=300&auto=format&fit=crop",
                },
              ].map((category, index) => (
                <Link href={`/category/${category.name.toLowerCase().replace(" ", "-")}`} key={index}>
                  <div
                    className={`rounded-lg p-6 text-center transition-transform hover:scale-105 ${
                      theme === "dark" ? "bg-gray-700 hover:bg-gray-600" : "bg-white hover:shadow-md"
                    }`}
                  >
                    <div className="h-24 flex items-center justify-center mb-4">
                      <Image
                        src={category.image || "/placeholder.svg"}
                        alt={category.name}
                        width={80}
                        height={80}
                        className="rounded-full object-cover h-16 w-16"
                      />
                    </div>
                    <h3 className="font-medium">{category.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">What Our Customers Say</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  name: "Alex Johnson",
                  text: "The quality of products and customer service is exceptional. I've been a loyal customer for years!",
                  rating: 5,
                  image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop",
                },
                {
                  name: "Sarah Williams",
                  text: "Fast shipping and the products always arrive in perfect condition. Highly recommend!",
                  rating: 5,
                  image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop",
                },
                {
                  name: "Michael Brown",
                  text: "Great selection of tech products at competitive prices. The website is also very easy to navigate.",
                  rating: 4,
                  image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop",
                },
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`p-6 rounded-lg ${
                    theme === "dark" ? "bg-gray-800 border border-gray-700" : "bg-white shadow-md"
                  }`}
                >
                  <div className="flex items-center mb-4">
                    <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                      <Image
                        src={testimonial.image || "/placeholder.svg"}
                        alt={testimonial.name}
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">{testimonial.name}</h3>
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg
                            key={i}
                            className={`h-4 w-4 ${i < testimonial.rating ? "text-yellow-400" : "text-gray-300"}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="italic">{testimonial.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className={`py-12 ${theme === "dark" ? "bg-gray-800" : "bg-emerald-50"}`}>
          <div className="container mx-auto px-4 max-w-3xl text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Stay Updated</h2>
            <p className="mb-6 opacity-80">
              Subscribe to our newsletter for exclusive deals and updates on new products.
            </p>

            <form className="flex flex-col sm:flex-row gap-2">
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
            <p className="mt-4 text-sm opacity-70">We respect your privacy. Unsubscribe at any time.</p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className={`py-12 ${theme === "dark" ? "bg-gray-900" : "bg-gray-100"}`}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-emerald-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                <span className="ml-2 text-lg font-bold">TechMart</span>
              </div>
              <p className="mb-4 opacity-80">Your one-stop shop for all things tech.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-emerald-600 hover:text-emerald-700">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a href="#" className="text-emerald-600 hover:text-emerald-700">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
                <a href="#" className="text-emerald-600 hover:text-emerald-700">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">Shop</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/products" className="hover:text-emerald-600 transition-colors">
                    All Products
                  </Link>
                </li>
                <li>
                  <Link href="/deals" className="hover:text-emerald-600 transition-colors">
                    Deals
                  </Link>
                </li>
                <li>
                  <Link href="/new-arrivals" className="hover:text-emerald-600 transition-colors">
                    New Arrivals
                  </Link>
                </li>
                <li>
                  <Link href="/best-sellers" className="hover:text-emerald-600 transition-colors">
                    Best Sellers
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">Account</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/account" className="hover:text-emerald-600 transition-colors">
                    My Account
                  </Link>
                </li>
                <li>
                  <Link href="/orders" className="hover:text-emerald-600 transition-colors">
                    Orders
                  </Link>
                </li>
                <li>
                  <Link href="/wishlist" className="hover:text-emerald-600 transition-colors">
                    Wishlist
                  </Link>
                </li>
                <li>
                  <Link href="/cart" className="hover:text-emerald-600 transition-colors">
                    Cart
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">Support</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/contact" className="hover:text-emerald-600 transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-emerald-600 transition-colors">
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link href="/shipping" className="hover:text-emerald-600 transition-colors">
                    Shipping Policy
                  </Link>
                </li>
                <li>
                  <Link href="/returns" className="hover:text-emerald-600 transition-colors">
                    Returns & Refunds
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm opacity-70 mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} TechMart. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link href="/privacy" className="text-sm hover:text-emerald-600 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm hover:text-emerald-600 transition-colors">
                Terms of Service
              </Link>
              <Link href="/sitemap" className="text-sm hover:text-emerald-600 transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
