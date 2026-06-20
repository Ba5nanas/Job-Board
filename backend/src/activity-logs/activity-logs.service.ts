import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { ActivityLog, ActivityLogDocument } from './schemas/activity-log.schema'
import { CreateActivityLogDto } from './dto/activity-logs.dto'

@Injectable()
export class ActivityLogsService {
  constructor(
    @InjectModel(ActivityLog.name) private activityLogModel: Model<ActivityLogDocument>,
  ) {}

  async create(createActivityLogDto: CreateActivityLogDto) {
    const activityLog = new this.activityLogModel({
      ...createActivityLogDto,
      createdAt: new Date(),
    })

    return activityLog.save()
  }

  async findAll(params: {
    page?: number
    limit?: number
    action?: string
    entity?: string
    userId?: number
  }) {
    const { page = 1, limit = 20, action, entity, userId } = params
    const skip = (page - 1) * limit
    const take = limit

    const query: any = {}

    if (action) {
      query.action = action
    }

    if (entity) {
      query.entity = entity
    }

    if (userId) {
      query.userId = userId
    }

    const [logs, total] = await Promise.all([
      this.activityLogModel
        .find(query)
        .skip(skip)
        .limit(take)
        .sort({ createdAt: -1 }),
      this.activityLogModel.countDocuments(query),
    ])

    return {
      data: logs,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  async getUserActivity(userId: number, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit
    const take = limit

    const [logs, total] = await Promise.all([
      this.activityLogModel
        .find({ userId })
        .skip(skip)
        .limit(take)
        .sort({ createdAt: -1 }),
      this.activityLogModel.countDocuments({ userId }),
    ])

    return {
      data: logs,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    }
  }
}
