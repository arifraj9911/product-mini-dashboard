// Order type definition
export type OrderProps = {
  id: string;
  orderId: string;
  clientName: string;
  deliveryAddress: string;
  paymentStatus: "paid" | "pending" | "refunded";
  deliveryStatus: "pending" | "shipped" | "delivered" | "canceled";
  expectedDeliveryDate: string;
  totalAmount: number;
  createdAt: string;
  orderDate: string;
  products: Array<{
    productId: string;
    quantity: number;
    price: number;
    product?: {
      productName: string;
      sku: string;
      category: string;
    };
  }>;
  customerFeedback?: number;
  deliveryProgress?: number;
};
