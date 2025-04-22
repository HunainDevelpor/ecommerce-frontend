"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, X, AlertTriangle, Info } from "lucide-react"
import { useTheme } from "@/contexts/ThemeContext"

export default function Toast({ message, type = "success", duration = 3000, onClose }) {
  const { theme } = useTheme()
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      if (onClose) setTimeout(onClose, 300)
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const getIcon = () => {
    switch (type) {
      case "success":
        return <Check className="h-5 w-5 text-green-500" />
      case "error":
        return <X className="h-5 w-5 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />
      default:
        return <Check className="h-5 w-5 text-green-500" />
    }
  }

  const getBgColor = () => {
    if (theme === "dark") {
      switch (type) {
        case "success":
          return "bg-green-900"
        case "error":
          return "bg-red-900"
        case "warning":
          return "bg-yellow-900"
        case "info":
          return "bg-blue-900"
        default:
          return "bg-green-900"
      }
    } else {
      switch (type) {
        case "success":
          return "bg-green-100"
        case "error":
          return "bg-red-100"
        case "warning":
          return "bg-yellow-100"
        case "info":
          return "bg-blue-100"
        default:
          return "bg-green-100"
      }
    }
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-4 right-4 z-50"
        >
          <div
            className={`px-4 py-3 rounded-lg shadow-lg flex items-center ${getBgColor()} ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            <div className="mr-3">{getIcon()}</div>
            <p>{message}</p>
            <button
              onClick={() => {
                setVisible(false)
                if (onClose) setTimeout(onClose, 300)
              }}
              className="ml-4 text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
