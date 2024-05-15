import CommentSchema from '@schemas/CommentSchema';
import PostSchema from '@schemas/PostSchema';

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
          {
            path: 'replies',
            populate: {
              path: 'author',
              select: 'username profilePicUrl',
            },
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

      if (commentID == null) {
        const newComment = await CommentSchema.create({
          post: postID,
          content,
          author,
        });

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

      const reply = await CommentSchema.create({
        post: postID,
        content,
        author,
        parentComment: comment._id,
      });

      await comment.updateOne({
        $push: {
          replies: [reply._id],
        },
      });

      await post.updateOne({
        $push: {
          comments: [reply._id],
        },
      });

      return { message: 'Reply has been created.' };
    } catch (error) {
      return error as Error;
    }
  },
};
