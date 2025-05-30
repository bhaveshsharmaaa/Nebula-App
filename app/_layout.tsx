import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import "../global.css";

import InitialLayout from "@/components/initialLayout";
import ClerkAndConvexProvider from "@/providers/clerkandconvexprovider";
import { useFonts } from "expo-font";
import * as NavigationBar from "expo-navigation-bar";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect } from "react";
import { ActivityIndicator, Platform } from "react-native";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontLoaded] = useFonts({
    "Pacifico-Regular": require("../assets/fonts/Pacifico-Regular.ttf"),
  });

  useEffect(() => {
    if (Platform.OS === "android") {
      NavigationBar.setBackgroundColorAsync("#000000");
      NavigationBar.setButtonStyleAsync("light");
    }
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (fontLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontLoaded]);

  if (!fontLoaded) {
    return (
      <SafeAreaProvider>
        <SafeAreaView className="flex-1 bg-black items-center justify-center">
          <ActivityIndicator size="large" color="#fff" />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }
  return (
    <ClerkAndConvexProvider>
      <SafeAreaProvider>
        <SafeAreaView onLayout={onLayoutRootView} className="flex-1 bg-black ">
          <InitialLayout />
          <StatusBar style="light" />
        </SafeAreaView>
      </SafeAreaProvider>
    </ClerkAndConvexProvider>
  );
}
