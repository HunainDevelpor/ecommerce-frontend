"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { ChevronRight, Heart, Share2, ShoppingCart, Star, Minus, Plus, Check } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useTheme } from "@/contexts/ThemeContext"
import { useCart } from "@/contexts/CartContext"
import { useWishlist } from "@/contexts/WishlistContext"
import { useRecentlyViewed } from "@/contexts/RecentlyViewedContext"
import { useToast } from "@/contexts/ToastContext"
import { sampleProducts } from "@/data/products"
import ProductCard from "@/components/ProductCard"
import LoadingIndicator from "@/components/LoadingIndicator"

export default function ProductPage() {
  const { theme } = useTheme()
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const { addToRecentlyViewed, recentlyViewed } = useRecentlyViewed()
  const { showToast } = useToast()
  const params = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState("description")
  const [relatedProducts, setRelatedProducts] = useState([])
  const [showShareOptions, setShowShareOptions] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false)
  const [selectedColor, setSelectedColor] = useState("")
  const [selectedVariant, setSelectedVariant] = useState("")

  useEffect(() => {
    // Simulate API call to fetch product
    const fetchProduct = () => {
      setLoading(true)
      setTimeout(() => {
        const foundProduct = sampleProducts.find((p) => p.id.toString() === params.id)
        if (foundProduct) {
          setProduct(foundProduct)
          setSelectedColor(foundProduct.colors?.[0] || "")
          setSelectedVariant(foundProduct.variants?.[0] || "")
          if (foundProduct) {
            addToRecentlyViewed(foundProduct)
          }

          // Get related products from the same category
          const related = sampleProducts
            .filter((p) => p.category === foundProduct.category && p.id !== foundProduct.id)
            .slice(0, 4)
          setRelatedProducts(related)
        }
        setLoading(false)
      }, 500)
    }

    fetchProduct()
  }, [params.id, addToRecentlyViewed])

  const handleAddToCart = () => {
    if (product) {
      setIsAddingToCart(true)

      // Simulate a delay to show loading state
      setTimeout(() => {
        addToCart({
          ...product,
          quantity,
          selectedColor,
          selectedVariant,
        })
        setIsAddingToCart(false)
        showToast(`${product.name} added to cart`, "success")
      }, 500)
    }
  }

  const handleToggleWishlist = () => {
    if (product) {
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
  }

  const handleShare = () => {
    setShowShareOptions(!showShareOptions)
  }

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1)
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  if (loading) {
    return (
      <div className={`min-h-screen ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-emerald-600"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className={`min-h-screen ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
            <p className="mb-6">The product you are looking for does not exist.</p>
            <Link
              href="/products"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    )
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
          <Link href="/products" className="hover:text-emerald-600 transition-colors">
            Products
          </Link>
          <ChevronRight size={16} className="mx-2" />
          <Link
            href={`/category/${product.category.toLowerCase().replace(" ", "-")}`}
            className="hover:text-emerald-600 transition-colors"
          >
            {product.category}
          </Link>
          <ChevronRight size={16} className="mx-2" />
          <span className="text-gray-500">{product.name}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 mb-12">
          {/* Product Images */}
          <div className="lg:w-1/2">
            <div className="relative aspect-square mb-4 rounded-lg overflow-hidden">
              <Image
                src={product.images?.[selectedImage] || product.image || "/placeholder.svg?height=600&width=600"}
                alt={product.name}
                fill
                className="object-cover"
              />
              {product.discount > 0 && (
                <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-2 py-1 rounded">
                  {product.discount}% OFF
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-20 h-20 rounded-md overflow-hidden ${
                      selectedImage === index ? "ring-2 ring-emerald-600" : ""
                    }`}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} - view ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="lg:w-1/2">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{product.name}</h1>

            <div className="flex items-center mb-4">
              <div className="flex text-amber-400">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    size={18}
                    fill={index < product.rating ? "currentColor" : "none"}
                    className={index < product.rating ? "" : "text-gray-300"}
                  />
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-500">
                {product.rating.toFixed(1)} ({product.reviewCount} reviews)
              </span>
            </div>

            <div className="mb-4">
              {product.discount > 0 ? (
                <div className="flex items-center">
                  <span className="text-2xl font-bold">
                    ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                  </span>
                  <span className="ml-2 text-lg line-through text-gray-500">${product.price.toFixed(2)}</span>
                  <span className="ml-2 bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded">
                    Save ${(product.price * (product.discount / 100)).toFixed(2)}
                  </span>
                </div>
              ) : (
                <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
              )}
            </div>

            <p className="text-gray-500 mb-6">{product.description}</p>

            {/* Stock Status */}
            <div className="mb-6">
              {product.stock > 10 ? (
                <span className="text-emerald-600 flex items-center">
                  <Check size={16} className="mr-1" /> In Stock
                </span>
              ) : product.stock > 0 ? (
                <span className="text-amber-500 flex items-center">
                  <Check size={16} className="mr-1" /> Low Stock - Only {product.stock} left
                </span>
              ) : (
                <span className="text-red-500">Out of Stock</span>
              )}
            </div>

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <h3 className="font-medium mb-2">Color</h3>
                <div className="flex space-x-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full border-2 ${
                        selectedColor === color ? "border-emerald-600" : "border-transparent"
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    ></button>
                  ))}
                </div>
              </div>
            )}

            {/* Variant Selection */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-6">
                <h3 className="font-medium mb-2">Variant</h3>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant) => (
                    <button
                      key={variant}
                      onClick={() => setSelectedVariant(variant)}
                      className={`px-3 py-1 rounded-md border ${
                        selectedVariant === variant
                          ? "border-emerald-600 bg-emerald-50 text-emerald-600"
                          : theme === "dark"
                            ? "border-gray-700 bg-gray-800"
                            : "border-gray-300 bg-white"
                      }`}
                    >
                      {variant}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Quantity</h3>
              <div className="flex items-center">
                <button
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  className={`p-2 rounded-l-md ${
                    theme === "dark" ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-200 hover:bg-gray-300"
                  } ${quantity <= 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <Minus size={16} />
                </button>
                <input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.min(product.stock, Math.max(1, Number.parseInt(e.target.value) || 1)))
                  }
                  className={`w-16 text-center py-2 ${
                    theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-900"
                  } border-y ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}
                />
                <button
                  onClick={incrementQuantity}
                  disabled={quantity >= product.stock}
                  className={`p-2 rounded-r-md ${
                    theme === "dark" ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-200 hover:bg-gray-300"
                  } ${quantity >= product.stock ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || isAddingToCart}
                className={`flex-1 flex items-center justify-center px-6 py-3 rounded-md font-medium ${
                  product.stock === 0 || isAddingToCart
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-emerald-600 hover:bg-emerald-700 text-white"
                } transition-colors`}
              >
                {isAddingToCart ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                    Adding to Cart...
                  </>
                ) : (
                  <>
                    <ShoppingCart size={20} className="mr-2" /> Add to Cart
                  </>
                )}
              </button>

              <button
                onClick={handleToggleWishlist}
                disabled={isTogglingWishlist}
                className={`sm:w-12 flex items-center justify-center rounded-md ${
                  isTogglingWishlist
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : isInWishlist(product.id)
                      ? "bg-red-500 text-white"
                      : theme === "dark"
                        ? "bg-gray-800 text-white"
                        : "bg-gray-200 text-gray-700"
                } hover:opacity-90 transition-colors`}
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
                  <Heart size={20} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
                )}
              </button>

              <div className="relative sm:w-12">
                <button
                  onClick={handleShare}
                  className={`w-full flex items-center justify-center py-3 rounded-md ${
                    theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-700"
                  } hover:opacity-90 transition-colors`}
                >
                  <Share2 size={20} />
                </button>

                {showShareOptions && (
                  <div
                    className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg z-10 ${
                      theme === "dark" ? "bg-gray-800" : "bg-white"
                    }`}
                  >
                    <div className="py-1">
                      {["Facebook", "Twitter", "Pinterest", "Email"].map((option) => (
                        <button
                          key={option}
                          className={`block w-full text-left px-4 py-2 text-sm ${
                            theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"
                          }`}
                          onClick={() => setShowShareOptions(false)}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Info */}
            <div className={`p-4 rounded-md ${theme === "dark" ? "bg-gray-800" : "bg-gray-100"} text-sm`}>
              <div className="flex items-center mb-2">
                <span className="font-medium mr-2">SKU:</span>
                <span>
                  {product.model}-{product.id}
                </span>
              </div>
              <div className="flex items-center mb-2">
                <span className="font-medium mr-2">Category:</span>
                <Link
                  href={`/category/${product.category.toLowerCase().replace(" ", "-")}`}
                  className="text-emerald-600 hover:underline"
                >
                  {product.category}
                </Link>
              </div>
              <div className="flex items-center">
                <span className="font-medium mr-2">Brand:</span>
                <Link
                  href={`/brand/${product.brand.toLowerCase().replace(" ", "-")}`}
                  className="text-emerald-600 hover:underline"
                >
                  {product.brand}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        <div className="mb-12">
          <div className="flex border-b">
            {["description", "specifications", "reviews"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 font-medium capitalize ${
                  activeTab === tab
                    ? "border-b-2 border-emerald-600 text-emerald-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="py-6">
            {activeTab === "description" && (
              <div>
                <p className="mb-4">{product.fullDescription}</p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt,
                  nisl nisl aliquam nisl, eget aliquam nisl nisl eget nisl. Nullam auctor, nisl eget ultricies
                  tincidunt, nisl nisl aliquam nisl, eget aliquam nisl nisl eget nisl.
                </p>
              </div>
            )}

            {activeTab === "specifications" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`p-4 rounded-md ${theme === "dark" ? "bg-gray-800" : "bg-gray-100"}`}>
                  <h3 className="font-bold mb-2">Product Specifications</h3>
                  <ul className="space-y-2">
                    <li className="flex justify-between">
                      <span className="text-gray-500">Brand</span>
                      <span className="font-medium">{product.brand}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-500">Model</span>
                      <span className="font-medium">{product.model}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-500">Color Options</span>
                      <span className="font-medium">{product.colors?.join(", ") || "N/A"}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-500">Variants</span>
                      <span className="font-medium">{product.variants?.join(", ") || "N/A"}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-500">Release Date</span>
                      <span className="font-medium">{product.createdAt}</span>
                    </li>
                  </ul>
                </div>
                <div className={`p-4 rounded-md ${theme === "dark" ? "bg-gray-800" : "bg-gray-100"}`}>
                  <h3 className="font-bold mb-2">Technical Details</h3>
                  <ul className="space-y-2">
                    <li className="flex justify-between">
                      <span className="text-gray-500">Connectivity</span>
                      <span className="font-medium">Bluetooth 5.0</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-500">Battery Life</span>
                      <span className="font-medium">Up to 24 hours</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-500">Water Resistance</span>
                      <span className="font-medium">IPX7</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-500">Warranty</span>
                      <span className="font-medium">1 Year</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-500">Package Contents</span>
                      <span className="font-medium">Device, Manual, Charger</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div>
                <div className="flex items-center mb-6">
                  <div className="mr-4">
                    <div className="text-4xl font-bold">{product.rating.toFixed(1)}</div>
                    <div className="flex text-amber-400">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                          key={index}
                          size={16}
                          fill={index < Math.round(product.rating) ? "currentColor" : "none"}
                          className={index < Math.round(product.rating) ? "" : "text-gray-300"}
                        />
                      ))}
                    </div>
                    <div className="text-sm text-gray-500">{product.reviewCount} reviews</div>
                  </div>
                  <div className="flex-1">
                    {[5, 4, 3, 2, 1].map((star) => (
                      <div key={star} className="flex items-center mb-1">
                        <div className="w-10 text-sm text-gray-500">{star} star</div>
                        <div className="w-full h-2 mx-2 bg-gray-200 rounded-full">
                          <div
                            className="h-2 bg-amber-400 rounded-full"
                            style={{
                              width: `${
                                star === 5 ? "70" : star === 4 ? "20" : star === 3 ? "5" : star === 2 ? "3" : "2"
                              }%`,
                            }}
                          ></div>
                        </div>
                        <div className="w-10 text-sm text-gray-500">
                          {star === 5 ? "70" : star === 4 ? "20" : star === 3 ? "5" : star === 2 ? "3" : "2"}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md transition-colors">
                    Write a Review
                  </button>
                </div>

                <div className="space-y-6">
                  {[
                    {
                      name: "John D.",
                      rating: 5,
                      date: "2 months ago",
                      comment:
                        "Excellent product! The quality is outstanding and it works exactly as described. I would definitely recommend it to anyone looking for a reliable device.",
                    },
                    {
                      name: "Sarah M.",
                      rating: 4,
                      date: "3 months ago",
                      comment:
                        "Very good product overall. The only minor issue is that the battery life could be a bit better, but otherwise it's perfect for my needs.",
                    },
                    {
                      name: "Michael R.",
                      rating: 5,
                      date: "4 months ago",
                      comment:
                        "I've been using this for a few months now and I'm very impressed with the performance. The design is sleek and modern, and it's very user-friendly.",
                    },
                  ].map((review, index) => (
                    <div key={index} className={`p-4 rounded-md ${theme === "dark" ? "bg-gray-800" : "bg-gray-100"}`}>
                      <div className="flex justify-between mb-2">
                        <div className="font-medium">{review.name}</div>
                        <div className="text-sm text-gray-500">{review.date}</div>
                      </div>
                      <div className="flex text-amber-400 mb-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            fill={i < review.rating ? "currentColor" : "none"}
                            className={i < review.rating ? "" : "text-gray-300"}
                          />
                        ))}
                      </div>
                      <p>{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}

        {/* Recently Viewed */}
        {recentlyViewed.length > 1 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Recently Viewed</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentlyViewed
                .filter((p) => p.id !== product.id)
                .slice(0, 4)
                .map((viewedProduct) => (
                  <ProductCard key={viewedProduct.id} product={viewedProduct} />
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Loading Indicator */}
      <LoadingIndicator isLoading={isAddingToCart || isTogglingWishlist} message="Processing..." />
    </div>
  )
}
