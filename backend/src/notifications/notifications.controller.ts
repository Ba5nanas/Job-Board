import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  UseGuards,
  Request,
  Query,
  Param,
} from '@nestjs/common'
import { NotificationsService } from './notifications.service'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { RolesGuard } from '../common/guards/roles.guard'
import { Roles } from '../common/decorators/roles.decorator'
import { ApiTags, ApiOperation } from '@nestjs/swagger'

@ApiTags('Notifications')
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get user notifications' })
  async findAll(@Request() req, @Query('page') page: number = 1, @Query('limit') limit: number = 20) {
    return this.notificationsService.getUserNotifications(req.user.userId, page, limit)
  }

  @Get('unread')
  @ApiOperation({ summary: 'Get unread notification count' })
  async getUnreadCount(@Request() req) {
    return this.notificationsService.getUnreadCount(req.user.userId)
  }

  @Put(':id/read')
  @ApiOperation({ summary: 'Mark notification as read' })
  async markAsRead(@Request() req, @Param('id') id: string) {
    return this.notificationsService.markAsRead(req.user.userId, id)
  }

  @Put('read-all')
  @ApiOperation({ summary: 'Mark all as read' })
  async markAllAsRead(@Request() req) {
    return this.notificationsService.markAllAsRead(req.user.userId)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete notification' })
  async remove(@Request() req, @Param('id') id: string) {
    return this.notificationsService.remove(req.user.userId, id)
  }
}
