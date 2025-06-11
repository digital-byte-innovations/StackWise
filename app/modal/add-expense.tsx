import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import useBudgetStore from '@/hooks/useBudgetStore';
import Colors from '@/constants/colors';

export default function AddExpenseScreen() {
  const router = useRouter();
  const { addExpense, categories } = useBudgetStore();
  
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [amountError, setAmountError] = useState('');
  const [categoryError, setCategoryError] = useState('');
  
  const handleSave = () => {
    // Validate inputs
    let hasError = false;
    
    if (!amount) {
      setAmountError('Amount is required');
      hasError = true;
    } else {
      const numAmount = parseFloat(amount);
      if (isNaN(numAmount) || numAmount <= 0) {
        setAmountError('Please enter a valid amount');
        hasError = true;
      }
    }
    
    if (!selectedCategoryId) {
      setCategoryError('Please select a category');
      hasError = true;
    }
    
    if (hasError) return;
    
    // Add expense and navigate back
    addExpense(parseFloat(amount), description, selectedCategoryId!);
    router.back();
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Amount</Text>
              <View style={styles.amountInputContainer}>
                <Text style={styles.currencySymbol}>$</Text>
                <TextInput
                  style={styles.amountInput}
                  placeholder="0.00"
                  keyboardType="decimal-pad"
                  value={amount}
                  onChangeText={(text) => {
                    setAmount(text);
                    setAmountError('');
                  }}
                  autoFocus
                />
              </View>
              {amountError ? <Text style={styles.errorText}>{amountError}</Text> : null}
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description (Optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Groceries, Dinner"
                value={description}
                onChangeText={setDescription}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Category</Text>
              {categories.length === 0 ? (
                <View style={styles.noCategoriesContainer}>
                  <Text style={styles.noCategoriesText}>
                    No categories available. Please add a category first.
                  </Text>
                  <Pressable
                    style={styles.addCategoryButton}
                    onPress={() => router.push('/modal/add-category')}
                  >
                    <Text style={styles.addCategoryButtonText}>Add Category</Text>
                  </Pressable>
                </View>
              ) : (
                <>
                  <View style={styles.categoriesContainer}>
                    {categories.map((category) => (
                      <Pressable
                        key={category.id}
                        style={({ pressed }) => [
                          styles.categoryChip,
                          selectedCategoryId === category.id && styles.selectedCategoryChip,
                          pressed && { opacity: 0.8 }
                        ]}
                        onPress={() => {
                          setSelectedCategoryId(category.id);
                          setCategoryError('');
                        }}
                      >
                        <View 
                          style={[
                            styles.categoryColor, 
                            { backgroundColor: category.color || Colors.primary }
                          ]} 
                        />
                        <Text 
                          style={[
                            styles.categoryChipText,
                            selectedCategoryId === category.id && styles.selectedCategoryChipText
                          ]}
                        >
                          {category.name}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                  {categoryError ? <Text style={styles.errorText}>{categoryError}</Text> : null}
                </>
              )}
            </View>
            
            {categories.length > 0 && (
              <Pressable
                style={({ pressed }) => [
                  styles.saveButton,
                  pressed && { opacity: 0.9 }
                ]}
                onPress={handleSave}
              >
                <Text style={styles.saveButtonText}>Save Expense</Text>
              </Pressable>
            )}
          </View>
        </ScrollView>
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
  scrollContent: {
    flexGrow: 1,
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
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    margin: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedCategoryChip: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  categoryChipText: {
    fontSize: 14,
    color: Colors.text,
  },
  selectedCategoryChipText: {
    color: '#fff',
    fontWeight: '500',
  },
  errorText: {
    color: Colors.danger,
    fontSize: 14,
    marginTop: 4,
  },
  saveButton: {
    backgroundColor: Colors.danger,
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
  noCategoriesContainer: {
    backgroundColor: Colors.card,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  noCategoriesText: {
    fontSize: 14,
    color: Colors.lightText,
    textAlign: 'center',
    marginBottom: 12,
  },
  addCategoryButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  addCategoryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});