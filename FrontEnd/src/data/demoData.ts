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
  date.toLocaleString("default", { month: "long", year: "numeric" });
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

const randomDateWithinLastMonths = (() => {
  const minPerMonth = 2;
  const maxMonths = 7;
  let generatedCount = {};

  return () => {
    const now = new Date();

    // pick a random month from the last 7 months
    const monthOffset = Math.floor(Math.random() * maxMonths);
    const targetMonth = new Date(
      now.getFullYear(),
      now.getMonth() - monthOffset,
      1,
    );
    const monthKey = `${targetMonth.getFullYear()}-${targetMonth.getMonth()}`;

    // initialize counter for this month
    if (!generatedCount[monthKey]) generatedCount[monthKey] = 0;
    generatedCount[monthKey]++;

    const start = new Date(
      targetMonth.getFullYear(),
      targetMonth.getMonth(),
      1,
    );

    // clamp end date to now if it's current month
    const endOfMonth = new Date(
      targetMonth.getFullYear(),
      targetMonth.getMonth() + 1,
      0,
      23,
      59,
      59,
    );
    const end =
      targetMonth.getMonth() === now.getMonth() &&
      targetMonth.getFullYear() === now.getFullYear()
        ? now
        : endOfMonth;

    const randomTime =
      start.getTime() + Math.random() * (end.getTime() - start.getTime());
    return new Date(randomTime).toISOString().replace("T", " ").slice(0, 19);
  };
})();

export const expenses: Expense[] = [
  {
    id: 1,
    category: categories[0],
    amount: 100,
    currency: "INR",
    date: randomDateWithinLastMonths(),
    paymentMethod: "UPI",
    notes: "Bakery Snacks",
    isRecurring: true,
  },
  {
    id: 3,
    category: categories[3],
    amount: 300,
    currency: "USD",
    date: randomDateWithinLastMonths(),
    paymentMethod: "Card",
    notes: "Movie",
    isRecurring: false,
  },
  {
    id: 4,
    category: categories[7],
    amount: 10,
    currency: "INR",
    date: randomDateWithinLastMonths(),
    paymentMethod: "Wallet",
    notes: "Pencil",
    isRecurring: false,
  },
  {
    id: 6,
    category: categories[7],
    amount: 150,
    currency: "INR",
    date: randomDateWithinLastMonths(),
    paymentMethod: "Others",
    notes: "Stationery",
    isRecurring: false,
  },
  {
    id: 7,
    category: categories[3],
    amount: 3200,
    currency: "INR",
    date: randomDateWithinLastMonths(),
    paymentMethod: "UPI",
    notes: "New shoes",
    isRecurring: false,
  },
  {
    id: 8,
    category: categories[5],
    amount: 500,
    currency: "INR",
    date: randomDateWithinLastMonths(),
    paymentMethod: "Cash",
    notes: "Medicine",
    isRecurring: false,
  },
  {
    id: 9,
    category: categories[0],
    amount: 980,
    currency: "INR",
    date: randomDateWithinLastMonths(),
    paymentMethod: "Card",
    notes: "Supermarket trip",
    isRecurring: false,
  },
  {
    id: 10,
    category: categories[2],
    amount: 1200,
    currency: "INR",
    date: randomDateWithinLastMonths(),
    paymentMethod: "UPI",
    notes: "Movie and snacks",
    isRecurring: false,
  },
  {
    id: 11,
    category: categories[6],
    amount: 5000,
    currency: "INR",
    date: randomDateWithinLastMonths(),
    paymentMethod: "Card",
    notes: "Electronics repair",
    isRecurring: false,
  },
  {
    id: 12,
    category: categories[1],
    amount: 750,
    currency: "INR",
    date: randomDateWithinLastMonths(),
    paymentMethod: "Wallet",
    notes: "Bus pass",
    isRecurring: true,
  },
  {
    id: 13,
    category: categories[4],
    amount: 1800,
    currency: "INR",
    date: randomDateWithinLastMonths(),
    paymentMethod: "UPI",
    notes: "Electricity bill",
    isRecurring: true,
  },
  {
    id: 14,
    category: categories[0],
    amount: 650,
    currency: "INR",
    date: randomDateWithinLastMonths(),
    paymentMethod: "Cash",
    notes: "Fresh vegetables",
    isRecurring: false,
  },
  {
    id: 15,
    category: categories[3],
    amount: 4200,
    currency: "INR",
    date: randomDateWithinLastMonths(),
    paymentMethod: "Card",
    notes: "Holiday shopping",
    isRecurring: false,
  },
  {
    id: 17,
    category: categories[2],
    amount: 1100,
    currency: "INR",
    date: randomDateWithinLastMonths(),
    paymentMethod: "UPI",
    notes: "New Year eve food",
    isRecurring: false,
  },
  {
    id: 19,
    category: categories[6],
    amount: 460,
    currency: "INR",
    date: randomDateWithinLastMonths(),
    paymentMethod: "UPI",
    notes: "Friends Trip",
    isRecurring: false,
  },
  {
    id: 20,
    category: categories[2],
    amount: 400,
    currency: "INR",
    date: randomDateWithinLastMonths(),
    paymentMethod: "Cash",
    notes: "Clothes",
    isRecurring: false,
  },
  {
    id: 21,
    category: categories[4],
    amount: 600,
    currency: "INR",
    date: randomDateWithinLastMonths(),
    paymentMethod: "Card",
    notes: "Electricity Bill",
    isRecurring: true,
  },
  {
    id: 22,
    category: categories[1],
    amount: 7000,
    currency: "INR",
    date: randomDateWithinLastMonths(),
    paymentMethod: "UPI",
    notes: "Bike ride",
    isRecurring: false,
  },
  {
    id: 25,
    category: categories[2],
    amount: 100,
    currency: "INR",
    date: randomDateWithinLastMonths(),
    paymentMethod: "Card",
    notes: "Handkerchief",
    isRecurring: false,
  },
  {
    id: 26,
    category: categories[3],
    amount: 600,
    currency: "INR",
    date: randomDateWithinLastMonths(),
    paymentMethod: "UPI",
    notes: "Bought a game on steam",
    isRecurring: false,
  },
];

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
