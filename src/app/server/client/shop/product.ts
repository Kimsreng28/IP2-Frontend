// lib/services/product.ts

import { mockDataNewArrivals } from "../home/home.service";

interface FetchOptions {
  category?: string;
  priceRanges?: string[];
  sortBy?: string;
  search?: string;
}

export async function fetchFilteredProducts({ category, priceRanges, sortBy, search }: FetchOptions) {
  const params = new URLSearchParams();

  if (category && category !== "All Electronic") params.append("category", category);
  if (priceRanges && priceRanges.length) params.append("priceRanges", priceRanges.join(","));
  if (sortBy && sortBy !== "default") params.append("sortBy", sortBy);
  if (search) params.append("search", search);
  return mockDataNewArrivals;
  const res = await fetch(`/api/products?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}
