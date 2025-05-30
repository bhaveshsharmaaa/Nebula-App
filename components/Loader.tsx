import React from "react";
import { ActivityIndicator, Text, View } from "react-native";

export default function Loader() {
  return (
    <View className="flex-1 bg-black justify-center items-center">
      <ActivityIndicator size="large" color="#60A5FA" />
      <Text className="text-white mt-4 text-lg font-semibold">Loading...</Text>
    </View>
  );
}
