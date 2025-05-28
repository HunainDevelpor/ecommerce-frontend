"use client"

import { useState, useEffect } from "react"
import { Grid, List, SlidersHorizontal, X, ChevronDown, Search } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import ProductCard from "@/components/ProductCard"
import ProductListItem from "@/components/ProductListItem"
import { useTheme } from "@/contexts/ThemeContext"
import { sampleProducts } from "@/data/products"
import axios from "axios"

export default function ProductsPage() {
  const { theme } = useTheme()
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [viewMode, setViewMode] = useState("grid")
  const [filterOpen, setFilterOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState({
    categories: [],
    priceRange: [0, 1000],
    rating: 0,
    colors: [],
    inStock: false,
  })
  const [sortOption, setSortOption] = useState("featured")



// ...

useEffect(() => {
  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/products/get")
      setProducts(res.data)
      setFilteredProducts(res.data)
    } catch (error) {
      console.error("Error fetching products:", error)
    }
  }

  fetchProducts()
}, [])


  useEffect(() => {
    let result = [...products]

    // Apply search query
    if (searchQuery) {
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Apply category filter
    if (filters.categories.length > 0) {
      result = result.filter((product) => filters.categories.includes(product.category))
    }

    // Apply price range filter
    result = result.filter(
      (product) => product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1],
    )

    // Apply rating filter
    if (filters.rating > 0) {
      result = result.filter((product) => product.rating >= filters.rating)
    }

    // Apply color filter
    if (filters.colors.length > 0) {
      result = result.filter((product) => product.colors.some((color) => filters.colors.includes(color)))
    }

    // Apply stock filter
    if (filters.inStock) {
      result = result.filter((product) => product.stock > 0)
    }

    // Apply sorting
    switch (sortOption) {
      case "featured":
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
        break
      case "newest":
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        break
      case "price-low":
        result.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        result.sort((a, b) => b.price - a.price)
        break
      case "rating":
        result.sort((a, b) => b.rating - a.rating)
        break
      default:
        break
    }

    setFilteredProducts(result)
  }, [products, searchQuery, filters, sortOption])

  const handleCategoryChange = (category) => {
    setFilters((prev) => {
      const categories = prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category]
      return { ...prev, categories }
    })
  }

  const handleColorChange = (color) => {
    setFilters((prev) => {
      const colors = prev.colors.includes(color) ? prev.colors.filter((c) => c !== color) : [...prev.colors, color]
      return { ...prev, colors }
    })
  }

  const handlePriceChange = (min, max) => {
    setFilters((prev) => ({ ...prev, priceRange: [min, max] }))
  }

  const handleRatingChange = (rating) => {
    setFilters((prev) => ({ ...prev, rating }))
  }

  const handleStockChange = () => {
    setFilters((prev) => ({ ...prev, inStock: !prev.inStock }))
  }

  const resetFilters = () => {
    setFilters({
      categories: [],
      priceRange: [0, 1000],
      rating: 0,
      colors: [],
      inStock: false,
    })
    setSearchQuery("")
  }

  // Get unique categories from products
  const categories = [...new Set(products.map((product) => product.category))]

  // Get unique colors from products
  const colors = [...new Set(products.flatMap((product) => product.colors || []))]

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          {/* Mobile Filter Button */}
          <div className="w-full md:hidden flex justify-between items-center mb-4">
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className={`flex items-center px-4 py-2 rounded-md ${theme === "dark" ? "bg-gray-800" : "bg-gray-100"}`}
            >
              <SlidersHorizontal size={18} className="mr-2" />
              Filters
            </button>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md ${
                  viewMode === "grid" ? "bg-emerald-600 text-white" : theme === "dark" ? "bg-gray-800" : "bg-gray-100"
                }`}
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md ${
                  viewMode === "list" ? "bg-emerald-600 text-white" : theme === "dark" ? "bg-gray-800" : "bg-gray-100"
                }`}
              >
                <List size={18} />
              </button>
            </div>
          </div>

          {/* Sidebar Filters - Desktop */}
          <div
            className={`hidden md:block w-64 sticky top-24 ${theme === "dark" ? "bg-gray-800" : "bg-white"} rounded-lg p-6 shadow-md`}
          >
            <div className="mb-6">
              <h3 className="font-bold text-lg mb-3">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <label key={category} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.categories.includes(category)}
                      onChange={() => handleCategoryChange(category)}
                      className="mr-2 h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    {category}
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-bold text-lg mb-3">Price Range</h3>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="0"
                  max={filters.priceRange[1]}
                  value={filters.priceRange[0]}
                  onChange={(e) => handlePriceChange(Number(e.target.value), filters.priceRange[1])}
                  className={`w-full p-2 rounded-md ${theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-100"}`}
                />
                <span>to</span>
                <input
                  type="number"
                  min={filters.priceRange[0]}
                  max="1000"
                  value={filters.priceRange[1]}
                  onChange={(e) => handlePriceChange(filters.priceRange[0], Number(e.target.value))}
                  className={`w-full p-2 rounded-md ${theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-100"}`}
                />
              </div>
              <input
                type="range"
                min="0"
                max="1000"
                value={filters.priceRange[1]}
                onChange={(e) => handlePriceChange(filters.priceRange[0], Number(e.target.value))}
                className="w-full mt-2"
              />
            </div>

            <div className="mb-6">
              <h3 className="font-bold text-lg mb-3">Rating</h3>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <label key={rating} className="flex items-center">
                    <input
                      type="radio"
                      name="rating"
                      checked={filters.rating === rating}
                      onChange={() => handleRatingChange(rating)}
                      className="mr-2 h-4 w-4 rounded-full border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div className="flex text-amber-400">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <svg
                          key={index}
                          className={`h-4 w-4 ${index < rating ? "text-amber-400" : "text-gray-300"}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-1">& Up</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-bold text-lg mb-3">Color</h3>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => handleColorChange(color)}
                    className={`h-8 w-8 rounded-full border-2 ${
                      filters.colors.includes(color) ? "border-emerald-600" : "border-transparent"
                    }`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.inStock}
                  onChange={handleStockChange}
                  className="mr-2 h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                In Stock Only
              </label>
            </div>

            <button
              onClick={resetFilters}
              className={`w-full py-2 rounded-md ${
                theme === "dark" ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"
              } transition-colors`}
            >
              Reset Filters
            </button>
          </div>

          {/* Mobile Filters */}
          <AnimatePresence>
            {filterOpen && (
              <motion.div
                initial={{ opacity: 0, x: -300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -300 }}
                className={`fixed inset-0 z-50 ${theme === "dark" ? "bg-gray-900/80" : "bg-black/50"}`}
                onClick={() => setFilterOpen(false)}
              >
                <motion.div
                  initial={{ x: -300 }}
                  animate={{ x: 0 }}
                  exit={{ x: -300 }}
                  className={`absolute top-0 left-0 bottom-0 w-80 ${
                    theme === "dark" ? "bg-gray-800" : "bg-white"
                  } p-6 overflow-y-auto`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Filters</h2>
                    <button onClick={() => setFilterOpen(false)}>
                      <X size={24} />
                    </button>
                  </div>

                  {/* Filter content - same as desktop but styled for mobile */}
                  <div className="mb-6">
                    <h3 className="font-bold text-lg mb-3">Categories</h3>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <label key={category} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.categories.includes(category)}
                            onChange={() => handleCategoryChange(category)}
                            className="mr-2 h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                          />
                          {category}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="font-bold text-lg mb-3">Price Range</h3>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        min="0"
                        max={filters.priceRange[1]}
                        value={filters.priceRange[0]}
                        onChange={(e) => handlePriceChange(Number(e.target.value), filters.priceRange[1])}
                        className={`w-full p-2 rounded-md ${
                          theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-100"
                        }`}
                      />
                      <span>to</span>
                      <input
                        type="number"
                        min={filters.priceRange[0]}
                        max="1000"
                        value={filters.priceRange[1]}
                        onChange={(e) => handlePriceChange(filters.priceRange[0], Number(e.target.value))}
                        className={`w-full p-2 rounded-md ${
                          theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-100"
                        }`}
                      />
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      value={filters.priceRange[1]}
                      onChange={(e) => handlePriceChange(filters.priceRange[0], Number(e.target.value))}
                      className="w-full mt-2"
                    />
                  </div>

                  <div className="mb-6">
                    <h3 className="font-bold text-lg mb-3">Rating</h3>
                    <div className="space-y-2">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <label key={rating} className="flex items-center">
                          <input
                            type="radio"
                            name="rating"
                            checked={filters.rating === rating}
                            onChange={() => handleRatingChange(rating)}
                            className="mr-2 h-4 w-4 rounded-full border-gray-300 text-emerald-600 focus:ring-emerald-500"
                          />
                          <div className="flex text-amber-400">
                            {Array.from({ length: 5 }).map((_, index) => (
                              <svg
                                key={index}
                                className={`h-4 w-4 ${index < rating ? "text-amber-400" : "text-gray-300"}`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="ml-1">& Up</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="font-bold text-lg mb-3">Color</h3>
                    <div className="flex flex-wrap gap-2">
                      {colors.map((color) => (
                        <button
                          key={color}
                          onClick={() => handleColorChange(color)}
                          className={`h-8 w-8 rounded-full border-2 ${
                            filters.colors.includes(color) ? "border-emerald-600" : "border-transparent"
                          }`}
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.inStock}
                        onChange={handleStockChange}
                        className="mr-2 h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      In Stock Only
                    </label>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={resetFilters}
                      className={`flex-1 py-2 rounded-md ${
                        theme === "dark" ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"
                      } transition-colors`}
                    >
                      Reset
                    </button>
                    <button
                      onClick={() => setFilterOpen(false)}
                      className="flex-1 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <div className="flex-1">
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h1 className="text-2xl md:text-3xl font-bold">All Products</h1>

              <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`pl-10 pr-4 py-2 rounded-md w-full ${
                      theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-100"
                    }`}
                  />
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery("")} className="absolute right-3 top-2.5">
                      <X size={16} className="text-gray-400" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <div className="hidden md:flex items-center space-x-2">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded-md ${
                        viewMode === "grid"
                          ? "bg-emerald-600 text-white"
                          : theme === "dark"
                            ? "bg-gray-800"
                            : "bg-gray-100"
                      }`}
                    >
                      <Grid size={18} />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 rounded-md ${
                        viewMode === "list"
                          ? "bg-emerald-600 text-white"
                          : theme === "dark"
                            ? "bg-gray-800"
                            : "bg-gray-100"
                      }`}
                    >
                      <List size={18} />
                    </button>
                  </div>

                  <div className="relative">
                    <button
                      className={`flex items-center px-4 py-2 rounded-md ${
                        theme === "dark" ? "bg-gray-800" : "bg-gray-100"
                      }`}
                      onClick={() => document.getElementById("sort-dropdown").classList.toggle("hidden")}
                    >
                      Sort by:{" "}
                      {sortOption === "price-low"
                        ? "Price: Low to High"
                        : sortOption === "price-high"
                          ? "Price: High to Low"
                          : sortOption === "newest"
                            ? "Newest"
                            : sortOption === "rating"
                              ? "Rating"
                              : "Featured"}
                      <ChevronDown size={16} className="ml-2" />
                    </button>
                    <div
                      id="sort-dropdown"
                      className={`absolute right-0 mt-1 w-48 rounded-md shadow-lg hidden z-10 ${
                        theme === "dark" ? "bg-gray-800" : "bg-white"
                      }`}
                    >
                      <div className="py-1">
                        {[
                          { value: "featured", label: "Featured" },
                          { value: "newest", label: "Newest" },
                          { value: "price-low", label: "Price: Low to High" },
                          { value: "price-high", label: "Price: High to Low" },
                          { value: "rating", label: "Rating" },
                        ].map((option) => (
                          <button
                            key={option.value}
                            className={`block w-full text-left px-4 py-2 ${
                              sortOption === option.value
                                ? "bg-emerald-600 text-white"
                                : theme === "dark"
                                  ? "hover:bg-gray-700"
                                  : "hover:bg-gray-100"
                            }`}
                            onClick={() => {
                              setSortOption(option.value)
                              document.getElementById("sort-dropdown").classList.add("hidden")
                            }}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {(filters.categories.length > 0 ||
              filters.priceRange[0] > 0 ||
              filters.priceRange[1] < 1000 ||
              filters.rating > 0 ||
              filters.colors.length > 0 ||
              filters.inStock ||
              searchQuery) && (
              <div className="mb-6 flex flex-wrap gap-2">
                {filters.categories.map((category) => (
                  <div
                    key={category}
                    className={`flex items-center px-3 py-1 rounded-full text-sm ${
                      theme === "dark" ? "bg-gray-800" : "bg-gray-100"
                    }`}
                  >
                    {category}
                    <button onClick={() => handleCategoryChange(category)} className="ml-2">
                      <X size={14} />
                    </button>
                  </div>
                ))}

                {(filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) && (
                  <div
                    className={`flex items-center px-3 py-1 rounded-full text-sm ${
                      theme === "dark" ? "bg-gray-800" : "bg-gray-100"
                    }`}
                  >
                    ${filters.priceRange[0]} - ${filters.priceRange[1]}
                    <button onClick={() => handlePriceChange(0, 1000)} className="ml-2">
                      <X size={14} />
                    </button>
                  </div>
                )}

                {filters.rating > 0 && (
                  <div
                    className={`flex items-center px-3 py-1 rounded-full text-sm ${
                      theme === "dark" ? "bg-gray-800" : "bg-gray-100"
                    }`}
                  >
                    {filters.rating}+ Stars
                    <button onClick={() => handleRatingChange(0)} className="ml-2">
                      <X size={14} />
                    </button>
                  </div>
                )}

                {filters.colors.map((color) => (
                  <div
                    key={color}
                    className={`flex items-center px-3 py-1 rounded-full text-sm ${
                      theme === "dark" ? "bg-gray-800" : "bg-gray-100"
                    }`}
                  >
                    <span className="inline-block w-3 h-3 rounded-full mr-2" style={{ backgroundColor: color }}></span>
                    {color}
                    <button onClick={() => handleColorChange(color)} className="ml-2">
                      <X size={14} />
                    </button>
                  </div>
                ))}

                {filters.inStock && (
                  <div
                    className={`flex items-center px-3 py-1 rounded-full text-sm ${
                      theme === "dark" ? "bg-gray-800" : "bg-gray-100"
                    }`}
                  >
                    In Stock
                    <button onClick={handleStockChange} className="ml-2">
                      <X size={14} />
                    </button>
                  </div>
                )}

                {searchQuery && (
                  <div
                    className={`flex items-center px-3 py-1 rounded-full text-sm ${
                      theme === "dark" ? "bg-gray-800" : "bg-gray-100"
                    }`}
                  >
                    Search: {searchQuery}
                    <button onClick={() => setSearchQuery("")} className="ml-2">
                      <X size={14} />
                    </button>
                  </div>
                )}

                <button onClick={resetFilters} className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
                  Clear All
                </button>
              </div>
            )}

            {/* Results Count */}
            <p className="mb-6 text-sm">
              Showing {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"}
            </p>

            {/* Products Grid/List */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">No products found</h3>
                <p className="text-gray-500 mb-4">Try adjusting your filters or search query</p>
                <button
                  onClick={resetFilters}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProducts.map((product) => (
                  <ProductListItem key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
