// components/CommentItem.tsx
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { formatTimeAgo } from "./timeAgo";

type CommentItemProps = {
  content: string;
  username?: string;
  fullName?: string;
  userDp?: string;
  createdAt: number;
};

const CommentItem: React.FC<CommentItemProps> = ({
  content,
  username,
  fullName,
  userDp,
  createdAt,
}) => {
  return (
    <View style={styles.container}>
      <Image
        source={{
          uri:
            userDp || "https://cdn-icons-png.flaticon.com/512/149/149071.png", // fallback avatar
        }}
        style={styles.avatar}
      />
      <View style={styles.content}>
        <Text style={styles.author}>
          {fullName || username || "Unknown User"}
        </Text>
        <Text style={styles.text}>{content}</Text>
        <Text style={{ color: "#555", fontSize: 12 }}>
          {formatTimeAgo(createdAt)}
        </Text>
      </View>
    </View>
  );
};

export default CommentItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingVertical: 10,
    alignItems: "flex-start",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  content: {
    flex: 1,
  },
  author: {
    color: "#aaa",
    fontWeight: "600",
    marginBottom: 2,
  },
  text: {
    color: "white",
    fontSize: 15,
  },
});
