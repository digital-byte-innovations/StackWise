import 'react-native-gesture-handler';
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";
import ErrorBoundary from "@/components/ErrorBoundary";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) {
      console.error("Font loading error:", error);
      // Don't throw error in production, just log it
    }
  }, [error]);

  useEffect(() => {
    if (loaded || error) {
      // Hide splash screen even if there's a font error
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <ErrorBoundary>
      <RootLayoutNav />
    </ErrorBoundary>
  );
}

function RootLayoutNav() {
  return (
    <>
      <StatusBar style="dark" backgroundColor="#ffffff" />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="modal/add-income" 
          options={{ 
            presentation: "modal", 
            title: "Add Income",
            headerTitleAlign: "center",
            gestureEnabled: Platform.OS === 'ios',
          }} 
        />
        <Stack.Screen 
          name="modal/add-expense" 
          options={{ 
            presentation: "modal", 
            title: "Add Expense",
            headerTitleAlign: "center",
            gestureEnabled: Platform.OS === 'ios',
          }} 
        />
        <Stack.Screen 
          name="modal/add-category" 
          options={{ 
            presentation: "modal", 
            title: "Add Category",
            headerTitleAlign: "center",
            gestureEnabled: Platform.OS === 'ios',
          }} 
        />
        <Stack.Screen
          name="transaction-detail"
          options={{
            presentation: 'modal',
            title: 'Transaction Details',
            headerTitleAlign: 'center',
          }}
        />
      </Stack>
    </>
  );
}