import { Budget, CategoryColumn, Expense } from "@/types/expense";

export const categories: CategoryColumn[] = [
  {
    id: 1,
    name: "Food & Dining",
    colorCode: "hsl(186, 72%, 30%)",
    categoryIcon: 1,
  },
  {
    id: 2,
    name: "Transportation",
    colorCode: "hsl(140, 69%, 40%)",
    categoryIcon: 2,
  },
  {
    id: 3,
    name: "Shopping",
    colorCode: "hsl(280, 65%, 55%)",
    categoryIcon: 3,
  },
  {
    id: 4,
    name: "Entertainment",
    colorCode: "hsl(340, 75%, 55%)",
    categoryIcon: 4,
  },
  {
    id: 5,
    name: "Bills & Utilities",
    colorCode: "hsl(38, 92%, 50%)",
    categoryIcon: 5,
  },
  {
    id: 6,
    name: "Healthcare",
    colorCode: "hsl(210, 89%, 48%)",
    categoryIcon: 6,
  },
  {
    id: 7,
    name: "Travel",
    colorCode: "hsl(160, 60%, 45%)",
    categoryIcon: 7,
  },
  {
    id: 8,
    name: "Education",
    colorCode: "hsl(220, 70%, 50%)",
    categoryIcon: 8,
  },
];

const formatMonth = (date: Date) =>
  date.toLocaleString("en-US", { month: "long", year: "numeric" });
const now = new Date();
const thisMonth = formatMonth(now);

export const budgets: Budget[] = [
  {
    id: 17,
    category: categories[0],
    month: thisMonth,
    amount: 1000,
    spent: 0,
    rolloverEnabled: false,
    currency: "INR",
  },
  {
    id: 19,
    category: categories[1],
    month: thisMonth,
    amount: 2000,
    spent: 0,
    rolloverEnabled: false,
    currency: "INR",
  },
  {
    id: 20,
    category: categories[2],
    month: thisMonth,
    amount: 1200,
    spent: 0,
    rolloverEnabled: false,
    currency: "INR",
  },
  {
    id: 21,
    category: categories[3],
    month: thisMonth,
    amount: 1800,
    spent: 0,
    rolloverEnabled: false,
    currency: "INR",
  },
  {
    id: 22,
    category: categories[4],
    month: thisMonth,
    amount: 900,
    spent: 0,
    rolloverEnabled: false,
    currency: "INR",
  },
  {
    id: 23,
    category: categories[5],
    month: thisMonth,
    amount: 1100,
    spent: 0,
    rolloverEnabled: false,
    currency: "INR",
  },
  {
    id: 24,
    category: categories[6],
    month: thisMonth,
    amount: 1300,
    spent: 0,
    rolloverEnabled: false,
    currency: "INR",
  },
  {
    id: 25,
    category: categories[7],
    month: thisMonth,
    amount: 1500,
    spent: 0,
    rolloverEnabled: false,
    currency: "INR",
  }, // new category
];

// Sample dates are fixed relative to today, so every visit (and every screenshot) shows the same
// spread: six expenses in the current month and a few in each of the five months before it.
// monthsAgo 0 = current month. Days past today are pulled back to today so nothing is in the future.
const sampleDate = (monthsAgo: number, day: number) => {
  const today = new Date();
  const lastDay =
    monthsAgo === 0
      ? today.getDate()
      : new Date(today.getFullYear(), today.getMonth() - monthsAgo + 1, 0).getDate();
  const date = new Date(
    today.getFullYear(),
    today.getMonth() - monthsAgo,
    Math.min(day, lastDay),
    10,
    30,
  );
  const value = date > today ? today : date;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())} ${pad(value.getHours())}:${pad(value.getMinutes())}:00`;
};

type SampleRow = [
  id: number,
  categoryIndex: number,
  amount: number,
  monthsAgo: number,
  day: number,
  paymentMethod: Expense["paymentMethod"],
  notes: string,
  isRecurring: boolean,
];

const sampleRows: SampleRow[] = [
  // Current month
  [1, 0, 100, 0, 2, "UPI", "Bakery snacks", true],
  [13, 4, 850, 0, 3, "UPI", "Electricity bill", true],
  [9, 0, 980, 0, 5, "Card", "Supermarket trip", false],
  [12, 1, 750, 0, 6, "Wallet", "Bus pass", true],
  [6, 7, 150, 0, 8, "Others", "Stationery", false],
  [26, 3, 600, 0, 9, "UPI", "Bought a game on Steam", false],
  // 1 month ago
  [14, 0, 650, 1, 4, "Cash", "Fresh vegetables", false],
  [21, 4, 600, 1, 12, "Card", "Electricity bill", true],
  [10, 3, 1200, 1, 18, "UPI", "Movie and snacks", false],
  [4, 7, 10, 1, 22, "Wallet", "Pencil", false],
  // 2 months ago
  [22, 1, 7000, 2, 7, "UPI", "Bike ride", false],
  [20, 2, 400, 2, 15, "Cash", "Clothes", false],
  [8, 5, 500, 2, 20, "Cash", "Medicine", false],
  // 3 months ago
  [15, 2, 4200, 3, 10, "Card", "Holiday shopping", false],
  [17, 0, 1100, 3, 25, "UPI", "Dinner with family", false],
  // 4 months ago
  [11, 2, 5000, 4, 9, "Card", "Electronics repair", false],
  [19, 6, 460, 4, 21, "UPI", "Friends trip", false],
  // 5 months ago
  [7, 2, 3200, 5, 6, "UPI", "New shoes", false],
  [25, 2, 100, 5, 14, "Card", "Handkerchief", false],
  [3, 3, 300, 5, 19, "Card", "Movie", false],
];

export const expenses: Expense[] = sampleRows.map(
  ([id, categoryIndex, amount, monthsAgo, day, paymentMethod, notes, isRecurring]) => ({
    id,
    category: categories[categoryIndex],
    amount,
    currency: "INR",
    date: sampleDate(monthsAgo, day),
    paymentMethod,
    notes,
    isRecurring,
  }),
);

expenses.sort((a, b) => {
  return new Date(b.date).getTime() - new Date(a.date).getTime();
});

const currentMonth = now.getMonth();
const currentYear = now.getFullYear();

export const thisMonthExpenses = expenses.filter((exp) => {
  const expDate = new Date(exp.date);
  return (
    expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear
  );
});
