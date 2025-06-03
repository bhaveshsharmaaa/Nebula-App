import Loader from "@/components/Loader";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";

import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Modal,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Profile() {
  const { signOut, userId } = useAuth();
  const [isEditableModal, setIsEditableModal] = useState(false);
  const [isSavedLoading, setIsSavedLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const generateUploadUrl = useMutation(api.posts.generateUploadUrl);

  const router = useRouter();

  const currentUser = useQuery(
    api.users.getUserByClerkId,
    userId ? { clerkId: userId } : "skip"
  );
  const updateProfile = useMutation(api.users.updateUser);
  const posts = useQuery(api.posts.getPostsByUser, {});
  const updateUserImage = useMutation(api.users.updateUserImage);

  const [editedProfile, setEditedProfile] = useState({
    username: currentUser?.username || "",
    fullname: currentUser?.fullname || "",
    bio: currentUser?.bio || "",
  });

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!editedProfile.username || !editedProfile.fullname) {
      alert("Username and Full Name are required.");
      return;
    }
    setIsSavedLoading(true);

    try {
      if (!selectedImage) {
        await updateProfile({
          username: editedProfile.username,
          fullname: editedProfile.fullname,
          bio: editedProfile.bio,
        });
        setIsSavedLoading(false);
      } else {
        const uploadUrl = await generateUploadUrl();
        const uploadResponse = await FileSystem.uploadAsync(
          uploadUrl,
          selectedImage,
          {
            httpMethod: "POST",
            uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
            mimeType: "image/jpeg",
          }
        );

        if (uploadResponse.status !== 200) {
          throw new Error("Image upload failed");
        }
        const { storageId } = JSON.parse(uploadResponse.body);
        await updateProfile({
          username: editedProfile.username,
          fullname: editedProfile.fullname,
          bio: editedProfile.bio,
        });
        await updateUserImage({
          storageId,
        });
        setSelectedImage(null);
        setIsSavedLoading(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }

    setIsEditableModal(false);
  };

  if (!currentUser || posts === undefined) {
    return <Loader />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="black" />
      {/* Top Header with Username and Sign Out Icon */}
      <View style={styles.topHeader}>
        <Text style={styles.topUsername}>{currentUser?.username}</Text>
        <TouchableOpacity
          onPress={() => signOut()}
          style={styles.signOutIconBtn}
        >
          <Ionicons name="log-out-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        {/* Profile Header */}
        <View style={styles.header}>
          <Image source={{ uri: currentUser.image }} style={styles.avatar} />
          <View style={styles.statsContainer}>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{currentUser?.posts}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{currentUser.followers}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{currentUser.following}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
          </View>
        </View>

        {/* Full Name */}
        <Text style={styles.fullName}>{currentUser?.fullname}</Text>

        {/* Bio */}
        <Text style={styles.bio}>
          {currentUser?.bio || "This user has no bio."}
        </Text>

        {/* Edit Profile Button */}
        <TouchableOpacity
          onPress={() => setIsEditableModal(true)}
          style={styles.editProfileBtn}
        >
          <Text style={styles.editProfileText}>Edit Profile</Text>
        </TouchableOpacity>

        {/* Posts Grid */}
        <FlatList
          data={[...posts].reverse()} // 👈 Reverse the array here
          numColumns={3}
          keyExtractor={(_, idx) => idx.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/postScreen/[postid]",
                  params: { postid: item._id },
                })
              }
            >
              <Image source={{ uri: item.imageUrl }} style={styles.postImage} />
            </TouchableOpacity>
          )}
          ListEmptyComponent={<NoPosts />}
          contentContainerStyle={styles.postsGrid}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* Edit Profile Modal */}
      <Modal
        visible={isEditableModal}
        animationType="slide"
        transparent
        onRequestClose={() => setIsEditableModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <TouchableOpacity
              style={{ alignSelf: "center", marginBottom: 16 }}
              onPress={pickImage}
            >
              <Image
                source={
                  selectedImage
                    ? { uri: selectedImage }
                    : { uri: currentUser.image }
                }
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                }}
              />
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#888"
              value={editedProfile.fullname}
              onChangeText={(text) =>
                setEditedProfile((prev) => ({ ...prev, fullname: text }))
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="#888"
              value={editedProfile.username}
              onChangeText={(text) =>
                setEditedProfile((prev) => ({ ...prev, username: text }))
              }
            />
            <TextInput
              style={[styles.input, { height: 70 }]}
              placeholder="Bio"
              placeholderTextColor="#888"
              value={editedProfile.bio}
              multiline
              onChangeText={(text) =>
                setEditedProfile((prev) => ({ ...prev, bio: text }))
              }
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalBtn}
                onPress={() => {
                  setIsEditableModal(false);
                  setSelectedImage(null);
                }}
              >
                <Text style={styles.modalBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: "#C13584" }]}
                onPress={handleSave}
              >
                {isSavedLoading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={[styles.modalBtnText, { color: "#fff" }]}>
                    Save
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
const NoPosts = () => (
  <View style={styles.noPostsContainer}>
    <Text style={styles.noPostsText}>No Posts Available</Text>
  </View>
);

const imageSize = Dimensions.get("window").width / 3 - 8;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "black",
  },
  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 8,
    backgroundColor: "black",
  },
  topUsername: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20,
    letterSpacing: 0.5,
  },
  signOutIconBtn: {
    padding: 6,
  },
  signOutIcon: {
    fontSize: 22,
    color: "#C13584",
  },
  container: {
    flex: 1,
    backgroundColor: "black",
    paddingHorizontal: 12,
    paddingTop: 16,
    paddingBottom: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2.5,
    marginRight: 24,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
  },
  stat: {
    alignItems: "center",
  },
  statNumber: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#fff",
  },
  statLabel: {
    fontSize: 13,
    color: "#aaa",
    marginTop: 2,
    letterSpacing: 0.5,
  },
  fullName: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 17,
    marginBottom: 2,
    textAlign: "left",
    letterSpacing: 0.2,
  },
  bio: {
    color: "#bbb",
    marginBottom: 12,
    fontSize: 14,
    lineHeight: 18,
  },
  editProfileBtn: {
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: "#23242a",
  },
  editProfileText: {
    fontWeight: "bold",
    color: "#fff",
    fontSize: 15,
    letterSpacing: 0.5,
  },
  postsGrid: {
    paddingBottom: 80,
  },
  postImage: {
    width: imageSize,
    height: imageSize,
    margin: 1,
    backgroundColor: "#23242a",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#23242a",
    borderRadius: 12,
    padding: 20,
    alignItems: "stretch",
  },
  modalTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#181A20",
    color: "#fff",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    fontSize: 15,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
  },
  modalBtn: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 6,
    backgroundColor: "#333",
    marginLeft: 10,
  },
  modalBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
  noPostsContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  noPostsText: {
    color: "#888",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
});
