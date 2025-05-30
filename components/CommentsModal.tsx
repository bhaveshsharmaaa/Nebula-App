import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import CommentItem from "./CommentItem";

type CommentsModalProps = {
  postId: Id<"posts">;
  visible: boolean;
  onClose: () => void;
};

export default function CommentsModal({
  onClose,
  postId,
  visible,
}: CommentsModalProps) {
  const [newComment, setNewComment] = useState("");
  const comments = useQuery(api.comments.getComments, { postId });
  const addCommentMutation = useMutation(api.comments.addComments);
  const [loading, setLoading] = useState(false);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      await addCommentMutation({
        content: newComment,
        postId: postId,
      });
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.modalContainer}
      >
        <View style={styles.innerContainer}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Comments</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={26} color="white" />
            </TouchableOpacity>
          </View>

          {comments ? (
            <FlatList
              data={comments}
              keyExtractor={(item) => item._id}
              style={styles.commentsList}
              contentContainerStyle={{ paddingBottom: 20 }}
              renderItem={({ item }) => (
                <CommentItem
                  content={item.content}
                  username={item.user?.username}
                  fullName={item.user?.fullname}
                  userDp={item.user?.image}
                  createdAt={item.user.createdAt}
                />
              )}
            />
          ) : (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="#ccc" />
            </View>
          )}

          <View style={styles.inputContainer}>
            <TextInput
              value={newComment}
              onChangeText={setNewComment}
              placeholder="Add a comment..."
              placeholderTextColor="#aaa"
              style={styles.input}
              multiline
            />
            <TouchableOpacity onPress={handleAddComment} disabled={loading}>
              <Ionicons
                name="send"
                size={24}
                color={loading ? "#555" : "#1DA1F2"}
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "flex-end",
  },
  innerContainer: {
    height: "90%",
    backgroundColor: "#121212",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 12,
    borderBottomColor: "#333",
    borderBottomWidth: 1,
  },
  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  commentsList: {
    flex: 1,
    marginTop: 10,
  },
  commentItem: {
    paddingVertical: 10,
    borderBottomColor: "#333",
    borderBottomWidth: 1,
  },
  commentAuthor: {
    color: "#aaa",
    fontWeight: "600",
    marginBottom: 2,
  },
  commentText: {
    color: "white",
    fontSize: 15,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopColor: "#333",
    borderTopWidth: 1,
    paddingTop: 10,
    gap: 8,
  },
  input: {
    flex: 1,
    color: "white",
    fontSize: 16,
    maxHeight: 100,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#1e1e1e",
    borderRadius: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
