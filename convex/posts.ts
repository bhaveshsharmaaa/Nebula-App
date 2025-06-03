import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthenticatedUser } from "./users";

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    const currentUser = await getAuthenticatedUser(ctx);
    if (!currentUser) {
      throw new Error("User is not authenticated");
    }
    return await ctx.storage.generateUploadUrl();
  },
});

export const createPost = mutation({
  args: {
    caption: v.optional(v.string()),
    storageId: v.id("_storage"),
  },

  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUser(ctx);

    const imageUrl = await ctx.storage.getUrl(args.storageId);
    if (!imageUrl) {
      throw new Error("Image URL not found");
    }

    const postId = await ctx.db.insert("posts", {
      userId: currentUser._id,
      imageUrl,
      storageId: args.storageId,
      caption: args.caption,
      likes: 0,
      comments: 0,
    });

    await ctx.db.patch(currentUser._id, {
      posts: currentUser.posts + 1,
    });

    return postId;
  },
});

export const getFeedPosts = query({
  handler: async (ctx) => {
    const currentUser = await getAuthenticatedUser(ctx);
    if (!currentUser) {
      throw new Error("User not authenticated");
    }
    const posts = await ctx.db.query("posts").order("desc").collect();

    if (posts.length === 0) {
      return [];
    }
    const postWithinfo = await Promise.all(
      posts.map(async (post) => {
        const postAuther = (await ctx.db.get(post.userId))!;
        const isLiked = await ctx.db
          .query("likes")
          .withIndex("byUserAndPostId", (q) =>
            q.eq("userId", currentUser._id).eq("postId", post._id)
          )
          .first();

        const isBookmarked = await ctx.db
          .query("bookmarks")
          .withIndex("byUserAndPostId", (q) =>
            q.eq("userId", currentUser._id).eq("postId", post._id)
          )
          .first();

        return {
          ...post,
          author: {
            _id: postAuther?._id,
            username: postAuther?.username,
            fullname: postAuther?.fullname,
            image: postAuther?.image,
          },
          isLiked: !!isLiked,
          isBookmarked: !!isBookmarked,
        };
      })
    );
    return postWithinfo;
  },
});

export const toggleLikePost = mutation({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUser(ctx);
    const existingLike = await ctx.db
      .query("likes")
      .withIndex("byUserAndPostId", (q) =>
        q.eq("userId", currentUser._id).eq("postId", args.postId)
      )
      .first();

    const post = await ctx.db.get(args.postId);
    if (!post) {
      throw new Error("Post not found");
    }

    if (existingLike) {
      await ctx.db.delete(existingLike._id);
      await ctx.db.patch(args.postId, {
        likes: post.likes - 1,
      });
      return false;
    } else {
      await ctx.db.insert("likes", {
        userId: currentUser._id,
        postId: args.postId,
      });
      await ctx.db.patch(args.postId, {
        likes: post.likes + 1,
      });

      // Create a notification for the post author

      if (post.userId !== currentUser._id) {
        await ctx.db.insert("notifications", {
          recieverId: post.userId,
          senderId: currentUser._id,
          type: "like",
          postId: args.postId,
        });
      }
      return true;
    }
  },
});

export const deletePost = mutation({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUser(ctx);
    const post = await ctx.db.get(args.postId);
    if (!post) {
      throw new Error("Post not found");
    }

    if (post.userId !== currentUser._id) {
      throw new Error("You are not authorized to delete this post");
    }
    const likes = await ctx.db
      .query("likes")
      .withIndex("byPostId", (q) => q.eq("postId", args.postId))
      .collect();

    for (const like of likes) {
      await ctx.db.delete(like._id);
    }

    const comments = await ctx.db
      .query("comments")
      .withIndex("byPostId", (q) => q.eq("postId", args.postId))
      .collect();

    for (const comment of comments) {
      await ctx.db.delete(comment._id);
    }

    const notifications = await ctx.db
      .query("notifications")
      .withIndex("byPostId", (q) => q.eq("postId", args.postId))
      .collect();

    for (const notification of notifications) {
      await ctx.db.delete(notification._id);
    }

    const bookmarks = await ctx.db
      .query("bookmarks")
      .withIndex("byPostId", (q) => q.eq("postId", args.postId))
      .collect();

    for (const bookmark of bookmarks) {
      await ctx.db.delete(bookmark._id);
    }

    await ctx.storage.delete(post.storageId);
    await ctx.db.delete(args.postId);

    await ctx.db.patch(currentUser._id, {
      posts: Math.max(0, (currentUser.posts || 1) - 1),
    });
  },
});

export const getPostsByUser = query({
  args: {
    userId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUser(ctx);
    if (!currentUser) {
      throw new Error("User not authenticated");
    }
    const user = args.userId
      ? await ctx.db.get(args.userId)
      : await getAuthenticatedUser(ctx);

    if (!user) throw new Error("User not found");

    const posts = await ctx.db
      .query("posts")
      .withIndex("byUserId", (q) => q.eq("userId", args.userId || user._id))
      .collect();

    return posts;
  },
});

export const getPostById = query({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUser(ctx);
    const post = await ctx.db.get(args.postId);
    if (!post) {
      throw new Error("Post not found");
    }

    const posts = [post];
    if (posts.length === 0) {
      return [];
    }
    const postWithinfo = await Promise.all(
      posts.map(async (post) => {
        const postAuther = (await ctx.db.get(post.userId))!;
        const isLiked = await ctx.db
          .query("likes")
          .withIndex("byUserAndPostId", (q) =>
            q.eq("userId", currentUser._id).eq("postId", post._id)
          )
          .first();

        const isBookmarked = await ctx.db
          .query("bookmarks")
          .withIndex("byUserAndPostId", (q) =>
            q.eq("userId", currentUser._id).eq("postId", post._id)
          )
          .first();

        return {
          ...post,
          author: {
            _id: postAuther?._id,
            username: postAuther?.username,
            fullname: postAuther?.fullname,
            image: postAuther?.image,
          },
          isLiked: !!isLiked,
          isBookmarked: !!isBookmarked,
        };
      })
    );
    return postWithinfo;
  },
});
export const getAllImages = query({
  handler: async (ctx) => {
    const posts = await ctx.db.query("posts").collect();
    return posts.map((post) => ({
      _id: post._id,
      imageUrl: post.imageUrl,
    }));
  },
});
