import CommentSchema from '@schemas/CommentSchema';
import NotificationSchema from '@schemas/NotificationSchema';
import PostSchema from '@schemas/PostSchema';
import { eventEmitter } from '@utils/events/events';

export default {
  getComment: async (commentID: string) => {
    try {
      const comment = await CommentSchema.findById(commentID)
        .populate([
          {
            path: 'parentComment',
            populate: {
              path: 'author',
              select: 'username profilePicUrl',
            },
          },
          {
            path: 'author',
            select: 'username profilePicUrl',
          },
          {
            path: 'post',
            populate: {
              path: 'author',
              select: 'username profilePicUrl',
            },
          },
        ])
        .exec();

      if (!comment) {
        throw new Error('No comment found.');
      }

      return comment;
    } catch (error) {
      return error as Error;
    }
  },

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

  getYourComments: async (userID: string, page: number, limit: number) => {
    try {
      const yourComments = await CommentSchema.find({
        author: userID,
      })
        .populate([
          {
            path: 'author',
            select: 'username profilePicUrl',
          },
          {
            path: 'post',
            select: 'title author',
            populate: 'author',
          },
        ])
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: 'desc', upvote: 'asc' })
        .exec();

      if (!yourComments.length) {
        throw new Error("You've reached the end.");
      }

      return yourComments;
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

  updateCommentUpvotes: async (commentID: string, upvotedBy: string) => {
    try {
      const comment = await CommentSchema.findById(commentID);

      if (!comment) {
        throw new Error("Error up voting comment. Either upvote is currently zero or comment doesn't exist.");
      }

      const upvoteExist = await CommentSchema.findOne({
        _id: commentID,
        upvotes: {
          $in: [upvotedBy],
        },
      });

      if (upvoteExist) {
        await comment.updateOne({
          $pull: {
            upvotes: upvotedBy,
          },
          $inc: {
            upvoteCount: -1,
          },
        });

        return { message: 'Comment upvote updated.' };
      }

      const downvoteExist = await CommentSchema.findOne({
        _id: commentID,
        downvotes: {
          $in: [upvotedBy],
        },
      });

      if (downvoteExist) {
        await comment.updateOne({
          $pull: {
            downvotes: upvotedBy,
          },
          $inc: {
            upvoteCount: 1,
          },
          $push: {
            upvotes: upvotedBy,
          },
        });
        return { message: 'Comment upvote updated.' };
      }

      await comment.updateOne({
        $push: {
          upvotes: upvotedBy,
        },
        $inc: {
          upvoteCount: 1,
        },
      });

      return { message: 'Comment upvote updated.' };
    } catch (error) {
      return error as Error;
    }
  },

  updateCommentDownvotes: async (commentID: string, downvotedBy: string) => {
    try {
      const comment = await CommentSchema.findById(commentID);

      if (!comment) {
        throw new Error("Error down voting comment. Either upvote is currently zero or comment doesn't exist.");
      }

      const downvoteExist = await CommentSchema.findOne({
        _id: commentID,
        downvotes: {
          $in: [downvotedBy],
        },
      });

      if (downvoteExist) {
        await comment.updateOne({
          $pull: {
            downvotes: downvotedBy,
          },
          $inc: {
            upvoteCount: 1,
          },
        });

        return { message: 'Comment downvote updated.' };
      }

      const upvoteExist = await CommentSchema.findOne({
        _id: commentID,
        upvotes: {
          $in: [downvotedBy],
        },
      });

      if (upvoteExist) {
        await comment.updateOne({
          $pull: {
            upvotes: downvotedBy,
          },
          $inc: {
            upvoteCount: -1,
          },
          $push: {
            downvotes: downvotedBy,
          },
        });
        return { message: 'Comment downvote updated.' };
      }

      await comment.updateOne({
        $pull: {
          upvotes: downvotedBy,
        },
        $inc: {
          upvoteCount: -1,
        },
        $push: {
          downvotes: downvotedBy,
        },
      });

      return { message: 'Comment downvote updated.' };
    } catch (error) {
      return error as Error;
    }
  },

  editComment: async (commentID: string, content: string) => {
    try {
      const editedComment = await CommentSchema.findByIdAndUpdate(commentID, {
        content,
      });

      if (!editedComment) {
        throw new Error('Comment not found.');
      }

      return { message: 'Comment has been edited.' };
    } catch (error) {
      return error as Error;
    }
  },

  deleteComment: async (commentID: string) => {
    try {
      const comment = await CommentSchema.findByIdAndDelete(commentID);

      if (!comment) {
        throw new Error('Comment not found.');
      }

      return { message: 'Comment has been deleted.' };
    } catch (error) {
      return error as Error;
    }
  },
};
