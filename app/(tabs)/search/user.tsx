import Loader from "@/components/Loader";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function SearchUser() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchedUsername, setSearchedUsername] = useState("");
  const [loading, setLoading] = useState(false);

  const { user } = useUser();

  const convexOrCurrentUser = useQuery(
    api.users.getUserByClerkId,
    user?.id ? { clerkId: user.id } : "skip"
  );

  const searchUser = useQuery(
    api.users.getUserByUsername,
    searchedUsername ? { username: searchedUsername } : "skip"
  );

  const handleSearch = () => {
    if (searchTerm.trim()) {
      setSearchedUsername(searchTerm.trim());
      setLoading(true);
    }
  };

  useEffect(() => {
    if (searchedUsername && searchUser !== undefined) {
      setLoading(false);
    }
  }, [searchUser]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      {/* Search Bar with Back Icon inside */}
      <View style={styles.searchBar}>
        {/* Back Button */}
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#888" />
        </TouchableOpacity>

        {/* Text Input */}
        <TextInput
          placeholder="Search username"
          placeholderTextColor="#888"
          style={styles.searchText}
          value={searchTerm}
          onChangeText={setSearchTerm}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="while-editing"
          autoFocus
        />

        {/* Search Button */}
        <TouchableOpacity onPress={handleSearch} style={styles.searchBtn}>
          <Ionicons name="search-outline" size={22} color="#888" />
        </TouchableOpacity>
      </View>

      {/* Loader */}
      {loading && <Loader />}

      {/* User Found */}
      {!loading && searchUser && (
        <TouchableOpacity
          onPress={() =>
            router.push(
              convexOrCurrentUser?._id === searchUser?._id
                ? "/(tabs)/profile"
                : `/users/${searchUser?._id}`
            )
          }
          style={styles.userCard}
        >
          <Image source={{ uri: searchUser?.image }} style={styles.userImage} />
          <View>
            <Text style={styles.username}>{searchUser?.username}</Text>
            <Text style={styles.fullname}>{searchUser?.fullname}</Text>
          </View>
        </TouchableOpacity>
      )}

      {/* No User Found */}
      {!loading && searchedUsername && searchUser === null && (
        <Text style={styles.notFoundText}>
          No user found for &quot;{searchedUsername}&quot;
        </Text>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    margin: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 50,
  },
  backBtn: {
    paddingRight: 8,
  },
  searchText: {
    flex: 1,
    marginLeft: 8,
    color: "#888",
    fontSize: 16,
    padding: 5,
  },
  searchBtn: {
    paddingLeft: 8,
  },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#000",
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  username: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  fullname: {
    color: "#aaa",
  },
  notFoundText: {
    marginTop: 20,
    textAlign: "center",
    color: "#888",
    fontSize: 16,
  },
});
