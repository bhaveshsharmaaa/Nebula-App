import { Ionicons } from "@expo/vector-icons";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

export default function NotificationCard({ notification }: any) {
  const { sender, type, comment, post } = notification;
  const message =
    type === "like"
      ? "liked your post"
      : type === "comment"
        ? `commented: "${comment}"`
        : "started following you";

  const icon =
    type === "like"
      ? "heart"
      : type === "comment"
        ? "chatbubble-ellipses"
        : "person-add";

  const color =
    type === "like" ? "#EF4444" : type === "comment" ? "#3B82F6" : "#8B5CF6";

  const router = useRouter();

  return (
    <View>
      <View style={styles.card}>
        <Pressable onPress={() => router.push(`/users/${sender._id}`)}>
          <Image source={{ uri: sender.image }} style={styles.avatar} />
        </Pressable>
        <View style={styles.cardContent}>
          <View style={styles.textRow}>
            <Ionicons
              name={icon as any}
              size={16}
              color={color}
              style={{ marginRight: 6 }}
            />
            <Pressable onPress={() => router.push(`/users/${sender._id}`)}>
              <Text style={styles.username}>{sender.username}</Text>
            </Pressable>
            <Text style={styles.action}> {message}</Text>
          </View>

          <Text style={styles.time}>
            {formatDistanceToNow(notification._creationTime, {
              addSuffix: true,
            })}
          </Text>
        </View>

        {post?.imageUrl && (
          <Image source={{ uri: post.imageUrl }} style={styles.postThumb} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "black",
    borderRadius: 16,
    marginBottom: 14,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 24,
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
  },
  textRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    marginBottom: 6,
  },
  username: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFF",
  },
  action: {
    fontSize: 15,
    color: "#CCC",
  },
  time: {
    fontSize: 12,
    color: "#777",
  },
  postThumb: {
    width: 48,
    height: 48,
    borderRadius: 12,
    marginLeft: 10,
  },
});
