import { useSSO } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function Login() {
  const { startSSOFlow } = useSSO();

  const router = useRouter();

  const handlePress = async () => {
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: "oauth_google",
      });

      if (setActive && createdSessionId) {
        // Set the session as active
        setActive({ session: createdSessionId });
        // Navigate to the home screen after successful login
        router.replace("/(tabs)");
      }
    } catch (error) {
      console.log("Error during SSO flow:", error);
    }
  };

  return (
    <View className="flex-1 bg-black px-6 justify-center">
      {/* Illustration */}
      <View className="items-center mb-6">
        <Image
          source={require("../../assets/images/Mobile login-bro.png")}
          className="w-96 h-96"
          resizeMode="contain"
        />
      </View>

      {/* App Title */}
      <Text className="text-white text-4xl font-extrabold text-center mb-2">
        SocialSync
      </Text>

      <Text className="text-gray-400 text-lg text-center mb-8">
        Capture. Share. Connect.
      </Text>

      {/* Google Sign In */}
      <TouchableOpacity
        onPress={handlePress}
        className="flex-row items-center justify-center bg-white py-4 px-5 rounded-full shadow-md shadow-gray-500 active:opacity-80"
      >
        <Image
          source={require("../../assets/images/google-logo.png")}
          className="w-5 h-5 mr-3"
          resizeMode="contain"
        />
        <Text className="text-black font-semibold text-base">
          Continue with Google
        </Text>
      </TouchableOpacity>

      {/* Terms */}
      <Text className="text-gray-500 text-xs text-center mt-6">
        By continuing, you agree to our Terms & Privacy Policy.
      </Text>
    </View>
  );
}
