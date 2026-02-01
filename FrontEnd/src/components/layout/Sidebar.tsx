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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth, useAuthStore } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useAvatarStore } from "@/contexts/AvatarStore";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: Receipt, label: "Expenses", path: "/expenses" },
  { icon: PieChart, label: "Analytics", path: "/analytics" },
  { icon: Target, label: "Budgets", path: "/budgets" },
  { icon: Tags, label: "Categories", path: "/categories" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const profile = useAuthStore((state) => state);

  const { avatar } = useAvatarStore();

  const handleSignOut = () => {
    signOut();
    navigate("/auth");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-card border-r border-border transition-all duration-300",
        collapsed ? "w-20" : "w-64",
      )}
    >
      <div className="flex items-center gap-3 p-6 border-b border-border">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Wallet className="h-5 w-5" />
        </div>
        {!collapsed && (
          <div className="animate-fade-in">
            <h1 className="font-bold text-lg text-foreground">Sampada</h1>
            <p className="text-xs text-muted-foreground">Smart Tracker</p>
          </div>
        )}
      </div>

      <nav className="p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn("nav-link", isActive && "active")}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && (
                <span className="animate-fade-in">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:scale-110 transition-transform"
      >
        {collapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </button>

      {!collapsed && (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/50">
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-sm font-semibold text-primary">
                {avatar ? (
                  <img
                    src={avatar}
                    alt="Avatar"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-sm font-semibold text-primary">
                    {profile.fullName ? getInitials(profile.fullName) : "U"}
                  </span>
                )}
              </span>
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

      {collapsed && (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border flex flex-col items-center gap-2">
          <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-sm font-semibold text-primary">
              {avatar ? (
                <img
                  src={avatar}
                  alt="Avatar"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-sm font-semibold text-primary">
                  {profile.fullName ? getInitials(profile.fullName) : "U"}
                </span>
              )}
            </span>
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
    </aside>
  );
}
