import { AlertCircle, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { useNavigate } from "react-router-dom";

export function EmptyAlert({ showAlert, monthEmpty, alertType }: any) {
  const navigate = useNavigate();
  type AlertType = "categories" | "budgets" | "expenses";

  const alertRoutes: Record<AlertType, string> = {
    categories: "/categories",
    budgets: "/budgets",
    expenses: "/expenses",
  };
  return (
    <Dialog open={showAlert}>
      <DialogContent
        className="sm:max-w-[650px] animate-in fade-in zoom-in-95"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogTitle> </DialogTitle>
        <div className="flex flex-col items-center justify-center gap-4 py-6 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 animate-bounce">
            <AlertCircle className="h-10 w-10 text-primary" />
          </div>

          <p className="text-lg font-semibold">Oops! No {alertType} here</p>
          <p className="text-sm text-muted-foreground max-w-xs">
            Looks like your {alertType} haven't arrived yet{" "}
            {(monthEmpty || alertType === "budgets") && " for this month"}.
            Let's add one and get rolling 🚀
          </p>

          <Button
            size="default"
            className="mt-4 bg-gradient-to-r from-primary to-primary/70 shadow-lg flex items-center gap-2"
            onClick={() => navigate(alertRoutes[alertType])}
          >
            <Plus className="h-4 w-4" />
            Add {alertType}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
