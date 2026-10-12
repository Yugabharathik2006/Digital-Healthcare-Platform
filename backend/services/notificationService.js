/**
 * Notification Service Module
 * Handles user notifications and message history.
 */

const { Notification } = require('../models');
const queue = require('../config/queue');

const notificationService = {
  async getNotifications(userId) {
    return await Notification.find({ userId });
  },

  async markAsRead(notificationId) {
    const list = await Notification.find({});
    const found = list.find(n => n._id === notificationId);
    if (found) {
      found.isRead = true;
    }
    return { success: true };
  },

  getQueueStatus() {
    return queue.getStatus();
  }
};

module.exports = notificationService;
