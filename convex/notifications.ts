import { query } from "./_generated/server";
import { getAuthenticatedUser } from "./users";

export const getNotifications = query({
  handler: async (ctx) => {
    const currentUser = await getAuthenticatedUser(ctx);
    const notifications = await ctx.db
      .query("notifications")
      .withIndex("byRecieverId", (q) => q.eq("recieverId", currentUser._id))
      .order("desc")
      .collect();

    const notificationsWithInfo = await Promise.all(
      notifications.map(async (notification) => {
        const sender = (await ctx.db.get(notification.senderId))!;
        let post = null;
        let comment = null;

        if (notification.postId) {
          post = await ctx.db.get(notification.postId);
        }
        if (notification.type === "comment" && notification.commentsId) {
          comment = await ctx.db.get(notification.commentsId);
        }

        return {
          ...notification,
          sender: {
            _id: sender._id,
            username: sender.username,
            fullname: sender.fullname,
            image: sender.image,
          },
          post,
          comment: comment?.content,
        };
      })
    );
    return notificationsWithInfo;
  },
});
