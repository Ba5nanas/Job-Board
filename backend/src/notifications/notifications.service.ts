import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Notification, NotificationDocument } from './schemas/notification.schema'

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
  ) {}

  async create(userId: number, type: string, title: string, message: string, data?: any) {
    const notification = new this.notificationModel({
      userId,
      type,
      title,
      message,
      data,
      createdAt: new Date(),
    })

    return notification.save()
  }

  async getUserNotifications(userId: number, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit
    const take = limit

    const [notifications, total] = await Promise.all([
      this.notificationModel
        .find({ userId })
        .skip(skip)
        .limit(take)
        .sort({ createdAt: -1 }),
      this.notificationModel.countDocuments({ userId }),
    ])

    return {
      data: notifications,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  async getUnreadCount(userId: number) {
    return {
      count: await this.notificationModel.countDocuments({
        userId,
        isRead: false,
      }),
    }
  }

  async markAsRead(userId: number, id: string) {
    return this.notificationModel.updateOne(
      { _id: id, userId },
      { isRead: true, readAt: new Date() },
    )
  }

  async markAllAsRead(userId: number) {
    return this.notificationModel.updateMany(
      { userId, isRead: false },
      { isRead: true, readAt: new Date() },
    )
  }

  async remove(userId: number, id: string) {
    return this.notificationModel.deleteOne({ _id: id, userId })
  }
}
