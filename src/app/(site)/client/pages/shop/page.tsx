"use client";

import { Search } from "@/src/app/components/shared/ui/search";
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
import { fetchFilteredProducts } from "../../../../server/client/shop/product";

const categories = [
  "All Electronic",
  "Iphone",
  "Samsung",
  "Computer",
  "Power Bank",
  "Headset",
  "Magsafe",
  "Tablet",
  "Charger",
  "Camera",
];

import SharedFooterComponent from "@/src/app/components/shared/footer";
import homeClientApi from "@/src/app/server/client/home/home.route";
const initialPriceRanges = [
  { label: "All Price", checked: false },
  { label: "$0.00 - 99.99", checked: true },
  { label: "$100.00 - 199.99", checked: false },
  { label: "$200.00 - 299.99", checked: false },
  { label: "$300.00 - 399.99", checked: false },
  { label: "$400.00+", checked: false },
];

export default function ShopPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("All Electronic");
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [priceRanges, setPriceRanges] = useState(initialPriceRanges);
  const [sortBy, setSortBy] = useState("default");
  const [viewMode, setViewMode] = useState("grid");
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const displayedCategories = showAllCategories ? categories : categories.slice(0, 8);

  const toggleCategoryView = () => setShowAllCategories(!showAllCategories);

  const togglePriceRange = (index: number) => {
    const updatedRanges = priceRanges.map((range, i) =>
      i === index ? { ...range, checked: !range.checked } : range
    );
    setPriceRanges(updatedRanges);
  };

  const selectedPriceLabels = priceRanges.filter((p) => p.checked).map((p) => p.label);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchFilteredProducts({
          category: selectedCategory,
          priceRanges: selectedPriceLabels,
          sortBy,
          search,
        });
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
      setLoading(false);
    };

    fetchData();
  }, [selectedCategory, priceRanges, sortBy, search]);

  const toggleFavorite = async (id: number) => {
    // Optimistically update favorite locally
    setProducts((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, is_favorite: !item.is_favorite } : item
      )
    );
    try {
      await homeClientApi.updateFavoriteStatus(id);
    } catch (error) {
      // Revert on failure
      setProducts((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, is_favorite: !item.is_favorite } : item
        )
      );
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
            className={`space-y-6 mb-6 lg:mb-0 lg:block ${showSidebar ? "block" : "hidden"
              } lg:w-64`}
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
                      key={category}
                      layout
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => setSelectedCategory(category)}
                      className={`block w-full text-left px-2 py-1 text-sm hover:text-black ${selectedCategory === category
                        ? "text-black dark:text-gray-300 font-medium underline"
                        : "text-gray-600"
                        }`}
                    >
                      {category}
                    </motion.button>
                  ))}
                </AnimatePresence>
                {categories.length > 8 && (
                  <motion.button
                    layout
                    onClick={toggleCategoryView}
                    className="mt-2 text-sm text-black dark:text-gray-300 hover:underline"
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
                  <div key={index} className="flex items-center justify-between">
                    <label htmlFor={`price-${index}`} className="text-sm cursor-pointer">
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
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
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
                        className={`p-2 rounded-md ${viewMode === mode ? "bg-black text-white" : ""
                          }`}
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
              {loading && (
                <p className="mb-4 text-center text-gray-500">Loading products...</p>
              )}

              {!loading && products.length === 0 && (
                <p className="mb-4 text-center text-gray-500">No products found.</p>
              )}

              {!loading && products.length > 0 && (
                <div
                  className={`grid gap-4 ${viewMode === "list"
                    ? "grid-cols-1"
                    : viewMode === "large-grid"
                      ? "grid-cols-2 md:grid-cols-3"
                      : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4"
                    }`}
                >
                  {products.map((item) => (
                    <div
                      key={item.id}
                      className={`${viewMode === "list"
                        ? "flex gap-4 items-center p-4 border rounded-xl hover:shadow-md transition"
                        : ""
                        }`}
                    >
                      <div
                        className={`${viewMode === "list"
                          ? "flex-1 flex gap-4 items-center"
                          : "w-full"
                          }`}
                      >
                        {/* Image Container */}
                        <div
                          className={`group relative overflow-hidden rounded ${viewMode === "list"
                            ? "h-32 w-32 min-w-[128px]"
                            : "h-[240px] w-full mb-4"
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
                              <Icon className="text-red-400" path={mdiHeart} size={1} />
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
                            onClick={() => router.push(`/client/pages/shop/view/${item.id}`)}
                            className={`object-contain cursor-pointer  w-full h-full transition-transform duration-300 ${viewMode === "list" ? "" : "group-hover:scale-105"
                              }`}
                          />
                          <button
                            className={`absolute inset-x-0 bottom-0 py-2 text-sm font-medium text-white transition-all duration-500 ${viewMode === "list"
                              ? "translate-y-0 opacity-100 bg-black/70"
                              : "translate-y-full opacity-0"
                              } hover:bg-gray-800 group-hover:translate-y-0 group-hover:opacity-100 dark:bg-gray-300 dark:text-gray-700`}
                          >
                            Add to cart
                          </button>
                        </div>

                        {/* Product Info */}
                        <div
                          className={`${viewMode === "list" ? "flex-1" : ""
                            }`}
                        >
                          {/* Stars */}
                          <div className="flex items-center mt-1">
                            {Array.from({ length: 5 }, (_, i) => {
                              const filled = i < Math.floor(item.stars);
                              return (
                                <span
                                  key={i}
                                  className={`inline-block ${filled ? "text-black dark:text-gray-300" : "text-gray-300 dark:text-gray-600"}`}
                                >
                                  <Star
                                    className={`w-5 h-5 ${filled ? "fill-current" : ""}`}
                                    strokeWidth={filled ? 0 : 1.5}
                                  />
                                </span>
                              );
                            })}
                          </div>
                          {/* Title */}
                          <h3
                            className={`font-semibold text-black dark:text-gray-300 ${viewMode === "list"
                              ? "text-lg mb-2"
                              : "text-base mb-1 min-w-[220px] max-w-[220px]"
                              }`}
                          >
                            {item.title}
                          </h3>

                          {/* Price */}
                          <p
                            className={`font-bold text-black dark:text-gray-300 ${viewMode === "list" ? "text-lg" : "text-[13px]"
                              }`}
                          >
                            ${item.price}
                          </p>

                          {/* Description for list view */}
                          {viewMode === "list" && (
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </main>
        </div>
      </div>
      <SharedFooterComponent></SharedFooterComponent>
    </>
  );
}
