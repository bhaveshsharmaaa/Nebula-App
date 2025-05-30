import Loader from "@/components/Loader";
import NotificationCard from "@/components/RenderNotifications";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";

export default function Notifications() {
  const notifications = useQuery(api.notifications.getNotifications);

  if (notifications === undefined) return <Loader />;

  if (notifications.length === 0) {
    return (
      <View style={styles.centered}>
        <Image
          source={require("../../assets/images/Push notifications-rafiki.png")}
          style={{ width: 300, height: 300 }}
        />
        <Text style={styles.emptyText}>No Notifications</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <NotificationCard notification={item} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    paddingTop: 15,
    paddingHorizontal: 16,
    marginBottom: 50,
  },
  title: {
    fontSize: 28,
    color: "#FFFFFF",
    fontWeight: "700",
    marginBottom: 16,
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
