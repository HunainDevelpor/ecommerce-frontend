"use client"

import { createContext, useContext, useState, useEffect } from "react"
import axios from "axios"

const WishlistContext = createContext()

export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState([])

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
  const axiosAuth = axios.create({
    baseURL: "http://localhost:8000/api/wishlist",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  // Load wishlist from backend on mount
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await axiosAuth.get("/")
        if (response.status === 200) {
          setWishlistItems(response.data) // adjust if your backend returns { wishlist: [...] }
        }
      } catch (error) {
        console.error("Failed to fetch wishlist from backend:", error)
      }
    }

    if (token) {
      fetchWishlist()
    }
  }, [token])

  const addToWishlist = async (product) => {
    try {
      const res = await axiosAuth.post(`/${product.id}`)
      if (res.status === 200 || res.status === 201) {
        setWishlistItems((prevItems) => {
          if (!prevItems.some((item) => item.id === product.id)) {
            return [...prevItems, product]
          }
          return prevItems
        })
      }
    } catch (error) {
      console.error("Failed to add to wishlist:", error)
    }
  }

  const removeFromWishlist = async (productId) => {
    try {
      const res = await axiosAuth.delete(`/${productId}`)
      if (res.status === 200) {
        setWishlistItems((prevItems) => prevItems.filter((item) => item.id !== productId))
      }
    } catch (error) {
      console.error("Failed to remove from wishlist:", error)
    }
  }

  const clearWishlist = async () => {
    try {
      const res = await axiosAuth.post("/clear")
      if (res.status === 200) {
        setWishlistItems([])
      }
    } catch (error) {
      console.error("Failed to clear wishlist:", error)
    }
  }

  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item.id === productId)
  }

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }
  return context
}
