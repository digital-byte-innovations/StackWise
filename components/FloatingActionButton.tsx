import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { Plus, TrendingUp, TrendingDown } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/colors';
import { Platform } from 'react-native';

export default function FloatingActionButton() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  
  // Use regular View for web to avoid reanimated issues
  const AnimatedView = Platform.OS === 'web' ? View : Animated.View;
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  const handleAddIncome = () => {
    router.push('/modal/add-income');
    setIsOpen(false);
  };
  
  const handleAddExpense = () => {
    router.push('/modal/add-expense');
    setIsOpen(false);
  };
  
  return (
    <View style={styles.container}>
      {isOpen && (
        <View style={styles.menuContainer}>
          <Pressable 
            style={({ pressed }) => [
              styles.menuItem,
              pressed && { opacity: 0.8 }
            ]}
            onPress={handleAddIncome}
          >
            <AnimatedView style={styles.menuItemContent}>
              <TrendingUp size={20} color={Colors.success} />
              <Text style={styles.menuItemText}>Add Income</Text>
            </AnimatedView>
          </Pressable>
          
          <Pressable 
            style={({ pressed }) => [
              styles.menuItem,
              pressed && { opacity: 0.8 }
            ]}
            onPress={handleAddExpense}
          >
            <AnimatedView style={styles.menuItemContent}>
              <TrendingDown size={20} color={Colors.danger} />
              <Text style={styles.menuItemText}>Add Expense</Text>
            </AnimatedView>
          </Pressable>
        </View>
      )}
      
      <Pressable
        style={({ pressed }) => [
          styles.fab,
          pressed && { opacity: 0.9 }
        ]}
        onPress={toggleMenu}
      >
        <Plus size={24} color="#fff" />
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuContainer: {
    marginBottom: 16,
  },
  menuItem: {
    marginBottom: 12,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  menuItemText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
});