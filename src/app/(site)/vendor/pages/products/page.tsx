"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Icon } from '@iconify/react';
import { useTheme } from 'next-themes';
import { Box, EyeIcon } from 'lucide-react';
import CreateProduct from './createProduct';
import UpdateProduct from './updateProduct';
import { FaEvernote, FaRegEdit } from 'react-icons/fa';
import { MdDeleteForever } from 'react-icons/md';

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
  const [limit, setLimit] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const { theme } = useTheme(); // Get the current theme
  const [productToUpdate, setProductToUpdate] = useState<Product | null>(null);


  const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001';
  const FILE_BASE_URL = process.env.FILE_BASE_URL;

  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
  const [showUpdateForm, setShowUpdateForm] = useState<boolean>(false);
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
        const url = new URL(`${API_BASE_URL}/vendor/product`);
        url.searchParams.append('page', page.toString());
        url.searchParams.append('limit', limit.toString());
        url.searchParams.append('sortByPrice', priceSort);
        if (committedSearchTerm) {
          url.searchParams.append('keySearch', committedSearchTerm);
        }

        console.log(limit);
        console.log(page);

        // Get the JWT token from where you store it (localStorage, cookies, etc.)
        const token = localStorage.getItem('token'); // Adjust based on your auth storage

        if (!token) {
          throw new Error('Authentication token not found');
        }

        const response = await fetch(url.toString(), {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('Response status:', response.status);

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
  }, [API_BASE_URL, page, limit, priceSort, committedSearchTerm]);

  useEffect(() => {
    const fetchSetupData = async () => {
      try {
        // Get the JWT token from where you store it (localStorage, cookies, etc.)
        const token = localStorage.getItem('token'); // Adjust based on your auth storage

        if (!token) {
          throw new Error('Authentication token not found');
        }

        const response = await fetch(`${API_BASE_URL}/vendor/product/setUp`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

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



  // const handlePageChange = (newPage: number) => {
  //   setLoading(true);
  //   setPage(newPage);
  // };

  // const limitChange = (newLimit: number) => {
  //   setLimit(newLimit);
  // };

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

  const handleCreateSubmit = async (productData: {
    name: string;
    description: string;
    price: number;
    stock: number;
    category_id: number;
    brand_id: number;
    is_new_arrival: boolean;
    is_best_seller: boolean;
    product_images: File[];
  }) => {
    try {
      const formData = new FormData();

      // Append all product data as strings (converting numbers/booleans)
      formData.append('name', productData.name);
      formData.append('description', productData.description);
      formData.append('price', productData.price.toString());
      formData.append('stock', productData.stock.toString());
      formData.append('category_id', productData.category_id.toString());
      formData.append('brand_id', productData.brand_id.toString());
      formData.append('is_new_arrival', String(productData.is_new_arrival));
      formData.append('is_best_seller', String(productData.is_best_seller));

      for (let [key, value] of formData.entries()) {
        console.log("before ", key, value);
      }

      // Append each image file
      productData.product_images.forEach(file => {
        formData.append('product_images', file);
      });

      for (let [key, value] of formData.entries()) {
        console.log("after", key, value);
      }

      const token = localStorage.getItem('token'); // Adjust based on your auth storage

      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await fetch(`${API_BASE_URL}/vendor/product`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          // 'Content-Type': 'application/json'
        },
        method: 'POST',
        body: formData,
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
      throw err; // Re-throw the error so CreateProduct can handle it
    }
  };

  // const removeImage = (index: number) => {
  //   setNewProduct(prev => {
  //     const updatedImages = [...prev.product_images];
  //     updatedImages.splice(index, 1);
  //     return {
  //       ...prev,
  //       product_images: updatedImages
  //     };
  //   });
  // };

  const handleUpdateClick = (product: Product) => {
    setProductToUpdate(product);
    console.log('Updating product:', product);
    setShowUpdateForm(true);
  };

  const handleUpdateCancel = () => {
    setShowUpdateForm(false);
  };

  const handleUpdateSubmit = async (updatedProduct: {
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
  }) => {
    const formData = new FormData();

    formData.append('name', updatedProduct.name);
    formData.append('description', updatedProduct.description);
    formData.append('price', updatedProduct.price.toString());
    formData.append('stock', updatedProduct.stock.toString());
    formData.append('category_id', updatedProduct.category_id.toString());
    formData.append('brand_id', updatedProduct.brand_id.toString());
    formData.append('is_new_arrival', updatedProduct.is_new_arrival.toString());
    formData.append('is_best_seller', updatedProduct.is_best_seller.toString());

    for (let [key, value] of formData.entries()) {
      console.log("before ", key, value);
    }

    // Determine if there are any File instances (new uploads)
    const newImages = updatedProduct.product_images.filter(
      img => img instanceof File
    ) as File[];

    // Only append files if there are new ones
    if (newImages.length > 0) {
      newImages.forEach(file => {
        formData.append('product_images', file);
      });
    }
    // Get the JWT token from where you store it (localStorage, cookies, etc.)
    const token = localStorage.getItem('authToken'); // Adjust based on your auth storage

    if (!token) {
      throw new Error('Authentication token not found');
    }

    // const response = await fetch(url.toString(), {
    //   headers: {
    //     'Authorization': `Bearer ${token}`,
    //     'Content-Type': 'application/json'
    //   }
    // });
    try {
      const response = await fetch(`${API_BASE_URL}/vendor/product/${updatedProduct.id}`, {
        method: 'PUT',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to update product');
      }

      const result = await response.json();
      console.log('Update success:', result);

      setProducts(prevProducts =>
        prevProducts.map(product =>
          product.id === updatedProduct.id ? result.data : product
        )
      );
      setShowUpdateForm(false);
      setProductToUpdate(null);
    } catch (err) {
      console.error('Update failed:', err);
    }
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
    <div className="container m-2 ">
      <div className={`rounded-lg px-6 py-8  shadow-md flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800"
        }`}>
        <div className='flex gap-2'>
          <Box className="h-8 w-8" />
          <h1 className="text-2xl font-bold">Products</h1>
        </div>

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
        <CreateProduct
          brands={brands}
          categories={categories}
          onCancel={handleCreateCancel}
          onSubmit={handleCreateSubmit}
        />
      ) : showUpdateForm ? (
        productToUpdate ? (
          <UpdateProduct
            product={productToUpdate}
            brands={brands}
            categories={categories}
            onCancel={handleUpdateCancel}  // Fixed: removed the arrow function wrapper
            onSubmit={handleUpdateSubmit}
          />
        ) : null
      ) :
        (
          <div className={`rounded-lg p-5  shadow-md overflow-hidden  ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800"}`}>
            <div className="overflow-auto overflow-x-auto  h-[calc(100vh-24rem)] " >
              <table className="w-full divide-y divide-gray-200 ">
                <thead className="bg-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-500 uppercase tracking-wider"></th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-500 uppercase tracking-wider">Product Name</th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-500 uppercase tracking-wider">Brand</th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-500 uppercase tracking-wider">Stock</th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-500 uppercase tracking-wider"></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 overflow-auto">
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
                        <td className="px- py-4 whitespace-nowrap text-sm font-medium text-gray-900">
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
                            <span className="ml-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-700">
                              Best Seller
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4  whitespace-nowrap text-sm text-gray-500 relative">
                          <div className="menu-container relative">
                            <button
                              onClick={() => setOpenMenuId(openMenuId === product.uuid ? null : product.uuid)}
                              className="hover:text-indigo-600 text-gray-500 border-2 border-gray-500 hover:border-indigo-600 p-2 rounded-xl"
                            >
                              <Icon icon="mdi:dots-horizontal" className="w-5 h-5" />
                            </button>

                            {openMenuId === product.uuid && (
                              <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-xl shadow-md z-10">
                                <button
                                  className="flex items-center px-4 py-2 text-sm text-blue-600 hover:bg-gray-100 w-full"
                                  onClick={() => console.log('View', product.uuid)}
                                >
                                  <EyeIcon className="h-5 w-5" />
                                  <span className="ml-2">View</span>
                                </button>
                                <button
                                  className="flex items-center px-4 py-2 text-sm text-blue-600 hover:bg-gray-100 w-full"
                                  onClick={() => handleUpdateClick(product)}
                                >
                                  <FaRegEdit className='h-5 w-5' />
                                  <span className="ml-2">Update</span>
                                </button>
                                <button
                                  className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full"
                                  onClick={() => setProductToDelete(product)}
                                >
                                  <MdDeleteForever className="h-5 w-5"/>
                                  <span className="ml-2">View</span>
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

            {/* Pagination */}
            <div className="flex justify-center mt-6">
              <nav className="flex items-center gap-1">
                <div className="flex items-center gap-2">
                  {/* <span className="text-sm">Items per page:</span> */}
                  <select
                    value={limit} // Add limit to your state: const [limit, setLimit] = useState(10);
                    onChange={(e) => {
                      setLimit(Number(e.target.value));
                      setPage(1); // Reset to first page when changing limit
                    }}
                    className="px-2 py-1 border rounded-md text-sm"
                  >
                    {[5, 10, 15, 20].map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
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
                  await fetch(`${API_BASE_URL}/vendor/product/${productToDelete.id}`, {
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