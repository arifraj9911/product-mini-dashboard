/* eslint-disable react-hooks/incompatible-library */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronDown,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Package,
  Truck,
  Calendar,
  DollarSign,
  User,
  Smile,
  Meh,
  Frown,
  TrendingUp,
  ChevronRight,
  ChevronDownIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Order type definition
export type Order = {
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
  customerFeedback?: number; // 1-5 rating
  deliveryProgress?: number; // 0-100%
};

// Generate sample data if localStorage is empty
const generateSampleData = (): Order[] => [
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

// Custom components for indicators
const ClientAvatar = ({ name }: { name: string }) => {
  const initials = name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs font-semibold dark:bg-blue-900 dark:text-blue-300">
      {initials}
    </div>
  );
};

const PaymentStatusBadge = ({ status }: { status: Order["paymentStatus"] }) => {
  const config = {
    paid: { label: "Paid", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
    pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" },
    refunded: { label: "Refunded", color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" },
  };

  return (
    <Badge variant="secondary" className={config[status].color}>
      {config[status].label}
    </Badge>
  );
};

const DeliveryStatusChip = ({ status, progress }: { status: Order["deliveryStatus"], progress?: number }) => {
  const config = {
    pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" },
    shipped: { label: "Shipped", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" },
    delivered: { label: "Delivered", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
    canceled: { label: "Canceled", color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" },
  };

  return (
    <div className="flex items-center gap-2">
      <Badge variant="outline" className={config[status].color}>
        {config[status].label}
      </Badge>
      {status === "shipped" && progress !== undefined && (
        <span className="text-xs text-gray-500">({progress}%)</span>
      )}
    </div>
  );
};

const DeliveryProgressBar = ({ progress }: { progress?: number }) => {
  const value = progress || 0;
  return (
    <div className="flex items-center gap-2 w-24">
      <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-xs text-gray-600 dark:text-gray-400 w-8">
        {value}%
      </span>
    </div>
  );
};

const CustomerFeedbackIcon = ({ rating }: { rating?: number }) => {
  if (!rating) return <span className="text-gray-400">N/A</span>;

  if (rating >= 4) return <Smile className="h-5 w-5 text-green-500" />;
  if (rating >= 3) return <Meh className="h-5 w-5 text-yellow-500" />;
  return <Frown className="h-5 w-5 text-red-500" />;
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const columns: ColumnDef<Order>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value: any) =>
          table.toggleAllPageRowsSelected(!!value)
        }
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: any) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "orderId",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="pl-0"
        >
          Order ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <Button
        variant="link"
        className="p-0 h-auto font-mono text-blue-600 hover:text-blue-800 dark:text-blue-400"
        onClick={() => {
          // Navigate to order details page
          toast.info(`Viewing order: ${row.getValue("orderId")}`);
        }}
      >
        {row.getValue("orderId")}
      </Button>
    ),
  },
  {
    accessorKey: "clientName",
    header: "Client",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        {/* <ClientAvatar name={row.getValue("clientName")} /> */}
        <div className="flex flex-col">
          <span className="font-medium text-sm">
            {row.getValue("clientName")}
          </span>
          {/* <span className="text-xs text-gray-500">
            {row.original.deliveryAddress.split(',')[0]}
          </span> */}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "paymentStatus",
    header: "Payment",
    cell: ({ row }) => (
      <PaymentStatusBadge status={row.getValue("paymentStatus")} />
    ),
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue) return true;
      return row.getValue(columnId) === filterValue;
    },
  },
  {
    accessorKey: "deliveryStatus",
    header: "Delivery Status",
    cell: ({ row }) => (
      <DeliveryStatusChip 
        status={row.getValue("deliveryStatus")} 
        progress={row.original.deliveryProgress}
      />
    ),
  },
  {
    accessorKey: "totalAmount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-right"
        >
          Total Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("totalAmount"));
      return <div className="text-center font-medium">{formatCurrency(amount)}</div>;
    },
  },
  {
    id: "deliveryProgress",
    header: "Delivery Progress",
    cell: ({ row }) => {
      return <DeliveryProgressBar progress={row.original.deliveryProgress} />;
    },
  },
//   {
//     id: "customerFeedback",
//     header: "Feedback",
//     cell: ({ row }) => {
//       return <CustomerFeedbackIcon rating={row.original.customerFeedback} />;
//     },
//   },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div className="text-sm">{formatDate(row.getValue("createdAt"))}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const order = row.original;

      const handleEdit = () => {
        toast.info(`Editing order: ${order.orderId}`);
        // Add your edit logic here
      };

      const handleDelete = () => {
        if (confirm(`Are you sure you want to delete order ${order.orderId}?`)) {
          const orders = JSON.parse(localStorage.getItem("orders") || "[]");
          const updatedOrders = orders.filter((o: Order) => o.id !== order.id);
          localStorage.setItem("orders", JSON.stringify(updatedOrders));
          toast.success(`Order ${order.orderId} deleted successfully`);
          window.dispatchEvent(new Event("storage")); // Trigger storage event to refresh data
        }
      };

      const handleView = () => {
        toast.info(`Viewing order: ${order.orderId}`);
        // Add your view logic here
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={handleView}>
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Order
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleDelete}
              className="text-red-600 focus:text-red-600"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Order
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

// Expanded row component for product details
const OrderProductsDetail = ({ products }: { products: Order["products"] }) => {
  return (
    <div className="p-4 bg-slate-50 dark:bg-slate-800 border-t">
      <h4 className="font-medium mb-3">Order Items</h4>
      <div className="space-y-2">
        {products.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-2 border rounded-lg">
            <div className="flex-1">
              <p className="font-medium text-sm">{item.product?.productName}</p>
              <p className="text-xs text-gray-500">
                SKU: {item.product?.sku} • Category: {item.product?.category}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">
                {formatCurrency(item.price)} × {item.quantity}
              </p>
              <p className="text-sm text-green-600">
                {formatCurrency(item.price * item.quantity)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function OrderList() {
  const [data, setData] = React.useState<Order[]>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [expandedRows, setExpandedRows] = React.useState<Set<string>>(new Set());
  const [statusFilter, setStatusFilter] = React.useState<string>("");
  const [amountRange, setAmountRange] = React.useState<[number, number]>([0, 1000]);

  // Load data from localStorage
  React.useEffect(() => {
    const loadData = () => {
      try {
        const stored = localStorage.getItem("orders");
        if (stored) {
          setData(JSON.parse(stored));
        } else {
          const sampleData = generateSampleData();
          localStorage.setItem("orders", JSON.stringify(sampleData));
          setData(sampleData);
        }
      } catch (error) {
        console.error("Error loading orders from localStorage:", error);
        const sampleData = generateSampleData();
        setData(sampleData);
      }
    };

    loadData();

    // Listen for storage events
    const handleStorageChange = () => {
      loadData();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Calculate overview metrics
  const overviewMetrics = React.useMemo(() => {
    const totalOrders = data.length;
    const deliveredOrders = data.filter(order => order.deliveryStatus === "delivered").length;
    const pendingDeliveries = data.filter(order => 
      order.deliveryStatus === "pending" || order.deliveryStatus === "shipped"
    ).length;
    const averageSatisfaction = data.length > 0 
      ? data.reduce((sum, order) => sum + (order.customerFeedback || 0), 0) / data.length 
      : 0;

    return {
      totalOrders,
      deliveredPercentage: totalOrders > 0 ? (deliveredOrders / totalOrders) * 100 : 0,
      pendingDeliveries,
      averageSatisfaction: Math.round(averageSatisfaction * 10) / 10,
    };
  }, [data]);

  // Get unique statuses for filter
  const statuses = React.useMemo(() => {
    return [...new Set(data.map((order) => order.deliveryStatus))];
  }, [data]);

  // Apply status and amount filters
  const filteredData = React.useMemo(() => {
    return data.filter((order) => {
      const matchesStatus = !statusFilter || order.deliveryStatus === statusFilter;
      const matchesAmount = order.totalAmount >= amountRange[0] && order.totalAmount <= amountRange[1];
      return matchesStatus && matchesAmount;
    });
  }, [data, statusFilter, amountRange]);

  const table = useReactTable({
    data: filteredData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  // Toggle row expansion
  const toggleRowExpansion = (orderId: string) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  // Bulk actions
  const handleBulkDelete = () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    if (selectedRows.length === 0) {
      toast.error("No orders selected");
      return;
    }

    if (confirm(`Are you sure you want to delete ${selectedRows.length} orders?`)) {
      const orders = JSON.parse(localStorage.getItem("orders") || "[]");
      const selectedIds = selectedRows.map((row) => row.original.id);
      const updatedOrders = orders.filter((o: Order) => !selectedIds.includes(o.id));
      localStorage.setItem("orders", JSON.stringify(updatedOrders));
      setData(updatedOrders);
      setRowSelection({});
      toast.success(`Deleted ${selectedRows.length} orders successfully`);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overviewMetrics.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              All time orders
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivered</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overviewMetrics.deliveredPercentage.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Success rate
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Delivery</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overviewMetrics.pendingDeliveries}</div>
            <p className="text-xs text-muted-foreground">
              In transit
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Satisfaction</CardTitle>
            <Smile className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overviewMetrics.averageSatisfaction}/5</div>
            <p className="text-xs text-muted-foreground">
              Customer feedback
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4 p-4 bg-white dark:bg-slate-800 rounded-lg border">
        <div className="flex-1 flex flex-col md:flex-row justify-start md:justify-between items-start md:items-center gap-4">
          {/* Status Filter */}
          <div>
            <label className="text-sm font-medium mb-2 block">Delivery Status</label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All statuses">All statuses</SelectItem>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Amount Range Filter */}
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block md:w-2/5 md:ml-auto">
              Amount Range: {formatCurrency(amountRange[0])} - {formatCurrency(amountRange[1])}
            </label>
            <Slider
              value={amountRange}
              onValueChange={(value) => setAmountRange(value as [number, number])}
              max={5000}
              step={50}
              className="md:w-2/5 md:ml-auto"
            />
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {table.getFilteredSelectedRowModel().rows.length > 0 && (
        <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border">
          <span className="text-sm text-blue-700 dark:text-blue-300">
            {table.getFilteredSelectedRowModel().rows.length} order(s) selected
          </span>
          <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
            Delete Selected
          </Button>
        </div>
      )}

      {/* Table Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Filter orders..."
            value={
              (table.getColumn("orderId")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("orderId")?.setFilterValue(event.target.value)
            }
            className="w-full sm:w-64"
          />
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-md border">
        <div className="overflow-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <React.Fragment key={row.id}>
                    <TableRow
                      data-state={row.getIsSelected() && "selected"}
                      className="hover:bg-gray-50 dark:hover:bg-slate-800/50"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleRowExpansion(row.original.id)}
                        >
                          {expandedRows.has(row.original.id) ? (
                            <ChevronDownIcon className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                    {expandedRows.has(row.original.id) && (
                      <TableRow>
                        <TableCell colSpan={columns.length + 1} className="p-0">
                          <OrderProductsDetail products={row.original.products} />
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + 1}
                    className="h-24 text-center"
                  >
                    No orders found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination and Summary */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
        <div className="text-sm text-muted-foreground flex-1">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} order(s) selected.
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <div className="flex items-center gap-1 text-sm">
            Page{" "}
            <strong>
              {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </strong>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}