import React from "react";
import { ActivityIndicator, View } from "react-native";

export default function Loader() {
  return (
    <View className="flex-1 bg-black justify-center items-center">
      <ActivityIndicator size="large" color="#60A5FA" />
    </View>
  );
}
