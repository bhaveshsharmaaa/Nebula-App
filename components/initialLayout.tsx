import { useAuth } from "@clerk/clerk-expo";
import { Slot, Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";

SplashScreen.preventAutoHideAsync();

export default function AppLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const [isNavigationReady, setIsNavigationReady] = useState(false);

  const isAuthRoute = segments[0] === "(auth)";
  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn && !isAuthRoute) {
      router.replace("/(auth)/login");
    } else if (isSignedIn && isAuthRoute) {
      router.replace("/(tabs)");
    }

    setIsNavigationReady(true);
  }, [isLoaded, isSignedIn, segments]);

  // 🔐 Wait until Clerk is ready and we've handled navigation
  if (!isLoaded || !isNavigationReady) {
    return null;
  }

  return isAuthRoute ? (
    <Slot />
  ) : (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "ios_from_right", // Smooth transition
        contentStyle: {
          backgroundColor: "#000000", // Prevent white screen by matching your app background
        },
      }}
    />
  );
}
