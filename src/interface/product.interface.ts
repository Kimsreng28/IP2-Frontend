export type Product = {
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
  category: {
    id: number;
    name: string;
  };
  brand: {
    id: number;
    name: string;
  };
  product_images: any[];
  discounts: any[];
  is_favorite?: boolean;
  is_new?: boolean;
  is_hot?: boolean;
  stars?: number;
};