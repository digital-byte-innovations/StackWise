import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";

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
      console.error(error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="modal/add-income" 
          options={{ 
            presentation: "modal", 
            title: "Add Income",
            headerTitleAlign: "center",
          }} 
        />
        <Stack.Screen 
          name="modal/add-expense" 
          options={{ 
            presentation: "modal", 
            title: "Add Expense",
            headerTitleAlign: "center",
          }} 
        />
        <Stack.Screen 
          name="modal/add-category" 
          options={{ 
            presentation: "modal", 
            title: "Add Category",
            headerTitleAlign: "center",
          }} 
        />
      </Stack>
    </>
  );
}