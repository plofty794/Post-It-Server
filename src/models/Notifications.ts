import NotificationSchema from '@schemas/NotificationSchema';

export default {
  getNotifications: async (userID: string, page: number, limit: number) => {
    try {
      const notifications = await NotificationSchema.find({
        recipient: userID,
      })
        .populate([
          {
            path: 'sender',
            select: 'username profilePicUrl',
          },
          {
            path: 'post',
            select: 'title',
          },
        ])
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: 'desc', upvote: 'asc' })
        .exec();

      if (!notifications.length) {
        throw new Error("You've reached the end.");
      }

      return notifications;
    } catch (error) {
      return error as Error;
    }
  },

  readNotification: async (userID: string, notificationID: string) => {
    try {
      const notificationAlreadyRead = await NotificationSchema.findOne({
        _id: notificationID,
        recipient: userID,
        read: true,
      });

      if (notificationAlreadyRead) {
        throw new Error('Notification already read.');
      }

      const notification = await NotificationSchema.findOneAndUpdate(
        {
          _id: notificationID,
          recipient: userID,
        },
        {
          read: true,
        }
      );

      if (!notification) {
        throw new Error('No notification found.');
      }

      return { message: 'Notification has been read.' };
    } catch (error) {
      return error as Error;
    }
  },
};
