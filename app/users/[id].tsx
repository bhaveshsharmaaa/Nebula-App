import Loader from "@/components/Loader";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const profile = useQuery(
    api.users.getUserProfile,
    id ? { id: id as Id<"users"> } : "skip"
  );
  const posts = useQuery(api.posts.getPostsByUser, {
    userId: id as Id<"users">,
  });
  const isFollowing = useQuery(api.users.isFollowing, {
    followingId: id as Id<"users">,
  });

  const toggleFollow = useMutation(api.users.toggleFollow);

  if (
    profile === undefined ||
    posts === undefined ||
    isFollowing === undefined
  ) {
    return <Loader />;
  }

  return (
    <View style={styles.safeArea}>
      <View style={styles.viewHeader}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
          {profile?.username || "Profile"}
        </Text>
        <View className="w-5" />
      </View>

      <View style={styles.container}>
        {/* Profile Header */}
        <View style={styles.header}>
          <Image source={{ uri: profile.image }} style={styles.avatar} />
          <View style={styles.statsContainer}>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{profile?.posts}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{profile.followers}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{profile.following}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
          </View>
        </View>

        {/* Full Name */}
        <Text style={styles.fullName}>{profile?.fullname}</Text>

        {/* Bio */}
        <Text style={styles.bio}>
          {profile?.bio || "This user has no bio."}
        </Text>

        <Pressable
          style={[styles.followButton, isFollowing && styles.followingButton]}
          onPress={() => toggleFollow({ followingId: id as Id<"users"> })}
        >
          <Text
            style={[
              styles.followButtonText,
              isFollowing && styles.followingButtonText,
            ]}
          >
            {isFollowing ? "Following" : "Follow"}
          </Text>
        </Pressable>

        <FlatList
          data={[...posts].reverse()}
          numColumns={3}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/postScreen/[postid]",
                  params: { postid: item._id },
                })
              }
              activeOpacity={0.8}
            >
              <Image source={{ uri: item.imageUrl }} style={styles.postImage} />
            </TouchableOpacity>
          )}
          ListEmptyComponent={<NoPosts />}
          contentContainerStyle={styles.postsGrid}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}
const NoPosts = () => (
  <View style={styles.noPostsContainer}>
    <Text style={styles.noPostsText}>No Posts Available</Text>
  </View>
);
const imageSize = Dimensions.get("window").width / 3 - 8;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: "black",
  },
  viewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    backgroundColor: "black",
  },
  container: {
    flex: 1,
    backgroundColor: "black",
    paddingHorizontal: 12,
    paddingTop: 16,
    paddingBottom: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2.5,
    marginRight: 24,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
  },
  stat: {
    alignItems: "center",
  },
  statNumber: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#fff",
  },
  statLabel: {
    fontSize: 13,
    color: "#aaa",
    marginTop: 2,
    letterSpacing: 0.5,
  },
  fullName: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 17,
    marginBottom: 2,
    textAlign: "left",
    letterSpacing: 0.2,
  },
  bio: {
    color: "#bbb",
    marginBottom: 12,
    fontSize: 14,
    lineHeight: 18,
  },
  editProfileBtn: {
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: "#23242a",
  },
  editProfileText: {
    fontWeight: "bold",
    color: "#fff",
    fontSize: 15,
    letterSpacing: 0.5,
  },
  postsGrid: {
    paddingBottom: 80,
  },
  postImage: {
    width: imageSize,
    height: imageSize,
    margin: 1,
    backgroundColor: "#23242a",
  },

  noPostsContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  noPostsText: {
    color: "#888",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  followButton: {
    backgroundColor: "#C13584",
    paddingVertical: 8,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
    marginTop: 8,
  },
  followingButton: {
    backgroundColor: "#23242a",
    borderWidth: 1,
    borderColor: "#C13584",
  },
  followButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 0.5,
  },
  followingButtonText: {
    color: "#C13584",
  },
});
