import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Plus, TrendingUp, TrendingDown } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Platform } from 'react-native';
import Colors from '@/constants/colors';

export default function FloatingActionButton() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleMenu = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);
  
  const handleAddIncome = useCallback(() => {
    router.push('/modal/add-income');
    setIsOpen(false);
  }, [router]);
  
  const handleAddExpense = useCallback(() => {
    router.push('/modal/add-expense');
    setIsOpen(false);
  }, [router]);
  
  return (
    <View style={styles.container}>
      {isOpen && (
        <View style={styles.menuContainer}>
          <Pressable 
            style={({ pressed }) => [
              styles.menuItem,
              pressed && styles.menuItemPressed
            ]}
            onPress={handleAddIncome}
            android_ripple={{ color: Colors.success, borderless: true }}
          >
            <View style={styles.menuItemContent}>
              <TrendingUp size={20} color={Colors.success} />
              <Text style={styles.menuItemText}>Add Income</Text>
            </View>
          </Pressable>
          
          <Pressable 
            style={({ pressed }) => [
              styles.menuItem,
              pressed && styles.menuItemPressed
            ]}
            onPress={handleAddExpense}
            android_ripple={{ color: Colors.danger, borderless: true }}
          >
            <View style={styles.menuItemContent}>
              <TrendingDown size={20} color={Colors.danger} />
              <Text style={styles.menuItemText}>Add Expense</Text>
            </View>
          </Pressable>
        </View>
      )}
      
      <Pressable
        style={({ pressed }) => [
          styles.fab,
          pressed && styles.fabPressed
        ]}
        onPress={toggleMenu}
        android_ripple={{ color: 'rgba(255,255,255,0.3)', borderless: true }}
      >
        <Plus 
          size={24} 
          color="#fff" 
          style={[
            styles.fabIcon,
            isOpen && styles.fabIconRotated
          ]} 
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    alignItems: 'flex-end',
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  fabPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.95 }],
  },
  fabIcon: {
    transform: [{ rotate: '0deg' }],
  },
  fabIconRotated: {
    transform: [{ rotate: '45deg' }],
  },
  menuContainer: {
    marginBottom: 16,
  },
  menuItem: {
    marginBottom: 12,
    borderRadius: 8,
    overflow: 'hidden',
  },
  menuItemPressed: {
    opacity: 0.8,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    minWidth: 140,
  },
  menuItemText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
});