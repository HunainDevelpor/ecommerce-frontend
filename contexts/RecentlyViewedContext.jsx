"use client"

import { createContext, useContext, useState, useEffect } from "react"

const RecentlyViewedContext = createContext()

export function RecentlyViewedProvider({ children }) {
  const [recentlyViewed, setRecentlyViewed] = useState([])
  const MAX_ITEMS = 10

  useEffect(() => {
    // Load recently viewed from localStorage
    const savedItems = localStorage.getItem("recentlyViewed")
    if (savedItems) {
      try {
        setRecentlyViewed(JSON.parse(savedItems))
      } catch (error) {
        console.error("Failed to parse recently viewed from localStorage:", error)
      }
    }
  }, [])

  useEffect(() => {
    // Save recently viewed to localStorage
    localStorage.setItem("recentlyViewed", JSON.stringify(recentlyViewed))
  }, [recentlyViewed])

  const addToRecentlyViewed = (product) => {
    setRecentlyViewed((prevItems) => {
      // Remove the product if it already exists
      const filteredItems = prevItems.filter((item) => item.id !== product.id)

      // Add the product to the beginning of the array
      const newItems = [product, ...filteredItems]

      // Limit the number of items
      return newItems.slice(0, MAX_ITEMS)
    })
  }

  const clearRecentlyViewed = () => {
    setRecentlyViewed([])
  }

  return (
    <RecentlyViewedContext.Provider
      value={{
        recentlyViewed,
        addToRecentlyViewed,
        clearRecentlyViewed,
      }}
    >
      {children}
    </RecentlyViewedContext.Provider>
  )
}

export function useRecentlyViewed() {
  const context = useContext(RecentlyViewedContext)
  if (context === undefined) {
    throw new Error("useRecentlyViewed must be used within a RecentlyViewedProvider")
  }
  return context
}
