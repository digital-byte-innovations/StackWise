// Validation utilities for production app
export const validateAmount = (amount: string): { isValid: boolean; error?: string } => {
  if (!amount || amount.trim() === '') {
    return { isValid: false, error: 'Amount is required' };
  }
  
  const numAmount = parseFloat(amount);
  if (isNaN(numAmount)) {
    return { isValid: false, error: 'Please enter a valid number' };
  }
  
  if (numAmount <= 0) {
    return { isValid: false, error: 'Amount must be greater than 0' };
  }
  
  if (numAmount > 999999.99) {
    return { isValid: false, error: 'Amount is too large' };
  }
  
  // Check for more than 2 decimal places
  if (amount.includes('.') && amount.split('.')[1].length > 2) {
    return { isValid: false, error: 'Amount can have at most 2 decimal places' };
  }
  
  return { isValid: true };
};

export const validateCategoryName = (name: string): { isValid: boolean; error?: string } => {
  const trimmedName = name.trim();
  
  if (!trimmedName) {
    return { isValid: false, error: 'Category name is required' };
  }
  
  if (trimmedName.length < 2) {
    return { isValid: false, error: 'Category name must be at least 2 characters' };
  }
  
  if (trimmedName.length > 30) {
    return { isValid: false, error: 'Category name must be less than 30 characters' };
  }
  
  return { isValid: true };
};

export const validateDescription = (description: string): { isValid: boolean; error?: string } => {
  if (description.length > 100) {
    return { isValid: false, error: 'Description must be less than 100 characters' };
  }
  
  return { isValid: true };
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};