import Loader from "@/components/Loader";
import Post from "@/components/Post";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

export default function PostScreen() {
  const { postid } = useLocalSearchParams();

  const router = useRouter();

  const posts = useQuery(api.posts.getPostById, {
    postId: postid as Id<"posts">,
  });

  if (posts === undefined) {
    return <Loader />;
  }

  return (
    <View className="flex-1 bg-black ">
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingVertical: 15,
          paddingBottom: 20,
          backgroundColor: "black",
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
          Your Post
        </Text>
        <View className="w-5" />
      </View>
      <FlatList
        data={posts}
        renderItem={({ item }) => (
          <Post post={{ ...item, _creationTime: String(item._creationTime) }} />
        )}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
