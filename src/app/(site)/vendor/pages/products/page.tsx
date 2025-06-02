"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Icon } from '@iconify/react';

interface ProductImage {
  id: number;
  product_id: number;
  image_url: string;
  is_primary: boolean;
  created_at: string;
}

interface Brand {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  uuid: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category_id: number;
  brand_id: number;
  is_new_arrival: boolean;
  is_best_seller: boolean;
  created_at: string;
  brand: Brand;
  category: Category;
  product_images: ProductImage[];
}

interface ApiResponse {
  products: Product[];
  totalItems: number;
  page: number;
  totalPages: number;
}

interface Brand {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
}

const ProductTable: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [committedSearchTerm, setCommittedSearchTerm] = useState('');
  const [priceSort, setPriceSort] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);


  const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001';
  const FILE_BASE_URL = process.env.FILE_BASE_URL + '/file/';

  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    category_id: 0,
    brand_id: 0,
    is_new_arrival: false,
    is_best_seller: false,
    product_images: [] as File[],
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const url = new URL(`${API_BASE_URL}/api/vendor/product`);
        url.searchParams.append('sortByPrice', priceSort);
        if (committedSearchTerm) {
          url.searchParams.append('keySearch', committedSearchTerm);
        }

        const response = await fetch(url.toString());
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data: ApiResponse = await response.json();
        console.log('Fetched products:', data.products);
        setProducts(data.products);
        setTotalPages(data.totalPages);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [API_BASE_URL, page, priceSort, committedSearchTerm]);

  useEffect(() => {
    const fetchSetupData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/vendor/product/setUp`);
        if (!response.ok) {
          throw new Error('Failed to fetch setup data');
        }
        const data = await response.json();
        setBrands(data.brands ?? []);
        setCategories(data.categories ?? []);
        console.log('Setup data:', data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      }
    };

    fetchSetupData();
  }, [API_BASE_URL]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as HTMLElement).closest('.menu-container')) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleCreateClick = () => {
    setShowCreateForm(true);
  };

  const handleCreateCancel = () => {
    setShowCreateForm(false);
    // Reset form
    setNewProduct({
      name: '',
      description: '',
      price: 0,
      stock: 0,
      category_id: 0,
      brand_id: 0,
      is_new_arrival: false,
      is_best_seller: false,
      product_images: [] as File[],
    });
  };

  // const handleCreateSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   try {
  //     const formData = new FormData();

  //     // Append all product data
  //     formData.append('name', newProduct.name);
  //     formData.append('description', newProduct.description);
  //     formData.append('price', newProduct.price.toString());
  //     formData.append('stock', newProduct.stock.toString());
  //     formData.append('category_id', newProduct.category_id.toString());
  //     formData.append('brand_id', newProduct.brand_id.toString());
  //     formData.append('is_new_arrival', newProduct.is_new_arrival.toString());
  //     formData.append('is_best_seller', newProduct.is_best_seller.toString());
  //     console.log('Form data:', formData.values);
  //     // Append all image files
  //     newProduct.product_images.forEach((file, index) => {
  //       formData.append('product_images', file);
  //     });

  //     const response = await fetch(`${API_BASE_URL}/api/vendor/product`, {
  //       method: 'POST',
  //       body: formData,
  //       // Don't set Content-Type header - the browser will set it automatically with the correct boundary
  //     });

  //     if (!response.ok) {
  //       throw new Error('Failed to create product');
  //     }

  //     const result = await response.json();
  //     console.log('Product created:', result);

  //     // Reset form
  //     setNewProduct({
  //       name: '',
  //       description: '',
  //       price: 0,
  //       stock: 0,
  //       category_id: 0,
  //       brand_id: 0,
  //       is_new_arrival: false,
  //       is_best_seller: false,
  //       product_images: [],
  //     });

  //     // Refresh product list or redirect
  //     setProducts([result.data, ...products]);
  //     setShowCreateForm(false);

  //   } catch (err) {
  //     setError(err instanceof Error ? err.message : 'Failed to create product');
  //   }
  // };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      // Append all product data as strings (converting numbers/booleans)
      formData.append('name', newProduct.name);
      formData.append('description', newProduct.description);
      formData.append('price', newProduct.price.toString());
      formData.append('stock', newProduct.stock.toString());
      formData.append('category_id', newProduct.category_id.toString());
      formData.append('brand_id', newProduct.brand_id.toString());
      formData.append('is_new_arrival', String(newProduct.is_new_arrival));
      formData.append('is_best_seller', String(newProduct.is_best_seller));
      for (let [key, value] of formData.entries()) {
        console.log("before ", key, value);
      }
      // Append each image file
      newProduct.product_images.forEach(file => {
        formData.append('product_images', file);
      });

      // Debug: Show all FormData entries
      for (let [key, value] of formData.entries()) {
        console.log("after", key, value);
      }

      const response = await fetch(`${API_BASE_URL}/api/vendor/product`, {
        method: 'POST',
        body: formData,
        // Let browser set Content-Type with boundary automatically
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create product');
      }

      const result = await response.json();
      console.log('Success:', result);

      // Reset form and update UI
      handleCreateCancel();
      setProducts(prev => [result.data, ...prev]);

    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to create product');
    }
  };

  const removeImage = (index: number) => {
    setNewProduct(prev => {
      const updatedImages = [...prev.product_images];
      updatedImages.splice(index, 1);
      return {
        ...prev,
        product_images: updatedImages
      };
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCommittedSearchTerm(searchTerm);
    setPage(1);
  };


  const togglePriceSort = () => {
    setPriceSort(prev => prev === 'asc' ? 'desc' : 'asc');
    setPage(1);
  };

  const getPrimaryImage = (images: ProductImage[]) => {
    const primaryImage = images.find(img => img.is_primary);

    return primaryImage || images[0] || { image_url: '/placeholder-product.png' };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Products</h1>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto ">
          <form onSubmit={handleSearch} className="flex">
            <input
              type="text"
              placeholder="Search products..."
              className="px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch(e);
                }
              }}
            />
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Search
            </button>
          </form>

          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <span className="mr-2 text-sm text-gray-600">Price:</span>
              <button
                onClick={togglePriceSort}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex items-center"
              >
                {priceSort === 'asc' ? 'Low to High' : 'High to Low'}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 ml-1 ${priceSort === 'asc' ? '' : 'transform rotate-180'}`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            <button
              onClick={() => {
                // Add your create product logic here
                handleCreateClick()
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Create
            </button>
          </div>
        </div>
      </div>
      {showCreateForm ? (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-6">Create New Product</h2>
          <form onSubmit={handleCreateSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={newProduct.category_id}
                  onChange={(e) => setNewProduct({ ...newProduct, category_id: Number(e.target.value) })}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={newProduct.brand_id}
                  onChange={(e) => setNewProduct({ ...newProduct, brand_id: Number(e.target.value) })}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                  required
                  min="0"
                  step="0.01"
                />
              </div>

              {/* Stock */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
                  required
                  min="0"
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows={3}
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                />
                <p className="text-xs text-gray-500 mt-1">{newProduct.description.length}/1000</p>
              </div>

              {/* Image Upload */}
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Preview/Message */}
                <div>
                  {newProduct.product_images.length > 0 && (
                    <div className="mt-2">
                      <h4 className="text-sm font-medium text-gray-700">Selected Images:</h4>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {newProduct.product_images.map((file, index) => (
                          <div key={index} className="relative">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Preview ${index + 1}`}
                              className="h-20 w-20 object-cover rounded border"
                            />
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
                {/* File input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Images</label>
                  <input
                    type="file"
                    className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-indigo-50 file:text-indigo-700
                  hover:file:bg-indigo-100"
                    multiple
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        setNewProduct(prev => ({
                          ...prev,
                          product_images: [
                            ...prev.product_images, // Keep existing files
                            ...Array.from(e.target.files!) // Add new files
                          ]
                        }));
                      }
                      e.target.value = ''; // Reset input to allow selecting same files again
                    }}
                  />
                  <p className="mt-1 text-sm text-gray-500">First image will be set as primary</p>
                </div>

              </div>

            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                type="button"
                onClick={handleCreateCancel}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={newProduct.category_id === 0 || newProduct.brand_id === 0}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Create Product
              </button>
            </div>
          </form>
        </div>
      ) : (


        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => {
                  const primaryImage = getPrimaryImage(product.product_images);
                  const imageUrl = primaryImage?.image_url
                    ? primaryImage.image_url.startsWith('https://') || primaryImage.image_url.startsWith('http://')
                      ? primaryImage.image_url  // already full URL
                      : `${FILE_BASE_URL}${primaryImage.image_url}`
                    : '/placeholder-product.png';

                  return (
                    <tr key={product.uuid}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex-shrink-0 h-10 w-10">
                          <Image
                            className="h-10 w-10 rounded-lg object-cover border-2 border-gray-500"
                            src={imageUrl}
                            alt={product.name}
                            width={40}
                            height={40}
                            unoptimized={true}
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {product.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.brand.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.category.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${product.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.stock}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {product.is_new_arrival && (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            New
                          </span>
                        )}
                        {product.is_best_seller && (
                          <span className="ml-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                            Best Seller
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 relative">
                        <div className="menu-container relative">
                          <button
                            onClick={() => setOpenMenuId(openMenuId === product.uuid ? null : product.uuid)}
                            className="hover:text-indigo-600 text-gray-500 border-2 border-gray-500 hover:border-indigo-600 p-2 rounded-xl"
                          >
                            <Icon icon="mdi:dots-horizontal" className="w-5 h-5" />
                          </button>

                          {openMenuId === product.uuid && (
                            <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow-md z-10">
                              <button
                                className="flex items-center px-4 py-2 text-sm text-blue-600 hover:bg-gray-100 w-full"
                                onClick={() => console.log('View', product.uuid)}
                              >
                                View
                              </button>
                              <button
                                className="flex items-center px-4 py-2 text-sm text-blue-600 hover:bg-gray-100 w-full"
                                onClick={() => console.log('Update', product.uuid)}
                              >
                                Update
                              </button>
                              <button
                                className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full"
                                onClick={() => setProductToDelete(product)}
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <nav className="flex items-center gap-1">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 rounded-md border border-gray-300 disabled:opacity-50"
            >
              Previous
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`px-3 py-1 rounded-md ${page === pageNum ? 'bg-indigo-600 text-white' : 'border border-gray-300'}`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 rounded-md border border-gray-300 disabled:opacity-50"
            >
              Next
            </button>
          </nav>
        </div>
      )}
      {productToDelete && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-lg font-semibold mb-4 text-center">
              Do you want to delete <span className="font-bold">{productToDelete.name}</span>?
            </h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={async () => {
                  // Call your delete logic here
                  await fetch(`${API_BASE_URL}/api/vendor/product/${productToDelete.id}`, {
                    method: 'DELETE',
                  });
                  setProducts(prev => prev.filter(p => p.id !== productToDelete.id));

                  setProductToDelete(null);
                }}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Yes
              </button>
              <button
                onClick={() => setProductToDelete(null)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProductTable;