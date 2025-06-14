import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import useBudgetStore from '@/hooks/useBudgetStore';
import { validateAmount, validateDescription } from '@/utils/validation';
import Colors from '@/constants/colors';

export default function AddIncomeScreen() {
  const router = useRouter();
  const addIncome = useBudgetStore(state => state.addIncome);
  
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [amountError, setAmountError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleAmountChange = useCallback((text: string) => {
    // Only allow numbers and one decimal point
    const cleanText = text.replace(/[^0-9.]/g, '');
    const parts = cleanText.split('.');
    if (parts.length > 2) return; // Prevent multiple decimal points
    
    setAmount(cleanText);
    setAmountError('');
  }, []);
  
  const handleDescriptionChange = useCallback((text: string) => {
    setDescription(text);
    setDescriptionError('');
  }, []);
  
  const handleSave = useCallback(async () => {
    if (isSubmitting) return;
    
    // Validate inputs
    const amountValidation = validateAmount(amount);
    const descriptionValidation = validateDescription(description);
    
    if (!amountValidation.isValid) {
      setAmountError(amountValidation.error || '');
      return;
    }
    
    if (!descriptionValidation.isValid) {
      setDescriptionError(descriptionValidation.error || '');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Add income and navigate back
      addIncome(parseFloat(amount), description);
      router.back();
    } catch (error) {
      console.error('Error adding income:', error);
      Alert.alert('Error', 'Failed to add income. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [amount, description, addIncome, router, isSubmitting]);
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Amount *</Text>
            <View style={styles.amountInputContainer}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                style={styles.amountInput}
                placeholder="0.00"
                keyboardType="decimal-pad"
                value={amount}
                onChangeText={handleAmountChange}
                autoFocus
                maxLength={10}
                returnKeyType="next"
                editable={!isSubmitting}
              />
            </View>
            {amountError ? <Text style={styles.errorText}>{amountError}</Text> : null}
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Salary, Freelance work"
              value={description}
              onChangeText={handleDescriptionChange}
              maxLength={100}
              returnKeyType="done"
              onSubmitEditing={handleSave}
              editable={!isSubmitting}
            />
            {descriptionError ? <Text style={styles.errorText}>{descriptionError}</Text> : null}
          </View>
          
          <Pressable
            style={({ pressed }) => [
              styles.saveButton,
              (pressed || isSubmitting) && styles.saveButtonPressed,
              isSubmitting && styles.saveButtonDisabled
            ]}
            onPress={handleSave}
            disabled={isSubmitting}
          >
            <Text style={styles.saveButtonText}>
              {isSubmitting ? 'Saving...' : 'Save Income'}
            </Text>
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
    color: Colors.text,
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
    fontWeight: '500',
  },
  amountInput: {
    flex: 1,
    padding: 16,
    fontSize: 20,
    color: Colors.text,
  },
  errorText: {
    color: Colors.danger,
    fontSize: 14,
    marginTop: 4,
  },
  saveButton: {
    backgroundColor: Colors.success,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonPressed: {
    opacity: 0.9,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});