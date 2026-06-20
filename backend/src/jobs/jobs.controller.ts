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
import { JobsService } from './jobs.service'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { RolesGuard } from '../common/guards/roles.guard'
import { Roles } from '../common/decorators/roles.decorator'
import { CreateJobDto, UpdateJobDto } from './dto/jobs.dto'
import { ApiTags, ApiOperation } from '@nestjs/swagger'

@ApiTags('Jobs')
@UseGuards(JwtAuthGuard)
@Controller('jobs')
export class JobsController {
  constructor(private jobsService: JobsService) {}

  @Get()
  @ApiOperation({ summary: 'List all jobs' })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('search') search?: string,
    @Query('location') location?: string,
    @Query('type') type?: string,
    @Query('remote') remote?: boolean,
  ) {
    return this.jobsService.findAll({
      page,
      limit,
      search,
      location,
      type,
      remote,
    })
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get job by ID' })
  async findOne(@Param('id') id: number) {
    return this.jobsService.findOne(id)
  }

  @Post()
  @Roles('company')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Create job (Company)' })
  async create(@Request() req, @Body() createJobDto: CreateJobDto) {
    return this.jobsService.create(req.user.companyId, createJobDto)
  }

  @Put(':id')
  @Roles('company')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Update job (Company)' })
  async update(@Request() req, @Param('id') id: number, @Body() updateJobDto: UpdateJobDto) {
    return this.jobsService.update(req.user.companyId, id, updateJobDto)
  }

  @Delete(':id')
  @Roles('company')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Delete job (Company)' })
  async remove(@Request() req, @Param('id') id: number) {
    return this.jobsService.remove(req.user.companyId, id)
  }

  @Post(':id/publish')
  @Roles('company')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Publish job (Company)' })
  async publish(@Request() req, @Param('id') id: number) {
    return this.jobsService.publish(req.user.companyId, id)
  }

  @Post(':id/draft')
  @Roles('company')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Set job to draft (Company)' })
  async draft(@Request() req, @Param('id') id: number) {
    return this.jobsService.draft(req.user.companyId, id)
  }

  @Get('my-jobs')
  @Roles('company')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get company jobs' })
  async getMyJobs(@Request() req) {
    return this.jobsService.getCompanyJobs(req.user.companyId)
  }

  @Get('can-create')
  @Roles('company')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Check if can create job' })
  async canCreate(@Request() req) {
    return this.jobsService.checkJobLimit(req.user.companyId)
  }
}
