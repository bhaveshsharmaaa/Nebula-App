import { useAuth } from "@clerk/clerk-expo";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";

export default function InitialLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  const [hasNavigated, setHasNavigated] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;

    const isAuthRoute = segments[0] === "(auth)";

    if (!isSignedIn && !isAuthRoute) {
      router.replace("/(auth)/login");
      setHasNavigated(true);
    } else if (isSignedIn && isAuthRoute) {
      router.replace("/(tabs)");
      setHasNavigated(true);
    } else {
      // User is where they should be
      setHasNavigated(true);
    }
  }, [isLoaded, isSignedIn, segments]);

  // 🔐 Don't render until auth is loaded and navigation is settled
  if (!isLoaded || !hasNavigated) return null;

  return <Stack screenOptions={{ headerShown: false }} />;
}
