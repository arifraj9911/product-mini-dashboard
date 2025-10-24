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
import { useState } from "react";

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
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Image, Upload, CheckCircle2, AlertCircle } from "lucide-react";

const formSchema = z.object({
  productName: z
    .string()
    .min(1, "Product name is required")
    .max(100, "Product name must be at most 100 characters"),
  sku: z
    .string()
    .min(1, "SKU is required")
    .max(50, "SKU must be at most 50 characters")
    .transform((val) => val.toUpperCase()),
  category: z.string().min(1, "Category is required"),
  price: z
    .string()
    .min(1, "Price is required")
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "Price must be a positive number",
    }),
  stockQuantity: z
    .string()
    .min(1, "Stock quantity is required")
    .refine((val) => !isNaN(parseInt(val)) && parseInt(val) >= 0, {
      message: "Stock quantity must be a non-negative number",
    }),
  description: z
    .string()
    .max(500, "Description must be at most 500 characters")
    .optional(),
  active: z.boolean().default(true),
  satisfaction: z
    .string()
    .min(1, "Satisfaction rating is required")
    .refine(
      (val) =>
        !isNaN(parseInt(val)) && parseInt(val) >= 1 && parseInt(val) <= 5,
      {
        message: "Satisfaction must be between 1 and 5",
      }
    ),
  deliveryProgress: z
    .string()
    .min(1, "Delivery progress is required")
    .refine(
      (val) =>
        !isNaN(parseInt(val)) && parseInt(val) >= 0 && parseInt(val) <= 100,
      {
        message: "Delivery progress must be between 0 and 100",
      }
    ),
});

type FormData = z.infer<typeof formSchema>;

// Step validation schemas
const stepSchemas = {
  basic: z.object({
    productName: formSchema.shape.productName,
    description: formSchema.shape.description,
  }),
  inventory: z.object({
    sku: formSchema.shape.sku,
    category: formSchema.shape.category,
    price: formSchema.shape.price,
    stockQuantity: formSchema.shape.stockQuantity,
  }),
  media: z.object({
    satisfaction: formSchema.shape.satisfaction,
    deliveryProgress: formSchema.shape.deliveryProgress,
  }),
  review: formSchema,
};

