export type BudgetFormData = {
  id?: number;
  categoryId: number;
  category: string;
  month: string;
  amount: string;
  rollOverEnabled: boolean;
};

export interface AddBudgetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isUpdate?: boolean;
  rowData?: any[];
}
