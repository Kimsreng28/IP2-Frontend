"use client";
import React, { useState } from 'react';
import { useTheme } from 'next-themes';

interface Brand {
    id: number;
    name: string;
}

interface Category {
    id: number;
    name: string;
}

interface ProductImage {
    id: number;
    image_url: string;
    is_primary: boolean;
}

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    category_id: number;
    brand_id: number;
    is_new_arrival: boolean;
    is_best_seller: boolean;
    product_images: ProductImage[];
}

interface UpdateProductProps {
    product: Product;
    brands: Brand[];
    categories: Category[];
    onCancel: () => void;
    onSubmit: (product: {
        id: number;
        name: string;
        description: string;
        price: number;
        stock: number;
        category_id: number;
        brand_id: number;
        is_new_arrival: boolean;
        is_best_seller: boolean;
        product_images: (File | ProductImage)[];
    }) => Promise<void>;
}

const UpdateProduct: React.FC<UpdateProductProps> = ({
    product,
    brands,
    categories,
    onCancel,
    onSubmit
}) => {
    const { theme } = useTheme();
    const [updatedProduct, setUpdatedProduct] = useState({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        category_id: product.category_id,
        brand_id: product.brand_id,
        is_new_arrival: product.is_new_arrival,
        is_best_seller: product.is_best_seller,
        product_images: [...product.product_images] as (File | ProductImage)[],
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            await onSubmit(updatedProduct);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update product');
        } finally {
            setIsSubmitting(false);
        }
    };

    const removeImage = (index: number) => {
        setUpdatedProduct(prev => {
            const updatedImages = [...prev.product_images];
            updatedImages.splice(index, 1);
            return {
                ...prev,
                product_images: updatedImages
            };
        });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const filesArray = Array.from(e.target.files);
            setUpdatedProduct(prev => ({
                ...prev,
                product_images: [...prev.product_images, ...filesArray]
            }));
        }
    };

    return (
        <div className="overflow-auto p-3 h-[calc(100vh-15.5rem)]">
            <div className="overflow-hidden">
                <h2 className="text-lg font-semibold mb-4">Update Product</h2>
                {error && (
                    <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-auto overflow-x-auto">
                        {/* Product Name */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-1">Product Name</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={updatedProduct.name}
                                onChange={(e) => setUpdatedProduct({ ...updatedProduct, name: e.target.value })}
                                required
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium mb-1">Category</label>
                            <select
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={updatedProduct.category_id}
                                onChange={(e) => setUpdatedProduct({ ...updatedProduct, category_id: Number(e.target.value) })}
                                required
                            >
                                <option value="">Select a category</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Brand */}
                        <div>
                            <label className="block text-sm font-medium mb-1">Brand</label>
                            <select
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={updatedProduct.brand_id}
                                onChange={(e) => setUpdatedProduct({ ...updatedProduct, brand_id: Number(e.target.value) })}
                                required
                            >
                                <option value="">Select a brand</option>
                                {brands.map((brand) => (
                                    <option key={brand.id} value={brand.id}>
                                        {brand.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Price */}
                        <div>
                            <label className="block text-sm font-medium mb-1">Price</label>
                            <input
                                type="number"
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={updatedProduct.price}
                                onChange={(e) => setUpdatedProduct({ ...updatedProduct, price: Number(e.target.value) })}
                                onFocus={(e) => {
                                    if (e.target.value === "0") {
                                        e.target.value = "";
                                    }
                                }}
                                onBlur={(e) => {
                                    if (e.target.value === "") {
                                        setUpdatedProduct({ ...updatedProduct, price: 0 });
                                    }
                                }}
                                required
                                min="0"
                                step="0.5"
                            />
                        </div>

                        {/* Stock */}
                        <div>
                            <label className="block text-sm font-medium mb-1">Stock</label>
                            <input
                                type="number"
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={updatedProduct.stock}
                                onChange={(e) => setUpdatedProduct({ ...updatedProduct, stock: Number(e.target.value) })}
                                onFocus={(e) => {
                                    if (e.target.value === "0") {
                                        e.target.value = "";
                                    }
                                }}
                                onBlur={(e) => {
                                    if (e.target.value === "") {
                                        setUpdatedProduct({ ...updatedProduct, stock: 0 });
                                    }
                                }}
                                required
                                min="0"
                            />
                        </div>

                        {/* Description */}
                        <div className="md:col-span-2 flex gap-4">
                            <div className='flex-1'>
                                <label className="block text-sm font-medium mb-1">Description</label>
                                <textarea
                                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    rows={3}
                                    value={updatedProduct.description}
                                    onChange={(e) => setUpdatedProduct({ ...updatedProduct, description: e.target.value })}
                                />
                                <p className="text-xs mt-1">
                                    {updatedProduct.description.length}/1000
                                </p>
                            </div>
                            {/* Flags */}
                            <div className="md:col-span-2 flex flex-col gap-4 py-6 justify-between">
                                <div>
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                            checked={updatedProduct.is_new_arrival}
                                            onChange={(e) => setUpdatedProduct({ ...updatedProduct, is_new_arrival: e.target.checked })}
                                        />
                                        <span className="ml-2 text-sm">New Arrival</span>
                                    </label>
                                </div>
                                <div>
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                            checked={updatedProduct.is_best_seller}
                                            onChange={(e) => setUpdatedProduct({ ...updatedProduct, is_best_seller: e.target.checked })}
                                        />
                                        <span className="ml-2 text-sm">Best Seller</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Image Upload */}
                        <div className="md:col-span-2 grid md:grid-cols-3 gap-4">
                            {/* File input */}
                            <div className='col-span-1'>
                                <div className='flex flex-col gap-3 p-2'>
                                    <label className="block text-sm font-medium mb-1">Product Images</label>
                                    <input
                                        type="file"
                                        className={`block w-full text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-500"
                                            }`}
                                        multiple
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                    <p className="mt-1 text-sm pb-1 font-semibold">
                                        First image will be set as primary
                                    </p>
                                </div>
                            </div>

                            {/* Preview/Message */}
                            <div className='col-span-2'>
                                {updatedProduct.product_images.length > 0 && (
                                    <div className="mt-2">
                                        <h4 className="text-sm font-medium mb-2">Selected Images:</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {updatedProduct.product_images.map((image, index) => (
                                                <div key={index} className="relative  border rounded-lg shadow-md">
                                                    {'image_url' in image ? (
                                                        <img
                                                            src={`${process.env.FILE_BASE_URL}${image.image_url}`}
                                                            alt={`Preview ${index + 1}`}
                                                            className="h-20 w-20 object-cover rounded border"
                                                        />
                                                    ) : (
                                                        <img
                                                            src={URL.createObjectURL(image as File)}
                                                            alt={`Preview ${index + 1}`}
                                                            className="h-20 w-20 object-cover rounded border"
                                                        />
                                                    )}
                                                    {index === 0 && (
                                                        <span className="absolute top-0 left-0 bg-blue-500 text-white text-xs px-1 rounded">
                                                            Primary
                                                        </span>
                                                    )}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImage(index)}
                                                        className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 mt-6">
                        <button
                            type="button"
                            onClick={onCancel}
                            className={`px-4 py-2 text-sm rounded-md ${theme === "dark"
                                ? "bg-gray-700 text-white hover:bg-gray-600"
                                : "bg-gray-300 text-gray-800 hover:bg-gray-400"
                                }`}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || updatedProduct.category_id === 0 || updatedProduct.brand_id === 0}
                            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                        >
                            {isSubmitting ? 'Updating...' : 'Update Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateProduct;