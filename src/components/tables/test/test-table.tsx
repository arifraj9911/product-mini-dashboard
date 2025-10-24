/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */

"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
  TrendingUp,
  //   Truck,
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
import { ProductProps } from "@/types/products-props";

// Generate sample data if localStorage is empty
const generateSampleData = (): ProductProps[] => [
  {
    id: "1",
    productName: "Wireless Bluetooth Headphones",
    sku: "AUDIO-001",
    category: "Electronics",
    price: 129.99,
    stockQuantity: 60,
    description: "High-quality wireless headphones with noise cancellation",
    active: true,
    createdAt: "2024-01-15",
    satisfaction: 4,
    deliveryProgress: 85,
    salesData: [12, 19, 8, 15, 22, 18, 25],
    imageUrl: "",
  },
  {
    id: "2",
    productName: "Ergonomic Office Chair",
    sku: "FURN-001",
    category: "Furniture",
    price: 299.99,
    stockQuantity: 8,
    description: "Comfortable ergonomic chair for office use",
    active: true,
    createdAt: "2024-01-10",
    satisfaction: 5,
    deliveryProgress: 45,
    salesData: [5, 8, 12, 6, 9, 11, 7],
    imageUrl: "",
  },
  {
    id: "3",
    productName: "Cotton T-Shirt",
    sku: "CLOTH-001",
    category: "Clothing",
    price: 24.99,
    stockQuantity: 120,
    description: "100% cotton comfortable t-shirt",
    active: true,
    createdAt: "2024-01-20",
    satisfaction: 3,
    deliveryProgress: 100,
    salesData: [45, 38, 52, 48, 61, 55, 49],
    imageUrl: "",
  },
  {
    id: "4",
    productName: "Smartphone Case",
    sku: "ACC-001",
    category: "Electronics",
    price: 19.99,
    stockQuantity: 0,
    description: "Protective case for smartphones",
    active: false,
    createdAt: "2024-01-05",
    satisfaction: 2,
    deliveryProgress: 0,
    salesData: [0, 0, 0, 0, 0, 0, 0],
    imageUrl: "",
  },
  {
    id: "5",
    productName: "Desk Lamp",
    sku: "FURN-002",
    category: "Furniture",
    price: 49.99,
    stockQuantity: 55,
    description: "LED desk lamp with adjustable brightness",
    active: true,
    createdAt: "2024-01-12",
    satisfaction: 4,
    deliveryProgress: 90,
    salesData: [8, 12, 6, 14, 10, 13, 9],
    imageUrl: "",
  },
];

// Custom components for indicators
const StockIndicator = ({ quantity }: { quantity: number }) => {
  let color =
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
  if (quantity < 10) {
    color = "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
  } else if (quantity < 50) {
    color =
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
  }

  return (
    <Badge variant="secondary" className={color}>
      {quantity} in stock
    </Badge>
  );
};

const StatusIndicator = ({ active }: { active: boolean }) => (
  <Badge
    variant="outline"
    className={
      active
        ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300"
        : "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300"
    }
  >
    {active ? "Active" : "Inactive"}
  </Badge>
);

const SatisfactionIndicator = ({ rating }: { rating?: number }) => {
  if (!rating) return <span className="text-gray-400">N/A</span>;

  const emojis = ["😡", "😠", "😐", "😊", "😀"];
  const emoji = emojis[Math.min(Math.max(Math.floor(rating) - 1, 0), 4)];

  return (
    <div className="flex items-center gap-1">
      <span className="text-lg">{emoji}</span>
      <span className="text-xs text-gray-500">({rating}/5)</span>
    </div>
  );
};

