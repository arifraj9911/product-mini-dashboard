/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, Resolver } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, Calendar, Package } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

// Order form schema
const orderFormSchema = z.object({
  orderId: z.string().optional(),
  products: z.array(z.object({
    productId: z.string().min(1, "Product is required"),
    quantity: z.number().min(1, "Quantity must be at least 1"),
    price: z.number().min(0, "Price must be positive")
  })).min(1, "At least one product is required"),
  clientName: z.string().min(1, "Client name is required"),
  deliveryAddress: z.string().min(1, "Delivery address is required"),
  paymentStatus: z.enum(["paid", "pending", "refunded"]),
  deliveryStatus: z.enum(["pending", "shipped", "delivered", "canceled"]),
  expectedDeliveryDate: z.string().min(1, "Expected delivery date is required"),
});

type OrderFormData = z.infer<typeof orderFormSchema>;
type Product = {
  id: string;
  productName: string;
  price: number;
  stockQuantity: number;
  sku: string;
};

export default function AddOrder() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState("details");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Array<{
    productId: string;
    quantity: number;
    price: number;
    product?: Product;
  }>>([]);

  const form = useForm<OrderFormData>({
    resolver: zodResolver(orderFormSchema) as Resolver<OrderFormData>,
    defaultValues: {
      products: [],
      clientName: "",
      deliveryAddress: "",
      paymentStatus: "pending",
      deliveryStatus: "pending",
      expectedDeliveryDate: "",
    },
  });

  // Load products from localStorage
  useEffect(() => {
    const loadProducts = () => {
      try {
        const storedProducts = localStorage.getItem("products");
        if (storedProducts) {
          const products = JSON.parse(storedProducts);
          setAvailableProducts(products);
        }
      } catch (error) {
        console.error("Failed to load products:", error);
      }
    };

    loadProducts();
  }, []);

  // Calculate total amount
  const totalAmount = selectedProducts.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);

  // Generate order ID
  const generateOrderId = () => {
    return `ORD-${Date.now().toString(36).toUpperCase()}`;
  };

  // Add product to order
  const addProduct = (productId: string) => {
    const product = availableProducts.find(p => p.id === productId);
    if (product) {
      const existingItem = selectedProducts.find(item => item.productId === productId);
      
      if (existingItem) {
        // Update quantity if product already exists
        setSelectedProducts(prev => 
          prev.map(item => 
            item.productId === productId 
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        );
      } else {
        // Add new product
        const newProduct = {
          productId,
          quantity: 1,
          price: product.price,
          product
        };
        setSelectedProducts(prev => [...prev, newProduct]);
      }
    }
  };

  // Remove product from order
  const removeProduct = (productId: string) => {
    setSelectedProducts(prev => prev.filter(item => item.productId !== productId));
  };

  // Update product quantity
  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    
    const product = selectedProducts.find(item => item.productId === productId);
    if (product) {
      const availableStock = product.product?.stockQuantity || 0;
      if (quantity > availableStock) {
        toast.error(`Only ${availableStock} items available in stock`);
        return;
      }
    }

    setSelectedProducts(prev => 
      prev.map(item => 
        item.productId === productId 
          ? { ...item, quantity }
          : item
      )
    );
  };

  useEffect(() => {
  // Set the products in form when selectedProducts changes
  if (selectedProducts.length > 0) {
    form.setValue("products", selectedProducts);
  }
}, [selectedProducts, form]);

  // Handle form submission
  async function onSubmit(data: OrderFormData) {
    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const existingOrders = JSON.parse(
        localStorage.getItem("orders") || "[]"
      );

      const newOrder = {
        orderId: generateOrderId(),
        products: selectedProducts,
        clientName: data.clientName,
        deliveryAddress: data.deliveryAddress,
        paymentStatus: data.paymentStatus,
        deliveryStatus: data.deliveryStatus,
        expectedDeliveryDate: data.expectedDeliveryDate,
        totalAmount: totalAmount,
        createdAt: new Date().toISOString(),
        orderDate: new Date().toISOString().split('T')[0],
      };

      console.log("New order:", newOrder);

      const updatedOrders = [...existingOrders, newOrder];
      localStorage.setItem("orders", JSON.stringify(updatedOrders));

      toast.success("Order created successfully!", {
        description: `Order ${newOrder.orderId} has been created for ${data.clientName}.`,
        position: "top-center",
      });

    //   setTimeout(() => {
    //     router.push("/dashboard/orders");
    //   }, 2000);
    } catch (error: any) {
      toast.error("Failed to create order", {
        description: "Please try again later.",
        position: "top-center",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  return (
    <div className="min-h-screen flex items-center justify-center md:p-4 bg-linear-to-br from-slate-50 to-blue-50 dark:from-neutral-900 dark:to-slate-900">
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <Card className="w-full lg:col-span-2 shadow-xl border-slate-200 dark:border-slate-700">
          <CardHeader className="text-center md:pb-4">
            <CardTitle className="text-2xl font-bold bg-linear-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
              Create New Order
            </CardTitle>
            <CardDescription>
              Fill in the order details below. Fields marked with * are required.
            </CardDescription>
          </CardHeader>

          <CardContent className="md:px-6">
            {/* Progress Indicator */}
            <div className="md:flex justify-center mb-12 hidden">
              <div className="flex items-start space-x-0.5">
                {["details", "products", "review"].map((step, index) => {
                  const stepIndex = ["details", "products", "review"].indexOf(currentStep);
                  const isCompleted = index < stepIndex;
                  const isCurrent = currentStep === step;
                  const isUpcoming = index > stepIndex;

                  return (
                    <React.Fragment key={step}>
                      <div className="flex flex-col items-center">
                        <div
                          className={`
                            relative w-12 h-12 rounded-full flex items-center justify-center 
                            text-sm font-semibold transition-all duration-300 ease-in-out
                            border-2 ${
                              isCurrent
                                ? "border-blue-600 bg-blue-600 text-white scale-110 shadow-lg"
                                : isCompleted
                                ? "border-green-500 bg-green-500 text-white"
                                : isUpcoming
                                ? "border-slate-300 bg-white text-slate-400 dark:border-slate-600 dark:bg-slate-800"
                                : "border-blue-600 bg-white text-blue-600"
                            }
                          `}
                        >
                          {isCompleted ? (
                            <CheckCircle2 size={20} className="text-white" />
                          ) : (
                            <span className="flex items-center justify-center w-full h-full">
                              {index + 1}
                            </span>
                          )}
                          {isCurrent && (
                            <div className="absolute inset-0 rounded-full bg-blue-600 animate-ping opacity-20" />
                          )}
                        </div>
                        <span
                          className={`
                            text-sm font-medium mt-3 capitalize transition-colors duration-200
                            ${
                              isCurrent
                                ? "text-blue-600 dark:text-blue-400 font-semibold"
                                : isCompleted
                                ? "text-green-600 dark:text-green-400"
                                : "text-slate-500 dark:text-slate-400"
                            }
                          `}
                        >
                          {step === "details" && "Client Details"}
                          {step === "products" && "Products"}
                          {step === "review" && "Review"}
                        </span>
                      </div>
                      {index < 2 && (
                        <div className="relative flex items-start mt-6">
                          <div
                            className={`
                              w-24 h-1 rounded-full transition-all duration-500 ease-out
                              ${
                                isCompleted
                                  ? "bg-linear-to-r from-green-500 to-green-400"
                                  : "bg-slate-200 dark:bg-slate-700"
                              }
                            `}
                          />
                          {index === stepIndex - 1 && (
                            <div className="absolute w-24 h-1 rounded-full bg-linear-to-r from-green-500 to-green-400 animate-pulse" />
                          )}
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            <form id="order-form" onSubmit={form.handleSubmit(onSubmit)}>
              <Tabs
                value={currentStep}
                onValueChange={setCurrentStep}
                className="w-full"
              >
                {/* Step 1: Client Details */}
                <TabsContent value="details" className="space-y-6">
                  <FieldGroup>
                    <Controller
                      name="clientName"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="client-name">
                            Client Name *
                          </FieldLabel>
                          <Input
                            {...field}
                            id="client-name"
                            aria-invalid={fieldState.invalid}
                            placeholder="Enter client name"
                            autoComplete="off"
                            className="w-full"
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    <Controller
                      name="deliveryAddress"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="delivery-address">
                            Delivery Address *
                          </FieldLabel>
                          <Textarea
                            {...field}
                            id="delivery-address"
                            placeholder="Enter complete delivery address..."
                            rows={4}
                            className="resize-none"
                            aria-invalid={fieldState.invalid}
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Controller
                        name="expectedDeliveryDate"
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="delivery-date">
                              Expected Delivery Date *
                            </FieldLabel>
                            <Input
                              {...field}
                              id="delivery-date"
                              type="date"
                              aria-invalid={fieldState.invalid}
                              min={new Date().toISOString().split('T')[0]}
                            />
                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </Field>
                        )}
                      />

                      <Controller
                        name="paymentStatus"
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="payment-status">
                              Payment Status *
                            </FieldLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select payment status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="paid">Paid</SelectItem>
                                <SelectItem value="refunded">Refunded</SelectItem>
                              </SelectContent>
                            </Select>
                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </Field>
                        )}
                      />
                    </div>
                  </FieldGroup>

                  <div className="flex justify-between pt-4">
                    <Button type="button" variant="outline" disabled>
                      Previous
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setCurrentStep("products")}
                    >
                      Next: Select Products
                    </Button>
                  </div>
                </TabsContent>

                {/* Step 2: Products Selection */}
                <TabsContent value="products" className="space-y-6">
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="product-select">
                        Select Products *
                      </FieldLabel>
                      <Select onValueChange={addProduct}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a product to add" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableProducts.map((product) => (
                            <SelectItem key={product.id} value={product.id}>
                              {product.productName} - {formatCurrency(product.price)} (Stock: {product.stockQuantity})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FieldDescription>
                        Select products to add to this order
                      </FieldDescription>
                    </Field>

                    {/* Selected Products List */}
                    {selectedProducts.length > 0 && (
                      <div className="space-y-3">
                        <Label className="text-sm font-medium">Selected Products</Label>
                        {selectedProducts.map((item) => (
                          <div key={item.productId} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex-1">
                              <p className="font-medium">{item.product?.productName}</p>
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                {formatCurrency(item.price)} × {item.quantity} = {formatCurrency(item.price * item.quantity)}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                              >
                                -
                              </Button>
                              <span className="w-8 text-center">{item.quantity}</span>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                disabled={item.quantity >= (item.product?.stockQuantity || 0)}
                              >
                                +
                              </Button>
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => removeProduct(item.productId)}
                              >
                                Remove
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <Controller
                      name="deliveryStatus"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="delivery-status">
                            Delivery Status *
                          </FieldLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select delivery status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="shipped">Shipped</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                              <SelectItem value="canceled">Canceled</SelectItem>
                            </SelectContent>
                          </Select>
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  </FieldGroup>

                  <div className="flex justify-between pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentStep("details")}
                    >
                      Previous
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setCurrentStep("review")}
                      disabled={selectedProducts.length === 0}
                    >
                      Review Order
                    </Button>
                  </div>
                </TabsContent>

                {/* Step 3: Review Order */}
                <TabsContent value="review" className="space-y-6">
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6 space-y-4">
                    <h3 className="font-semibold text-lg">Review Your Order</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Order ID</Label>
                        <p className="text-sm font-mono">{generateOrderId()}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Client Name</Label>
                        <p className="text-sm">{form.watch("clientName") || "Not provided"}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Delivery Address</Label>
                        <p className="text-sm whitespace-pre-wrap">{form.watch("deliveryAddress") || "Not provided"}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Expected Delivery</Label>
                        <p className="text-sm">{form.watch("expectedDeliveryDate") || "Not provided"}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Payment Status</Label>
                        <p className="text-sm capitalize">{form.watch("paymentStatus") || "Not provided"}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Delivery Status</Label>
                        <p className="text-sm capitalize">{form.watch("deliveryStatus") || "Not provided"}</p>
                      </div>
                    </div>

                    {/* Order Items Summary */}
                    {selectedProducts.length > 0 && (
                      <div>
                        <Label className="text-sm font-medium">Order Items</Label>
                        <div className="mt-2 space-y-2">
                          {selectedProducts.map((item) => (
                            <div key={item.productId} className="flex justify-between text-sm">
                              <span>{item.product?.productName} × {item.quantity}</span>
                              <span>{formatCurrency(item.price * item.quantity)}</span>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between font-semibold border-t pt-2 mt-2">
                          <span>Total Amount:</span>
                          <span>{formatCurrency(totalAmount)}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentStep("products")}
                    >
                      Previous
                    </Button>
                    <Button
                      type="submit"
                      form="order-form"
                      disabled={isSubmitting || selectedProducts.length === 0}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {isSubmitting ? "Creating Order..." : "Create Order"}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </form>
          </CardContent>
        </Card>

        {/* Order Summary Card */}
        <Card className="w-full h-fit shadow-xl border-slate-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package size={20} />
              Order Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Items:</span>
                <span>{selectedProducts.reduce((sum, item) => sum + item.quantity, 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Products:</span>
                <span>{selectedProducts.length}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold border-t pt-2">
                <span>Total Amount:</span>
                <span className="text-green-600">{formatCurrency(totalAmount)}</span>
              </div>
            </div>

            {/* Quick Status */}
            <div className="space-y-3 pt-4 border-t">
              <div>
                <Label className="text-sm font-medium">Payment Status</Label>
                <p className="text-sm capitalize mt-1">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    form.watch("paymentStatus") === "paid" 
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : form.watch("paymentStatus") === "pending"
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                  }`}>
                    {form.watch("paymentStatus") || "Pending"}
                  </span>
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Delivery Status</Label>
                <p className="text-sm capitalize mt-1">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    form.watch("deliveryStatus") === "delivered" 
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : form.watch("deliveryStatus") === "shipped"
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      : form.watch("deliveryStatus") === "canceled"
                      ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                  }`}>
                    {form.watch("deliveryStatus") || "Pending"}
                  </span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}