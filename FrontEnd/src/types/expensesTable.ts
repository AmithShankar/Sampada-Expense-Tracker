import { CategoryColumn } from "./expense";
import "@tanstack/react-table";

declare module "@tanstack/react-table" {
  interface TableMeta<TData> {
    onEdit?: (row: TData) => void;
    onDelete?: (row: TData) => void;
  }
}

export interface ExpensesTable {
  id: string;
  category: CategoryColumn;
  amount: number;
  currency: string;
  date: string;
  paymentMethod: string;
  notes?: string;
  tags?: string[];
  isRecurring: boolean;
}

export interface PagingData {
  pageIndex: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
}

export interface PagingState {
  pagingData: PagingData;
  setPagingApiData: (data: {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  }) => void;
  setPagingData: (data: PagingData) => void;
}

export interface rowDataType {
  isUpdate: boolean;
  rowData: any[];
  type: string;
}

export type ExpenseFormData = {
  id?: number;
  amount: string;
  categoryId: number;
  category: string;
  date: string;
  paymentMethod: string;
  notes: string;
  isRecurring: boolean;
};

export interface ExpenseTableProps {
  filters: FilterState | null;
  rowData?: any;
  setShowAddExpense?: (open: boolean) => void;
  setIsEmpty?: (open: boolean) => void;
}

export interface ExpenseFiltersProps {
  onFilterChange?: (filters: FilterState) => void;
}

export interface FilterState {
  category: string;
  paymentMethod: string;
  dateFrom: string;
  dateTo: string;
  minAmount: string;
  maxAmount: string;
}
