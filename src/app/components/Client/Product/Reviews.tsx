"use client";

import env from "@/src/envs/env";
import { getUserFromLocalStorage } from "@/src/utils/getUser";
import { ThumbsDown, ThumbsUp, User } from "lucide-react";
import React, { useEffect, useState } from "react";

interface ReviewsProps {
    productId: number;
}

interface Review {
    id: number;
    rating: number;
    comment?: string;
    likes: number;
    dislikes: number;
    isLiked: boolean;
    isDisliked: boolean;
    created_at: string;
    user: {
        id: number;
        first_name: string;
        last_name: string;
        avatar: string;
    };
}

const renderStars = (
    rating: number,
    interactive: boolean = false,
    onClick?: (rating: number) => void
) => {
    const stars = [1, 2, 3, 4, 5].map((star) => (
        <span
            key={star}
            className={`text-2xl cursor-${interactive ? "pointer" : "default"} ${star <= rating ? "text-black" : "text-gray-300"
                }`}
            onClick={interactive ? () => onClick?.(star) : undefined}
        >
            ★
        </span>
    ));
    return <div className="flex">{stars}</div>;
};

const getHeaders = (): HeadersInit => {
    const headers: HeadersInit = {
        "Content-Type": "application/json",
    };
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (token) headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
};
const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
        return 'now';
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes === 1) {
        return '1 min ago';
    }
    if (diffInMinutes < 60) {
        return `${diffInMinutes} mins ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours === 1) {
        return '1 h ago';
    }
    if (diffInHours < 24) {
        return `${diffInHours} h ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) {
        return '1 d ago';
    }
    if (diffInDays < 7) {
        return `${diffInDays} d ago`;
    }

    return date.toLocaleDateString(); // fallback to full date
};
const Reviews: React.FC<ReviewsProps> = ({ productId }) => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [visibleCount, setVisibleCount] = useState(5);
    const [newReview, setNewReview] = useState("");
    const [rating, setRating] = useState(5);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [userId, setUserId] = useState<number | null>(null);

    const fetchReviews = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${env.API_BASE_URL}/client/shop/product/${productId}/review`, {
                method: "GET",
                headers: getHeaders(),
            });
            if (!response.ok) throw new Error("Failed to fetch reviews");
            const result = await response.json();
            setReviews(
                Array.isArray(result)
                    ? result.map((r: Review) => ({
                        ...r,
                        isLiked: r.isLiked ?? false, // Fallback if backend doesn't provide
                        isDisliked: r.isDisliked ?? false,
                    }))
                    : []
            );
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to fetch reviews");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitReview = async () => {
        if (!newReview.trim()) return;

        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${env.API_BASE_URL}/client/shop/product/${productId}/review/${userId}`, {
                method: "POST",
                headers: getHeaders(),
                body: JSON.stringify({
                    rating,
                    comment: newReview,
                }),
            });
            if (!response.ok) throw new Error("Failed to submit review");
            setNewReview("");
            setRating(5);
            await fetchReviews();
        } catch (err) {
            setError("Failed to submit review");
        } finally {
            setLoading(false);
        }
    };

    const handleToggleLike = async (reviewId: number) => {
        setError(null);
        try {
            // Optimistic update - just increment likes
            setReviews(prev => prev.map(r =>
                r.id === reviewId
                    ? { ...r, likes: r.likes + 1 }
                    : r
            ));

            const response = await fetch(
                `${env.API_BASE_URL}/client/shop/product/${productId}/review/${reviewId}/like`,
                {
                    method: "POST",
                    headers: getHeaders(),
                    body: JSON.stringify({ like: true }), // Always send true to increment
                }
            );

            if (!response.ok) {
                throw new Error(await response.text() || "Failed to add like");
            }

        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to add like");
            // Revert on error
            fetchReviews();
        }
    };

    const handleToggleDislike = async (reviewId: number) => {
        setError(null);
        try {
            // Optimistic update - just increment dislikes
            setReviews(prev => prev.map(r =>
                r.id === reviewId
                    ? { ...r, dislikes: r.dislikes + 1 }
                    : r
            ));

            const response = await fetch(
                `${env.API_BASE_URL}/client/shop/product/${productId}/review/${reviewId}/dislike`,
                {
                    method: "POST",
                    headers: getHeaders(),
                    body: JSON.stringify({ dislike: true }), // Always send true to increment
                }
            );

            if (!response.ok) {
                throw new Error(await response.text() || "Failed to add dislike");
            }

        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to add dislike");
            // Revert on error
            fetchReviews();
        }
    };

    useEffect(() => {
        const user = getUserFromLocalStorage();
        setUserId(user.id);
        fetchReviews();
    }, [productId]);

    const handleSeeMore = () => {
        setVisibleCount((prev) => prev + 20);
    };

    return (
        <div className="py-8 bg-gray-50">
            <div className="max-w-4xl px-4 mx-auto sm:px-6 lg:px-8">
                <h2 className="mb-6 text-2xl font-bold text-gray-900">Customer Reviews ({reviews.length})</h2>

                {/* Write a Review Section */}
                <div className="p-6 mb-8 bg-white rounded-lg shadow-md">
                    <h3 className="mb-4 text-lg font-semibold text-gray-800">Write a Review</h3>
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium text-gray-700">Rating</label>
                        {renderStars(rating, true, setRating)}
                    </div>
                    <textarea
                        className="w-full p-3 border border-gray-300 rounded-lg "
                        placeholder="Share your thoughts about the product..."
                        rows={4}
                        value={newReview}
                        onChange={(e) => setNewReview(e.target.value)}
                    />
                    <button
                        onClick={handleSubmitReview}
                        className="px-6 py-2 mt-4 text-white transition-colors duration-200 bg-gray-700 rounded-lg hover:bg-gray-800"
                        disabled={loading}
                    >
                        {loading ? "Submitting..." : "Submit Review"}
                    </button>
                </div>

                {/* Error or Loading */}
                {loading && <p className="text-center text-gray-500">Loading reviews...</p>}
                {error && <p className="text-center text-red-500">{error}</p>}

                {/* Review List */}
                {!loading && !error && reviews.length === 0 && (
                    <p className="text-center text-gray-500">No reviews yet. Be the first to review!</p>
                )}
                {!loading &&
                    !error &&
                    reviews.slice(0, visibleCount).map((review) => (
                        <div
                            key={review.id}
                            className="p-6 mb-6 bg-white border border-gray-200 rounded-lg shadow-md"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="border border-gray-300 p-2 bg-gray-300 rounded-full">
                                        <User className="w-5 h-5 text-gray-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {review.user.first_name} {review.user.last_name}
                                        </h3>
                                        <span className="text-xs text-gray-400">
                                            {formatDate(review.created_at)}
                                        </span>
                                    </div>
                                </div>
                                {renderStars(review.rating)}
                            </div>
                            {review.comment ? (
                                <p className="mb-4 text-gray-600">{review.comment}</p>
                            ) : (
                                <p className="mb-4 italic text-gray-500">No comment provided</p>
                            )}
                            <div className="flex items-center space-x-6 text-sm">
                                <button
                                    onClick={() => handleToggleLike(review.id)}
                                    className={`flex items-center ${review.isLiked ? "text-blue-600" : "text-gray-500"} hover:text-blue-600 transition-colors duration-200`}
                                >
                                    <ThumbsUp className="w-4 h-4 mr-1" />
                                    <span>{review.likes} Likes</span>
                                </button>

                                <button
                                    onClick={() => handleToggleDislike(review.id)}
                                    className={`flex items-center ${review.isDisliked ? "text-red-600" : "text-gray-500"} hover:text-red-600 transition-colors duration-200`}
                                >
                                    <ThumbsDown className="w-4 h-4 mr-1" />
                                    <span>{review.dislikes} Dislikes</span>
                                </button>
                            </div>
                        </div>
                    ))}

                {/* See More */}
                {visibleCount < reviews.length && (
                    <button
                        onClick={handleSeeMore}
                        className="w-full py-3 mt-6 text-sm font-medium text-gray-700 transition-colors duration-200 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                        See more reviews
                    </button>
                )}
            </div>
        </div>
    );
};

export default Reviews;