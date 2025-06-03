import Loader from "@/components/Loader";
import { api } from "@/convex/_generated/api";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");
const tileSize = width / 3 - 4;

export default function SearchScreen() {
  const router = useRouter();
  const images = useQuery(api.posts.getAllImages);

  if (!images) {
    return <Loader />;
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      {/* Tappable Search Bar */}
      <TouchableOpacity
        style={styles.searchBar}
        activeOpacity={0.7}
        onPress={() => router.push("/search/user")}
      >
        <Ionicons name="search-outline" size={20} color="#888" />
        <Text style={styles.searchText}>Search username</Text>
      </TouchableOpacity>

      {/* Images Grid Using map */}
      <ScrollView contentContainerStyle={styles.gridContainer}>
        <View style={styles.gridRow}>
          {images.map((item) => (
            <TouchableOpacity
              key={item._id}
              onPress={() =>
                router.push({
                  pathname: "/postScreen/[postid]",
                  params: { postid: item._id },
                })
              }
            >
              <Image source={{ uri: item.imageUrl }} style={styles.imageTile} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    margin: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 50,
  },
  searchText: {
    marginLeft: 8,
    color: "#888",
    fontSize: 16,
    padding: 5,
  },
  gridContainer: {
    paddingHorizontal: 2,
    paddingBottom: 80,
  },
  gridRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  imageTile: {
    width: tileSize,
    height: tileSize,
    margin: 1,
  },
});
