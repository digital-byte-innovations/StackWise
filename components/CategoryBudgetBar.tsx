import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '@/constants/colors';
import { Category } from '@/types';

interface CategoryBudgetBarProps {
  category: Category;
  currentSpending: number;
}

export default function CategoryBudgetBar({ category, currentSpending }: CategoryBudgetBarProps) {
  const { name, budget, color } = category;
  const percentage = Math.min(100, (currentSpending / budget) * 100);
  const isOverBudget = currentSpending > budget;
  
  const barColor = isOverBudget ? Colors.danger : color || Colors.success;
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.name}>{name}</Text>
        <Text style={[styles.amount, isOverBudget && styles.overBudget]}>
          ${currentSpending.toFixed(2)} / ${budget.toFixed(2)}
        </Text>
      </View>
      
      <View style={styles.barContainer}>
        <View 
          style={[
            styles.barFill, 
            { width: `${percentage}%`, backgroundColor: barColor }
          ]} 
        />
      </View>
      
      {isOverBudget && (
        <Text style={styles.overBudgetText}>
          ${(currentSpending - budget).toFixed(2)} over budget
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  amount: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  overBudget: {
    color: Colors.danger,
  },
  barContainer: {
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  overBudgetText: {
    fontSize: 12,
    color: Colors.danger,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
});