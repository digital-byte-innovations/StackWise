import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import useBudgetStore from '@/hooks/useBudgetStore';
import Colors from '@/constants/colors';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TransactionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { transactions, categories } = useBudgetStore();

  const transaction = transactions.find((t) => t.id === id);
  const category = categories.find((c) => c.id === transaction?.categoryId);

  if (!transaction) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={styles.centered}>
          <Text style={styles.errorText}>Transaction not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(transaction.amount);

  const formattedDate = new Date(transaction.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.amountContainer}>
          <Text
            style={[
              styles.amountText,
              transaction.type === 'income' ? styles.incomeText : styles.expenseText,
            ]}
          >
            {transaction.type === 'income' ? '+' : '-'}{formattedAmount}
          </Text>
          <Text style={styles.descriptionText}>{transaction.description}</Text>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Category</Text>
            <Text style={styles.detailValue}>{category?.name || 'N/A'}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Date</Text>
            <Text style={styles.detailValue}>{formattedDate}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Recurring Charge</Text>
            <Text style={styles.detailValue}>Details coming soon</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondaryBackground,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: Colors.danger,
  },
  content: {
    padding: 20,
  },
  amountContainer: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  amountText: {
    fontSize: 36,
    fontWeight: '700',
    marginBottom: 8,
  },
  incomeText: {
    color: Colors.success,
  },
  expenseText: {
    color: Colors.danger,
  },
  descriptionText: {
    fontSize: 16,
    color: Colors.lightText,
  },
  detailsContainer: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 20,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  detailLabel: {
    fontSize: 16,
    color: Colors.text,
  },
  detailValue: {
    fontSize: 16,
    color: Colors.lightText,
    fontWeight: '500',
  },
}); 