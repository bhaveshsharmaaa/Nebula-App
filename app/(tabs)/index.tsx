import Loader from "@/components/Loader";
import Post from "@/components/Post";
import { api } from "@/convex/_generated/api";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Index() {
  const [refreshing, setRefreshing] = useState(false);
  const posts = useQuery(api.posts.getFeedPosts);

  const router = useRouter();

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  if (posts === undefined) return <Loader />;

  if (posts.length === 0) {
    return (
      <SafeAreaView style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No posts available</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <Post post={{ ...item, _creationTime: String(item._creationTime) }} />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#60A5FA"
          />
        }
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
          <View style={styles.header}>
            <Text style={styles.headerText}>Nebula</Text>
            <TouchableOpacity
              style={styles.searchIcon}
              onPress={() => router.push("/notifications")}
            >
              <Ionicons
                name={"notifications-outline"}
                size={26}
                color="white"
              />
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={styles.contentContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  contentContainer: {
    paddingBottom: 64,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    backgroundColor: "black",
  },
  headerText: {
    fontSize: 32,
    color: "#FFFFFF",
    fontFamily: "Pacifico-Regular",
    marginBottom: 16,
    marginTop: 8,
  },
  searchIcon: {
    marginBottom: 16,
    marginTop: 8,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: "#FFFFFF",
    fontSize: 18,
  },
});
