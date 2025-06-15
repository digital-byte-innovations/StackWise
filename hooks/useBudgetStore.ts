import { create, StateCreator } from 'zustand';
import { persist, createJSONStorage, PersistOptions } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { BudgetState, Transaction, Category } from '@/types';
import Colors from '@/constants/colors';
import { useHydration } from './useHydration';

type BudgetStateCreator = StateCreator<BudgetState, [], [], BudgetState>;

const budgetStoreCreator: BudgetStateCreator = (set, get) => ({
  transactions: [],
  categories: [],

  addIncome: (amount, description) => {
    try {
      const newIncome: Transaction = {
        id: `income_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        amount: Math.abs(amount),
        description: description.trim() || 'Income',
        date: new Date().toISOString(),
        type: 'income',
      };
      
      set((state) => ({
        transactions: [newIncome, ...(Array.isArray(state.transactions) ? state.transactions : [])],
      }));
    } catch (error) {
      console.error('Error adding income:', error);
    }
  },

  addExpense: (amount, description, categoryId) => {
    try {
      const newExpense: Transaction = {
        id: `expense_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        amount: Math.abs(amount),
        description: description.trim() || 'Expense',
        date: new Date().toISOString(),
        type: 'expense',
        categoryId,
      };
      
      set((state) => ({
        transactions: [newExpense, ...(Array.isArray(state.transactions) ? state.transactions : [])],
      }));
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  },

  addCategory: (name, budget) => {
    try {
      const trimmedName = name.trim();
      if (!trimmedName) return;
      
      const newCategory: Category = {
        id: `category_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: trimmedName,
        budget: Math.abs(budget),
        color: getRandomColor(),
      };
      
      set((state) => ({
        categories: [...(Array.isArray(state.categories) ? state.categories : []), newCategory],
      }));
    } catch (error) {
      console.error('Error adding category:', error);
    }
  },

  deleteTransaction: (id) => {
    try {
      set((state) => ({
        transactions: (Array.isArray(state.transactions) ? state.transactions : []).filter(
          (transaction) => transaction && transaction.id !== id
        ),
      }));
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  },

  deleteCategory: (id) => {
    try {
      set((state) => ({
        transactions: (Array.isArray(state.transactions) ? state.transactions : []).filter(
          (transaction) => transaction && transaction.categoryId !== id
        ),
        categories: (Array.isArray(state.categories) ? state.categories : []).filter(
          (category) => category && category.id !== id
        ),
      }));
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  },
});

const persistOptions: PersistOptions<BudgetState> = {
  name: 'budget-storage',
  storage: createJSONStorage(() => AsyncStorage),
  onRehydrateStorage: () => (state, error) => {
    if (error) {
      console.error('Error rehydrating store:', error);
    }
    useHydration.getState().setHasHydrated(true);
  },
  partialize: (state) => ({
    transactions: state.transactions,
    categories: state.categories,
  }),
  version: 1,
  migrate: (persistedState: any, version: number) => {
    if (version === 0) {
      return {
        ...persistedState,
        transactions: Array.isArray(persistedState.transactions) ? persistedState.transactions : [],
        categories: Array.isArray(persistedState.categories) ? persistedState.categories : [],
      };
    }
    return persistedState;
  },
};

const useBudgetStore = create<BudgetState>()(
  persist(
    budgetStoreCreator,
    persistOptions
  )
);

// Helper function to generate random colors for categories
function getRandomColor(): string {
  const colors = Colors.categoryColors;
  return colors[Math.floor(Math.random() * colors.length)];
}

export default useBudgetStore;