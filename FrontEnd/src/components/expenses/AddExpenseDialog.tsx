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
import { Textarea } from "@/components/ui/textarea";
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
  Calendar as CalendarIcon,
  CreditCard,
  RefreshCw,
  IndianRupee,
  Euro,
  PoundSterling,
} from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/contexts/AuthContext";
import { addExpenseApi, getCategoriesApi, updateExpenseApi } from "../api/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { format, parseISO, set } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "../ui/calendar";
import { Spinner } from "../ui/spinner";
import { ExpenseFormData } from "@/types/expensesTable";
import { budgetIcons } from "@/data/data";

interface AddExpenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isUpdate?: boolean;
  rowData?: any[];
}

const paymentMethods = ["Cash", "Card", "UPI", "Wallet", "Others"];

export function AddExpenseDialog({
  open,
  onOpenChange,
  isUpdate,
  rowData,
}: AddExpenseDialogProps) {
  const [formData, setFormData] = useState<ExpenseFormData>({
    amount: "",
    categoryId: 0,
    category: "",
    date: new Date().toISOString(),
    paymentMethod: "",
    notes: "",
    isRecurring: false,
  });

  const handleDateTimeChange = (newDate?: Date, newTime?: string) => {
    const currentDateTime = parseISO(formData.date);

    let updatedDate = newDate || currentDateTime;

    if (newTime) {
      const [hours, minutes] = newTime.split(":").map(Number);
      updatedDate = set(updatedDate, { hours, minutes });
    }

    setFormData({
      ...formData,
      date: format(updatedDate, "yyyy-MM-dd'T'HH:mm:ss"),
    });
  };

  const { currency, userId } = useAuthStore((state) => state);
  const { data: categories } = useQuery({
    queryKey: ["categories", userId],
    queryFn: () => getCategoriesApi(userId),
  });

  let icon: ReactNode;
  switch (currency) {
    case "INR":
      icon = <IndianRupee className="h-4 w-4" />;
      break;
    case "USD":
      icon = <DollarSign className="h-4 w-4" />;
      break;
    case "EUR":
      icon = <Euro className="h-4 w-4" />;
      break;
    case "GBP":
      icon = <PoundSterling className="h-4 w-4" />;
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
    mutationFn: isUpdate ? updateExpenseApi : addExpenseApi,
    onSuccess: (data) => {
      toast.success(
        isUpdate
          ? "Expense updated successfully!"
          : "Expense added successfully!",
      );
      setFormData({
        amount: "",
        categoryId: 0,
        category: "",
        date: new Date().toISOString(),
        paymentMethod: "",
        notes: "",
        isRecurring: false,
      });
      queryClient.invalidateQueries({ queryKey: ["expenses", userId] });
      queryClient.invalidateQueries({ queryKey: ["allExpenses", userId] });
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(
        isUpdate
          ? "Error while updating expense! "
          : "Error while adding expense! " + error,
      );
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.amount || !formData.category || !formData.paymentMethod) {
      toast.error("Please fill in all required fields");
      return;
    }
    const data = {
      id: formData.id,
      userid: userId,
      categoryId: formData.categoryId,
      amount: formData.amount,
      currency: currency,
      date: formData.date,
      paymentMethod: formData.paymentMethod,
      notes: formData.notes,
      isRecurring: formData.isRecurring,
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
        date: rowData[0]?.date,
        paymentMethod: rowData[0]?.paymentMethod,
        notes: rowData[0]?.notes,
        isRecurring: rowData[0]?.isRecurring,
      });
    }
  }, [rowData]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] dark:text-primary">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold ">
            {isUpdate ? "Update Expense" : "Add New Expense"}
          </DialogTitle>
          <DialogDescription>
            {isUpdate
              ? "Update your expense details."
              : "Track your spending by adding a new expense entry."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount" className="flex items-center gap-2 ">
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

            <div className="space-y-2">
              <Label htmlFor="date" className="flex items-center gap-2 ">
                <CalendarIcon className="h-4 w-4 " />
                Date & Time*
              </Label>
              <div className="flex flex-col sm:flex-row gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal ",
                        !formData.date && "text-muted-foreground",
                      )}
                    >
                      {formData.date
                        ? format(parseISO(formData.date), "PPP")
                        : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 ">
                    <Calendar
                      mode="single"
                      selected={parseISO(formData.date)}
                      onSelect={(date) => handleDateTimeChange(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <div className="relative">
                  <Input
                    type="time"
                    className="w-full sm:w-[120px] "
                    value={format(parseISO(formData.date), "HH:mm")}
                    onChange={(e) =>
                      handleDateTimeChange(undefined, e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 ">
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

            <div className="space-y-2 ">
              <Label className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 " />
                Payment Method *
              </Label>
              <Select
                value={formData.paymentMethod}
                onValueChange={(v) =>
                  setFormData({ ...formData, paymentMethod: v })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map((method) => (
                    <SelectItem key={method} value={method}>
                      {method}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2 ">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Add any additional details..."
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              rows={3}
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-accent/30">
            <div className="flex items-center gap-3">
              <RefreshCw className="h-5 w-5 " />
              <div>
                <p className="font-medium text-foreground">Recurring Expense</p>
                <p className="text-sm text-muted-foreground">
                  This expense repeats regularly
                </p>
              </div>
            </div>
            <Switch
              checked={formData.isRecurring}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, isRecurring: checked })
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
              {isUpdate ? "Update Expense" : "Add Expense"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
