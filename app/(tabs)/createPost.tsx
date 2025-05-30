import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "convex/react";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function CreatePostScreen() {
  const router = useRouter();
  const { user } = useUser();
  const [caption, setCaption] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isPosting, setIsPosting] = useState(false);

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

  const generateUploadUrl = useMutation(api.posts.generateUploadUrl);
  const createPost = useMutation(api.posts.createPost);

  const handlePost = async () => {
    if (!selectedImage) return;

    try {
      setIsPosting(true);
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
      await createPost({ storageId, caption });
      setSelectedImage(null);
      setCaption("");
      router.push("/(tabs)");
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post. Please try again.");
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black pt-3">
      {/* Header */}
      <View className="h-14 flex-row items-center justify-between px-4 bg-black">
        <View className="w-[50px]">
          {selectedImage && (
            <TouchableOpacity
              onPress={() => {
                setSelectedImage(null);
                setCaption("");
              }}
              disabled={isPosting}
            >
              <Ionicons name="close-outline" size={28} color="white" />
            </TouchableOpacity>
          )}
        </View>

        <Text className="text-white text-3xl font-semibold text-center flex-1">
          New Post
        </Text>

        <View className="w-[50px] items-end">
          {selectedImage && (
            <TouchableOpacity
              className={`p-2 ${isPosting ? "opacity-60" : ""}`}
              onPress={handlePost}
              disabled={isPosting || !selectedImage}
            >
              {isPosting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-blue-500 text-base font-semibold">
                  Post
                </Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        className="flex-1 px-5 pt-5"
      >
        <TouchableOpacity onPress={pickImage} activeOpacity={0.8}>
          {selectedImage ? (
            <Image
              source={{ uri: selectedImage }}
              className="w-full h-72 rounded-xl"
              resizeMode="contain"
            />
          ) : (
            <View className="flex h-[500px] justify-center items-center">
              <Image
                source={require("../../assets/images/Photo-rafiki.png")}
                className="w-full h-96 rounded-xl"
                resizeMode="contain"
              />
              <Text className="text-gray-400 text-base mt-3">
                Tap to select image from library
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {selectedImage && (
          <TextInput
            className=" text-white mt-3 bg-black text-base"
            placeholder="Write a caption..."
            placeholderTextColor="#aaa"
            value={caption}
            onChangeText={setCaption}
            multiline
          />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
