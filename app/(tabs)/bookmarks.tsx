import Loader from "@/components/Loader";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import React from "react";
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const screenWidth = Dimensions.get("window").width;
const imageSize = screenWidth / 3;

export default function Bookmarks() {
  const bookmarkedPosts = useQuery(api.bookmarks.getBookmarkedPosts);

  if (bookmarkedPosts === undefined) return <Loader />;

  if (bookmarkedPosts.length === 0) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.emptyText}>No bookmarks yet</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headingContainer}>
        <Text style={styles.heading}>Bookmarked</Text>
      </View>
      <FlatList
        data={bookmarkedPosts}
        keyExtractor={(item, index) => item?._id ?? `bookmark-${index}`}
        numColumns={3}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) =>
          item ? (
            <TouchableOpacity style={styles.gridItem}>
              <Image source={{ uri: item.imageUrl }} style={styles.image} />
            </TouchableOpacity>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  headingContainer: {
    paddingTop: 15,
    paddingHorizontal: 16,
    backgroundColor: "black",
  },
  heading: {
    fontSize: 28,
    color: "#FFFFFF",
    fontWeight: "700",
    marginBottom: 16,
  },
  grid: {
    paddingBottom: 20,
  },
  gridItem: {
    width: imageSize,
    height: imageSize,
    padding: 1, // Small padding between images
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  centeredContainer: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
  },
});