export default function AddProduct() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState("basic");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema) as Resolver<FormData>,
    defaultValues: {
      productName: "",
      sku: "",
      category: "",
      price: "",
      stockQuantity: "",
      description: "",
      active: true,
      satisfaction: "",
      deliveryProgress: "",
    },
    mode: "onChange",
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const imageDataUrl = e.target?.result as string;
        setImagePreview(imageDataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
  };

  const categories = [
    "Electronics",
    "Furniture",
    "Clothing",
    "Books",
    "Sports",
    "Beauty",
    "Toys",
    "Food",
    "Other",
  ];

  const generateSalesData = () => {
    return Array.from({ length: 7 }, () => Math.floor(Math.random() * 100));
  };

  const generateUniqueId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  // Validate current step before proceeding
  const validateStep = async (step: string): Promise<boolean> => {
    const stepSchema = stepSchemas[step as keyof typeof stepSchemas];
    
    try {
      await stepSchema.parseAsync(form.getValues());
      return true;
    } catch (error) {
      // Trigger validation to show errors
      await form.trigger(Object.keys(stepSchema.shape) as any);
      return false;
    }
  };

  const handleNextStep = async (nextStep: string) => {
    const isValid = await validateStep(currentStep);
    if (isValid) {
      setCurrentStep(nextStep);
    } else {
      toast.error("Please fill all required fields correctly", {
        description: "Check the form for errors before proceeding.",
        position: "top-center",
      });
    }
  };

  const handlePreviousStep = (prevStep: string) => {
    setCurrentStep(prevStep);
  };

  async function onSubmit(data: FormData) {
    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const existingProducts = JSON.parse(
        localStorage.getItem("product-data") || "[]"
      );

      const newProduct = {
        id: generateUniqueId(),
        productName: data.productName,
        sku: data.sku,
        category: data.category,
        price: parseFloat(data.price),
        stockQuantity: parseInt(data.stockQuantity),
        description: data.description,
        active: data.active,
        createdAt: new Date().toISOString().split("T")[0],
        satisfaction: parseInt(data.satisfaction),
        deliveryProgress: parseInt(data.deliveryProgress),
        salesData: generateSalesData(),
        imageUrl: imagePreview || null,
      };

      console.log("new product", newProduct);

      const updatedProducts = [...existingProducts, newProduct];

      localStorage.setItem("product-data", JSON.stringify(updatedProducts));

      toast.success("Product created successfully!", {
        description: `${data.productName} has been added to your catalog.`,
        position: "top-center",
      });

      setTimeout(() => {
        router.push("/dashboard/products");
      }, 2000);
    } catch (error: any) {
      toast.error("Failed to create product", {
        description: "Please try again later.",
        position: "top-center",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const formatCurrency = (value: string) => {
    if (!value) return "";
    const number = parseFloat(value);
    if (isNaN(number)) return value;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(number);
  };

  // Check if current step is valid
  const isStepValid = (step: string): boolean => {
    const stepFields = Object.keys(stepSchemas[step as keyof typeof stepSchemas].shape);
    return stepFields.every(field => !form.formState.errors[field as keyof FormData]);
  };

  const steps = [
    { id: "basic", label: "Basic", fields: ["productName", "description"] },
    { id: "inventory", label: "Inventory", fields: ["sku", "category", "price", "stockQuantity"] },
    { id: "media", label: "Media", fields: ["satisfaction", "deliveryProgress"] },
    { id: "review", label: "Review", fields: [] }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center md:p-4 bg-linear-to-br from-slate-50 to-blue-50 dark:from-neutral-900 dark:to-slate-900">
      <Card className="w-full max-w-3xl mx-auto shadow-xl border-slate-200 dark:border-slate-700">
        <CardHeader className="text-center md:pb-4">
          <CardTitle className="text-2xl font-bold bg-linear-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
            Add New Product
          </CardTitle>
          <CardDescription>
            Fill in the product details below. Fields marked with * are required.
          </CardDescription>
        </CardHeader>

        <CardContent className="md:px-6">
          <div className="md:flex justify-center mb-12 hidden">
            <div className="flex items-start space-x-0.5">
              {steps.map((step, index) => {
                const stepIndex = steps.findIndex(s => s.id === currentStep);
                const isCompleted = index < stepIndex;
                const isCurrent = currentStep === step.id;
                const isUpcoming = index > stepIndex;
                const isValid = isStepValid(step.id);

                return (
                  <React.Fragment key={step.id}>
                    <div className="flex flex-col items-center">
                      {/* Step circle */}
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
                          ${!isValid && isCurrent ? "border-red-500 bg-red-500 text-white" : ""}
                        `}
                      >
                        {isCompleted ? (
                          <CheckCircle2 size={20} className="text-white" />
                        ) : !isValid && isCurrent ? (
                          <AlertCircle size={20} className="text-white" />
                        ) : (
                          <span className="flex items-center justify-center w-full h-full">
                            {index + 1}
                          </span>
                        )}

                        {isCurrent && (
                          <div className={`absolute inset-0 rounded-full animate-ping opacity-20 ${
                            !isValid ? "bg-red-500" : "bg-blue-600"
                          }`} />
                        )}
                      </div>

                      {/* Step label */}
                      <span
                        className={`
                          text-sm font-medium mt-3 capitalize transition-colors duration-200
                          ${
                            isCurrent
                              ? !isValid 
                                ? "text-red-600 dark:text-red-400 font-semibold"
                                : "text-blue-600 dark:text-blue-400 font-semibold"
                              : isCompleted
                              ? "text-green-600 dark:text-green-400"
                              : "text-slate-500 dark:text-slate-400"
                          }
                        `}
                      >
                        {step.label}
                      </span>
                    </div>

                    {/* Connector line */}
                    {index < steps.length - 1 && (
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

          <form id="product-form" onSubmit={form.handleSubmit(onSubmit)}>
            <Tabs
              value={currentStep}
              onValueChange={setCurrentStep}
              className="w-full"
            >
              {/* Basic Information Step */}
              <TabsContent value="basic" className="space-y-6">
                <FieldGroup>
                  <Controller
                    name="productName"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="product-name">
                          Product Name *
                        </FieldLabel>
                        <Input
                          {...field}
                          id="product-name"
                          aria-invalid={fieldState.invalid}
                          placeholder="Enter product name"
                          autoComplete="off"
                          className="w-full"
                        />
                        <FieldDescription>
                          Must be unique across your product catalog
                        </FieldDescription>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="description"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="description">
                          Description
                        </FieldLabel>
                        <InputGroup>
                          <InputGroupTextarea
                            {...field}
                            id="description"
                            placeholder="Describe your product features, specifications, and benefits..."
                            rows={6}
                            className="min-h-32 resize-none"
                            aria-invalid={fieldState.invalid}
                          />
                          <InputGroupAddon align="block-end">
                            <InputGroupText className="tabular-nums">
                              {field?.value?.length}/500 characters
                            </InputGroupText>
                          </InputGroupAddon>
                        </InputGroup>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </FieldGroup>

                <div className="flex justify-between pt-4">
                  <Button type="button" variant="outline" disabled>
                    Previous
                  </Button>
                  <Button
                    type="button"
                    onClick={() => handleNextStep("inventory")}
                  >
                    Next: Inventory & Pricing
                  </Button>
                </div>
              </TabsContent>

              {/* Inventory & Pricing Step */}
              <TabsContent value="inventory" className="space-y-6">
                <FieldGroup>
                  <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                    <Controller
                      name="sku"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="sku">
                            SKU (Stock Keeping Unit) *
                          </FieldLabel>
                          <Input
                            {...field}
                            id="sku"
                            aria-invalid={fieldState.invalid}
                            placeholder="PROD-001"
                            autoComplete="off"
                            className="w-full uppercase"
                            onChange={(e) =>
                              field.onChange(e.target.value.toUpperCase())
                            }
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    <Controller
                      name="category"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="category">Category *</FieldLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  </div>
                  <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                    <Controller
                      name="price"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="price">Price *</FieldLabel>
                          <InputGroup>
                            <Input
                              {...field}
                              id="price"
                              type="number"
                              step="0.01"
                              min="0"
                              aria-invalid={fieldState.invalid}
                              placeholder="0.00"
                              autoComplete="off"
                              value={field.value ?? ""}
                            />
                          </InputGroup>
                          <FieldDescription>
                            Formatted:{" "}
                            {field.value && ` ${formatCurrency(field.value)}`}
                          </FieldDescription>
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    <Controller
                      name="stockQuantity"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="stock-quantity">
                            Stock Quantity *
                          </FieldLabel>
                          <Input
                            {...field}
                            id="stock-quantity"
                            type="number"
                            min="0"
                            aria-invalid={fieldState.invalid}
                            placeholder="0"
                            autoComplete="off"
                            className="w-full"
                            value={field.value ?? ""}
                          />
                          <FieldDescription>
                            Current available stock
                          </FieldDescription>
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  </div>
                </FieldGroup>

                <div className="flex justify-between pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handlePreviousStep("basic")}
                  >
                    Previous
                  </Button>
                  <Button 
                    type="button" 
                    onClick={() => handleNextStep("media")}
                  >
                    Next: Media & Description
                  </Button>
                </div>
              </TabsContent>

              {/* Media & Additional Info Step */}
              <TabsContent value="media" className="space-y-6">
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="product-image">
                      Product Image
                    </FieldLabel>
                    <div className="space-y-4">
                      {imagePreview ? (
                        <div className="relative inline-block">
                          <img
                            src={imagePreview}
                            alt="Product preview"
                            className="w-32 h-32 object-cover rounded-lg border-2 border-slate-200 dark:border-slate-600"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute -top-2 -right-2 w-6 h-6 p-0 rounded-full"
                            onClick={removeImage}
                          >
                            ×
                          </Button>
                        </div>
                      ) : (
                        <label
                          htmlFor="product-image"
                          className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg cursor-pointer hover:border-slate-400 dark:hover:border-slate-500 transition-colors"
                        >
                          <Upload size={24} className="text-slate-400 mb-2" />
                          <span className="text-sm text-slate-500">Upload</span>
                        </label>
                      )}
                      <input
                        id="product-image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                    <FieldDescription>
                      Recommended: 500x500px, JPG, PNG or WebP (max 5MB)
                    </FieldDescription>
                  </Field>

                  <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                    <Controller
                      name="satisfaction"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="satisfaction">
                            Customer Satisfaction (1-5) *
                          </FieldLabel>
                          <Input
                            {...field}
                            id="satisfaction"
                            type="number"
                            min="1"
                            max="5"
                            aria-invalid={fieldState.invalid}
                            placeholder="4"
                            autoComplete="off"
                          />
                          <FieldDescription>
                            Rate from 1 (Poor) to 5 (Excellent)
                          </FieldDescription>
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    <Controller
                      name="deliveryProgress"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="deliveryProgress">
                            Delivery Progress (0-100%) *
                          </FieldLabel>
                          <Input
                            {...field}
                            id="deliveryProgress"
                            type="number"
                            min="0"
                            max="100"
                            aria-invalid={fieldState.invalid}
                            placeholder="85"
                            autoComplete="off"
                          />
                          <FieldDescription>
                            Percentage of delivery completion
                          </FieldDescription>
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  </div>

                  <Controller
                    name="active"
                    control={form.control}
                    render={({ field }) => (
                      <Field className="flex items-center justify-between rounded-lg">
                        <div className="space-y-0.5">
                          <FieldLabel htmlFor="active-status">
                            Product Status
                          </FieldLabel>
                          <FieldDescription>
                            Active products are visible to customers
                          </FieldDescription>
                        </div>
                        <span className="w-20">
                          <Switch
                            id="active-status"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </span>
                      </Field>
                    )}
                  />
                </FieldGroup>

                <div className="flex justify-between pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handlePreviousStep("inventory")}
                  >
                    Previous
                  </Button>
                  <Button
                    type="button"
                    onClick={() => handleNextStep("review")}
                  >
                    Review & Submit
                  </Button>
                </div>
              </TabsContent>

              {/* Review Step */}
              <TabsContent value="review" className="space-y-6">
                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6 space-y-4">
                  <h3 className="font-semibold text-lg">Review Your Product</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">
                        Product Name
                      </Label>
                      <p className="text-sm">
                        {form.watch("productName") || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">SKU</Label>
                      <p className="text-sm font-mono">
                        {form.watch("sku") || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Category</Label>
                      <p className="text-sm">
                        {form.watch("category") || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Price</Label>
                      <p className="text-sm">
                        {form.watch("price")
                          ? formatCurrency(form.watch("price")!)
                          : "Not provided"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">
                        Stock Quantity
                      </Label>
                      <p className="text-sm">
                        {form.watch("stockQuantity") || "0"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">
                        Satisfaction
                      </Label>
                      <p className="text-sm">
                        {form.watch("satisfaction") || "Not provided"}/5
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">
                        Delivery Progress
                      </Label>
                      <p className="text-sm">
                        {form.watch("deliveryProgress") || "0"}%
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Status</Label>
                      <p className="text-sm">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            form.watch("active")
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          }`}
                        >
                          {form.watch("active") ? "Active" : "Inactive"}
                        </span>
                      </p>
                    </div>
                  </div>

                  {form.watch("description") && (
                    <div>
                      <Label className="text-sm font-medium">Description</Label>
                      <p className="text-sm mt-1 whitespace-pre-wrap">
                        {form.watch("description")}
                      </p>
                    </div>
                  )}

                  {imagePreview && (
                    <div>
                      <Label className="text-sm font-medium">
                        Product Image
                      </Label>
                      <img
                        src={imagePreview}
                        alt="Product preview"
                        className="w-24 h-24 object-cover rounded-lg border mt-2"
                      />
                    </div>
                  )}
                </div>

                <div className="flex justify-between pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handlePreviousStep("media")}
                  >
                    Previous
                  </Button>
                  <Button
                    type="submit"
                    form="product-form"
                    disabled={isSubmitting}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isSubmitting ? <>Creating Product...</> : "Create Product"}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}