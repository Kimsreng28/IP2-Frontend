"use client";

import SharedFooterComponent from "@/src/app/components/shared/footer";
import {
  Bookmark,
  ChevronLeft,
  ChevronRight,
  ChevronRightIcon,
  HeartIcon,
  Minus,
  Plus,
  ShoppingCartIcon,
  Star,
  ThumbsUp,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProductPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState<
    "ratings" | "questions" | "reviews"
  >("ratings");
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 12,
    minutes: 45,
    seconds: 5,
  });
  const router = useRouter();
  const productId = params.id;

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return {
            ...prev,
            days: prev.days - 1,
            hours: 23,
            minutes: 59,
            seconds: 59,
          };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const images = ["/images/product/image2.png", "/images/product/image1.png"];

  const colors = [
    { name: "White", value: "bg-gray-100", selected: true },
    { name: "Black", value: "bg-gray-900" },
    { name: "Blue", value: "bg-blue-600" },
    { name: "Gray", value: "bg-gray-400" },
  ];

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleClickAddToCart = () => {
    console.log("Add to cart");
    alert("Added to cart");
  };

  return (
    <>
      <div className="w-full bg-gray-50">
        <div className="mx-auto mt-30 flex w-full max-w-7xl items-start justify-start p-5 py-8">
          <div className="flex items-start space-x-2 text-sm font-medium text-gray-700">
            <span className="cursor-pointer text-black hover:text-blue-600">
              Home
            </span>
            <ChevronRightIcon className="h-4 w-4 text-gray-400" />
            <span className="cursor-pointer hover:text-blue-600">Shop</span>
            <ChevronRightIcon className="h-4 w-4 text-gray-400" />
            <span className="cursor-pointer hover:text-blue-600">Product</span>
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="relative overflow-hidden rounded-lg bg-white">
                <div className="relative aspect-square">
                  <Image
                    src={images[selectedImage] || "/placeholder.svg"}
                    alt="Product"
                    fill
                    className="object-contain p-8"
                  />

                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-50"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-50"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Thumbnail Images */}
              <div className="flex space-x-4">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`h-20 w-20 overflow-hidden rounded-lg border-2 bg-white ${
                      selectedImage === index
                        ? "border-gray-900"
                        : "border-gray-200"
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
                    <Star key={i} className="h-4 w-4 fill-black text-black" />
                  ))}
                </div>
                <span className="text-sm text-gray-600">11 Reviews</span>
              </div>

              {/* Title */}
              <h1 className="text-3xl font-bold text-gray-900">Tray Table</h1>

              {/* Description */}
              <p className="leading-relaxed text-gray-600">
                Buy one or buy a few and make every space where you at more
                convenient. Light and easy to move around with removable tray
                top, handy for serving snacks.
              </p>

              {/* Price */}
              <div className="flex items-center space-x-3">
                <span className="text-3xl font-bold text-gray-900">
                  $199.00
                </span>
                <span className="text-xl text-gray-500 line-through">
                  $400.00
                </span>
              </div>

              {/* Countdown Timer */}
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Offer discount in:</p>
                <div className="flex space-x-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {timeLeft.days.toString().padStart(2, "0")}
                    </div>
                    <div className="text-xs text-gray-500">Days</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {timeLeft.hours.toString().padStart(2, "0")}
                    </div>
                    <div className="text-xs text-gray-500">Hours</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {timeLeft.minutes.toString().padStart(2, "0")}
                    </div>
                    <div className="text-xs text-gray-500">Minutes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {timeLeft.seconds.toString().padStart(2, "0")}
                    </div>
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
                  <span className="font-medium text-gray-900">
                    Choose Color
                  </span>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
                <p className="text-gray-900">Black</p>
                <div className="flex space-x-3">
                  {colors.map((color, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedColor(index)}
                      className={`h-12 w-12 rounded-lg border-2 ${
                        selectedColor === index
                          ? "border-gray-900"
                          : "border-gray-200"
                      } ${color.value}`}
                    />
                  ))}
                </div>
              </div>

              {/* Quantity and Actions */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center rounded-lg border border-gray-300">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-3 hover:bg-gray-100"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="min-w-[60px] px-4 py-3 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-3 hover:bg-gray-100"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  {/* Add to Cart wishlist*/}
                  <button
                    onClick={() => {
                      alert("Added to wishlist");
                    }}
                    className="text-grey-900 flex items-center justify-center rounded-lg border-2 border-gray-300  px-30 py-3 font-semibold hover:border-gray-800 hover:bg-gray-200 hover:text-gray-800"
                  >
                    <HeartIcon className="mr-2 h-5 w-5" />
                    Wishlist
                  </button>
                </div>
              </div>

              {/* Add to Cart */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleClickAddToCart}
                  className="flex items-center justify-center rounded-lg  bg-black px-46  py-3 font-semibold text-white  hover:bg-gray-800 hover:text-gray-100"
                >
                  <ShoppingCartIcon className="mr-2 h-5 w-5" />
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-6 py-8">
          {/* Tabs Navigation */}
          <div className="flex border-b border-gray-200">
            {["ratings", "questions", "reviews"].map((tab) => (
              <button
                key={tab}
                onClick={() =>
                  setActiveTab(tab as "ratings" | "questions" | "reviews")
                }
                className={`px-4 py-2 font-medium ${
                  activeTab === tab
                    ? "border-b-2 border-gray-900 text-gray-900"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab === "ratings" && "Ratings (11)"}
                {tab === "questions" && "Questions (0)"}
                {tab === "reviews" && "Reviews (2)"}
              </button>
            ))}
          </div>

          {/* Ratings Tab Content */}
          {activeTab === "ratings" && (
            <>
              {/* Rating Summary */}
              <div className="py-6">
                <div className="flex items-center">
                  <div className="text-4xl font-bold text-gray-900">4.5</div>
                  <div className="ml-4">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${i < 4 ? "fill-black text-black" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                    <div className="text-sm text-gray-600">11 ratings</div>
                  </div>
                </div>
              </div>

              {/* Rating Item */}
              <div className="border-b border-gray-200 pb-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Sofia Harvetz
                  </h3>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-black text-black" />
                    ))}
                  </div>
                </div>
                <p className="mt-2 text-gray-600">
                  I bought it 3 weeks ago and now come back just to say "Awesome
                  Product".
                </p>
                <div className="mt-4 flex items-center space-x-4 text-sm">
                  <button className="flex items-center text-gray-500 hover:text-gray-700">
                    <ThumbsUp className="mr-1 h-4 w-4" />
                    Like
                  </button>
                  <button className="text-gray-500 hover:text-gray-700">
                    Reply
                  </button>
                  <span className="text-xs text-gray-400">3 days ago</span>
                </div>
              </div>
            </>
          )}

          {/* Questions Tab Content */}
          {activeTab === "questions" && (
            <div className="border-b border-gray-200 py-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    John Doe
                  </h3>
                  <p className="mt-1 text-gray-600">
                    Does this product come with a warranty?
                  </p>
                  <div className="mt-3 flex items-center space-x-4 text-sm">
                    <button className="text-gray-500 hover:text-gray-700">
                      Reply
                    </button>
                    <span className="text-xs text-gray-400">1 week ago</span>
                  </div>
                </div>
                <button className="p-1 text-gray-400 hover:text-gray-600">
                  <Bookmark className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          {/* Reviews Tab Content */}
          {activeTab === "reviews" && (
            <div className="py-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Alex Johnson
                </h3>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
              </div>
              <p className="mt-2 text-gray-600">
                The quality exceeded my expectations. Very durable and looks
                exactly like the pictures.
              </p>
              <div className="mt-4 flex items-center space-x-4 text-sm">
                <button className="flex items-center text-gray-500 hover:text-gray-700">
                  <ThumbsUp className="mr-1 h-4 w-4" />
                  Helpful (5)
                </button>
                <button className="text-gray-500 hover:text-gray-700">
                  Comment
                </button>
                <span className="text-xs text-gray-400">2 weeks ago</span>
              </div>
            </div>
          )}

          {/* Load More Button */}
          <button className="mt-6 w-full rounded-lg border border-gray-300 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Load more
          </button>
        </div>
      </div>
      <SharedFooterComponent></SharedFooterComponent>
    </>
  );
}
