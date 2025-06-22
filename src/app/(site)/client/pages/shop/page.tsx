"use client";
import SharedFooterComponent from "@/src/app/components/shared/footer";
import { Search } from "@/src/app/components/shared/ui/search";
import env from "@/src/envs/env";
import { mdiFilterOutline, mdiHeart, mdiHeartOutline } from "@mdi/js";
import Icon from "@mdi/react";
import { AnimatePresence, motion } from "framer-motion";
import { Grid3X3, LayoutGrid, List, Menu, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "../../../../components/shared/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/shared/ui/select";

const initialPriceRanges = [
  { label: "All Price", checked: true },
  { label: "$0.00 - 99.99", checked: false },
  { label: "$100.00 - 199.99", checked: false },
  { label: "$200.00 - 299.99", checked: false },
  { label: "$300.00 - 399.99", checked: false },
  { label: "$400.00+", checked: false },
];

const getHeaders = () => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  const token = localStorage.getItem("token");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
};

interface FetchOptions {
  categoryId?: number;
  priceRanges?: string[];
  sortBy?: string;
  search?: string;
  limit?: number;
}

async function fetchDataSetup() {
  const res = await fetch(`${env.API_BASE_URL}/client/shop/setup`, {
    method: "GET",
    headers: getHeaders(),
  });

  if (!res.ok) throw new Error("Failed to fetch setup data");
  const response = await res.json();
  return response.data || [];
}

async function fetchFilteredProducts({
  categoryId,
  priceRanges,
  sortBy,
  search,
  limit = 20,
}: FetchOptions) {
  const params = new URLSearchParams();

  if (categoryId) params.append("category", categoryId.toString());
  if (priceRanges && priceRanges.length)
    params.append("priceRanges", priceRanges.join(","));
  if (sortBy && sortBy !== "default") {
    const sortMap: { [key: string]: string } = {
      "price-low": "price_asc",
      "price-high": "price_desc",
      rating: "newest",
    };
    params.append("sortBy", sortMap[sortBy] || "newest");
  }
  if (search) params.append("search", search);
  params.append("limit", limit.toString());

  const res = await fetch(
    `${env.API_BASE_URL}/client/shop/products?${params.toString()}`,
    {
      method: "GET",
      headers: getHeaders(),
    },
  );

  if (!res.ok) throw new Error("Failed to fetch products");
  const response = await res.json();
  return {
    products: response.data || [],
    total: response.total || response.data?.length || 0,
  };
}

