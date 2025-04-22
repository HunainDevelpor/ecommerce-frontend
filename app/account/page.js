"use client"

import { useState } from "react"
import { User, Package, Heart, CreditCard, LogOut, Bell, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { useTheme } from "@/contexts/ThemeContext"
import { useWishlist } from "@/contexts/WishlistContext"

export default function AccountPage() {
  const { theme } = useTheme()
  const { wishlistItems } = useWishlist()
  const [activeTab, setActiveTab] = useState("dashboard")

  // Mock user data
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop",
    joined: "January 2023",
    orders: [
      {
        id: "ORD-123456",
        date: "2023-12-15",
        status: "Delivered",
        total: 249.97,
        items: 3,
      },
      {
        id: "ORD-123455",
        date: "2023-11-28",
        status: "Processing",
        total: 79.99,
        items: 1,
      },
      {
        id: "ORD-123454",
        date: "2023-10-05",
        status: "Delivered",
        total: 129.98,
        items: 2,
      },
    ],
    addresses: [
      {
        id: 1,
        type: "Home",
        default: true,
        street: "123 Main Street",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "United States",
      },
      {
        id: 2,
        type: "Work",
        default: false,
        street: "456 Office Avenue",
        city: "New York",
        state: "NY",
        zipCode: "10002",
        country: "United States",
      },
    ],
    paymentMethods: [
      {
        id: 1,
        type: "Credit Card",
        default: true,
        last4: "4242",
        expiry: "05/25",
        brand: "Visa",
      },
      {
        id: 2,
        type: "Credit Card",
        default: false,
        last4: "1234",
        expiry: "08/24",
        brand: "Mastercard",
      },
    ],
    notifications: {
      orderUpdates: true,
      promotions: true,
      newsletter: false,
      productUpdates: true,
    },
  }

  const tabContent = {
    dashboard: (
      <div>
        <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className={`rounded-lg p-6 ${theme === "dark" ? "bg-gray-800" : "bg-white"} shadow-sm`}>
            <div className="flex items-center mb-4">
              <Package className="h-5 w-5 text-emerald-600 mr-2" />
              <h3 className="font-medium">Orders</h3>
            </div>
            <p className="text-3xl font-bold">{user.orders.length}</p>
            <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
              {user.orders.filter((order) => order.status === "Delivered").length} delivered
            </p>
          </div>

          <div className={`rounded-lg p-6 ${theme === "dark" ? "bg-gray-800" : "bg-white"} shadow-sm`}>
            <div className="flex items-center mb-4">
              <Heart className="h-5 w-5 text-emerald-600 mr-2" />
              <h3 className="font-medium">Wishlist</h3>
            </div>
            <p className="text-3xl font-bold">{wishlistItems.length}</p>
            <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Items saved for later</p>
          </div>

          <div className={`rounded-lg p-6 ${theme === "dark" ? "bg-gray-800" : "bg-white"} shadow-sm`}>
            <div className="flex items-center mb-4">
              <CreditCard className="h-5 w-5 text-emerald-600 mr-2" />
              <h3 className="font-medium">Payment Methods</h3>
            </div>
            <p className="text-3xl font-bold">{user.paymentMethods.length}</p>
            <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Saved payment methods</p>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Recent Orders</h3>
            <button onClick={() => setActiveTab("orders")} className="text-sm text-emerald-600 hover:text-emerald-700">
              View All
            </button>
          </div>

          <div className={`rounded-lg overflow-hidden ${theme === "dark" ? "bg-gray-800" : "bg-white"} shadow-sm`}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead
                  className={`text-xs uppercase ${theme === "dark" ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"}`}
                >
                  <tr>
                    <th className="px-6 py-3 text-left">Order ID</th>
                    <th className="px-6 py-3 text-left">Date</th>
                    <th className="px-6 py-3 text-left">Status</th>
                    <th className="px-6 py-3 text-left">Total</th>
                    <th className="px-6 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {user.orders.slice(0, 3).map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">{order.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{order.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            order.status === "Delivered"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">${order.total.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button className="text-emerald-600 hover:text-emerald-700">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Recently Viewed</h3>
            <Link href="/products" className="text-sm text-emerald-600 hover:text-emerald-700">
              Browse Products
            </Link>
          </div>

          <div className={`rounded-lg p-6 ${theme === "dark" ? "bg-gray-800" : "bg-white"} shadow-sm`}>
            <p className="text-center py-8 text-gray-500">No products viewed recently.</p>
          </div>
        </div>
      </div>
    ),

    profile: (
      <div>
        <h2 className="text-2xl font-bold mb-6">My Profile</h2>

        <div className={`rounded-lg p-6 ${theme === "dark" ? "bg-gray-800" : "bg-white"} shadow-sm mb-8`}>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="relative h-24 w-24 rounded-full overflow-hidden">
              <Image src={user.avatar || "/placeholder.svg"} alt={user.name} fill className="object-cover" />
            </div>

            <div>
              <h3 className="text-xl font-bold">{user.name}</h3>
              <p className={`${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>{user.email}</p>
              <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                Member since {user.joined}
              </p>
            </div>

            <button className="ml-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors">
              Edit Profile
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-medium mb-4">Personal Information</h3>
            <div className={`rounded-lg p-6 ${theme === "dark" ? "bg-gray-800" : "bg-white"} shadow-sm`}>
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">First Name</label>
                    <input
                      type="text"
                      defaultValue="John"
                      className={`w-full px-3 py-2 rounded-md ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"}`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Last Name</label>
                    <input
                      type="text"
                      defaultValue="Doe"
                      className={`w-full px-3 py-2 rounded-md ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"}`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    defaultValue={user.email}
                    className={`w-full px-3 py-2 rounded-md ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"}`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Phone Number</label>
                  <input
                    type="tel"
                    defaultValue="+1 (555) 123-4567"
                    className={`w-full px-3 py-2 rounded-md ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"}`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Date of Birth</label>
                  <input
                    type="date"
                    defaultValue="1990-01-01"
                    className={`w-full px-3 py-2 rounded-md ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"}`}
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Password</h3>
            <div className={`rounded-lg p-6 ${theme === "dark" ? "bg-gray-800" : "bg-white"} shadow-sm`}>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Current Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className={`w-full px-3 py-2 rounded-md ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"}`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">New Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className={`w-full px-3 py-2 rounded-md ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"}`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className={`w-full px-3 py-2 rounded-md ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"}`}
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    ),

    orders: (
      <div>
        <h2 className="text-2xl font-bold mb-6">My Orders</h2>

        <div className={`rounded-lg overflow-hidden ${theme === "dark" ? "bg-gray-800" : "bg-white"} shadow-sm mb-8`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead
                className={`text-xs uppercase ${theme === "dark" ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"}`}
              >
                <tr>
                  <th className="px-6 py-3 text-left">Order ID</th>
                  <th className="px-6 py-3 text-left">Date</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Items</th>
                  <th className="px-6 py-3 text-left">Total</th>
                  <th className="px-6 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {user.orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{order.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === "Delivered"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{order.items}</td>
                    <td className="px-6 py-4 whitespace-nowrap">${order.total.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button className="text-emerald-600 hover:text-emerald-700 mr-3">View</button>
                      {order.status === "Delivered" && (
                        <button className="text-emerald-600 hover:text-emerald-700">Review</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/products"
            className="inline-block px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    ),

    wishlist: (
      <div>
        <h2 className="text-2xl font-bold mb-6">My Wishlist</h2>

        {wishlistItems.length === 0 ? (
          <div className={`rounded-lg p-8 ${theme === "dark" ? "bg-gray-800" : "bg-white"} shadow-sm text-center`}>
            <Heart className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium mb-2">Your wishlist is empty</h3>
            <p className={`mb-6 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
              Items added to your wishlist will appear here
            </p>
            <Link
              href="/products"
              className="inline-block px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((item) => (
              <div
                key={item.id}
                className={`rounded-lg overflow-hidden ${theme === "dark" ? "bg-gray-800" : "bg-white"} shadow-sm`}
              >
                <div className="relative aspect-square">
                  <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                </div>
                <div className="p-4">
                  <h3 className="font-medium mb-1">{item.name}</h3>
                  <div className="flex items-center mb-4">
                    {item.discount > 0 ? (
                      <>
                        <span className="font-bold">${(item.price * (1 - item.discount / 100)).toFixed(2)}</span>
                        <span className="ml-2 text-sm line-through text-gray-500">${item.price.toFixed(2)}</span>
                      </>
                    ) : (
                      <span className="font-bold">${item.price.toFixed(2)}</span>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button className="flex-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors">
                      Add to Cart
                    </button>
                    <button className="px-3 py-2 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-md transition-colors">
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    ),

    addresses: (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">My Addresses</h2>
          <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors">
            Add New Address
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {user.addresses.map((address) => (
            <div
              key={address.id}
              className={`rounded-lg p-6 ${theme === "dark" ? "bg-gray-800" : "bg-white"} shadow-sm relative`}
            >
              {address.default && (
                <span className="absolute top-2 right-2 px-2 py-1 bg-emerald-100 text-emerald-800 text-xs font-medium rounded-full">
                  Default
                </span>
              )}
              <div className="flex items-center mb-4">
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center ${theme === "dark" ? "bg-gray-700" : "bg-emerald-100"} ${theme === "dark" ? "text-emerald-400" : "text-emerald-600"}`}
                >
                  {address.type === "Home" ? "H" : "W"}
                </div>
                <h3 className="ml-2 font-medium">{address.type}</h3>
              </div>
              <div className="space-y-1 mb-4">
                <p>{address.street}</p>
                <p>
                  {address.city}, {address.state} {address.zipCode}
                </p>
                <p>{address.country}</p>
              </div>
              <div className="flex space-x-2">
                <button className="text-sm text-emerald-600 hover:text-emerald-700">Edit</button>
                {!address.default && (
                  <>
                    <span className="text-gray-300">|</span>
                    <button className="text-sm text-emerald-600 hover:text-emerald-700">Set as Default</button>
                    <span className="text-gray-300">|</span>
                    <button className="text-sm text-red-500 hover:text-red-700">Delete</button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),

    payment: (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Payment Methods</h2>
          <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors">
            Add New Card
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {user.paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`rounded-lg p-6 ${theme === "dark" ? "bg-gray-800" : "bg-white"} shadow-sm relative`}
            >
              {method.default && (
                <span className="absolute top-2 right-2 px-2 py-1 bg-emerald-100 text-emerald-800 text-xs font-medium rounded-full">
                  Default
                </span>
              )}
              <div className="flex items-center mb-4">
                <div
                  className={`h-10 w-16 rounded flex items-center justify-center ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"}`}
                >
                  {method.brand === "Visa" ? (
                    <span className="text-blue-600 font-bold">VISA</span>
                  ) : (
                    <span className="text-red-600 font-bold">MC</span>
                  )}
                </div>
                <div className="ml-3">
                  <h3 className="font-medium">
                    {method.brand} •••• {method.last4}
                  </h3>
                  <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                    Expires {method.expiry}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="text-sm text-emerald-600 hover:text-emerald-700">Edit</button>
                {!method.default && (
                  <>
                    <span className="text-gray-300">|</span>
                    <button className="text-sm text-emerald-600 hover:text-emerald-700">Set as Default</button>
                    <span className="text-gray-300">|</span>
                    <button className="text-sm text-red-500 hover:text-red-700">Delete</button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),

    notifications: (
      <div>
        <h2 className="text-2xl font-bold mb-6">Notification Preferences</h2>

        <div className={`rounded-lg p-6 ${theme === "dark" ? "bg-gray-800" : "bg-white"} shadow-sm`}>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Order Updates</h3>
                <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                  Receive notifications about your order status
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={user.notifications.orderUpdates} readOnly />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Promotions and Deals</h3>
                <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                  Receive notifications about sales and special offers
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={user.notifications.promotions} readOnly />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Newsletter</h3>
                <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                  Receive our weekly newsletter with product updates
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={user.notifications.newsletter} readOnly />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Product Updates</h3>
                <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                  Receive notifications about updates to products you've purchased
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={user.notifications.productUpdates} readOnly />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-600"></div>
              </label>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors">
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    ),
  }

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center text-sm mb-6">
          <Link href="/" className="hover:text-emerald-600 transition-colors">
            Home
          </Link>
          <ChevronRight size={16} className="mx-2" />
          <span className="text-gray-500">My Account</span>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="md:w-1/4">
            <div
              className={`rounded-lg overflow-hidden ${theme === "dark" ? "bg-gray-800" : "bg-white"} shadow-sm mb-6`}
            >
              <div className="p-6 flex items-center">
                <div className="relative h-12 w-12 rounded-full overflow-hidden mr-4">
                  <Image src={user.avatar || "/placeholder.svg"} alt={user.name} fill className="object-cover" />
                </div>
                <div>
                  <h3 className="font-bold">{user.name}</h3>
                  <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>{user.email}</p>
                </div>
              </div>

              <div className={`border-t ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}>
                <nav className="p-2">
                  {[
                    { id: "dashboard", label: "Dashboard", icon: <User size={18} /> },
                    { id: "profile", label: "My Profile", icon: <User size={18} /> },
                    { id: "orders", label: "Orders", icon: <Package size={18} /> },
                    { id: "wishlist", label: "Wishlist", icon: <Heart size={18} /> },
                    { id: "addresses", label: "Addresses", icon: <User size={18} /> },
                    { id: "payment", label: "Payment Methods", icon: <CreditCard size={18} /> },
                    { id: "notifications", label: "Notifications", icon: <Bell size={18} /> },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`flex items-center w-full px-4 py-2 rounded-md mb-1 transition-colors ${
                        activeTab === item.id
                          ? `${theme === "dark" ? "bg-gray-700" : "bg-emerald-50"} text-emerald-600`
                          : `hover:${theme === "dark" ? "bg-gray-700" : "bg-gray-100"}`
                      }`}
                    >
                      <span className="mr-3">{item.icon}</span>
                      {item.label}
                    </button>
                  ))}

                  <Link
                    href="/auth/login"
                    className={`flex items-center w-full px-4 py-2 rounded-md mb-1 transition-colors text-red-500 hover:${
                      theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                    }`}
                  >
                    <LogOut size={18} className="mr-3" />
                    Logout
                  </Link>
                </nav>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:w-3/4">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`rounded-lg ${theme === "dark" ? "bg-gray-800" : "bg-white"} shadow-sm p-6`}
            >
              {tabContent[activeTab]}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