const DeliveryProgress = ({ progress }: { progress?: number }) => {
  const value = progress || 0;
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 bg-gray-200 rounded-full h-2 dark:bg-gray-700">
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

const SparklineChart = ({ data }: { data?: number[] }) => {
  if (!data || data.length === 0)
    return <div className="text-gray-400 text-xs">No data</div>;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  return (
    <div className="w-16 h-6 flex items-end gap-px">
      {data.map((value, index) => (
        <div
          key={index}
          className="flex-1 bg-blue-500 rounded-t-sm transition-all duration-300"
          style={{
            height: `${((value - min) / range) * 100}%`,
            backgroundColor:
              value > data[index - 1]
                ? "#10b981"
                : value < data[index - 1]
                ? "#ef4444"
                : "#3b82f6",
          }}
        />
      ))}
    </div>
  );
};

export const columns: ColumnDef<ProductProps>[] = [
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
    accessorKey: "productName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="pl-0"
        >
          Product Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        {row.original?.imageUrl ? (
          <img
            src={row.original.imageUrl}
            alt={row.getValue("productName")}
            className="w-8 h-8 object-cover rounded-lg"
          />
        ) : (
          <div className=" w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center dark:bg-blue-900">
            <Package className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
        )}
        <div className="flex flex-col">
          <span className="font-medium text-sm">
            {row.getValue("productName")}
          </span>
          <span className="text-xs text-gray-500 font-mono">
            {row.original.sku}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => (
      <Badge variant="outline" className="capitalize">
        {row.getValue("category")}
      </Badge>
    ),
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue) return true;
      return row.getValue(columnId) === filterValue;
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-right"
        >
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(price);

      return <div className="text-center font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "stockQuantity",
    header: "Stock",
    cell: ({ row }) => {
      return <StockIndicator quantity={row.getValue("stockQuantity")} />;
    },
  },
  {
    accessorKey: "active",
    header: "Status",
    cell: ({ row }) => {
      return <StatusIndicator active={row.getValue("active")} />;
    },
  },
  {
    id: "satisfaction",
    header: "Satisfaction",
    cell: ({ row }) => {
      return <SatisfactionIndicator rating={row.original.satisfaction} />;
    },
  },
  {
    id: "delivery",
    header: "Delivery",
    cell: ({ row }) => {
      return <DeliveryProgress progress={row.original.deliveryProgress} />;
    },
  },
  {
    id: "sales",
    header: () => (
      <div className="flex items-center gap-1">
        <TrendingUp className="h-4 w-4" />
        <span>Sales Trend</span>
      </div>
    ),
    cell: ({ row }) => {
      return <SparklineChart data={row.original.salesData} />;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const product = row.original;

      const handleEdit = () => {
        toast.info(`Editing product: ${product.productName}`);
        // Add your edit logic here
      };

      const handleDelete = () => {
        if (
          confirm(`Are you sure you want to delete ${product.productName}?`)
        ) {
          const products = JSON.parse(localStorage.getItem("products") || "[]");
          const updatedProducts = products.filter(
            (p: ProductProps) => p.id !== product.id
          );
          localStorage.setItem("products", JSON.stringify(updatedProducts));
          toast.success(`Product ${product.productName} deleted successfully`);
          window.dispatchEvent(new Event("storage")); // Trigger storage event to refresh data
        }
      };

      const handleView = () => {
        toast.info(`Viewing product: ${product.productName}`);
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
              Edit Product
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleDelete}
              className="text-red-600 focus:text-red-600"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Product
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function TableContentNew() {
  const [data, setData] = React.useState<ProductProps[]>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [categoryFilter, setCategoryFilter] = React.useState<string>("");
  const [priceRange, setPriceRange] = React.useState<[number, number]>([
    0, 1000,
  ]);

  // Load data from localStorage
  React.useEffect(() => {
    const loadData = () => {
      try {
        const stored = localStorage.getItem("products");
        if (stored) {
          setData(JSON.parse(stored));
        } else {
          const sampleData = generateSampleData();
          localStorage.setItem("products", JSON.stringify(sampleData));
          setData(sampleData);
        }
      } catch (error) {
        console.error("Error loading products from localStorage:", error);
        const sampleData = generateSampleData();
        setData(sampleData);
      }
    };

    loadData();

    // Listen for storage events (when data changes in other tabs/windows)
    const handleStorageChange = () => {
      loadData();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Get unique categories for filter
  const categories = React.useMemo(() => {
    return [...new Set(data.map((product) => product.category))];
  }, [data]);

  // Apply category and price filters
  const filteredData = React.useMemo(() => {
    return data.filter((product) => {
      const matchesCategory =
        !categoryFilter || product.category === categoryFilter;
      const matchesPrice =
        product.price >= priceRange[0] && product.price <= priceRange[1];
      return matchesCategory && matchesPrice;
    });
  }, [data, categoryFilter, priceRange]);

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

  // Bulk actions
  const handleBulkDelete = () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    if (selectedRows.length === 0) {
      toast.error("No products selected");
      return;
    }

    if (
      confirm(
        `Are you sure you want to delete ${selectedRows.length} products?`
      )
    ) {
      const products = JSON.parse(localStorage.getItem("products") || "[]");
      const selectedIds = selectedRows.map((row) => row.original.id);
      const updatedProducts = products.filter(
        (p: ProductProps) => !selectedIds.includes(p.id)
      );
      localStorage.setItem("products", JSON.stringify(updatedProducts));
      setData(updatedProducts);
      setRowSelection({});
      toast.success(`Deleted ${selectedRows.length} products successfully`);
    }
  };

  const handleBulkStatusChange = (active: boolean) => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    if (selectedRows.length === 0) {
      toast.error("No products selected");
      return;
    }

    const products = JSON.parse(localStorage.getItem("products") || "[]");
    const selectedIds = selectedRows.map((row) => row.original.id);
    const updatedProducts = products.map((p: ProductProps) =>
      selectedIds.includes(p.id) ? { ...p, active } : p
    );
    localStorage.setItem("products", JSON.stringify(updatedProducts));
    setData(updatedProducts);
    toast.success(`Updated status for ${selectedRows.length} products`);
  };
  return (
    <div className="overflow-hidden rounded-md border p-4 space-y-4">
      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4 p-4 bg-white dark:bg-slate-800 rounded-lg border">
        <div className="flex-1 flex flex-col md:flex-row justify-start md:justify-between items-start md:items-center gap-4">
          {/* Category Filter */}
          <div>
            <label className="text-sm font-medium mb-2 block">Category</label>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All categories">All categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Price Range Filter */}
          <div className=" flex-1">
            <label className="text-sm font-medium mb-2 block md:w-2/5 md:ml-auto">
              Price Range: ${priceRange[0]} - ${priceRange[1]}
            </label>
            <Slider
              value={priceRange}
              onValueChange={(value) =>
                setPriceRange(value as [number, number])
              }
              max={5000}
              step={20}
              className="md:w-2/5 md:ml-auto"
            />
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {table.getFilteredSelectedRowModel().rows.length > 0 && (
        <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border">
          <span className="text-sm text-blue-700 dark:text-blue-300">
            {table.getFilteredSelectedRowModel().rows.length} product(s)
            selected
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleBulkStatusChange(true)}
          >
            Activate
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleBulkStatusChange(false)}
          >
            Deactivate
          </Button>
          <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
            Delete Selected
          </Button>
        </div>
      )}

      <div className="overflow-x-auto">
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
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
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
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No products found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination and Summary */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
        <div className="text-sm text-muted-foreground flex-1">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} product(s) selected.
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
