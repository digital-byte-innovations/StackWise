import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import useBudgetStore from '@/hooks/useBudgetStore';
import Colors from '@/constants/colors';

export default function AddCategoryScreen() {
  const router = useRouter();
  const addCategory = useBudgetStore(state => state.addCategory);
  
  const [name, setName] = useState('');
  const [budget, setBudget] = useState('');
  const [nameError, setNameError] = useState('');
  const [budgetError, setBudgetError] = useState('');
  
  const handleSave = () => {
    // Validate inputs
    let hasError = false;
    
    if (!name.trim()) {
      setNameError('Category name is required');
      hasError = true;
    }
    
    if (!budget) {
      setBudgetError('Budget amount is required');
      hasError = true;
    } else {
      const numBudget = parseFloat(budget);
      if (isNaN(numBudget) || numBudget <= 0) {
        setBudgetError('Please enter a valid budget amount');
        hasError = true;
      }
    }
    
    if (hasError) return;
    
    // Add category and navigate back
    addCategory(name.trim(), parseFloat(budget));
    router.back();
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Category Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Groceries, Rent, Entertainment"
              value={name}
              onChangeText={(text) => {
                setName(text);
                setNameError('');
              }}
              autoFocus
            />
            {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Monthly Budget</Text>
            <View style={styles.amountInputContainer}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                style={styles.amountInput}
                placeholder="0.00"
                keyboardType="decimal-pad"
                value={budget}
                onChangeText={(text) => {
                  setBudget(text);
                  setBudgetError('');
                }}
              />
            </View>
            {budgetError ? <Text style={styles.errorText}>{budgetError}</Text> : null}
          </View>
          
          <Pressable
            style={({ pressed }) => [
              styles.saveButton,
              pressed && { opacity: 0.9 }
            ]}
            onPress={handleSave}
          >
            <Text style={styles.saveButtonText}>Save Category</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardAvoid: {
    flex: 1,
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.card,
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 16,
  },
  currencySymbol: {
    fontSize: 20,
    color: Colors.text,
    marginRight: 4,
  },
  amountInput: {
    flex: 1,
    padding: 16,
    fontSize: 20,
  },
  errorText: {
    color: Colors.danger,
    fontSize: 14,
    marginTop: 4,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});