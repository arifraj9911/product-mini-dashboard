/* eslint-disable @typescript-eslint/no-explicit-any */
type RequestOptions = RequestInit & {
  next?: {
    revalidate?: number;
    tags?: string[];
  };
};

export default class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const defaultOptions: RequestOptions = {
      headers: {
        "Content-Type": "application/json",
      },
      next: {
        revalidate: 3600,
        tags: ["api-data"],
      },
    };

    try {
      const response = await fetch(url, { ...defaultOptions, ...options });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Handle empty responses safely
      const text = await response.text();
      return text ? JSON.parse(text) : ({} as T);
    } catch (error) {
      console.error("API Request failed:", error);
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: "DELETE",
    });
  }

  // ----- Products -----
  async getProducts<T>(): Promise<T> {
    return this.get<T>("/products");
  }

  async createProduct<T>(productData: any): Promise<T> {
    return this.post<T>("/products/create", productData);
  }

  async deleteProduct<T>(id: string): Promise<T> {
    return this.delete<T>(`/products/delete/${id}`);
  }

  // ----- Orders -----
  async getOrders<T>(): Promise<T> {
    return this.get<T>("/orders");
  }

  async createOrder<T>(orderData: any): Promise<T> {
    return this.post<T>("/orders/create", orderData);
  }

  async deleteOrder<T>(id: string): Promise<T> {
    return this.delete<T>(`/orders/delete/${id}`);
  }
}

export const apiService = new ApiService(
  "https://68fb464594ec960660256938.mockapi.io/api/v1"
);
