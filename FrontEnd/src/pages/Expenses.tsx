import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Header } from "@/components/layout/Header";
import { ExpenseTable } from "@/components/expenses/ExpenseTable";
import { ExpenseFilters } from "@/components/expenses/ExpenseFilters";
import { AddExpenseDialog } from "@/components/expenses/AddExpenseDialog";
import { Button } from "@/components/ui/button";
import { Download, Plus, Upload } from "lucide-react";
import { toast } from "sonner";
import { DeleteExpenseDialog } from "@/components/expenses/DeleteExpenseDialog";
import { FilterState, rowDataType } from "@/types/expensesTable";
import { EmptyAlert } from "@/components/dashboard/EmptyAlert";
import { getBudgetsApi, getCategoriesApi } from "@/components/api/api";
import { useAuthStore } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";

export default function Expenses() {
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [activeFilters, setActiveFilters] = useState<FilterState | null>(null);
  const [rowData, setRowData] = useState<rowDataType | null>({
    isUpdate: false,
    rowData: [],
    type: "",
  });

  const userId = useAuthStore((states) => states.userId);

  const { data: categories } = useQuery({
    queryKey: ["categories", userId],
    queryFn: () => getCategoriesApi(userId),
  });

  const { data: budgets } = useQuery({
    queryKey: ["budgets", userId],
    queryFn: () => getBudgetsApi(userId),
  });

  useEffect(() => {
    if (categories?.length === 0) {
      setShowAlert(true);
      setAlertType("categories");
      return;
    }
    if (budgets?.length === 0) {
      setShowAlert(true);
      setAlertType("budgets");
      return;
    }
  }, [categories, budgets]);

  const handleExport = () => {
    toast.success("Expenses exported to CSV");
  };

  const handleImport = () => {
    toast.info("Import feature coming soon");
  };

  return (
    <Layout>
      <Header
        title="Expenses"
        subtitle="Manage and track all your expenses in one place."
        onAddExpense={() => setShowAddExpense(true)}
        isEmpty={isEmpty}
      />

      <div className="p-8 space-y-6 dark:text-primary">
        {/* Actions Row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <ExpenseFilters onFilterChange={setActiveFilters} />

          <div className="flex items-center gap-3 w-full md:w-auto">
            <Button
              variant="outline"
              className="gap-2 bg-card border-border text-foreground hover:bg-secondary/50 font-semibold flex-1 md:flex-none"
              onClick={handleImport}
            >
              <Upload className="h-4 w-4" />
              Import
            </Button>
            <Button
              variant="outline"
              className="gap-2 bg-card border-border text-foreground hover:bg-secondary/50 font-semibold flex-1 md:flex-none"
              onClick={handleExport}
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {isEmpty ? (
          <div className="col-span-full flex flex-col items-center justify-center py-24 text-center bg-card/40 rounded-xl border border-dashed border-border/50 animate-fade-in">
            <div className="bg-secondary/30 p-6 rounded-full mb-6 border border-primary/10">
              <div className="text-6xl filter drop-shadow-lg animate-bounce">
                🧾
              </div>
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              No Expenses yet
            </h3>
            <p className="mb-6 text-muted-foreground max-w-sm">
              Start tracking your spending by adding your first expense
              transaction below.
            </p>
            <Button
              onClick={() => setShowAddExpense(true)}
              className="gap-2 font-bold bg-primary-foreground hover:bg-primary/90 shadow-glow"
            >
              <Plus className="h-4 w-4" />
              Add your first expense
            </Button>
          </div>
        ) : (
          <ExpenseTable
            filters={activeFilters}
            rowData={setRowData}
            setShowAddExpense={setShowAddExpense}
            setIsEmpty={setIsEmpty}
          />
        )}
      </div>

      <EmptyAlert showAlert={showAlert} alertType={alertType} />

      {rowData?.type !== "delete" && (
        <AddExpenseDialog
          open={showAddExpense}
          onOpenChange={setShowAddExpense}
          isUpdate={rowData?.isUpdate}
          rowData={rowData?.rowData}
        />
      )}
      {rowData?.type === "delete" && (
        <DeleteExpenseDialog
          open={showAddExpense}
          onOpenChange={setShowAddExpense}
          rowData={rowData?.rowData}
        />
      )}
    </Layout>
  );
}
