// Product type definition
export type ProductProps = {
  id: string;
  productName: string;
  sku: string;
  category: string;
  price: number;
  stockQuantity: number;
  description?: string;
  active: boolean;
  createdAt: string;
  satisfaction?: number;
  deliveryProgress?: number;
  salesData?: number[];
  imageUrl?: string;
};