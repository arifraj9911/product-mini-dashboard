"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { HashLoader } from "react-spinners";

// Types
interface User {
  email: string;
  isAuthenticated: boolean;
  loginTime: string;
}

interface Order {
  id: string;
  productId: string;
  quantity: number;
  total: number;
  status: string;
  createdAt: string;
}

export default function DashboardHome() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = () => {
      // Check authentication
      const userData = localStorage.getItem("user");
      if (!userData) {
        router.push("/");
        return;
      }

      const userObj: User = JSON.parse(userData);
      setUser(userObj);

      // Load data from localStorage
      const usersData = localStorage.getItem("users");
      const productsData = localStorage.getItem("product-data");
      const ordersData = localStorage.getItem("order-data");

      // Calculate stats
      const totalUsers = usersData ? JSON.parse(usersData).length : 1; // At least current user
      const totalProducts = productsData ? JSON.parse(productsData).length : 0;
      const orders = ordersData ? JSON.parse(ordersData) : [];
      const totalOrders = orders.length;
      const totalRevenue = orders.reduce(
        (sum: number, order: Order) => sum + (order.total || 0),
        0
      );

      setStats({
        totalUsers,
        totalRevenue,
        totalProducts,
        totalOrders,
      });

      setLoading(false);
    };

    loadDashboardData();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <HashLoader />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen ">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold ">Dashboard</h1>
          <p className="text-gray-400 mt-2">Welcome back, {user.email}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-card-foreground mb-2">
              Total Users
            </h3>
            <p className="text-2xl font-bold text-primary">
              {stats.totalUsers}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Registered users in system
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-card-foreground mb-2">
              Total Revenue
            </h3>
            <p className="text-2xl font-bold text-primary">
              ${stats.totalRevenue.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Total revenue from all orders
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-card-foreground mb-2">
              Total Products
            </h3>
            <p className="text-2xl font-bold text-primary">
              {stats.totalProducts}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Products in inventory
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-card-foreground mb-2">
              Total Orders
            </h3>
            <p className="text-2xl font-bold text-primary">
              {stats.totalOrders}
            </p>
            <p className="text-sm text-muted-foreground mt-1">Orders placed</p>
          </div>
        </div>

        {/* Recent Activity & Dashboard Manual */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-card-foreground mb-4">
              Recent Activity
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-card-foreground">
                    User logged in
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(user.loginTime).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-card-foreground">
                    Dashboard accessed
                  </p>
                  <p className="text-sm text-muted-foreground">Just now</p>
                </div>
              </div>
              {stats.totalOrders > 0 && (
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-card-foreground">
                      {stats.totalOrders} orders processed
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Total orders in system
                    </p>
                  </div>
                </div>
              )}
              {stats.totalProducts > 0 && (
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-card-foreground">
                      {stats.totalProducts} products available
                    </p>
                    <p className="text-sm text-muted-foreground">
                      In inventory
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-card-foreground mb-4">
              Dashboard Manual
            </h3>
            <div className="space-y-4">
              <div className="p-4  rounded-lg border border-blue-200">
                <h4 className="font-semibold  mb-2">View Products</h4>
                <p className="text-sm ">
                  To see the complete list of products with details, navigate to
                  the Products section. You can view all available products,
                  their prices, and stock levels.
                </p>
              </div>

              <div className="p-4  rounded-lg border border-green-200">
                <h4 className="font-semibold  mb-2">Manage Orders</h4>
                <p className="text-sm ">
                  For detailed order information including customer details,
                  order status, and order history, please visit the Orders
                  section.
                </p>
              </div>

              <div className="p-4 rounded-lg border border-purple-200">
                <h4 className="font-semibold  mb-2">User Management</h4>
                <p className="text-sm ">
                  To manage user accounts, permissions, and view user activity,
                  access the Users section from the main navigation.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="mt-8 bg-card border border-border rounded-lg p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-card-foreground mb-4">
            Quick Navigation
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border border-border rounded-lg hover:bg-accent transition-colors">
              <h4 className="font-semibold text-card-foreground mb-2">
                Products Management
              </h4>
              <p className="text-sm text-muted-foreground">
                Manage your product catalog, inventory, and pricing
              </p>
            </div>

            <div className="text-center p-4 border border-border rounded-lg hover:bg-accent transition-colors">
              <h4 className="font-semibold text-card-foreground mb-2">
                Orders Overview
              </h4>
              <p className="text-sm text-muted-foreground">
                View and manage customer orders and order status
              </p>
            </div>

            <div className="text-center p-4 border border-border rounded-lg hover:bg-accent transition-colors">
              <h4 className="font-semibold text-card-foreground mb-2">
                User Administration
              </h4>
              <p className="text-sm text-muted-foreground">
                Manage user accounts and system permissions
              </p>
            </div>
          </div>
        </div>

        {/* User Information */}
        <div className="mt-8 bg-card border border-border rounded-lg p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-card-foreground mb-4">
            User Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <span className="text-sm text-muted-foreground">Email:</span>
              <p className="text-sm font-medium text-card-foreground">
                {user.email}
              </p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Role:</span>
              <p className="text-sm font-medium text-card-foreground">
                Administrator
              </p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Login Time:</span>
              <p className="text-sm font-medium text-card-foreground">
                {new Date(user.loginTime).toLocaleString()}
              </p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Status:</span>
              <p className="text-sm font-medium text-green-600">Active</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
