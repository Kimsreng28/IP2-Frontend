"use client";

import env from "@/src/envs/env";
import { Calendar, Heart, MessageCircle, Send, ThumbsUp, User } from "lucide-react";
import React, { useEffect, useState } from "react";

interface User {
    id: number;
    first_name: string;
    last_name: string;
    avatar?: string;
    role?: string;
}

interface Question {
    id: number;
    product_id: number;
    user_id: number | null;
    question: string;
    answer?: string | null;
    created_at: string;
    user: any;
    likes: number;
    isLiked?: boolean;
    comments?: Comment[];
}

interface Comment {
    id: number;
    user: any;
    comment: string;
    created_at: string;
}

interface QuestionsProps {
    productId: number;
}

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

const Questions: React.FC<QuestionsProps> = ({ productId }) => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [newQuestion, setNewQuestion] = useState("");
    const [newComment, setNewComment] = useState<{ [key: number]: string }>({});
    const [showComments, setShowComments] = useState<{ [key: number]: boolean }>({});
    const [submitLoading, setSubmitLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [userId, setUserId] = useState<number | null>(null);

    const fetchQuestions = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${env.API_BASE_URL}/client/shop/product/${productId}/question`, {
                method: "GET",
                headers: getHeaders(),
            });

            if (!response.ok) throw new Error("Failed to fetch questions");

            const result = await response.json();
            setQuestions(
                Array.isArray(result)
                    ? result.map((q: Question) => ({
                        ...q,
                        isLiked: q.isLiked ?? false,
                        comments: q.comments?.map((c: Comment) => ({
                            ...c,
                            user: c.user ?? null
                        })) ?? []
                    }))
                    : []
            );
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to fetch questions");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!newQuestion.trim()) return;

        setSubmitLoading(true);
        setError(null);
        try {
            const response = await fetch(`${env.API_BASE_URL}/client/shop/product/${productId}/question`, {
                method: "POST",
                headers: getHeaders(),
                body: JSON.stringify({
                    question: newQuestion.trim()
                }),
            });

            if (!response.ok) throw new Error("Failed to submit question");

            setNewQuestion("");
            await fetchQuestions(); // Refresh the list
        } catch (err) {
            setError("Failed to submit question");
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleLike = async (questionId: number) => {
        try {
            // Optimistic update
            setQuestions(prev => prev.map(q =>
                q.id === questionId
                    ? { ...q, isLiked: !q.isLiked, likes: q.likes + (q.isLiked ? -1 : 1) }
                    : q
            ));

            const response = await fetch(
                `${env.API_BASE_URL}/client/shop/product/${productId}/questions/${questionId}/like`,
                {
                    method: "POST",
                    headers: getHeaders(),
                    body: JSON.stringify({ like: true }),
                }
            );

            if (!response.ok) throw new Error("Failed to like question");

            // Optional: Update with server response if needed
            const updatedQuestion = await response.json();
            if (updatedQuestion) {
                setQuestions(prev => prev.map(q =>
                    q.id === questionId
                        ? { ...q, likes: updatedQuestion.likes ?? q.likes, isLiked: updatedQuestion.isLiked ?? q.isLiked }
                        : q
                ));
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to like question");
            // Revert on error
            fetchQuestions();
        }
    };

    const handleComment = async (questionId: number) => {
        const comment = newComment[questionId]?.trim();
        if (!comment) return;

        try {
            const response = await fetch(
                `${env.API_BASE_URL}/client/shop/product/${productId}/questions/${questionId}/comments`,
                {
                    method: "POST",
                    headers: getHeaders(),
                    body: JSON.stringify({ comment }),
                }
            );

            if (!response.ok) throw new Error("Failed to add comment");

            setNewComment(prev => ({ ...prev, [questionId]: "" }));
            await fetchQuestions(); // Refresh to get the new comment
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to add comment");
        }
    };

    const toggleComments = (questionId: number) => {
        setShowComments(prev => ({ ...prev, [questionId]: !prev[questionId] }));
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

        if (diffInHours < 24) {
            return `${Math.floor(diffInHours)}h ago`;
        } else {
            return date.toLocaleDateString();
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            // In a real app, decode the token to get user ID
            setUserId(1); // Temporary - replace with actual user ID
        }
        fetchQuestions();
    }, [productId]);

    return (
        <div className="max-w-4xl px-4 py-8 mx-auto">
            <div className="p-8 bg-white shadow-lg rounded-2xl">
                <div className="flex items-center gap-3 mb-8">
                    <MessageCircle className="text-gray-900 w-7 h-7" />
                    <h2 className="text-2xl font-bold text-gray-900">Questions & Answers</h2>
                </div>

                {/* New Question Input */}
                <div className="p-6 mb-8 border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                    <h3 className="mb-4 text-lg font-semibold text-gray-800">Ask a Question</h3>
                    <div className="space-y-4">
                        <textarea
                            className="w-full p-4 transition-all border-2 border-gray-200 rounded-lg resize-none"
                            placeholder="What would you like to know about this product?"
                            rows={3}
                            value={newQuestion}
                            onChange={(e) => setNewQuestion(e.target.value)}
                        />
                        <button
                            onClick={handleSubmit}
                            disabled={submitLoading || !newQuestion.trim()}
                            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${submitLoading || !newQuestion.trim()
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-gray-700 hover:bg-gray-800 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                }`}
                        >
                            <Send className="w-4 h-4" />
                            {submitLoading ? "Submitting..." : "Submit Question"}
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="p-4 mb-6 border border-red-200 rounded-lg bg-red-50">
                        <p className="text-red-600">{error}</p>
                    </div>
                )}

                {/* Questions List */}
                <div className="space-y-6">
                    {questions.length === 0 ? (
                        <div className="py-12 text-center">
                            <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                            <p className="text-lg text-gray-500">
                                No questions yet. Be the first to ask!
                            </p>
                        </div>
                    ) : (
                        questions.map((q) => (
                            <div
                                key={q.id}
                                className="p-6 transition-shadow bg-white border border-gray-200 shadow-sm rounded-xl hover:shadow-md"
                            >
                                {/* Question Header */}
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="flex-shrink-0">
                                        {q.user?.avatar ? (
                                            <img
                                                src={q.user.avatar}
                                                alt={`${q.user.first_name} ${q.user.last_name}`}
                                                className="object-cover w-10 h-10 rounded-full"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center w-10 h-10 bg-gray-300 rounded-full">
                                                <User className="w-5 h-5 text-gray-600" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="font-semibold text-gray-900">
                                                {q.user?.first_name && q.user?.last_name
                                                    ? `${q.user.first_name} ${q.user.last_name}`
                                                    : "Anonymous"}
                                            </h4>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <Calendar className="w-4 h-4" />
                                            {formatDate(q.created_at)}
                                        </div>
                                    </div>
                                </div>

                                {/* Question */}
                                <div className="mb-4">
                                    <p className="text-lg leading-relaxed text-gray-800">{q.question}</p>
                                </div>

                                {/* Answer */}
                                {q.answer ? (
                                    <div className="p-4 mb-4 border-l-4 border-green-500 rounded-r-lg bg-green-50">
                                        <div className="flex items-center gap-2 mb-2">
                                            <ThumbsUp className="w-4 h-4 text-green-600" />
                                            <span className="font-medium text-green-800">Answer</span>
                                        </div>
                                        <p className="leading-relaxed text-green-700">{q.answer}</p>
                                    </div>
                                ) : (
                                    <div className="p-4 mb-4 border-l-4 border-yellow-400 rounded-r-lg bg-yellow-50">
                                        <p className="font-medium text-yellow-700">
                                            ⏳ Waiting for an answer from the seller
                                        </p>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex items-center gap-4 mb-4">
                                    <button
                                        onClick={() => handleLike(q.id)}
                                        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${q.isLiked
                                            ? "bg-red-50 text-red-600 border border-red-200"
                                            : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"
                                            }`}
                                    >
                                        <Heart className={`w-4 h-4 ${q.isLiked ? "fill-current" : ""}`} />
                                        <span className="font-medium">{q.likes || 0}</span>
                                    </button>
                                    <button
                                        onClick={() => toggleComments(q.id)}
                                        className="flex items-center gap-2 px-3 py-2 text-gray-600 transition-colors border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100"
                                    >
                                        <MessageCircle className="w-4 h-4" />
                                        <span className="font-medium">{q.comments?.length || 0} Comments</span>
                                    </button>
                                </div>

                                {/* Comments Section */}
                                {showComments[q.id] && (
                                    <div className="pt-4 mt-4 border-t border-gray-200">
                                        {/* Add Comment */}
                                        <div className="flex gap-3 mb-4">
                                            <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 bg-gray-300 rounded-full">
                                                <User className="w-4 h-4 text-gray-600" />
                                            </div>
                                            <div className="flex flex-1 gap-2">
                                                <input
                                                    type="text"
                                                    placeholder="Add a comment..."
                                                    value={newComment[q.id] || ""}
                                                    onChange={(e) => setNewComment(prev => ({ ...prev, [q.id]: e.target.value }))}
                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                                                    onKeyPress={(e) => e.key === 'Enter' && handleComment(q.id)}
                                                />
                                                <button
                                                    onClick={() => handleComment(q.id)}
                                                    disabled={!newComment[q.id]?.trim()}
                                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${newComment[q.id]?.trim()
                                                        ? "bg-gray-700 text-white hover:bg-gray-800"
                                                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                                        }`}
                                                >
                                                    Post
                                                </button>
                                            </div>
                                        </div>

                                        {/* Comments List */}
                                        {q.comments && q.comments.length > 0 && (
                                            <div className="space-y-3">
                                                {q.comments.map((comment) => (
                                                    <div key={comment.id} className="flex gap-3">
                                                        <div className="flex-shrink-0">
                                                            {comment.user.avatar ? (
                                                                <img
                                                                    src={comment.user.avatar}
                                                                    alt={`${comment.user.first_name} ${comment.user.last_name}`}
                                                                    className="object-cover w-8 h-8 rounded-full"
                                                                />
                                                            ) : (
                                                                <div className="flex items-center justify-center w-8 h-8 bg-gray-300 rounded-full">
                                                                    <User className="w-4 h-4 text-gray-600" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex-1 p-3 rounded-lg bg-gray-50">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className="text-sm font-medium text-gray-900">
                                                                    {comment.user.first_name} {comment.user.last_name}
                                                                </span>
                                                                <span className="text-xs text-gray-500">
                                                                    {formatDate(comment.created_at)}
                                                                </span>
                                                            </div>
                                                            <p className="text-sm text-gray-700">{comment.comment}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Questions;