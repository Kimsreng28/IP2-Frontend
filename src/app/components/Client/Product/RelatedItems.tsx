"use client";

import env from "@/src/envs/env";
import { Product } from "@/src/interface/product.interface";
import { mdiHeart, mdiHeartOutline } from "@mdi/js";
import Icon from "@mdi/react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
interface RelatedItemsProps {
    productId: number;
}

const RelatedItems: React.FC<RelatedItemsProps> = ({ productId }) => {
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const fileUrl = `${env.FILE_BASE_URL}`
    const router = useRouter();
    
    useEffect(() => {
        fetchRelated();
    }, [productId, userId]);


    const getHeaders = () => {
        const headers: HeadersInit = { "Content-Type": "application/json" };
        const token = localStorage.getItem("token");
        if (token) headers["Authorization"] = `Bearer ${token}`;
        return headers;
    };

    const fetchRelated = async () => {
        setLoading(true);
        try {
            const res = await fetch(
                `${env.API_BASE_URL}/client/shop/product/${productId}/relative/${userId}`,
                { method: "GET", headers: getHeaders() }
            );

            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

            const result = await res.json();
            const data: Product[] = result.data || [];

            setRelatedProducts(data);
            setError(null);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to fetch related products"
            );
        } finally {
            setLoading(false);
        }
    };

    const toggleFavorite = async (id: number) => {
        // Optimistic UI update
        setRelatedProducts((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, is_favorite: !item.is_favorite } : item
            )
        );

        try {
            const currentItem = relatedProducts.find((item) => item.id === id);
            const newFavoriteStatus = !currentItem?.is_favorite;
            const response = await fetch(
                `${env.API_BASE_URL}/client/home/wishlists/${id}/${userId}`,
                {
                    method: "PATCH",
                    headers: getHeaders(),
                    body: JSON.stringify({ is_favorite: newFavoriteStatus }),
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result.error) {
                throw new Error(result.error);
            }
        } catch (error) {
            // Revert optimistic change on error
            setRelatedProducts((prev) =>
                prev.map((item) =>
                    item.id === id ? { ...item, is_favorite: !item.is_favorite } : item
                )
            );

            const errorMessage =
                error instanceof Error ? error.message : "Failed to update favorite status";
            console.error("Error updating favorite status:", errorMessage);
            setError(errorMessage);
        }
    };

    return (
        <div className="container mx-auto mt-10">
            <h2 className="px-5 mb-4 text-2xl font-semibold text-black dark:text-gray-300">
                Related Products
            </h2>

            {loading ? (
                <p className="text-center text-gray-500">Loading...</p>
            ) : error ? (
                <p className="text-center text-red-500">{error}</p>
            ) : relatedProducts.length === 0 ? (
                <p className="text-center text-gray-500">No related products found.</p>
            ) : (
                <div className="pl-5 mb-4 overflow-x-auto scrollbar-hide">
                    <div className="flex gap-4 w-max">
                        {relatedProducts.map((item) => (
                            <div key={item.id} className="flex gap-1">
                                <div className="group relative min-h-[20px] min-w-[260px] max-w-[260px] overflow-hidden rounded-xl border bg-gray-100 p-4 shadow-sm hover:shadow-md dark:bg-transparent">
                                    {/* NEW Badge */}
                                    {item.is_new && (
                                        <div className="absolute px-2 py-1 text-xs font-bold text-black bg-white rounded left-2 top-2">
                                            NEW
                                        </div>
                                    )}

                                    {/* Favorite Icon */}
                                    <motion.div
                                        onClick={() => toggleFavorite(item.id)}
                                        role="button"
                                        aria-label={item.is_favorite ? "Remove from favorites" : "Add to favorites"}
                                        tabIndex={0}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" || e.key === " ") toggleFavorite(item.id);
                                        }}
                                        className="absolute z-10 cursor-pointer right-2 top-2"
                                        whileTap={{ scale: 0.8 }}
                                        whileHover={{ scale: 1.1 }}
                                    >
                                        <Icon
                                            className={`${item.is_favorite ? "text-red-500" : "text-gray-400"
                                                }`}
                                            path={item.is_favorite ? mdiHeart : mdiHeartOutline}
                                            size={1}
                                        />
                                    </motion.div>

                                    {/* Image */}
                                    <div className="relative mb-4 h-[240px] w-full overflow-hidden rounded">
                                        <img
                                            onClick={() => router.push(`/client/pages/shop/view/${item.id}`)}
                                            src={fileUrl + item.product_images?.[0]?.image_url || "/images/product/image.png"}
                                            alt={item.name}
                                            className="object-contain cursor-pointer w-full h-full transition-transform duration-300 group-hover:scale-105"
                                            onError={(e) => {
                                                e.currentTarget.src = "/images/product/image.png";
                                            }}
                                        />
                                        <button className="absolute inset-x-0 bottom-0 py-2 text-sm font-medium text-white transition-all duration-500 translate-y-full bg-black opacity-0 hover:bg-gray-800 group-hover:translate-y-0 group-hover:opacity-100 dark:bg-gray-300 dark:text-gray-700">
                                            Add to cart
                                        </button>
                                    </div>

                                    {/* Info */}
                                    <div>
                                        <div className="flex items-center mt-1">
                                            {Array.from({ length: 5 }, (_, i) => {
                                                const filled = i < (item.stars ?? 0);
                                                return (
                                                    <span
                                                        key={i}
                                                        className={`inline-block ${filled
                                                            ? "text-black dark:text-gray-300"
                                                            : "text-gray-300 dark:text-gray-600"
                                                            }`}
                                                    >
                                                        <Star
                                                            className={`w-5 h-5 ${filled ? "fill-current" : ""}`}
                                                            strokeWidth={filled ? 0 : 1.5}
                                                        />
                                                    </span>
                                                );
                                            })}
                                        </div>

                                        <h3 className="mb-1 min-w-[220px] max-w-[220px] text-base font-semibold text-black dark:text-gray-300">
                                            {item.name}
                                        </h3>
                                        <p className="text-[13px] font-bold text-black dark:text-gray-300">
                                            ${item.price.toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default RelatedItems;
