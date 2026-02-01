import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2Icon } from "lucide-react";
import { deleteExpenseApi } from "../api/api";
import { toast } from "sonner";
import { useAuthStore } from "@/contexts/AuthContext";
import { Spinner } from "../ui/spinner";

interface DeleteExpenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rowData?: any[];
}
export function DeleteExpenseDialog({
  open,
  onOpenChange,
  rowData,
}: DeleteExpenseDialogProps) {
  const queryClient = useQueryClient();
  const { userId } = useAuthStore((state) => state);

  const { mutate, isPending } = useMutation({
    mutationFn: deleteExpenseApi,
    onSuccess: (data) => {
      toast.success("Expense deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["expenses", userId] });
      queryClient.invalidateQueries({ queryKey: ["allExpenses", userId] });
    },
    onError: (error) => toast.error("Error while deleting expense! " + error),
  });

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="w-[400px] p-6 dark:text-primary">
        <AlertDialogHeader className="text-center space-y-4">
          <div className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive p-2 rounded-full inline-flex mx-auto">
            <Trash2Icon />
          </div>
          <AlertDialogTitle className="text-center">
            Delete Expense?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete this Expense.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex gap-2 justify-center">
          <AlertDialogCancel asChild>
            <Button variant="outline">Cancel</Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant="destructive"
              className="bg-destructive hover:bg-destructive/90"
              onClick={() => mutate(rowData[0]?.id)}
              disabled={isPending}
            >
              {isPending && <Spinner />}
              Delete
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
