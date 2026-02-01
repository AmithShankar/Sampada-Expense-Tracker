import { ReactNode, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DollarSign,
  RefreshCw,
  IndianRupee,
  Euro,
  PoundSterling,
} from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/contexts/AuthContext";
import { addBudgetApi, getCategoriesApi, updateBudgetApi } from "../api/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Spinner } from "../ui/spinner";
import { MonthYearSelect } from "../MonthYearSelect";
import { AddBudgetDialogProps, BudgetFormData } from "@/types/budget";
import { budgetIcons } from "@/data/data";

export function AddBudgetDialog({
  open,
  onOpenChange,
  isUpdate,
  rowData,
}: AddBudgetDialogProps) {
  const [formData, setFormData] = useState<BudgetFormData>({
    categoryId: 0,
    category: "",
    month: "",
    amount: "",
    rollOverEnabled: false,
  });

  const { currency, userId } = useAuthStore((state) => state);

  const { data: categories } = useQuery({
    queryKey: ["categories", userId],
    queryFn: () => getCategoriesApi(userId),
  });

  let icon: ReactNode;
  switch (currency) {
    case "INR":
      icon = <IndianRupee className="h-4 w-4 text-primary" />;
      break;
    case "USD":
      icon = <DollarSign className="h-4 w-4 text-primary" />;
      break;
    case "EUR":
      icon = <Euro className="h-4 w-4 text-primary" />;
      break;
    case "GBP":
      icon = <PoundSterling className="h-4 w-4 text-primary" />;
      break;
    default:
      break;
  }

  useEffect(() => {
    let categoryId = categories?.find((c) => c.name === formData.category)?.id;

    if (categoryId) setFormData({ ...formData, categoryId: categoryId });
  }, [formData.category]);

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: isUpdate ? updateBudgetApi : addBudgetApi,
    onSuccess: (data) => {
      toast.success(
        isUpdate
          ? "Budget updated successfully!"
          : "Budget added successfully!",
      );
      setFormData({
        categoryId: 0,
        category: "",
        month: "",
        amount: "",
        rollOverEnabled: false,
      });
      queryClient.invalidateQueries({ queryKey: ["budgets", userId] });
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(
        isUpdate
          ? error.message || "Error while updating Budget!"
          : error.message || "Error while adding Budget!",
      );
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.amount || !formData.category || !formData.month) {
      toast.error("Please fill in all required fields");
      return;
    }
    const data = {
      id: formData.id,
      userid: userId,
      categoryId: formData.categoryId,
      month: formData.month,
      amount: formData.amount,
      currency: currency,
      rollOverEnabled: formData.rollOverEnabled,
    };
    mutate(data);
  };

  useEffect(() => {
    if (isUpdate && rowData && rowData.length > 0) {
      setFormData({
        id: rowData[0]?.id,
        amount: rowData[0]?.amount,
        categoryId: rowData[0]?.category?.id,
        category: rowData[0]?.category?.name,
        month: rowData[0]?.month,
        rollOverEnabled: rowData[0]?.rollOverEnabled,
      });
    }
  }, [rowData]);

  useEffect(() => {
    if (open && !isUpdate) {
      setFormData({
        categoryId: 0,
        category: "",
        month: "",
        amount: "",
        rollOverEnabled: false,
      });
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] dark:text-primary">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {isUpdate ? "Update Budget" : "Add New Budget"}
          </DialogTitle>
          <DialogDescription>
            {isUpdate
              ? "Update your Budget details."
              : "Track your Expenses by adding a new Budget."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(v) => setFormData({ ...formData, category: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((cat) => (
                    <SelectItem key={cat.id} value={cat.name}>
                      <span className="flex items-center gap-2">
                        <span>{budgetIcons[cat.categoryIcon]}</span>
                        {cat.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount" className="flex items-center gap-2 mb-4">
                {icon}
                Amount *
              </Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                className="text-lg font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Month *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[290px]">
                    {formData.month || "Select month & year"}
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-auto p-2">
                  <MonthYearSelect
                    fromYear={2000}
                    toYear={2030}
                    format="MMMM yyyy"
                    value={formData.month}
                    onChange={(date) => {
                      setFormData({
                        ...formData,
                        month: date,
                      });
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-accent/30">
            <div className="flex items-center gap-3">
              <RefreshCw className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">Roll Over Budget</p>
                <p className="text-sm text-muted-foreground">
                  This Budget will be carrying over remaining funds to next
                  month.
                </p>
              </div>
            </div>
            <Switch
              checked={formData.rollOverEnabled}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, rollOverEnabled: checked })
              }
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Spinner />}
              {isUpdate ? "Update Budget" : "Add Budget"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
