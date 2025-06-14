import React from 'react';
import { StyleSheet, Text, View, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Plus, Trash2 } from 'lucide-react-native';
import useBudgetStore from '@/hooks/useBudgetStore';
import Colors from '@/constants/colors';

export default function CategoriesScreen() {
  const router = useRouter();
  const { categories, deleteCategory, isLoading } = useBudgetStore();
  
  // Ensure categories is always an array
  const safeCategories = categories || [];
  
  const handleAddCategory = () => {
    router.push('/modal/add-category');
  };
  
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {safeCategories.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            No categories yet. Add a category to start tracking your budget.
          </Text>
        </View>
      ) : (
        <FlatList
          data={safeCategories}
          keyExtractor={(item, index) => item?.id || `category-${index}`}
          renderItem={({ item }) => {
            if (!item) return null;
            return (
              <View style={styles.categoryItem}>
                <View style={styles.categoryContent}>
                  <View 
                    style={[
                      styles.categoryColor, 
                      { backgroundColor: item.color || Colors.primary }
                    ]} 
                  />
                  <View style={styles.categoryDetails}>
                    <Text style={styles.categoryName}>{item.name || 'Unnamed Category'}</Text>
                    <Text style={styles.categoryBudget}>
                      Budget: ${(item.budget || 0).toFixed(2)}
                    </Text>
                  </View>
                </View>
                
                <Pressable
                  style={({ pressed }) => [
                    styles.deleteButton,
                    pressed && { opacity: 0.7 }
                  ]}
                  onPress={() => deleteCategory(item.id)}
                >
                  <Trash2 size={20} color={Colors.lightText} />
                </Pressable>
              </View>
            );
          }}
          contentContainerStyle={styles.listContent}
        />
      )}
      
      <Pressable
        style={({ pressed }) => [
          styles.addButton,
          pressed && { opacity: 0.9 }
        ]}
        onPress={handleAddCategory}
      >
        <Plus size={20} color="#fff" />
        <Text style={styles.addButtonText}>Add Category</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  categoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  categoryDetails: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  categoryBudget: {
    fontSize: 14,
    color: Colors.lightText,
  },
  deleteButton: {
    padding: 8,
  },
  addButton: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateText: {
    textAlign: 'center',
    fontSize: 16,
    color: Colors.lightText,
    lineHeight: 24,
  },
});