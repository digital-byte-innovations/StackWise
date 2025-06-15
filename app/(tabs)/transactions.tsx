import React, { useMemo } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TransactionItem from '@/components/TransactionItem';
import useBudgetStore from '@/hooks/useBudgetStore';
import { useHydration } from '@/hooks/useHydration';
import Colors from '@/constants/colors';

export default function TransactionsScreen() {
  const { transactions, categories } = useBudgetStore();
  const { _hasHydrated } = useHydration();
  
  const safeTransactions = useMemo(() => {
    if (!_hasHydrated || !Array.isArray(transactions)) return [];
    return transactions.filter(t => t && typeof t === 'object' && t.id);
  }, [transactions, _hasHydrated]);
  
  const safeCategories = useMemo(() => {
    if (!_hasHydrated || !Array.isArray(categories)) return [];
    return categories.filter(c => c && typeof c === 'object' && c.id);
  }, [categories, _hasHydrated]);
  
  const sortedTransactions = useMemo(() => {
    if (!_hasHydrated || !safeTransactions.length) return [];
    
    try {
      return [...safeTransactions]
        .filter(t => t && t.date)
        .sort((a, b) => {
          try {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
          } catch (error) {
            console.error('Error sorting transactions:', error);
            return 0;
          }
        });
    } catch (error) {
      console.error('Error processing transactions:', error);
      return [];
    }
  }, [safeTransactions, _hasHydrated]);
  
  const getCategoryName = (categoryId?: string) => {
    if (!categoryId || !safeCategories.length) return undefined;
    try {
      const category = safeCategories.find(c => c && c.id === categoryId);
      return category?.name;
    } catch (error) {
      console.error('Error finding category:', error);
      return undefined;
    }
  };
  
  if (!_hasHydrated) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading transactions...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {sortedTransactions.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            No transactions yet. Add income or expenses to see them here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={sortedTransactions}
          keyExtractor={(item, index) => item?.id || `transaction-${index}`}
          renderItem={({ item }) => {
            if (!item) return null;
            return (
              <TransactionItem 
                transaction={item} 
                categoryName={getCategoryName(item.categoryId)} 
              />
            );
          }}
          contentContainerStyle={styles.listContent}
          removeClippedSubviews={Platform.OS === 'android'}
          initialNumToRender={15}
          maxToRenderPerBatch={10}
          windowSize={10}
        />
      )}
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
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.lightText,
  },
  listContent: {
    paddingBottom: 20,
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