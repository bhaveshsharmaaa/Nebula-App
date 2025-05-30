import { useSSO } from "@clerk/clerk-expo";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Login() {
  const { startSSOFlow } = useSSO();
  const [isLoading, setIsLoading] = useState(false);
  const handlePress = async () => {
    setIsLoading(true);
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: "oauth_google",
      });

      if (setActive && createdSessionId) {
        setActive({ session: createdSessionId });
      }
    } catch (error) {
      console.log("Error during SSO flow:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Illustration */}
      <View style={styles.illustrationContainer}>
        <Image
          source={require("../../assets/images/Mobile login-bro.png")}
          style={styles.illustration}
          resizeMode="contain"
        />
      </View>

      {/* App Title */}
      <Text style={styles.title}>Nebula</Text>
      <Text style={styles.subtitle}>Capture. Share. Connect.</Text>

      {/* Google Sign In */}
      {isLoading ? (
        <ActivityIndicator size="large" color="#60A5FA" />
      ) : (
        <TouchableOpacity style={styles.googleButton} onPress={handlePress}>
          <Image
            source={require("../../assets/images/google-logo.png")}
            style={styles.googleLogo}
            resizeMode="contain"
          />
          <Text style={styles.googleText}>Continue with Google</Text>
        </TouchableOpacity>
      )}

      {/* Terms */}
      <Text style={styles.termsText}>
        By continuing, you agree to our Terms & Privacy Policy.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  illustrationContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  illustration: {
    width: 384,
    height: 384,
  },
  title: {
    color: "white",
    fontSize: 32,
    fontFamily: "Pacifico-Regular",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    color: "#9CA3AF",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 32,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 9999,
    shadowColor: "#6B7280",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
  googleLogo: {
    width: 20,
    height: 20,
    marginRight: 12,
  },
  googleText: {
    color: "black",
    fontWeight: "600",
    fontSize: 16,
  },
  termsText: {
    color: "#6B7280",
    fontSize: 12,
    textAlign: "center",
    marginTop: 24,
  },
});
