import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BudgetState, Transaction, Category } from '@/types';
import Colors from '@/constants/colors';

const useBudgetStore = create<BudgetState>()(
  persist(
    (set, get) => ({
      transactions: [],
      categories: [],
      isLoading: true,

      addIncome: (amount, description) => {
        const newIncome: Transaction = {
          id: `income_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          amount: Math.abs(amount), // Ensure positive amount
          description: description.trim() || 'Income',
          date: new Date().toISOString(),
          type: 'income',
        };
        
        set((state) => ({
          transactions: [newIncome, ...(state.transactions || [])],
        }));
      },

      addExpense: (amount, description, categoryId) => {
        const newExpense: Transaction = {
          id: `expense_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          amount: Math.abs(amount), // Ensure positive amount
          description: description.trim() || 'Expense',
          date: new Date().toISOString(),
          type: 'expense',
          categoryId,
        };
        
        set((state) => ({
          transactions: [newExpense, ...(state.transactions || [])],
        }));
      },

      addCategory: (name, budget) => {
        const trimmedName = name.trim();
        if (!trimmedName) return; // Prevent empty category names
        
        const newCategory: Category = {
          id: `category_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name: trimmedName,
          budget: Math.abs(budget), // Ensure positive budget
          color: getRandomColor(),
        };
        
        set((state) => ({
          categories: [...(state.categories || []), newCategory],
        }));
      },

      deleteTransaction: (id) => {
        set((state) => ({
          transactions: (state.transactions || []).filter(
            (transaction) => transaction.id !== id
          ),
        }));
      },

      deleteCategory: (id) => {
        set((state) => ({
          // Also remove transactions associated with this category
          transactions: (state.transactions || []).filter(
            (transaction) => transaction.categoryId !== id
          ),
          categories: (state.categories || []).filter((category) => category.id !== id),
        }));
      },
    }),
    {
      name: 'budget-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error('Error rehydrating store:', error);
        }
        if (state) {
          // Ensure arrays are always defined
          state.transactions = state.transactions || [];
          state.categories = state.categories || [];
          state.isLoading = false;
        }
      },
      // Optimize storage by only persisting necessary data
      partialize: (state) => ({
        transactions: state.transactions || [],
        categories: state.categories || [],
      }),
    }
  )
);

// Helper function to generate random colors for categories
function getRandomColor(): string {
  const colors = Colors.categoryColors;
  return colors[Math.floor(Math.random() * colors.length)];
}

export default useBudgetStore;