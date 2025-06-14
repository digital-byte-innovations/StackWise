import React from 'react';
import { StyleSheet, Text, View, FlatList, Pressable, ActivityIndicator, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Plus, Trash2 } from 'lucide-react-native';
import useBudgetStore from '@/hooks/useBudgetStore';
import { useHydration } from '@/hooks/useHydration';
import Colors from '@/constants/colors';

export default function CategoriesScreen() {
  const router = useRouter();
  const { categories, deleteCategory } = useBudgetStore();
  const { _hasHydrated } = useHydration();
  
  const safeCategories = Array.isArray(categories) && _hasHydrated 
    ? categories.filter(c => c && typeof c === 'object' && c.id)
    : [];
  
  const handleAddCategory = () => {
    router.push('/modal/add-category');
  };
  
  if (!_hasHydrated) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading categories...</Text>
        </View>
      </SafeAreaView>
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
                      Budget: ${(typeof item.budget === 'number' ? item.budget : 0).toFixed(2)}
                    </Text>
                  </View>
                </View>
                
                <Pressable
                  style={({ pressed }) => [
                    styles.deleteButton,
                    pressed && { opacity: 0.7 }
                  ]}
                  onPress={() => deleteCategory(item.id)}
                  android_ripple={Platform.OS === 'android' ? { color: Colors.lightText, borderless: true } : undefined}
                >
                  <Trash2 size={20} color={Colors.lightText} />
                </Pressable>
              </View>
            );
          }}
          contentContainerStyle={styles.listContent}
          removeClippedSubviews={Platform.OS === 'android'}
          initialNumToRender={10}
          maxToRenderPerBatch={5}
          windowSize={10}
        />
      )}
      
      <Pressable
        style={({ pressed }) => [
          styles.addButton,
          pressed && { opacity: 0.9 }
        ]}
        onPress={handleAddCategory}
        android_ripple={Platform.OS === 'android' ? { color: 'rgba(255,255,255,0.3)' } : undefined}
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
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.lightText,
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
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
      },
    }),
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
    borderRadius: 8,
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
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
      },
    }),
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