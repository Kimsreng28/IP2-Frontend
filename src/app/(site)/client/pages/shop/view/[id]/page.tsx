"use client";

import Questions from "@/src/app/components/Client/Product/Questions";
import RelatedItems from "@/src/app/components/Client/Product/RelatedItems";
import Reviews from "@/src/app/components/Client/Product/Reviews";
import SharedFooterComponent from "@/src/app/components/shared/footer";
import env from "@/src/envs/env";
import { getUserFromLocalStorage } from "@/src/utils/getUser";
import {
  ChevronLeft,
  ChevronRight,
  ChevronRightIcon,
  Heart,
  HeartIcon,
  Minus,
  Plus,
  ShoppingCartIcon,
  Star,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Product interface based on your API response
interface Product {
  id: number;
  uuid: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category_id: number;
  stars: number;
  brand_id: number;
  is_new_arrival: boolean;
  is_best_seller: boolean;
  is_favorite: boolean;
  created_at: string;
  category: {
    id: number;
    name: string;
  };
  brand: {
    id: number;
    name: string;
  };
  product_images: Array<{
    id: number;
    image_url: string;
  }>;
  discounts: Array<{
    id: number;
    discount_percentage: number;
    start_date: string;
    end_date: string;
  }>;
}

// Helper function to get headers with token if available
const getHeaders = () => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  // Get token from localStorage if available (only on client side)
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  return headers;
};

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

  // Product data states
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdatingWishlist, setIsUpdatingWishlist] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const router = useRouter();
  const productId = params.id;
  // Fetch product data
  useEffect(() => {
    const user = getUserFromLocalStorage(); // ensures it's fully completed
    setUserId(user.id);
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${env.API_BASE_URL}/client/shop/product/${productId}/${userId}`,
          {
            method: "GET",
            headers: getHeaders(),
          },
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setProduct(result.data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch product",
        );
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };
    console.log(userId)
    if (productId && userId) {
      fetchProduct();
    }
  }, [productId, userId]);

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

  const fileUrl = "https://files.ele-sale.shop/api/file/";
  const images =
    Array.isArray(product?.product_images) && product.product_images.length > 0
      ? product.product_images.map((img) => new URL(img.image_url, fileUrl).href)
      : ["/images/product/image1.png", "/images/product/image2.png"];

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

  const handleAddToWishlist = async () => {
    if (!product || isUpdatingWishlist) return;

    setIsUpdatingWishlist(true);

    // Optimistically update the UI
    const previousFavoriteState = product.is_favorite;
    setProduct((prev) =>
      prev ? { ...prev, is_favorite: !prev.is_favorite } : null,
    );

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth");
        return;
      }

      const response = await fetch(
        `${env.API_BASE_URL}/client/home/wishlists/${productId}/${userId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        // Revert on error
        setProduct((prev) =>
          prev ? { ...prev, is_favorite: previousFavoriteState } : null,
        );
        throw new Error("Failed to update wishlist");
      }

      // Dispatch update event
      window.dispatchEvent(new Event("wishlistUpdated"));
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsUpdatingWishlist(false);
    }
  };

  const getDiscountedPrice = () => {
    // Early return if no product or invalid product data
    if (!product || typeof product !== 'object' || !('price' in product)) {
      return null;
    }

    // Safely check for discounts array
    const discounts = Array.isArray(product?.discounts) ? product.discounts : [];

    // Find active discount with date validation
    const activeDiscount = discounts.find(discount => {
      try {
        if (!discount || !discount.start_date || !discount.end_date) return false;

        const now = new Date();
        const startDate = new Date(discount.start_date);
        const endDate = new Date(discount.end_date);

        // Additional date validation
        if (isNaN(endDate.getTime())) return false;

        return now >= startDate && now <= endDate;
      } catch (e) {
        console.error('Error processing discount dates:', e);
        return false;
      }
    });

    // Calculate discount if valid
    if (activeDiscount &&
      typeof activeDiscount.discount_percentage === 'number' &&
      !isNaN(product.price)) {
      const percentage = Math.min(100, Math.max(0, activeDiscount.discount_percentage));
      const discountedPrice = product.price * (1 - percentage / 100);

      return {
        original: product.price,
        discounted: parseFloat(discountedPrice.toFixed(2)),
        percentage
      };
    }

    return null;
  };
  const priceInfo = getDiscountedPrice();

  // Render stars based on product rating
  const renderStars = (rating: number, size: "sm" | "md" | "lg" = "sm") => {
    const sizeClass =
      size === "sm" ? "w-4 h-4" : size === "md" ? "w-5 h-5" : "w-6 h-6";
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`${sizeClass} ${i < rating ? "fill-black text-black" : "text-gray-300"}`}
          />
        ))}
      </div>
    );
  };

  // Add to Cart
  const handleAddToCart = async (productId: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth");
        return;
      }

      const response = await fetch(`${env.API_BASE_URL}/client/shop/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId,
          quantity: 1,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message ?? "Failed to add to cart");
      }

      // Dispatch custom event with updated count
      window.dispatchEvent(
        new CustomEvent("cartUpdated", {
          detail: { count: data.count }, // Ensure your API returns the new count
        }),
      );
    } catch (error) {
      console.error("Cart error:", error);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="w-full bg-gray-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-32 h-32 mx-auto border-b-2 border-gray-900 rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading product...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="w-full bg-gray-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="mb-2 text-2xl font-bold text-gray-900">
              Product Not Found
            </h2>
            <p className="mb-4 text-gray-600">
              {error || "The product you are looking for does not exist."}
            </p>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 text-white bg-black rounded-lg hover:bg-gray-800"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full bg-gray-50">
        <div className="flex items-start justify-start w-full p-5 py-8 mx-auto mt-30 max-w-7xl">
          <div className="flex items-start space-x-2 text-sm font-medium text-gray-700">
            <span
              className="text-black cursor-pointer hover:text-blue-600"
              onClick={() => router.push("/client/home")}
            >
              Home
            </span>
            <ChevronRightIcon className="w-4 h-4 text-gray-400" />
            <span
              className="cursor-pointer hover:text-blue-600"
              onClick={() => router.push("/client/pages/shop")}
            >
              Shop
            </span>
            <ChevronRightIcon className="w-4 h-4 text-gray-400" />
            <span className="cursor-pointer hover:text-blue-600">
              {product.category?.name}
            </span>
            <ChevronRightIcon className="w-4 h-4 text-gray-400" />
            <span className="text-gray-500">{product.name}</span>
          </div>
        </div>

        <div className="px-6 py-8 mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="relative overflow-hidden bg-white rounded-lg">
                <div className="relative aspect-square">
                  <img
                    src={images[selectedImage] || "/placeholder.svg"}
                    alt={product.name}
                    className="object-contain p-8"
                  />

                  {images.length > 1 && (
                    <>
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
                    </>
                  )}
                </div>
              </div>

              {/* Thumbnail Images */}
              {images.length > 1 && (
                <div className="flex space-x-4">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`h-20 w-20 overflow-hidden rounded-lg border-2 bg-white ${selectedImage === index
                        ? "border-gray-900"
                        : "border-gray-200"
                        }`}
                    >
                      <Image
                        src={image || "/image2.png"}
                        alt={`${product.name} ${index + 1}`}
                        width={80}
                        height={80}
                        className="object-contain p-2"
                        onError={() => console.error(`Failed to load image: ${image}`)}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              {/* Rating */}
              <div className="flex items-center space-x-2">
                {renderStars(product.stars)}
                <span className="text-sm text-gray-600">
                  {product.stars} out of 5 stars
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl font-bold text-gray-900">
                {product.name}
              </h1>

              {/* Brand */}
              <p className="text-lg text-gray-600">by {product.brand?.name}</p>

              {/* Description */}
              <p className="leading-relaxed text-gray-600">
                {product.description}
              </p>

              {/* Price */}
              <div className="flex items-center space-x-3">
                {priceInfo ? (
                  <>
                    <span className="text-3xl font-bold text-gray-900">
                      ${priceInfo.discounted.toFixed(2)}
                    </span>
                    <span className="text-xl text-gray-500 line-through">
                      ${priceInfo.original.toFixed(2)}
                    </span>
                    <span className="px-2 py-1 text-sm font-medium text-red-600 bg-red-100 rounded">
                      {priceInfo.percentage}% OFF
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-bold text-gray-900">
                    ${product.price?.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex items-center space-x-2">
                <span
                  className={`inline-block h-2 w-2 rounded-full ${product.stock > 0 ? "bg-green-500" : "bg-red-500"}`}
                ></span>
                <span className="text-sm text-gray-600">
                  {product.stock > 0
                    ? `${product.stock} in stock`
                    : "Out of stock"}
                </span>
              </div>

              {/* Badges */}
              <div className="flex space-x-2">
                {product.is_new_arrival && (
                  <span className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-full">
                    New Arrival
                  </span>
                )}
                {product.is_best_seller && (
                  <span className="px-3 py-1 text-xs font-medium text-orange-600 bg-orange-100 rounded-full">
                    Best Seller
                  </span>
                )}
              </div>

              {/* Countdown Timer (only show if there's an active discount) */}
              {priceInfo && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    Offer discount ends in:
                  </p>
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
              )}

              {/* Color Selection */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-900">
                    Choose Color
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
                <p className="text-gray-900">{colors[selectedColor].name}</p>
                <div className="flex space-x-3">
                  {colors.map((color, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedColor(index)}
                      className={`h-12 w-12 rounded-lg border-2 ${selectedColor === index
                        ? "border-gray-900"
                        : "border-gray-200"
                        } ${color.value}`}
                    />
                  ))}
                </div>
              </div>

              {/* Quantity and Actions */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                  {/* Quantity Selector */}
                  <div className="flex items-center border border-gray-300 rounded-lg w-fit">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 sm:p-3 hover:bg-gray-100 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="min-w-[50px] sm:min-w-[60px] px-3 sm:px-4 py-2 sm:py-3 text-center font-medium">
                      {quantity}
                    </span>
                    <button
                      onClick={() =>
                        setQuantity(Math.min(product.stock, quantity + 1))
                      }
                      className="p-2 sm:p-3 hover:bg-gray-100 transition-colors"
                      disabled={quantity >= product.stock}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Action Buttons Container */}
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 flex-1">
                    {/* Add to Wishlist */}
                    <button
                      onClick={handleAddToWishlist}
                      disabled={isUpdatingWishlist}
                      className={`flex items-center justify-center rounded-lg border-2 px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-semibold transition-colors ${product.is_favorite
                        ? "border-red-300 bg-red-50 text-red-600 hover:bg-red-100"
                        : "border-gray-300 bg-white text-gray-900 hover:border-gray-800 hover:bg-gray-50"
                        } ${isUpdatingWishlist ? "cursor-not-allowed opacity-50" : ""}`}
                    >
                      {product.is_favorite ? (
                        <Heart className="w-4 h-4 sm:w-5 sm:h-5 mr-2 fill-current" />
                      ) : (
                        <HeartIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      )}
                      <span className="whitespace-nowrap">
                        {product.is_favorite ? "In Wishlist" : "Add to Wishlist"}
                      </span>
                    </button>

                    {/* Add to Cart */}
                    <button
                      onClick={() => handleAddToCart(product.id)}
                      disabled={product.stock === 0}
                      className={`flex items-center justify-center rounded-lg px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base font-semibold transition-colors ${product.stock === 0
                        ? "cursor-not-allowed bg-gray-100 text-gray-600"
                        : "bg-black text-white hover:bg-gray-800 hover:text-gray-100"
                        }`}
                    >
                      <ShoppingCartIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      <span className="whitespace-nowrap">
                        {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-8 mx-auto max-w-7xl">
          {/* Tabs Navigation */}
          <div className="flex border-b border-gray-200">
            {["ratings", "questions", "reviews"].map((tab) => (
              <button
                key={tab}
                onClick={() =>
                  setActiveTab(tab as "ratings" | "questions" | "reviews")
                }
                className={`px-4 py-2 font-medium capitalize ${activeTab === tab
                  ? "border-b-2 border-gray-900 text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                {tab === "ratings" && `Relate Items`}
                {tab === "questions" && "Questions"}
                {tab === "reviews" && "Reviews"}
              </button>
            ))}
          </div>

          {/* Ratings Tab Content */}
          {activeTab === "ratings" && (
            <>
              <RelatedItems productId={product.id} />
            </>
          )}

          {/* Questions Tab Content */}
          {activeTab === "questions" && (
            <>
              <Questions productId={product.id} />
            </>
          )}

          {/* Reviews Tab Content */}
          {activeTab === "reviews" && (
            <>
              <Reviews productId={product.id} />
            </>
          )}
        </div>
      </div>
      <SharedFooterComponent />
    </>
  );
}