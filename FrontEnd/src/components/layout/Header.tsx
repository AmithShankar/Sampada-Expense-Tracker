import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeaderProps } from "@/types/dashboard";

export function Header({
  title,
  subtitle,
  onAddExpense,
  isEmpty,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between bg-background/80 backdrop-blur-sm border-b border-border px-8 py-4">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search expenses..."
            className="w-64 pl-10 bg-secondary/50 border-border/50 focus:bg-card"
          />
        </div>

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive" />
        </Button> */}

        {onAddExpense && !isEmpty && (
          <Button onClick={onAddExpense} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Expense
          </Button>
        )}
      </div>
    </header>
  );
}
