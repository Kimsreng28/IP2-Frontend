"use client";

import env from "@/src/envs/env";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { IoClose } from "react-icons/io5";
import { useTheme } from "next-themes";
import { useState } from "react";
import Image from "next/image";

export interface ProductImage {
    id: number;
    product_id: number;
    image_url: string;
    is_primary: boolean;
    created_at: string;
}

export interface Brand {
    id: number;
    name: string;
}

export interface Category {
    id: number;
    name: string;
}

export interface Product {
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
    created_at: string;
    brand: Brand;
    category: Category;
    product_images: ProductImage[];
}

interface ProductDetailViewProps {
    product: Product;
    onClose: () => void; // Only output prop needed
}

const ViewProduct: React.FC<ProductDetailViewProps> = ({
    product,
    onClose
}) => {
    const { theme } = useTheme();

    const fileUrl = `${env.FILE_BASE_URL}`;
    const [selectedImage, setSelectedImage] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const images =
        Array.isArray(product?.product_images) && product.product_images.length > 0
            ? product.product_images.map((img) => fileUrl + img.image_url)
            : ["/images/product/image1.png", "/images/product/image2.png"];

    const nextImage = () => {
        setSelectedImage((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
    };

    const renderStars = (rating: number, size: "sm" | "md" | "lg" = "sm") => {
        const sizeClass =
            size === "sm" ? "w-4 h-4" : size === "md" ? "w-5 h-5" : "w-6 h-6";
        return (
            <div className="flex">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        className={`${sizeClass} ${i < rating ? "fill-yellow-500 text-yellow-500" : "text-gray-300"}`}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="overflow-auto p-3 h-[calc(100vh-15.5rem)]">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold mb-4  ">View Product</h2>
                <button
                    onClick={onClose}
                    className="mb-4 w-7 h-7 flex justify-center items-center hover:bg-gray-300 hover:rounded-full">
                    <IoClose className="w-5 h-5 "/>
                </button>
            </div>
            {error && (
                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                {/* Product Images */}
                <div className="space-y-4 ">
                    <div className="relative overflow-hidden bg-white rounded-lg">
                        <div className="relative aspect-square">
                            <Image
                                src={images[selectedImage] || "/placeholder.svg"}
                                alt={product.name}
                                fill
                                className="object-contain p-8 w-[300px] h-[300px]"
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
                        <div className="flex space-x-4 ">
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
                                        src={image || "/placeholder.svg"}
                                        alt={`${product.name} ${index + 1}`}
                                        width={80}
                                        height={80}
                                        className="object-contain aspect-square p-2"
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
                    <p className="text-xl font-bold text-gray-900">
                        {product.price} $
                    </p>

                    {/* Price */}
                    {/* <div className="flex items-center space-x-3">
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
                    </div> */}

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
                    {/* {priceInfo && (
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
                    )} */}


                </div>
            </div>
        </div>
    )
}

export default ViewProduct;