import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common'
import { ActivityLogsService } from './activity-logs.service'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { RolesGuard } from '../common/guards/roles.guard'
import { Roles } from '../common/decorators/roles.decorator'
import { CreateActivityLogDto } from './dto/activity-logs.dto'
import { ApiTags, ApiOperation } from '@nestjs/swagger'

@ApiTags('Activity Logs')
@UseGuards(JwtAuthGuard)
@Controller('activity-logs')
export class ActivityLogsController {
  constructor(private activityLogsService: ActivityLogsService) {}

  @Post()
  @ApiOperation({ summary: 'Create activity log' })
  async create(@Body() createActivityLogDto: CreateActivityLogDto) {
    return this.activityLogsService.create(createActivityLogDto)
  }

  @Get()
  @Roles('admin', 'super-admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get activity logs' })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('action') action?: string,
    @Query('entity') entity?: string,
    @Query('userId') userId?: number,
  ) {
    return this.activityLogsService.findAll({
      page,
      limit,
      action,
      entity,
      userId,
    })
  }

  @Get('my-activity')
  @ApiOperation({ summary: 'Get user activity logs' })
  async getMyActivity(
    @Request() req,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return this.activityLogsService.getUserActivity(req.user.userId, page, limit)
  }
}
