"use client"


import { ChevronLeft, ChevronRight, Minus, Plus, Star } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"

export default function ProductPage() {
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 12,
    minutes: 45,
    seconds: 5,
  })

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 }
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 }
        }
        return prev
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const images = ["/headphones-main.png", "/headphones-main.png"]

  const colors = [
    { name: "White", value: "bg-gray-100", selected: true },
    { name: "Black", value: "bg-gray-900" },
    { name: "Blue", value: "bg-blue-600" },
    { name: "Gray", value: "bg-gray-400" },
  ]

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="px-6 py-4 bg-white border-b">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span>Home</span>
          <span>{">"}</span>
          <span>Shop</span>
          <span>{">"}</span>
          <span>Living Room</span>
          <span>{">"}</span>
          <span className="text-gray-900">Product</span>
        </div>
      </nav>

      <div className="px-6 py-8 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative overflow-hidden bg-white rounded-lg">
              {/* <Badge className="absolute z-10 bg-green-500 top-4 left-4 hover:bg-green-600">NEW</Badge>
              <Badge className="absolute z-10 bg-green-500 top-4 left-20 hover:bg-green-600">-50%</Badge> */}

              <div className="relative aspect-square">
                <Image
                  src={images[selectedImage] || "/placeholder.svg"}
                  alt="Product"
                  fill
                  className="object-contain p-8"
                />

                <button
                  onClick={prevImage}
                  className="absolute flex items-center justify-center w-10 h-10 -translate-y-1/2 bg-white rounded-full shadow-md left-4 top-1/2 hover:bg-gray-50"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                  onClick={nextImage}
                  className="absolute flex items-center justify-center w-10 h-10 -translate-y-1/2 bg-white rounded-full shadow-md right-4 top-1/2 hover:bg-gray-50"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Thumbnail Images */}
            <div className="flex space-x-4">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 bg-white rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? "border-gray-900" : "border-gray-200"
                  }`}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`Thumbnail ${index + 1}`}
                    width={80}
                    height={80}
                    className="object-contain p-2"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Rating */}
            <div className="flex items-center space-x-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <span className="text-sm text-gray-600">11 Reviews</span>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900">Tray Table</h1>

            {/* Description */}
            <p className="leading-relaxed text-gray-600">
              Buy one or buy a few and make every space where you at more convenient. Light and easy to move around with
              removable tray top, handy for serving snacks.
            </p>

            {/* Price */}
            <div className="flex items-center space-x-3">
              <span className="text-3xl font-bold text-gray-900">$199.00</span>
              <span className="text-xl text-gray-500 line-through">$400.00</span>
            </div>

            {/* Countdown Timer */}
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Offer discount in:</p>
              <div className="flex space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{timeLeft.days.toString().padStart(2, "0")}</div>
                  <div className="text-xs text-gray-500">Days</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{timeLeft.hours.toString().padStart(2, "0")}</div>
                  <div className="text-xs text-gray-500">Hours</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{timeLeft.minutes.toString().padStart(2, "0")}</div>
                  <div className="text-xs text-gray-500">Minutes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{timeLeft.seconds.toString().padStart(2, "0")}</div>
                  <div className="text-xs text-gray-500">Seconds</div>
                </div>
              </div>
            </div>

            {/* Size */}
            <div className="space-y-2">
              <p className="font-medium text-gray-900">Size</p>
              <p className="text-gray-600">17 1/2×20 5/8 "</p>
            </div>

            {/* Color Selection */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-900">Choose Color</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
              <p className="text-gray-900">Black</p>
              <div className="flex space-x-3">
                {colors.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedColor(index)}
                    className={`w-12 h-12 rounded-lg border-2 ${
                      selectedColor === index ? "border-gray-900" : "border-gray-200"
                    } ${color.value}`}
                  />
                ))}
              </div>
            </div>

            {/* Quantity and Actions */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:bg-gray-50">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-3 min-w-[60px] text-center">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="p-3 hover:bg-gray-50">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* <Button variant="outline" className="w-full h-12 text-base">
                <Heart className="w-5 h-5 mr-2" />
                Wishlist
              </Button>

              <Button className="w-full h-12 text-base bg-gray-900 hover:bg-gray-800">Add to Cart</Button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
