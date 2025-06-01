import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useUser } from "@clerk/clerk-expo";
import { Feather, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  Alert,
  Animated,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Vibration,
  View,
} from "react-native";
import CommentsModal from "./CommentsModal";
import { formatTimeAgo } from "./timeAgo";

type PostProps = {
  post: {
    _id: Id<"posts">;
    imageUrl: string;
    caption?: string;
    likes: number;
    comments: number;
    _creationTime: string;
    isLiked: boolean;
    isBookmarked: boolean;
    author: {
      _id: string;
      username: string;
      fullname: string;
      image: string;
    };
  };
};

export default function Post({ post }: PostProps) {
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [showComments, setShowComments] = useState(false);
  const [isBookmarked, setisBookmarked] = useState(post.isBookmarked);
  const [showHeart, setShowHeart] = useState(false);

  const { user } = useUser();

  const convexOrCurrentUser = useQuery(
    api.users.getUserByClerkId,
    user ? { clerkId: user?.id } : "skip"
  );

  const lastTap = useRef<number | null>(null);
  const scale = useRef(new Animated.Value(0)).current;
  const router = useRouter();

  const likeMutation = useMutation(api.posts.toggleLikePost);
  const bookmarkMutation = useMutation(api.bookmarks.toggleBookmark);
  const deletePostMutaion = useMutation(api.posts.deletePost);

  const vibrateFeedback = () => {
    if (Platform.OS === "android") {
      Vibration.vibrate(50);
    } else {
      Vibration.vibrate([0, 50]);
    }
  };

  const handleBookmark = async () => {
    const newBookmarkStatus = await bookmarkMutation({ postId: post._id });
    setisBookmarked(newBookmarkStatus);
  };

  const toggleLike = async () => {
    try {
      const newLiked = await likeMutation({ postId: post._id });
      vibrateFeedback();
      setIsLiked(newLiked);
    } catch (error) {
      console.error("Error toggling like:", error);
      Alert.alert("Error");
    }
  };

  const triggerHeartAnimation = () => {
    setShowHeart(true);
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 0,
        duration: 200,
        delay: 400,
        useNativeDriver: true,
      }),
    ]).start(() => setShowHeart(false));
  };

  const handleDoubleTap = async () => {
    const now = Date.now();
    if (lastTap.current && now - lastTap.current < 300) {
      if (!isLiked) await toggleLike();
      vibrateFeedback();
      triggerHeartAnimation();
    } else {
      lastTap.current = now;
    }
  };

  const handleDeletePost = async () => {
    try {
      await deletePostMutaion({ postId: post._id });
    } catch (error) {
      console.error("Error deleting post:", error);
      Alert.alert("Error", "Failed to delete post. Please try again.");
    }
  };

  return (
    <View style={styles.scrollView}>
      <View style={styles.postContainer} key={post._id}>
        {/* Header */}
        <View className="px-4" style={styles.headerRow}>
          <Pressable
            onPress={() =>
              router.push(
                convexOrCurrentUser?._id === post.author._id
                  ? "/(tabs)/profile"
                  : `/users/${post.author._id}`
              )
            }
          >
            <View style={styles.authorInfoRow}>
              <Image
                source={{ uri: post.author.image }}
                style={styles.authorImage}
              />
              <View>
                <Text style={styles.authorFullname}>
                  {post?.author?.fullname}
                </Text>
                <Text style={styles.authorUsername}>
                  {post?.author?.username}
                </Text>
              </View>
            </View>
          </Pressable>
          <TouchableOpacity onPress={handleBookmark}>
            <MaterialIcons
              name={isBookmarked ? "bookmark" : "bookmark-border"}
              size={24}
              color="white"
            />
          </TouchableOpacity>
        </View>

        {/* Post Image */}
        <TouchableWithoutFeedback onPress={handleDoubleTap}>
          <View style={styles.postImageWrapper}>
            <Image
              source={{ uri: post.imageUrl }}
              style={styles.postImage}
              resizeMode="cover"
            />
            {showHeart && (
              <Animated.View
                style={[styles.heartAnimation, { transform: [{ scale }] }]}
              >
                <Text style={styles.heartText}>❤️</Text>
              </Animated.View>
            )}
          </View>
        </TouchableWithoutFeedback>

        {/* Action Icons */}
        <View className="px-4" style={styles.actionRow}>
          <View style={styles.actionGroup}>
            <TouchableOpacity
              onPress={toggleLike}
              style={styles.likeButton}
              activeOpacity={0.7}
            >
              <FontAwesome
                name={isLiked ? "heart" : "heart-o"}
                size={24}
                color={isLiked ? "red" : "white"}
              />
              {post.likes > 0 && (
                <Text style={styles.likesCount}>{post.likes}</Text>
              )}
            </TouchableOpacity>
            <View style={styles.commentGroup}>
              <TouchableOpacity
                onPress={() => setShowComments(true)}
                activeOpacity={0.7}
              >
                <Feather name="message-circle" size={24} color="white" />
              </TouchableOpacity>
              {post.comments > 0 && (
                <Text style={styles.commentsCount}>{post.comments}</Text>
              )}
            </View>
          </View>
          {post.author._id === convexOrCurrentUser?._id && (
            <TouchableOpacity onPress={handleDeletePost} activeOpacity={0.7}>
              <Feather name="trash-2" size={22} color="white" />
            </TouchableOpacity>
          )}
        </View>

        {/* Be the first to like */}
        {post.likes === 0 && (
          <Text className="px-4" style={styles.firstLikeText}>
            Be the first one to like it
          </Text>
        )}

        {/* Caption */}
        <Text className="px-4" style={styles.caption}>
          {post.caption}
        </Text>

        {/* View Comments */}
        <TouchableOpacity
          onPress={() => setShowComments(true)}
          activeOpacity={0.7}
          className="px-4"
        >
          {post.comments > 0 && (
            <Text style={styles.viewComments}>
              View all {post.comments} comments
            </Text>
          )}
        </TouchableOpacity>
        <Text style={styles.postTime}>
          {formatTimeAgo(Number(post._creationTime))}
        </Text>
      </View>

      <CommentsModal
        postId={post._id}
        visible={showComments}
        onClose={() => setShowComments(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: "black",
  },
  postContainer: {
    marginBottom: 24,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  authorInfoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  authorImage: {
    width: 40,
    height: 40,
    borderRadius: 50,
    marginRight: 12,
  },
  authorFullname: {
    color: "white",
    fontWeight: "600",
  },
  authorUsername: {
    color: "#9CA3AF",
    fontSize: 12,
  },
  postTime: {
    color: "#9CA3AF",
    fontSize: 12,
    paddingLeft: 16,
  },
  postImageWrapper: {
    position: "relative",
    marginTop: 12,
  },
  postImage: {
    height: 384,
    width: "100%",
  },
  heartAnimation: {
    position: "absolute",
    top: "40%",
    left: "43%",
  },
  heartText: {
    fontSize: 60,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    justifyContent: "space-between",
  },
  actionGroup: {
    flexDirection: "row",
  },
  likeButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
  },
  likesCount: {
    color: "white",
    marginLeft: 8,
  },
  commentGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  commentsCount: {
    color: "white",
    marginLeft: 8,
  },
  firstLikeText: {
    color: "white",
    marginTop: 8,
  },
  caption: {
    color: "white",
    marginTop: 8,
  },
  viewComments: {
    color: "#9CA3AF",
    marginTop: 4,
  },
});
