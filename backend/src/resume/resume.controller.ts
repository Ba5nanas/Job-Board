import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common'
import { ResumeService } from './resume.service'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { RolesGuard } from '../common/guards/roles.guard'
import { Roles } from '../common/decorators/roles.decorator'
import { CreateResumeDto, UpdateResumeDto } from './dto/resume.dto'
import { ApiTags, ApiOperation } from '@nestjs/swagger'

@ApiTags('Resume')
@UseGuards(JwtAuthGuard)
@Controller('resume')
export class ResumeController {
  constructor(private resumeService: ResumeService) {}

  @Get()
  @Roles('job-seeker')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get user resume' })
  async getResume(@Request() req) {
    return this.resumeService.getResume(req.user.userId)
  }

  @Post()
  @Roles('job-seeker')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Create resume' })
  async createResume(@Request() req, @Body() createResumeDto: CreateResumeDto) {
    return this.resumeService.createResume(req.user.userId, createResumeDto)
  }

  @Put()
  @Roles('job-seeker')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Update resume' })
  async updateResume(@Request() req, @Body() updateResumeDto: UpdateResumeDto) {
    return this.resumeService.updateResume(req.user.userId, updateResumeDto)
  }

  @Delete()
  @Roles('job-seeker')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Delete resume' })
  async deleteResume(@Request() req) {
    return this.resumeService.deleteResume(req.user.userId)
  }

  @Post('export')
  @Roles('job-seeker')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Export resume as PDF' })
  async exportResume(@Request() req, @Body('templateId') templateId: string) {
    return this.resumeService.exportResume(req.user.userId, templateId)
  }

  @Get('templates')
  @ApiOperation({ summary: 'Get available templates' })
  async getTemplates() {
    return this.resumeService.getTemplates()
  }
}
