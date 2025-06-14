import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { BudgetState, Transaction, Category } from '@/types';
import Colors from '@/constants/colors';

const useBudgetStore = create<BudgetState>()(
  persist(
    (set, get) => ({
      transactions: [],
      categories: [],
      isLoading: true,

      addIncome: (amount, description) => {
        try {
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
        } catch (error) {
          console.error('Error adding income:', error);
        }
      },

      addExpense: (amount, description, categoryId) => {
        try {
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
        } catch (error) {
          console.error('Error adding expense:', error);
        }
      },

      addCategory: (name, budget) => {
        try {
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
        } catch (error) {
          console.error('Error adding category:', error);
        }
      },

      deleteTransaction: (id) => {
        try {
          set((state) => ({
            transactions: (state.transactions || []).filter(
              (transaction) => transaction.id !== id
            ),
          }));
        } catch (error) {
          console.error('Error deleting transaction:', error);
        }
      },

      deleteCategory: (id) => {
        try {
          set((state) => ({
            // Also remove transactions associated with this category
            transactions: (state.transactions || []).filter(
              (transaction) => transaction.categoryId !== id
            ),
            categories: (state.categories || []).filter((category) => category.id !== id),
          }));
        } catch (error) {
          console.error('Error deleting category:', error);
        }
      },
    }),
    {
      name: 'budget-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error('Error rehydrating store:', error);
          // Set default state on error
          return {
            transactions: [],
            categories: [],
            isLoading: false,
          };
        }
        
        // Ensure the store is properly initialized
        setTimeout(() => {
          if (state) {
            // Ensure arrays are always defined
            state.transactions = Array.isArray(state.transactions) ? state.transactions : [];
            state.categories = Array.isArray(state.categories) ? state.categories : [];
            state.isLoading = false;
          }
        }, Platform.OS === 'android' ? 100 : 0); // Small delay for Android
      },
      // Optimize storage by only persisting necessary data
      partialize: (state) => ({
        transactions: Array.isArray(state.transactions) ? state.transactions : [],
        categories: Array.isArray(state.categories) ? state.categories : [],
      }),
      // Add version for migration support
      version: 1,
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          // Migration from version 0 to 1
          return {
            ...persistedState,
            transactions: Array.isArray(persistedState.transactions) ? persistedState.transactions : [],
            categories: Array.isArray(persistedState.categories) ? persistedState.categories : [],
          };
        }
        return persistedState;
      },
    }
  )
);

// Helper function to generate random colors for categories
function getRandomColor(): string {
  const colors = Colors.categoryColors;
  return colors[Math.floor(Math.random() * colors.length)];
}

export default useBudgetStore;