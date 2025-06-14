import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { Plus, TrendingUp, TrendingDown } from 'lucide-react-native';
import { useRouter } from 'expo-router';
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
            android_ripple={Platform.OS === 'android' ? { color: Colors.success, borderless: true } : undefined}
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
            android_ripple={Platform.OS === 'android' ? { color: Colors.danger, borderless: true } : undefined}
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
        android_ripple={Platform.OS === 'android' ? { color: 'rgba(255,255,255,0.3)', borderless: true } : undefined}
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
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
      },
    }),
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
    minWidth: 140,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
      },
    }),
  },
  menuItemText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
});