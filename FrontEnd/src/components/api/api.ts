import {
  budgets,
  categories,
  expenses,
  thisMonthExpenses,
} from "@/data/demoData";
import axios from "axios";

export const api = axios.create({
  baseURL: `${window.location.protocol}//${window.location.hostname}:8080`,
});

export const loginApi = async ({ userid, password }) => {
  try {
    const response = await api.post(
      "/auth/login",
      { userid, password },
      {
        headers: { Authorization: "" },
      },
    );
    if (response.data.errors) {
      throw new Error(response.data.errors);
    }
    return response.data.data;
  } catch (err: any) {
    throw err;
  }
};

export const registerApi = async (payload: any) => {
  try {
    const response = await api.post(
      "/auth/register",
      {
        email: payload.email,
        password: payload.password,
        username: payload.username,
        userid: payload.userid,
        role: payload.role,
        defaultCurrency: "INR",
      },
      {
        headers: { Authorization: "" },
      },
    );
    if (response.data.errors) {
      throw new Error(response.data.errors);
    }
    return response.data.data;
  } catch (err: any) {
    throw err;
  }
};

export const getAllExpensesApi = async ({ userId, page, size }) => {
  try {
    const response = await api.get("/expenses/getAllExpenses", {
      params: {
        userId,
        page,
        size,
      },
    });
    if (response.data.errors) {
      throw new Error(response.data.errors);
    }
    return response.data;
  } catch (err: any) {
    console.warn(
      "Backend unavailable, returning hardcoded values instead.",
      err.message,
    );
    const totalElements = expenses.length;
    const totalPages = Math.ceil(totalElements / size);

    const start = page * size;
    const end = start + size;
    const pageData = expenses.slice(start, end);

    return {
      data: pageData,
      paging: {
        page,
        size,
        totalElements,
        totalPages,
      },
    };
  }
};

export const addExpenseApi = async (payload: any) => {
  try {
    const response = await api.post("/expenses/addExpenses", payload);
    if (response.data.errors) {
      throw new Error(response.data.errors);
    }
    return response.data.data;
  } catch (err: any) {
    throw err;
  }
};

export const getSixMonthsExpensesApi = async (userId) => {
  try {
    const response = await api.get(`/expenses/getSixMonthsExpenses/${userId}`);
    if (response.data.errors) {
      throw new Error(response.data.errors);
    }
    return response.data.data;
  } catch (err: any) {
    console.warn(
      "Backend unavailable, returning hardcoded values instead.",
      err.message,
    );
    return expenses;
  }
};

export const getCustomExpensesApi = async (userId, duration) => {
  try {
    const response = await api.get(
      `/expenses/getCustomExpenses/${userId}/${duration}`,
    );
    if (response.data.errors) {
      throw new Error(response.data.errors);
    }
    return response.data.data;
  } catch (err: any) {
    console.warn(
      "Backend unavailable, returning hardcoded values instead.",
      err.message,
    );
    return expenses;
  }
};

export const getCurrentExpensesApi = async (userId) => {
  try {
    const response = await api.get(`/expenses/getCurrentExpenses/${userId}`);
    if (response.data.errors) {
      throw new Error(response.data.errors);
    }
    return response.data.data;
  } catch (err: any) {
    console.warn(
      "Backend unavailable, returning hardcoded values instead.",
      err.message,
    );
    return thisMonthExpenses;
  }
};

export const updateExpenseApi = async (payload: any) => {
  try {
    const response = await api.post("/expenses/updateExpense", payload);
    if (response.data.errors) {
      throw new Error(response.data.errors);
    }
    return response.data.data;
  } catch (err: any) {
    throw err;
  }
};

export const deleteExpenseApi = async (userId) => {
  try {
    const response = await api.delete(`/expenses/deleteExpense/${userId}`);
    if (response.data.errors) {
      throw new Error(response.data.errors);
    }
    return response.data.data;
  } catch (err: any) {
    throw err;
  }
};

export const getBudgetsApi = async (userId) => {
  try {
    const response = await api.get(`/budgets/getBudgets/${userId}`);
    if (response.data.errors) {
      throw new Error(response.data.errors);
    }
    return response.data.data;
  } catch (err: any) {
    console.warn(
      "Backend unavailable, returning hardcoded values instead.",
      err.message,
    );
    return budgets;
  }
};

export const addBudgetApi = async (payload: any) => {
  try {
    const response = await api.post("/budgets/addBudget", payload);
    if (response.data.errors) {
      throw new Error(response.data.errors);
    }
    return response.data.data;
  } catch (err: any) {
    throw err;
  }
};

export const updateBudgetApi = async (payload: any) => {
  try {
    const response = await api.post("/budgets/updateBudget", payload);
    if (response.data.errors) {
      throw new Error(response.data.errors);
    }
    return response.data.data;
  } catch (err: any) {
    throw err;
  }
};

export const getCategoriesApi = async (userId) => {
  try {
    const response = await api.get(`/category/getCategories/${userId}`);
    if (response.data.errors) {
      throw new Error(response.data.errors);
    }
    return response.data.data;
  } catch (err: any) {
    console.warn(
      "Backend unavailable, returning hardcoded values instead.",
      err.message,
    );
    return categories;
  }
};

export const addCategoryApi = async (payload: any) => {
  try {
    const response = await api.post("/category/addCategory", payload);
    if (response.data.errors) {
      throw new Error(response.data.errors);
    }
    return response.data.data;
  } catch (err: any) {
    throw err;
  }
};

export const updateCategoryApi = async (payload: any) => {
  try {
    const response = await api.post("/category/updateCategory", payload);
    if (response.data.errors) {
      throw new Error(response.data.errors);
    }
    return response.data.data;
  } catch (err: any) {
    throw err;
  }
};

export const deleteCategoryApi = async (userId) => {
  try {
    const response = await api.delete(`/category/deleteCategory/${userId}`);
    if (response.data.errors) {
      throw new Error(response.data.errors);
    }
    return response.data.data;
  } catch (err: any) {
    throw err;
  }
};

export const resetApi = async ({ userid, newPassword, confirmPassword }) => {
  try {
    const response = await api.post(
      "/auth/forgotPassword",
      {
        userid: userid,
        newPassword: newPassword,
        confirmPassword: confirmPassword,
      },
      {
        headers: { Authorization: "" },
      },
    );
    if (response.data.errors) {
      throw new Error(response.data.errors);
    }
    return response.data.data;
  } catch (err: any) {
    throw err;
  }
};

export const updateUserApi = async ({ userid, fullName, email, password }) => {
  try {
    const response = await api.post("/auth/updateUser", {
      userid: userid,
      username: fullName,
      email: email,
      password: password,
    });
    if (response.data.errors) {
      throw new Error(response.data.errors);
    }
    return response.data.data;
  } catch (err: any) {
    throw err;
  }
};
