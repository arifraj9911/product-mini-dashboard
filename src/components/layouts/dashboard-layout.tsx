/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronDown,
  Moon,
  Sun,
  LogIn,
  LogOut,
  Package,
  ShoppingCart,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [ordersOpen, setOrdersOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<{
    name: string;
    email: string;
    avatar?: string;
  } | null>(null);

  const sidebarRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Load theme and user data from localStorage on component mount
  useEffect(() => {
    // Load theme
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    }

    // Load user data
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const userObj = JSON.parse(userData);
        setUser({
          name: userObj.name || "User",
          email: userObj.email,
          avatar: userObj.avatar || "https://i.pravatar.cc/40?img=12",
        });
      } catch (error) {
        console.error("Error parsing user data:", error);
        setUser(null);
      }
    }
  }, []);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!sidebarOpen) return;

      const target = event.target as Node;
      const isMenuButton = menuButtonRef.current?.contains(target);
      const isSidebar = sidebarRef.current?.contains(target);

      if (!isSidebar && !isMenuButton) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sidebarOpen]);

  const handleThemeToggle = () => {
    const newDarkMode = !isDark;

    if (newDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }

    setIsDark(newDarkMode);
  };

  const handleLogin = () => {
    router.push("/");
  };

  const handleLogout = () => {
    // Remove user data from localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("rememberedEmail");
    localStorage.removeItem("rememberedPassword");

    // Clear cookies
    document.cookie = "user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

    // Reset user state
    setUser(null);

    // Redirect to login page
    router.push("/");
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-linear-to-br from-slate-50 to-blue-50 dark:from-neutral-900 dark:to-slate-900 text-slate-900 dark:text-slate-100 overflow-hidden">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={cn(
          "fixed lg:sticky lg:top-0 inset-y-0 left-0 z-50 w-64 bg-linear-to-b from-slate-800 to-slate-900 dark:from-slate-900 dark:to-slate-950 text-white flex flex-col transform transition-transform duration-300 ease-in-out lg:transform-none lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center justify-between">
            <Link
              href="/dashboard"
              className="text-2xl font-bold tracking-wide bg-linear-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent"
            >
              WT Dashboard
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 mt-6 space-y-2 px-4 overflow-y-auto">
          {/* Products Dropdown */}
          <div>
            <button
              onClick={() => setProductsOpen(!productsOpen)}
              className={cn(
                "w-full flex items-center justify-between px-4 py-3 text-sm font-medium hover:bg-slate-700/50 transition-all duration-200 rounded-lg group",
                pathname.startsWith("/dashboard/products") &&
                  "bg-cyan-500/20 border-l-2 border-cyan-400"
              )}
            >
              <span className="flex items-center gap-3">
                <Package size={18} className="text-cyan-400" />
                Products
              </span>
              <ChevronDown
                size={16}
                className={cn(
                  "transition-transform duration-200 text-slate-400 group-hover:text-white",
                  productsOpen && "rotate-180"
                )}
              />
            </button>

            {/* Products Dropdown Links */}
            {productsOpen && (
              <div className="ml-4 mt-2 space-y-1 border-l border-slate-700/50">
                <Link
                  href="/dashboard/products"
                  className={cn(
                    "block px-4 py-2 text-sm hover:bg-slate-700/30 rounded-r-lg transition-all duration-200 group",
                    pathname === "/dashboard/products" &&
                      "bg-cyan-500/20 text-cyan-400 border-l border-cyan-400"
                  )}
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-200 block">
                    List Products
                  </span>
                </Link>
                <Link
                  href="/dashboard/products/create"
                  className={cn(
                    "block px-4 py-2 text-sm hover:bg-slate-700/30 rounded-r-lg transition-all duration-200 group",
                    pathname === "/dashboard/products/create" &&
                      "bg-cyan-500/20 text-cyan-400 border-l border-cyan-400"
                  )}
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-200 block">
                    Create Product
                  </span>
                </Link>
              </div>
            )}
          </div>

          {/* Orders Dropdown */}
          <div>
            <button
              onClick={() => setOrdersOpen(!ordersOpen)}
              className={cn(
                "w-full flex items-center justify-between px-4 py-3 text-sm font-medium hover:bg-slate-700/50 transition-all duration-200 rounded-lg group",
                pathname.startsWith("/dashboard/orders") &&
                  "bg-purple-500/20 border-l-2 border-purple-400"
              )}
            >
              <span className="flex items-center gap-3">
                <ShoppingCart size={18} className="text-purple-400" />
                Orders
              </span>
              <ChevronDown
                size={16}
                className={cn(
                  "transition-transform duration-200 text-slate-400 group-hover:text-white",
                  ordersOpen && "rotate-180"
                )}
              />
            </button>

            {/* Orders Dropdown Links */}
            {ordersOpen && (
              <div className="ml-4 mt-2 space-y-1 border-l border-slate-700/50">
                <Link
                  href="/dashboard/orders"
                  className={cn(
                    "block px-4 py-2 text-sm hover:bg-slate-700/30 rounded-r-lg transition-all duration-200 group",
                    pathname === "/dashboard/orders" &&
                      "bg-purple-500/20 text-purple-400 border-l border-purple-400"
                  )}
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-200 block">
                    Order List
                  </span>
                </Link>
                <Link
                  href="/dashboard/orders/create"
                  className={cn(
                    "block px-4 py-2 text-sm hover:bg-slate-700/30 rounded-r-lg transition-all duration-200 group",
                    pathname === "/dashboard/orders/create" &&
                      "bg-purple-500/20 text-purple-400 border-l border-purple-400"
                  )}
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-200 block">
                    Create Order
                  </span>
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-700/50 text-xs text-center text-slate-400">
          © {new Date().getFullYear()} WT Dashboard
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen w-full lg:w-[calc(100%-16rem)]">
        {/* Topbar */}
        <header className="h-16 flex items-center justify-between px-4 lg:px-6 border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-sm sticky top-0 z-30">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <button
              ref={menuButtonRef}
              onClick={toggleSidebar}
              className="lg:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <Menu size={20} />
            </button>

            <h1 className="text-lg font-semibold bg-linear-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
              <div className="hidden sm:flex items-center gap-2">
                <Avatar className="border-2 border-slate-300 dark:border-slate-600">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="bg-linear-to-br from-cyan-500 to-blue-500 text-white">
                    {user?.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <Button
              variant="outline"
              size="icon"
              onClick={handleThemeToggle}
              className="rounded-full border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700"
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? (
                <Sun size={18} className="text-amber-500" />
              ) : (
                <Moon size={18} className="text-slate-600" />
              )}
            </Button>

            {/* Auth / Avatar */}
            {user ? (
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-sm font-medium hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </div>
            ) : (
              <Button
                variant="default"
                size="sm"
                onClick={handleLogin}
                className="bg-linear-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white shadow-sm"
              >
                <LogIn className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Login</span>
              </Button>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 lg:p-6 w-full">
          <div className="max-w-7xl mx-auto w-full min-w-0">{children}</div>
        </main>
      </div>
    </div>
  );
}
