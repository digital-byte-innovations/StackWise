import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BudgetState, Transaction, Category } from '@/types';

const useBudgetStore = create<BudgetState>()(
  persist(
    (set, get) => ({
      transactions: [],
      categories: [],
      isLoading: true,

      addIncome: (amount, description) => {
        const newIncome: Transaction = {
          id: Date.now().toString(),
          amount,
          description,
          date: new Date().toISOString(),
          type: 'income',
        };
        
        set((state) => ({
          transactions: [newIncome, ...state.transactions],
        }));
      },

      addExpense: (amount, description, categoryId) => {
        const newExpense: Transaction = {
          id: Date.now().toString(),
          amount,
          description,
          date: new Date().toISOString(),
          type: 'expense',
          categoryId,
        };
        
        set((state) => ({
          transactions: [newExpense, ...state.transactions],
        }));
      },

      addCategory: (name, budget) => {
        const newCategory: Category = {
          id: Date.now().toString(),
          name,
          budget,
          color: getRandomColor(),
        };
        
        set((state) => ({
          categories: [...state.categories, newCategory],
        }));
      },

      deleteTransaction: (id) => {
        set((state) => ({
          transactions: state.transactions.filter(
            (transaction) => transaction.id !== id
          ),
        }));
      },

      deleteCategory: (id) => {
        set((state) => ({
          categories: state.categories.filter((category) => category.id !== id),
        }));
      },
    }),
    {
      name: 'budget-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isLoading = false;
        }
      },
    }
  )
);

// Helper function to generate random colors for categories
function getRandomColor() {
  const colors = [
    '#3498db', // Blue
    '#2ecc71', // Green
    '#e74c3c', // Red
    '#f1c40f', // Yellow
    '#9b59b6', // Purple
    '#1abc9c', // Teal
    '#e67e22', // Orange
    '#34495e', // Dark Blue
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

export default useBudgetStore;