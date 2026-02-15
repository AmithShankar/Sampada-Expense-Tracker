import { Menu, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeaderProps } from "@/types/dashboard";
import { useApp } from "@/contexts/AppContext";

export function Header({
  title,
  subtitle,
  onAddExpense,
  isEmpty,
}: HeaderProps) {
  const { setMobileMenuOpen } = useApp();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between bg-background/80 backdrop-blur-sm border-b border-border px-4 sm:px-6 lg:px-8 py-4 gap-4">
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile hamburger */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden flex-shrink-0"
          onClick={() => setMobileMenuOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground truncate">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs sm:text-sm text-muted-foreground truncate">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
        {/* <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search expenses..." 
            className="w-48 lg:w-64 pl-10 bg-secondary/50 border-border/50 focus:bg-card"
          />
        </div>

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive" />
        </Button> */}

        {onAddExpense && !isEmpty && (
          <Button onClick={onAddExpense} className="gap-2" size="sm">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Expense</span>
          </Button>
        )}
      </div>
    </header>
  );
}
