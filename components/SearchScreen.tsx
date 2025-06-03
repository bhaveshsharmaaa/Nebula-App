import { api } from "@/convex/_generated/api";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// Mock explore images (replace later with real post URLs)
const exploreImages = [
  "https://source.unsplash.com/random/300x300?1",
  "https://source.unsplash.com/random/300x300?2",
  "https://source.unsplash.com/random/300x300?3",
  "https://source.unsplash.com/random/300x300?4",
  "https://source.unsplash.com/random/300x300?5",
  "https://source.unsplash.com/random/300x300?6",
  "https://source.unsplash.com/random/300x300?7",
  "https://source.unsplash.com/random/300x300?8",
  "https://source.unsplash.com/random/300x300?9",
];

const { width } = Dimensions.get("window");
const tileSize = width / 3 - 4;

const SearchScreen = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchedUsername, setSearchedUsername] = useState("");

  const user = useQuery(
    api.users.getUserByUsername,
    searchedUsername ? { username: searchedUsername } : "skip"
  );

  const handleSearch = () => {
    if (searchTerm.trim()) {
      setSearchedUsername(searchTerm.trim());
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: "padding", android: undefined })}
    >
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={22} color="#888" />
        <TextInput
          placeholder="Search username"
          placeholderTextColor="#888"
          style={styles.input}
          value={searchTerm}
          onChangeText={setSearchTerm}
          onSubmitEditing={handleSearch}
        />
      </View>

      {/* Searched User Result */}
      {user && (
        <TouchableOpacity style={styles.userCard}>
          <Image source={{ uri: user.image }} style={styles.userImage} />
          <View>
            <Text style={styles.username}>{user.username}</Text>
            <Text style={styles.fullname}>{user.fullname}</Text>
          </View>
        </TouchableOpacity>
      )}

      {/* Explore Grid */}
      <FlatList
        data={exploreImages}
        numColumns={3}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={styles.gridContainer}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={styles.imageTile} />
        )}
      />
    </KeyboardAvoidingView>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#f2f2f2",
    margin: 12,
    borderRadius: 12,
  },
  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: "#000",
  },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    marginHorizontal: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    marginBottom: 10,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  username: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  fullname: {
    color: "#555",
  },
  gridContainer: {
    paddingHorizontal: 2,
    paddingBottom: 80,
  },
  imageTile: {
    width: tileSize,
    height: tileSize,
    margin: 2,
    borderRadius: 10,
  },
});
