// "use client"

// import { createContext, useContext, useState, useEffect } from "react"

// const CartContext = createContext()

// export function CartProvider({ children }) {
//   const [cartItems, setCartItems] = useState([])
//   const [cartTotal, setCartTotal] = useState(0)

//   useEffect(() => {
//     // Load cart from localStorage
//     const savedCart = localStorage.getItem("cart")
//     if (savedCart) {
//       try {
//         setCartItems(JSON.parse(savedCart))
//       } catch (error) {
//         console.error("Failed to parse cart from localStorage:", error)
//       }
//     }
//   }, [])

//   useEffect(() => {
//     // Save cart to localStorage
//     localStorage.setItem("cart", JSON.stringify(cartItems))

//     // Calculate cart total
//     const total = cartItems.reduce((sum, item) => {
//       const price = item.discount > 0 ? item.price * (1 - item.discount / 100) : item.price
//       return sum + price * item.quantity
//     }, 0)

//     setCartTotal(total)
//   }, [cartItems])

//   const addToCart = (product) => {
//     setCartItems((prevItems) => {
//       const existingItemIndex = prevItems.findIndex((item) => item.id === product.id)

//       if (existingItemIndex !== -1) {
//         // Item already exists, update quantity
//         const updatedItems = [...prevItems]
//         const newQuantity = updatedItems[existingItemIndex].quantity + (product.quantity || 1)

//         // Check if new quantity exceeds stock
//         if (newQuantity <= product.stock) {
//           updatedItems[existingItemIndex].quantity = newQuantity
//         }

//         return updatedItems
//       } else {
//         // Add new item
//         return [...prevItems, { ...product, quantity: product.quantity || 1 }]
//       }
//     })
//   }

//   const removeFromCart = (productId) => {
//     setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId))
//   }

//   const updateQuantity = (productId, quantity) => {
//     setCartItems((prevItems) =>
//       prevItems.map((item) =>
//         item.id === productId ? { ...item, quantity: Math.min(item.stock, Math.max(1, quantity)) } : item,
//       ),
//     )
//   }

//   const clearCart = () => {
//     setCartItems([])
//   }

//   return (
//     <CartContext.Provider
//       value={{
//         cartItems,
//         cartTotal,
//         addToCart,
//         removeFromCart,
//         updateQuantity,
//         clearCart,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   )
// }

// export function useCart() {
//   const context = useContext(CartContext)
//   if (context === undefined) {
//     throw new Error("useCart must be used within a CartProvider")
//   }
//   return context
// }
// // 



"use client"

import { createContext, useContext, useEffect, useState } from "react"
import axios from "axios"
import { toast } from "react-toastify"

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([])
  const [cartTotal, setCartTotal] = useState(0)
  const [loading, setLoading] = useState(false)

  // Fetch cart from backend
  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true)
      try {
        const response = await axios.get("http://localhost:8000/api/cart", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        const items = response.data.items
        setCartItems(items)

        // Calculate total
        const total = items.reduce((sum, item) => {
          const price = item.discount > 0 ? item.price * (1 - item.discount / 100) : item.price
          return sum + price * item.quantity
        }, 0)

        setCartTotal(total)
      } catch (err) {
        toast.error("Failed to fetch cart items")
      } finally {
        setLoading(false)
      }
    }

    fetchCart()

  }, [])

  const refreshCart = async () => {
    // Optional function you can call to manually re-fetch cart
    try {
      const response = await axios.get("http://localhost:8000/api/cart", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      const items = response.data.items
      setCartItems(items)

      const total = items.reduce((sum, item) => {
        const price = item.discount > 0 ? item.price * (1 - item.discount / 100) : item.price
        return sum + price * item.quantity
      }, 0)

      setCartTotal(total)
    } catch (err) {
      toast.error("Failed to refresh cart")
    }
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartTotal,
        loading,
        refreshCart, // for manually re-fetching if needed
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
