import { OrderProps } from "@/types/order-props";

// Generate sample data if localStorage is empty
export const generateSampleData = (): OrderProps[] => [
  {
    id: "1",
    orderId: "ORD-001",
    clientName: "John Smith",
    deliveryAddress: "123 Main St, New York, NY 10001",
    paymentStatus: "paid",
    deliveryStatus: "delivered",
    expectedDeliveryDate: "2024-01-20",
    totalAmount: 299.97,
    createdAt: "2024-01-15T10:30:00Z",
    orderDate: "2024-01-15",
    products: [
      {
        productId: "1",
        quantity: 2,
        price: 129.99,
        product: {
          productName: "Wireless Bluetooth Headphones",
          sku: "AUDIO-001",
          category: "Electronics"
        }
      },
      {
        productId: "3",
        quantity: 1,
        price: 24.99,
        product: {
          productName: "Cotton T-Shirt",
          sku: "CLOTH-001",
          category: "Clothing"
        }
      }
    ],
    customerFeedback: 5,
    deliveryProgress: 100,
  },
  {
    id: "2",
    orderId: "ORD-002",
    clientName: "Sarah Johnson",
    deliveryAddress: "456 Oak Ave, Los Angeles, CA 90210",
    paymentStatus: "pending",
    deliveryStatus: "shipped",
    expectedDeliveryDate: "2024-01-25",
    totalAmount: 549.98,
    createdAt: "2024-01-16T14:20:00Z",
    orderDate: "2024-01-16",
    products: [
      {
        productId: "2",
        quantity: 1,
        price: 299.99,
        product: {
          productName: "Ergonomic Office Chair",
          sku: "FURN-001",
          category: "Furniture"
        }
      },
      {
        productId: "5",
        quantity: 1,
        price: 49.99,
        product: {
          productName: "Desk Lamp",
          sku: "FURN-002",
          category: "Furniture"
        }
      }
    ],
    customerFeedback: 4,
    deliveryProgress: 75,
  },
  {
    id: "3",
    orderId: "ORD-003",
    clientName: "Mike Chen",
    deliveryAddress: "789 Pine Rd, Chicago, IL 60601",
    paymentStatus: "paid",
    deliveryStatus: "pending",
    expectedDeliveryDate: "2024-01-30",
    totalAmount: 89.97,
    createdAt: "2024-01-17T09:15:00Z",
    orderDate: "2024-01-17",
    products: [
      {
        productId: "3",
        quantity: 3,
        price: 24.99,
        product: {
          productName: "Cotton T-Shirt",
          sku: "CLOTH-001",
          category: "Clothing"
        }
      }
    ],
    customerFeedback: 3,
    deliveryProgress: 25,
  },
  {
    id: "4",
    orderId: "ORD-004",
    clientName: "Emily Davis",
    deliveryAddress: "321 Elm St, Miami, FL 33101",
    paymentStatus: "refunded",
    deliveryStatus: "canceled",
    expectedDeliveryDate: "2024-01-22",
    totalAmount: 129.99,
    createdAt: "2024-01-14T16:45:00Z",
    orderDate: "2024-01-14",
    products: [
      {
        productId: "1",
        quantity: 1,
        price: 129.99,
        product: {
          productName: "Wireless Bluetooth Headphones",
          sku: "AUDIO-001",
          category: "Electronics"
        }
      }
    ],
    customerFeedback: 1,
    deliveryProgress: 0,
  },
  {
    id: "5",
    orderId: "ORD-005",
    clientName: "David Wilson",
    deliveryAddress: "654 Maple Dr, Seattle, WA 98101",
    paymentStatus: "paid",
    deliveryStatus: "shipped",
    expectedDeliveryDate: "2024-01-28",
    totalAmount: 174.97,
    createdAt: "2024-01-18T11:20:00Z",
    orderDate: "2024-01-18",
    products: [
      {
        productId: "5",
        quantity: 2,
        price: 49.99,
        product: {
          productName: "Desk Lamp",
          sku: "FURN-002",
          category: "Furniture"
        }
      },
      {
        productId: "3",
        quantity: 3,
        price: 24.99,
        product: {
          productName: "Cotton T-Shirt",
          sku: "CLOTH-001",
          category: "Clothing"
        }
      }
    ],
    customerFeedback: 4,
    deliveryProgress: 60,
  },
];