import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Receipt,
  PieChart,
  Target,
  Tags,
  Settings,
  ChevronLeft,
  ChevronRight,
  Wallet,
  LogOut,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth, useAuthStore } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useAvatarStore } from "@/contexts/AvatarStore";
import { useApp } from "@/contexts/AppContext";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: Receipt, label: "Expenses", path: "/expenses" },
  { icon: PieChart, label: "Analytics", path: "/analytics" },
  { icon: Target, label: "Budgets", path: "/budgets" },
  { icon: Tags, label: "Categories", path: "/categories" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export function Sidebar() {
  const {
    sidebarCollapsed,
    setSidebarCollapsed,
    mobileMenuOpen,
    setMobileMenuOpen,
  } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const profile = useAuthStore((state) => state);

  const { avatar } = useAvatarStore();

  const handleSignOut = () => {
    signOut();
    navigate("/auth");
  };

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="flex items-center gap-3 p-6 border-b border-border">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground flex-shrink-0">
          <Wallet className="h-5 w-5" />
        </div>
        {(!sidebarCollapsed || mobileMenuOpen) && (
          <div className="animate-fade-in flex-1 min-w-0">
            <h1 className="font-bold text-lg text-foreground">ExpenseFlow</h1>
            <p className="text-xs text-muted-foreground">Smart Tracker</p>
          </div>
        )}
        {/* Close button for mobile */}
        <button
          onClick={() => setMobileMenuOpen(false)}
          className="lg:hidden flex h-8 w-8 items-center justify-center rounded-lg hover:bg-accent transition-colors ml-auto"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2 flex-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={handleNavClick}
              className={cn("nav-link", isActive && "active")}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {(!sidebarCollapsed || mobileMenuOpen) && (
                <span className="animate-fade-in">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      {(!sidebarCollapsed || mobileMenuOpen) && (
        <div className="p-4 border-t border-border space-y-3 mt-auto">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/50">
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              {avatar ? (
                <img
                  src={avatar}
                  alt="Avatar"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-sm font-semibold text-primary">
                  {profile.fullName ? getInitials(profile.fullName) : "U"}
                  {profile?.fullName ? getInitials(profile.fullName) : "U"}
                </span>
              )}
            </div>
            <div className="animate-fade-in flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {profile?.fullName || "User"}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {profile?.email || ""}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-muted-foreground hover:text-foreground"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      )}

      {/* sidebarCollapsed User Section (desktop only) */}
      {sidebarCollapsed && !mobileMenuOpen && (
        <div className="p-4 border-t border-border flex flex-col items-center gap-2 mt-auto">
          <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
            {avatar ? (
              <img
                src={avatar}
                alt="Avatar"
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-sm font-semibold text-primary">
                {profile.fullName ? getInitials(profile.fullName) : "U"}
                {profile?.fullName ? getInitials(profile.fullName) : "U"}
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      )}
    </>
  );

  return (
    <>
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile sidebar drawer */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen bg-card border-r border-border transition-transform duration-300 w-72 flex flex-col lg:hidden",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen bg-card border-r border-border transition-all duration-300 hidden lg:flex flex-col",
          sidebarCollapsed ? "w-20" : "w-64",
        )}
      >
        {sidebarContent}

        {/* Collapse Button (desktop only) */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:scale-110 transition-transform"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </aside>
    </>
  );
}
