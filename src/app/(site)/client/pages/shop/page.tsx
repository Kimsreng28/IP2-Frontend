"use client"

import { useState } from "react"

const categories = [
  "All Electronic", "Iphone", "Samsung", "Computer",
  "Power Bank", "Headset", "Magsafe", "Tablet", "Charger", "Camera"
]

const initialPriceRanges = [
  { label: "All Price", checked: false },
  { label: "$0.00 - 99.99", checked: true },
  { label: "$100.00 - 199.99", checked: false },
  { label: "$200.00 - 299.99", checked: false },
  { label: "$300.00 - 399.99", checked: false },
  { label: "$400.00+", checked: false },
]

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState("All Electronic")
  const [showAllCategories, setShowAllCategories] = useState(false)
  const [priceRanges, setPriceRanges] = useState(initialPriceRanges)
  const [viewMode, setViewMode] = useState("grid")

  const displayedCategories = showAllCategories
    ? categories
    : categories.slice(0, 8)

  const toggleCategoryView = () => setShowAllCategories(!showAllCategories)

  const togglePriceRange = (index: number) => {
    const updatedRanges = priceRanges.map((range, i) =>
      i === index ? { ...range, checked: !range.checked } : range
    )
    setPriceRanges(updatedRanges)
  }

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-sm ${i < rating ? "text-yellow-400" : "text-gray-300"}`}>
        ★
      </span>
    ))

  return (
    <div className="container px-4 py-8 mx-auto">
      {/* Banner */}
      <div className="flex justify-center">
        <img src="/images/banner/image.png" alt="Shop Banner" />
      </div>

      <div className="container px-4 py-8 mx-auto">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="flex-shrink-0 w-64 space-y-6">
            {/* Filter Header */}
            <div className="flex items-center gap-2">
              <span className="font-medium">Filter</span>
            </div>

            {/* Categories */}
            <div>
              <h3 className="mb-3 font-medium">CATEGORIES</h3>
              <div className="space-y-2">
                {displayedCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`block w-full text-left px-2 py-1 text-sm hover:text-purple-600 ${selectedCategory === category
                        ? "text-purple-600 font-medium"
                        : "text-gray-600"
                      }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {categories.length > 8 && (
                <button
                  onClick={toggleCategoryView}
                  className="mt-2 text-sm text-purple-600 hover:underline"
                >
                  {showAllCategories ? "See less" : "See more"}
                </button>
              )}
            </div>

            {/* Price Range */}
            <div>
              <h3 className="mb-3 font-medium">PRICE</h3>
              <div className="space-y-2">
                {priceRanges.map((range, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`price-${index}`}
                      checked={range.checked}
                      onChange={() => togglePriceRange(index)}
                      className="cursor-pointer"
                    />
                    <label htmlFor={`price-${index}`} className="text-sm text-gray-600 cursor-pointer">
                      {range.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-medium">Living Room</h2>
              {/* Add sort, view toggle etc. here if needed */}
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Replace with dynamic product cards */}
              <h1 className="text-center text-gray-500 col-span-full">Product</h1>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
