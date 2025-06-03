import Loader from "@/components/Loader";
import NotificationCard from "@/components/RenderNotifications";
import { api } from "@/convex/_generated/api";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { useRouter } from "expo-router";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Notifications() {
  const notifications = useQuery(api.notifications.getNotifications);
  const router = useRouter();

  if (notifications === undefined) return <Loader />;

  if (notifications.length === 0) {
    return (
      <View style={styles.centered}>
        <Image
          source={require("../assets/images/Push notifications-rafiki.png")}
          style={{ width: 300, height: 300 }}
        />
        <Text style={styles.emptyText}>No Notifications</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={notifications}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => <NotificationCard notification={item} />}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
      ListHeaderComponent={
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={28} color="white" />
          </TouchableOpacity>
          <Text style={styles.title}>Notifications</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
    paddingTop: 15,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 10,
  },
  title: {
    fontSize: 28,
    color: "#FFFFFF",
    fontWeight: "700",
  },
  centered: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: "#AAA",
    fontSize: 18,
    marginTop: 20,
    fontWeight: "500",
  },
});
