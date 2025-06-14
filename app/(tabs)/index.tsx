import React, { useMemo } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CategoryBudgetBar from '@/components/CategoryBudgetBar';
import FloatingActionButton from '@/components/FloatingActionButton';
import useBudgetStore from '@/hooks/useBudgetStore';
import Colors from '@/constants/colors';

export default function DashboardScreen() {
  const { transactions, categories, isLoading } = useBudgetStore();
  
  // Ensure arrays are always defined before using them
  const safeTransactions = transactions || [];
  const safeCategories = categories || [];
  
  const { totalIncome, totalExpenses, leftToSpend } = useMemo(() => {
    if (!safeTransactions.length) {
      return { totalIncome: 0, totalExpenses: 0, leftToSpend: 0 };
    }
    
    const totalIncome = safeTransactions
      .filter(t => t && t.type === 'income')
      .reduce((sum, t) => sum + (t.amount || 0), 0);
      
    const totalExpenses = safeTransactions
      .filter(t => t && t.type === 'expense')
      .reduce((sum, t) => sum + (t.amount || 0), 0);
      
    return {
      totalIncome,
      totalExpenses,
      leftToSpend: totalIncome - totalExpenses
    };
  }, [safeTransactions]);
  
  const categorySpending = useMemo(() => {
    if (!safeCategories.length) {
      return [];
    }
    
    return safeCategories.map(category => {
      if (!category) return null;
      
      const spent = safeTransactions
        .filter(t => t && t.type === 'expense' && t.categoryId === category.id)
        .reduce((sum, t) => sum + (t.amount || 0), 0);
        
      return {
        category,
        spent
      };
    }).filter(Boolean);
  }, [safeCategories, safeTransactions]);
  
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryLabel}>Left to Spend</Text>
        <Text style={[
          styles.summaryAmount,
          leftToSpend < 0 ? styles.negativeAmount : styles.positiveAmount
        ]}>
          ${leftToSpend.toFixed(2)}
        </Text>
        
        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Income</Text>
            <Text style={[styles.detailAmount, styles.incomeText]}>
              ${totalIncome.toFixed(2)}
            </Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Expenses</Text>
            <Text style={[styles.detailAmount, styles.expenseText]}>
              ${totalExpenses.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Category Budgets</Text>
      </View>
      
      {safeCategories.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            No categories yet. Add a category to start tracking your budget.
          </Text>
        </View>
      ) : (
        <FlatList
          data={categorySpending}
          keyExtractor={(item, index) => item?.category?.id || `empty-${index}`}
          renderItem={({ item }) => {
            if (!item || !item.category) return null;
            return (
              <CategoryBudgetBar 
                category={item.category} 
                currentSpending={item.spent} 
              />
            );
          }}
          contentContainerStyle={styles.listContent}
        />
      )}
      
      <FloatingActionButton />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryContainer: {
    backgroundColor: Colors.card,
    paddingVertical: 24,
    paddingHorizontal: 20,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryLabel: {
    fontSize: 16,
    color: Colors.lightText,
    marginBottom: 8,
  },
  summaryAmount: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 16,
  },
  positiveAmount: {
    color: Colors.success,
  },
  negativeAmount: {
    color: Colors.danger,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: Colors.lightText,
    marginBottom: 4,
  },
  detailAmount: {
    fontSize: 18,
    fontWeight: '600',
  },
  incomeText: {
    color: Colors.success,
  },
  expenseText: {
    color: Colors.danger,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateText: {
    textAlign: 'center',
    fontSize: 16,
    color: Colors.lightText,
    lineHeight: 24,
  },
});