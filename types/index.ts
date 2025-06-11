export interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: string;
  type: 'income' | 'expense';
  categoryId?: string;
}

export interface Category {
  id: string;
  name: string;
  budget: number;
  color?: string;
}

export interface BudgetState {
  transactions: Transaction[];
  categories: Category[];
  isLoading: boolean;
  
  // Actions
  addIncome: (amount: number, description: string) => void;
  addExpense: (amount: number, description: string, categoryId: string) => void;
  addCategory: (name: string, budget: number) => void;
  deleteTransaction: (id: string) => void;
  deleteCategory: (id: string) => void;
}