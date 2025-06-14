import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '@/constants/colors';
import { Category } from '@/types';

interface CategoryBudgetBarProps {
  category: Category;
  currentSpending: number;
}

function CategoryBudgetBar({ category, currentSpending }: CategoryBudgetBarProps) {
  const { name, budget, color } = category;
  const percentage = Math.min(100, (currentSpending / budget) * 100);
  const isOverBudget = currentSpending > budget;
  
  const barColor = isOverBudget ? Colors.danger : color || Colors.success;
  const remaining = budget - currentSpending;
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.nameContainer}>
          <View 
            style={[styles.categoryIndicator, { backgroundColor: color || Colors.primary }]} 
          />
          <Text style={styles.name} numberOfLines={1}>{name}</Text>
        </View>
        <Text style={[styles.amount, isOverBudget && styles.overBudget]}>
          ${currentSpending.toFixed(2)} / ${budget.toFixed(2)}
        </Text>
      </View>
      
      <View style={styles.barContainer}>
        <View 
          style={[
            styles.barFill, 
            { 
              width: `${Math.min(percentage, 100)}%`, 
              backgroundColor: barColor 
            }
          ]} 
        />
      </View>
      
      <View style={styles.footer}>
        {isOverBudget ? (
          <Text style={styles.overBudgetText}>
            ${(currentSpending - budget).toFixed(2)} over budget
          </Text>
        ) : (
          <Text style={styles.remainingText}>
            ${remaining.toFixed(2)} remaining
          </Text>
        )}
        <Text style={styles.percentageText}>
          {percentage.toFixed(0)}%
        </Text>
      </View>
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  categoryIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
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
    marginBottom: 8,
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  overBudgetText: {
    fontSize: 12,
    color: Colors.danger,
    fontWeight: '500',
  },
  remainingText: {
    fontSize: 12,
    color: Colors.lightText,
  },
  percentageText: {
    fontSize: 12,
    color: Colors.lightText,
    fontWeight: '500',
  },
});

export default memo(CategoryBudgetBar);