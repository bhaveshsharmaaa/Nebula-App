import { useAuth } from "@clerk/clerk-expo";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";

export default function InitialLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  console.log("InitialLayout:", { isLoaded, isSignedIn, segments });

  useEffect(() => {
    if (!isLoaded) return;

    const isAuthScreen = segments[0] === "(auth)";
    if (!isSignedIn && !isAuthScreen) {
      console.log("Redirecting to /auth/login");
      router.replace("/(auth)/login");
    } else if (isSignedIn && isAuthScreen) {
      console.log("Redirecting to /tabs");
      router.replace("/(tabs)");
    }
  }, [isLoaded, isSignedIn, segments, router]);

  if (!isLoaded) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "black",
        }}
      >
        <ActivityIndicator color="#fff" />
        <Text style={{ color: "white", marginTop: 10 }}>
          Loading authentication...
        </Text>
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
