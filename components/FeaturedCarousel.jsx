"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"
import ProductCard from "./ProductCard"
import { useTheme } from "@/contexts/ThemeContext"

export default function FeaturedCarousel({ products }) {
  const { theme } = useTheme()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [visibleProducts, setVisibleProducts] = useState(4)
  const containerRef = useRef(null)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleProducts(1)
      } else if (window.innerWidth < 768) {
        setVisibleProducts(2)
      } else if (window.innerWidth < 1024) {
        setVisibleProducts(3)
      } else {
        setVisibleProducts(4)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + visibleProducts >= products.length ? 0 : prevIndex + 1))
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? Math.max(0, products.length - visibleProducts) : prevIndex - 1))
  }

  const maxIndex = Math.max(0, products.length - visibleProducts)

  return (
    <div className="relative">
      <div className="flex justify-end mb-4 space-x-2">
        <button
          onClick={prevSlide}
          disabled={currentIndex === 0}
          className={`p-2 rounded-full ${
            theme === "dark"
              ? "bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800"
              : "bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100"
          } disabled:opacity-50 transition-colors`}
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={nextSlide}
          disabled={currentIndex >= maxIndex}
          className={`p-2 rounded-full ${
            theme === "dark"
              ? "bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800"
              : "bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100"
          } disabled:opacity-50 transition-colors`}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="overflow-hidden" ref={containerRef}>
        <motion.div
          className="flex"
          animate={{
            x: -currentIndex * (containerRef.current ? containerRef.current.offsetWidth / visibleProducts : 0),
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {products.map((product) => (
            <div key={product.id} className="flex-shrink-0" style={{ width: `${100 / visibleProducts}%` }}>
              <div className="px-2">
                <ProductCard product={product} />
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
