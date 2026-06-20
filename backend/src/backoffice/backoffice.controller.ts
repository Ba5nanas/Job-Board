import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common'
import { BackofficeService } from './backoffice.service'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { BackofficeGuard } from '../common/guards/backoffice.guard'
import { BackofficeRoles } from '../common/decorators/roles.decorator'
import { ApiTags, ApiOperation } from '@nestjs/swagger'

@ApiTags('Backoffice')
@UseGuards(JwtAuthGuard, BackofficeGuard)
@Controller('backoffice')
export class BackofficeController {
  constructor(private backofficeService: BackofficeService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get dashboard overview' })
  async getDashboard() {
    return this.backofficeService.getDashboard()
  }

  @Get('users')
  @ApiOperation({ summary: 'List all users' })
  async getUsers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('search') search?: string,
    @Query('type') type?: string,
  ) {
    return this.backofficeService.getUsers({ page, limit, search, type })
  }

  @Get('users/:id')
  @ApiOperation({ summary: 'Get user details' })
  async getUser(@Param('id') id: number) {
    return this.backofficeService.getUser(id)
  }

  @Put('users/:id')
  @ApiOperation({ summary: 'Update user' })
  async updateUser(@Param('id') id: number, @Body() data: any) {
    return this.backofficeService.updateUser(id, data)
  }

  @Delete('users/:id')
  @ApiOperation({ summary: 'Delete user' })
  async deleteUser(@Param('id') id: number) {
    return this.backofficeService.deleteUser(id)
  }

  @Get('companies')
  @ApiOperation({ summary: 'List all companies' })
  async getCompanies(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('search') search?: string,
    @Query('status') status?: string,
  ) {
    return this.backofficeService.getCompanies({ page, limit, search, status })
  }

  @Get('companies/:id')
  @ApiOperation({ summary: 'Get company details' })
  async getCompany(@Param('id') id: number) {
    return this.backofficeService.getCompany(id)
  }

  @Post('companies/:id/approve')
  @ApiOperation({ summary: 'Approve company' })
  async approveCompany(@Param('id') id: number) {
    return this.backofficeService.approveCompany(id)
  }

  @Post('companies/:id/reject')
  @ApiOperation({ summary: 'Reject company' })
  async rejectCompany(@Param('id') id: number, @Body('reason') reason: string) {
    return this.backofficeService.rejectCompany(id, reason)
  }

  @Put('companies/:id/package')
  @ApiOperation({ summary: 'Update company package' })
  async updateCompanyPackage(
    @Param('id') id: number,
    @Body('packageType') packageType: string,
    @Body('maxJobs') maxJobs: number,
  ) {
    return this.backofficeService.updateCompanyPackage(id, packageType, maxJobs)
  }

  @Get('jobs')
  @ApiOperation({ summary: 'List all jobs' })
  async getJobs(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('companyId') companyId?: number,
  ) {
    return this.backofficeService.getJobs({ page, limit, search, status, companyId })
  }

  @Post('jobs/:id/approve')
  @ApiOperation({ summary: 'Approve job' })
  async approveJob(@Param('id') id: number) {
    return this.backofficeService.approveJob(id)
  }

  @Post('jobs/:id/reject')
  @ApiOperation({ summary: 'Reject job' })
  async rejectJob(@Param('id') id: number, @Body('reason') reason: string) {
    return this.backofficeService.rejectJob(id, reason)
  }

  @Get('applications')
  @ApiOperation({ summary: 'List all applications' })
  async getApplications(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('status') status?: string,
    @Query('companyId') companyId?: number,
  ) {
    return this.backofficeService.getApplications({ page, limit, status, companyId })
  }

  @Get('packages')
  @ApiOperation({ summary: 'List all packages' })
  async getPackages() {
    return this.backofficeService.getPackages()
  }

  @Post('packages')
  @ApiOperation({ summary: 'Create package' })
  async createPackage(@Body() data: any) {
    return this.backofficeService.createPackage(data)
  }

  @Put('packages/:id')
  @ApiOperation({ summary: 'Update package' })
  async updatePackage(@Param('id') id: number, @Body() data: any) {
    return this.backofficeService.updatePackage(id, data)
  }

  @Delete('packages/:id')
  @ApiOperation({ summary: 'Delete package' })
  async deletePackage(@Param('id') id: number) {
    return this.backofficeService.deletePackage(id)
  }

  @Get('analytics')
  @ApiOperation({ summary: 'Get analytics' })
  async getAnalytics(@Query('period') period: string = '30d') {
    return this.backofficeService.getAnalytics(period)
  }

  @Get('logs')
  @ApiOperation({ summary: 'Get activity logs' })
  async getLogs(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('action') action?: string,
    @Query('entity') entity?: string,
  ) {
    return this.backofficeService.getLogs({ page, limit, action, entity })
  }
}
