"use client";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Product = {
  id: number;
  name: string;
  price: number;
  product_images: { url: string }[];
  is_favorite: boolean;
};

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/client/shop/product/wishlist`,
        { headers },
      );

      if (!response.ok) throw new Error("Failed to fetch wishlist");

      const data = await response.json();
      setWishlistItems(data.data || []);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      setWishlistItems([]);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId: number) => {
    try {
      // Optimistic UI update
      setWishlistItems((prev) => prev.filter((item) => item.id !== productId));

      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/client/shop/product/${productId}/wishlist`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) throw new Error("Failed to remove from wishlist");

      // Update the count in navigation
      window.dispatchEvent(new Event("wishlistUpdated"));
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      fetchWishlist(); // Re-fetch if error occurs
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  if (loading) {
    return <div className="py-8 text-center">Loading wishlist...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Your Wishlist</h1>

      {wishlistItems.length === 0 ? (
        <div className="py-12 text-center">
          <p className="mb-4 text-lg">Your wishlist is empty</p>
          <button
            onClick={() => router.push("/client/pages/shop")}
            className="rounded bg-black px-4 py-2 text-white transition-colors hover:bg-gray-800"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {wishlistItems.map((product) => (
            <motion.div
              key={product.id}
              className="overflow-hidden rounded-lg border shadow-sm transition-shadow hover:shadow-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative">
                <img
                  src={
                    product.product_images[0]?.url ||
                    "/images/product/image.png"
                  }
                  alt={product.name}
                  className="h-48 w-full cursor-pointer object-cover"
                  onClick={() =>
                    router.push(`/client/shop/product/${product.id}`)
                  }
                  onError={(e) => {
                    e.currentTarget.src = "/images/product/image.png";
                  }}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromWishlist(product.id);
                  }}
                  className="absolute right-2 top-2 rounded-full bg-white p-2 shadow transition-colors hover:bg-gray-100"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="p-4">
                <h3 className="mb-1 line-clamp-1 font-medium">
                  {product.name}
                </h3>
                <p className="text-lg font-semibold">
                  ${product.price.toFixed(2)}
                </p>
                <button
                  onClick={() =>
                    router.push(`/client/shop/product/${product.id}`)
                  }
                  className="mt-3 w-full rounded bg-black py-2 text-white transition-colors hover:bg-gray-800"
                >
                  View Product
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
