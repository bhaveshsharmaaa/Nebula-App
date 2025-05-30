import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthenticatedUser } from "./users";

export const addComments = mutation({
  args: {
    content: v.string(),
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUser(ctx);

    const post = await ctx.db.get(args.postId);

    if (!post) {
      throw new Error("Post not found");
    }
    if (!currentUser) {
      throw new Error("User not authenticated");
    }

    const commentsId = await ctx.db.insert("comments", {
      userId: currentUser?._id,
      postId: args.postId,
      content: args.content,
    });

    await ctx.db.patch(args.postId, {
      comments: post.comments + 1,
    });

    if (post.userId !== currentUser?._id) {
      await ctx.db.insert("notifications", {
        recieverId: post.userId,
        senderId: currentUser?._id,
        type: "comment",
        postId: args.postId,
        commentsId,
      });
    }
    return commentsId;
  },
});

export const getComments = query({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const comments = await ctx.db
      .query("comments")
      .withIndex("byPostId", (q) => q.eq("postId", args.postId))
      .collect();

    const commentsWithUserInfo = await Promise.all(
      comments.map(async (comment) => {
        const user = await ctx.db.get(comment.userId);
        return {
          ...comment,
          user: {
            username: user?.username,
            fullname: user?.fullname,
            image: user?.image,
            createdAt: comment._creationTime,
          },
        };
      })
    );

    return commentsWithUserInfo;
  },
});
