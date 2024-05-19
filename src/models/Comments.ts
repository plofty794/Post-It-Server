import CommentSchema from '@schemas/CommentSchema';
import NotificationSchema from '@schemas/NotificationSchema';
import PostSchema from '@schemas/PostSchema';
import { eventEmitter } from '@utils/events/events';

export default {
  getComments: async (postID: string, page: number, limit: number) => {
    try {
      const comments = await CommentSchema.find({
        post: postID,
      })
        .populate([
          {
            path: 'author',
            select: 'username profilePicUrl',
          },
          {
            path: 'post',
          },
        ])
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: 'desc', upvote: 'asc' })
        .exec();

      if (!comments.length) {
        throw new Error("You've reached the end.");
      }

      return comments;
    } catch (error) {
      return error as Error;
    }
  },

  createComment: async (postID: string, content: string, author: string, commentID?: string) => {
    try {
      const post = await PostSchema.findById(postID);

      if (!post) {
        throw new Error('No post found.');
      }

      const isNotAuthorComment = post.author.toString() !== author;

      if (commentID == null) {
        const newComment = await CommentSchema.create({
          post: postID,
          content,
          author,
        });

        isNotAuthorComment &&
          (await NotificationSchema.create({
            type: 'comment',
            data: newComment._id,
            sender: author,
            recipient: post.author,
            post: postID,
            docModel: 'Comments',
          }));

        isNotAuthorComment && eventEmitter.emit('new-notification', post.author.toString());

        await post.updateOne({
          $push: {
            comments: [newComment._id],
          },
        });

        return { message: 'Comment has been created.' };
      }

      const comment = await CommentSchema.findById(commentID);

      if (!comment) {
        throw new Error('No comment found.');
      }

      const isNotAuthorParentComment = comment.author.toString() !== author;

      const reply = await CommentSchema.create({
        post: postID,
        content,
        author,
        parentComment: comment._id,
      });

      await Promise.all([
        comment.updateOne({
          $push: {
            replies: [reply._id],
          },
        }),
        post.updateOne({
          $push: {
            comments: [reply._id],
          },
        }),
      ]);

      isNotAuthorParentComment &&
        (await NotificationSchema.create({
          type: 'reply',
          data: reply._id,
          sender: author,
          recipient: comment.author,
          post: postID,
          docModel: 'Comments',
        }));

      isNotAuthorParentComment && eventEmitter.emit('new-notification', comment.author.toString());

      return { message: 'Reply has been created.' };
    } catch (error) {
      return error as Error;
    }
  },
};
