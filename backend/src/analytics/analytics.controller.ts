import {
  Controller,
  Get,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common'
import { AnalyticsService } from './analytics.service'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { RolesGuard } from '../common/guards/roles.guard'
import { Roles } from '../common/decorators/roles.decorator'
import { ApiTags, ApiOperation } from '@nestjs/swagger'

@ApiTags('Analytics')
@UseGuards(JwtAuthGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get('dashboard')
  @Roles('company')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get company analytics dashboard' })
  async getDashboard(@Request() req, @Query('period') period: string = 'monthly') {
    return this.analyticsService.getCompanyDashboard(req.user.companyId, period)
  }

  @Get('applications')
  @Roles('company')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get application analytics' })
  async getApplicationAnalytics(@Request() req, @Query('period') period: string = 'monthly') {
    return this.analyticsService.getApplicationAnalytics(req.user.companyId, period)
  }

  @Get('jobs')
  @Roles('company')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get job analytics' })
  async getJobAnalytics(@Request() req, @Query('period') period: string = 'monthly') {
    return this.analyticsService.getJobAnalytics(req.user.companyId, period)
  }
}