export default function ShopPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([
    { id: 0, name: "All Electronic" },
  ]);
  const fileUrl = `${env.FILE_BASE_URL}`;
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [priceRanges, setPriceRanges] = useState(initialPriceRanges);
  const [sortBy, setSortBy] = useState("default");
  const [viewMode, setViewMode] = useState("grid");
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [limit, setLimit] = useState(20);
  const [totalProducts, setTotalProducts] = useState(0);

  const displayedCategories = showAllCategories
    ? categories
    : categories.slice(0, 8);

  const toggleCategoryView = () => setShowAllCategories(!showAllCategories);

  const togglePriceRange = (index: number) => {
    const updatedRanges = priceRanges.map((range, i) =>
      i === index ? { ...range, checked: !range.checked } : range,
    );
    setPriceRanges(updatedRanges);
  };

  const selectedPriceLabels = priceRanges
    .filter((p) => p.checked)
    .map((p) => p.label);

  const handleSeeMore = () => {
    setLimit((prev) => prev + 20);
  };

  useEffect(() => {
    const fetchSetup = async () => {
      try {
        const setupData = await fetchDataSetup();
        const formattedCategories = [
          { id: 0, name: "All Electronic" },
          ...setupData.map((cat: any) => ({ id: cat.id, name: cat.name })),
        ];
        setCategories(formattedCategories);
      } catch (error) {
        console.error("Failed to fetch setup data", error);
      }
    };

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { products: data, total } = await fetchFilteredProducts({
          categoryId: selectedCategoryId !== 0 ? selectedCategoryId : undefined,
          priceRanges: selectedPriceLabels,
          sortBy,
          search,
          limit,
        });

        const formattedProducts = data.map((product: any) => ({
          ...product,
          // Use the is_favorite value from the API instead of hardcoding to false
          is_favorite: product.is_favorite || false,
          stars: 3 + (product.id % 3),
          title: product.name,
          image:
            fileUrl + product.product_images?.[0]?.image_url ||
            fileUrl + product.product_images?.[0]?.image_url ||
            "/images/product/image.png",
          is_new: product.is_new_arrival,
        }));

        // If we're loading more products, append them instead of replacing
        if (limit > 20) {
          setProducts((prev) => [...prev, ...formattedProducts]);
        } else {
          setProducts(formattedProducts);
        }

        setTotalProducts(total);
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
      setLoading(false);
    };

    fetchSetup();
    fetchProducts();
  }, [selectedCategoryId, priceRanges, sortBy, search, limit]);

  const toggleFavorite = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/client/auth");
        return;
      }

      // Get current favorite status
      const currentItem = products.find((item) => item.id === id);
      const isFavorite = currentItem?.is_favorite || false;

      // Optimistic UI update
      setProducts((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, is_favorite: !isFavorite } : item,
        ),
      );

      // Use DELETE for removing, POST for adding
      const method = isFavorite ? "DELETE" : "POST";
      const response = await fetch(
        `${env.API_BASE_URL}/client/shop/wishlist/${id}`,
        {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        // Revert on error
        setProducts((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, is_favorite: isFavorite } : item,
          ),
        );
        throw new Error("Failed to update wishlist");
      }

      // Dispatch update event
      window.dispatchEvent(new Event("wishlistUpdated"));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Add to Cart
  const handleAddToCart = async (productId: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/client/auth");
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

  return (
    <>
      <div className="container h-auto px-4 py-6 mx-auto">
        <div className="flex justify-center mt-5 mb-6">
          <img
            src="/images/banner/image.png"
            alt="Shop Banner"
            className="object-cover w-full rounded-lg"
          />
        </div>

        <div className="lg:flex lg:gap-8">
          {/* Sidebar Toggle on Mobile */}
          <div className="flex items-center justify-between mb-4 lg:hidden">
            <h2 className="text-xl font-semibold">Filters</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSidebar(!showSidebar)}
              className="flex items-center gap-2"
            >
              <Menu className="w-4 h-4" />
              {showSidebar ? "Hide Filters" : "Show Filters"}
            </Button>
          </div>

          {/* Sidebar */}
          <aside
            className={`mb-6 space-y-6 lg:mb-0 lg:block ${showSidebar ? "block" : "hidden"} lg:w-64`}
          >
            <div className="flex items-center gap-2">
              <Icon
                path={mdiFilterOutline}
                size={1.1}
                className="text-black dark:text-gray-300"
              />
              <span className="text-xl font-semibold text-black dark:text-gray-300">
                Filter
              </span>
            </div>

            <div>
              <h3 className="mb-3 font-medium">CATEGORIES</h3>
              <div className="space-y-2">
                <AnimatePresence initial={false}>
                  {displayedCategories.map((category) => (
                    <motion.button
                      key={category.id}
                      layout
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => setSelectedCategoryId(category.id)}
                      className={`block w-full px-2 py-1 text-left text-sm hover:text-black ${
                        selectedCategoryId === category.id
                          ? "font-medium text-black underline dark:text-gray-300"
                          : "text-gray-600"
                      }`}
                    >
                      {category.name}
                    </motion.button>
                  ))}
                </AnimatePresence>
                {categories.length > 8 && (
                  <motion.button
                    layout
                    onClick={toggleCategoryView}
                    className="mt-2 text-sm text-black hover:underline dark:text-gray-300"
                    whileTap={{ scale: 0.95 }}
                  >
                    {showAllCategories ? "See less" : "See more"}
                  </motion.button>
                )}
              </div>
            </div>

            <div>
              <h3 className="mb-3 font-medium">PRICE</h3>
              <div className="space-y-2">
                {priceRanges.map((range, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <label
                      htmlFor={`price-${index}`}
                      className="text-sm cursor-pointer"
                    >
                      {range.label}
                    </label>
                    <input
                      type="checkbox"
                      id={`price-${index}`}
                      checked={range.checked}
                      onChange={() => togglePriceRange(index)}
                      className="cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Top controls */}
            <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
              <h2 className="text-xl font-medium">Shop Products</h2>
              <div className="flex flex-col w-full gap-3 sm:flex-row sm:items-center sm:justify-between md:w-auto">
                <Search
                  placeholder="Search for products..."
                  className="w-full sm:w-64"
                  onChange={(value) => setSearch(value)}
                />
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-36">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="price-low">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="price-high">
                      Price: High to Low
                    </SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex justify-center gap-1 p-1 border rounded-md sm:justify-start">
                  {["grid", "large-grid", "list"].map((mode) => {
                    const IconComponent =
                      mode === "grid"
                        ? Grid3X3
                        : mode === "large-grid"
                          ? LayoutGrid
                          : List;
                    return (
                      <button
                        key={mode}
                        aria-label={`Set view mode to ${mode}`}
                        className={`rounded-md p-2 ${viewMode === mode ? "bg-black text-white" : ""}`}
                        onClick={() => setViewMode(mode)}
                      >
                        <IconComponent className="w-5 h-5" />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Product Grid/List */}
            <section>
              {loading && products.length === 0 && (
                <p className="mb-4 text-center text-gray-500">
                  Loading products...
                </p>
              )}

              {!loading && products.length === 0 && (
                <p className="mb-4 text-center text-gray-500">
                  No products found.
                </p>
              )}

              {!loading && products.length > 0 && (
                <>
                  <div
                    className={`grid gap-4 ${
                      viewMode === "list"
                        ? "grid-cols-1"
                        : viewMode === "large-grid"
                          ? "grid-cols-2 md:grid-cols-3"
                          : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4"
                    }`}
                  >
                    {products.map((item) => (
                      <div
                        key={item.id}
                        className={`${
                          viewMode === "list"
                            ? "flex items-center gap-4 rounded-xl border p-4 transition hover:shadow-md"
                            : "rounded-xl bg-gray-100 p-4 shadow-sm transition hover:shadow-md"
                        }`}
                      >
                        <div
                          className={`${
                            viewMode === "list"
                              ? "flex flex-1 items-center gap-4"
                              : "w-full"
                          }`}
                        >
                          {/* Image Container */}
                          <div
                            className={`group relative overflow-hidden rounded ${
                              viewMode === "list"
                                ? "h-32 w-32 min-w-[128px]"
                                : "mb-4 h-[240px] w-full"
                            }`}
                          >
                            {/* NEW Badge */}
                            {item.is_new && (
                              <div className="absolute px-2 py-1 text-xs font-bold text-black bg-white rounded left-2 top-2">
                                NEW
                              </div>
                            )}

                            {/* Favorite Icon */}
                            <motion.div
                              className="absolute z-10 cursor-pointer right-2 top-2"
                              onClick={() => toggleFavorite(item.id)}
                              whileTap={{ scale: 0.8 }}
                              whileHover={{ scale: 1.1 }}
                              initial={{ scale: 1 }}
                              animate={{ scale: item.is_favorite ? 1.2 : 1 }}
                              transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 10,
                              }}
                            >
                              {item.is_favorite ? (
                                <Icon
                                  className="text-red-400"
                                  path={mdiHeart}
                                  size={1}
                                />
                              ) : (
                                <Icon
                                  className="text-gray-400"
                                  path={mdiHeartOutline}
                                  size={1}
                                />
                              )}
                            </motion.div>

                            <img
                              src={item.image}
                              alt={item.title}
                              onClick={() =>
                                router.push(
                                  `/client/pages/shop/view/${item.id}`,
                                )
                              }
                              className={`h-full w-full cursor-pointer object-contain transition-transform duration-300 ${
                                viewMode === "list"
                                  ? ""
                                  : "group-hover:scale-105"
                              }`}
                            />
                            <button
                              className={`absolute inset-x-0 bottom-0 py-2 text-sm font-medium text-white transition-all duration-500 ${
                                viewMode === "list"
                                  ? "translate-y-0 bg-black/70 opacity-100"
                                  : "translate-y-full opacity-0"
                              } hover:bg-gray-800 group-hover:translate-y-0 group-hover:opacity-100 dark:bg-gray-300 dark:text-gray-700`}
                              onClick={() => handleAddToCart(item.id)}
                            >
                              Add to cart
                            </button>
                          </div>

                          {/* Product Info */}
                          <div
                            className={`${viewMode === "list" ? "flex-1" : ""}`}
                          >
                            {/* Stars */}
                            <div className="flex items-center mt-1">
                              {Array.from({ length: 5 }, (_, i) => {
                                const filled = i < Math.floor(item.stars);
                                return (
                                  <span
                                    key={i}
                                    className={`inline-block ${
                                      filled
                                        ? "text-black dark:text-gray-300"
                                        : "text-gray-300 dark:text-gray-600"
                                    }`}
                                  >
                                    <Star
                                      className={`h-5 w-5 ${filled ? "fill-current" : ""}`}
                                      strokeWidth={filled ? 0 : 1.5}
                                    />
                                  </span>
                                );
                              })}
                            </div>
                            {/* Title */}
                            <h3
                              className={`font-semibold text-black dark:text-gray-300 ${
                                viewMode === "list"
                                  ? "mb-2 text-lg"
                                  : "mb-1 min-w-[220px] max-w-[220px] text-base"
                              }`}
                            >
                              {item.title}
                            </h3>

                            {/* Price */}
                            <p
                              className={`font-bold text-black dark:text-gray-300 ${
                                viewMode === "list" ? "text-lg" : "text-[13px]"
                              }`}
                            >
                              ${item.price.toFixed(2)}
                            </p>

                            {/* Description for list view */}
                            {viewMode === "list" && (
                              <p className="mt-2 text-sm text-gray-600 line-clamp-2 dark:text-gray-400">
                                {item.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {products.length < totalProducts && (
                    <div className="flex justify-center mt-8 bg-gray-50">
                      <Button
                        variant="outline"
                        onClick={handleSeeMore}
                        disabled={loading}
                        className="px-8 py-4"
                      >
                        {loading ? "Loading..." : "See More"}
                      </Button>
                    </div>
                  )}
                </>
              )}
            </section>
          </main>
        </div>
      </div>
      <SharedFooterComponent />
    </>
  );
}
