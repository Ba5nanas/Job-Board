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
import { ApplicationsService } from './applications.service'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { RolesGuard } from '../common/guards/roles.guard'
import { Roles } from '../common/decorators/roles.decorator'
import { UpdateApplicationDto } from './dto/applications.dto'
import { ApiTags, ApiOperation } from '@nestjs/swagger'

@ApiTags('Applications')
@UseGuards(JwtAuthGuard)
@Controller('applications')
export class ApplicationsController {
  constructor(private applicationsService: ApplicationsService) {}

  @Get()
  @Roles('job-seeker')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get user applications' })
  async getMyApplications(@Request() req) {
    return this.applicationsService.getUserApplications(req.user.userId)
  }

  @Get('company')
  @Roles('company')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get company applications' })
  async getCompanyApplications(
    @Request() req,
    @Query('jobId') jobId?: number,
    @Query('status') status?: string,
  ) {
    return this.applicationsService.getCompanyApplications(req.user.companyId, jobId, status)
  }

  @Post()
  @Roles('job-seeker')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Apply for job' })
  async apply(@Request() req, @Body('jobId') jobId: number, @Body('coverLetter') coverLetter?: string) {
    return this.applicationsService.apply(req.user.userId, jobId, coverLetter)
  }

  @Put(':id')
  @Roles('company')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Update application status' })
  async updateStatus(@Request() req, @Param('id') id: number, @Body() updateApplicationDto: UpdateApplicationDto) {
    return this.applicationsService.updateStatus(req.user.companyId, id, updateApplicationDto)
  }

  @Delete(':id')
  @Roles('company')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Reject application' })
  async reject(@Request() req, @Param('id') id: number) {
    return this.applicationsService.reject(req.user.companyId, id)
  }
}
