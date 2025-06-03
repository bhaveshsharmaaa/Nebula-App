import { api } from "@/convex/_generated/api";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { Tabs } from "expo-router";
import { Image } from "react-native";

export default function TabLayout() {
  const { userId } = useAuth();

  const currentUser = useQuery(
    api.users.getUserByClerkId,
    userId ? { clerkId: userId } : "skip"
  );
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "#888",
        tabBarStyle: {
          backgroundColor: "#000",
          borderTopWidth: 0,
          position: "absolute",
          bottom: -15,
          elevation: 0,
          height: 68,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={size}
              color="#fff"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Seach",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "search" : "search-outline"}
              size={size}
              color="#fff"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="createPost"
        options={{
          title: "Post",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "add-circle" : "add-circle-outline"}
              size={size}
              color="#fff"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="bookmarks"
        options={{
          title: "Bookmarks",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "bookmark" : "bookmark-outline"}
              size={size}
              color="#fff"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size, focused }) => {
            if (currentUser && currentUser.image) {
              return (
                <Image
                  source={{ uri: currentUser.image }}
                  style={{
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    borderWidth: focused ? 2 : 1,
                    borderColor: "#fff",
                  }}
                />
              );
            } else {
              return (
                <Ionicons
                  name={focused ? "person" : "person-outline"}
                  size={size}
                  color="#fff"
                />
              );
            }
          },
        }}
      />
    </Tabs>
  );
}
