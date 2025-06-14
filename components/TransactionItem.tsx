import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Trash2 } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { Transaction } from '@/types';
import useBudgetStore from '@/hooks/useBudgetStore';

interface TransactionItemProps {
  transaction: Transaction;
  categoryName?: string;
}

export default function TransactionItem({ transaction, categoryName }: TransactionItemProps) {
  const deleteTransaction = useBudgetStore(state => state.deleteTransaction);
  
  // Defensive programming - ensure transaction exists and has required properties
  if (!transaction || !transaction.id || typeof transaction !== 'object') {
    return null;
  }
  
  const { id, amount = 0, description = '', date, type } = transaction;
  const safeAmount = typeof amount === 'number' ? amount : 0;
  
  let formattedDate = 'Invalid date';
  try {
    if (date) {
      formattedDate = new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }
  } catch (error) {
    console.error('Error formatting date:', error);
  }
  
  const handleDelete = () => {
    try {
      deleteTransaction(id);
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.leftContent}>
        <Text style={styles.description}>
          {description || (type === 'income' ? 'Income' : 'Expense')}
        </Text>
        <Text style={styles.details}>
          {formattedDate}
          {categoryName && ` • ${categoryName}`}
        </Text>
      </View>
      
      <View style={styles.rightContent}>
        <Text 
          style={[
            styles.amount, 
            type === 'income' ? styles.incomeAmount : styles.expenseAmount
          ]}
        >
          {type === 'income' ? '+' : '-'}${Math.abs(safeAmount).toFixed(2)}
        </Text>
        
        <Pressable 
          style={({ pressed }) => [
            styles.deleteButton,
            pressed && { opacity: 0.7 }
          ]} 
          onPress={handleDelete}
        >
          <Trash2 size={16} color={Colors.lightText} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  leftContent: {
    flex: 1,
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  description: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 4,
  },
  details: {
    fontSize: 14,
    color: Colors.lightText,
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 12,
  },
  incomeAmount: {
    color: Colors.success,
  },
  expenseAmount: {
    color: Colors.danger,
  },
  deleteButton: {
    padding: 8,
  },
});