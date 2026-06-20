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
import { CompaniesService } from './companies.service'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { RolesGuard } from '../common/guards/roles.guard'
import { Roles } from '../common/decorators/roles.decorator'
import { UpdateCompanyDto, CreateCompanyMemberDto } from './dto/companies.dto'
import { ApiTags, ApiOperation } from '@nestjs/swagger'

@ApiTags('Companies')
@UseGuards(JwtAuthGuard)
@Controller('companies')
export class CompaniesController {
  constructor(private companiesService: CompaniesService) {}

  @Get('my-profile')
  @Roles('company')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get company profile' })
  async getProfile(@Request() req) {
    return this.companiesService.getCompanyProfile(req.user.companyId)
  }

  @Put('my-profile')
  @Roles('company')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Update company profile' })
  async updateProfile(@Request() req, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companiesService.updateCompanyProfile(req.user.companyId, updateCompanyDto)
  }

  @Get('my-package')
  @Roles('company')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get company package' })
  async getPackage(@Request() req) {
    return this.companiesService.getCompanyPackage(req.user.companyId)
  }

  @Put('my-package')
  @Roles('company')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Update company package' })
  async updatePackage(@Request() req, @Body('packageType') packageType: string) {
    return this.companiesService.updateCompanyPackage(req.user.companyId, packageType)
  }

  @Get('my-stats')
  @Roles('company')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get company statistics' })
  async getStats(@Request() req) {
    return this.companiesService.getCompanyStats(req.user.companyId)
  }

  @Get('my-usage')
  @Roles('company')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get company usage stats' })
  async getUsage(@Request() req) {
    return this.companiesService.getCompanyUsage(req.user.companyId)
  }

  @Get('members')
  @Roles('company')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'List company members' })
  async getMembers(@Request() req) {
    return this.companiesService.getCompanyMembers(req.user.companyId)
  }

  @Post('members')
  @Roles('company')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Add company member' })
  async addMember(@Request() req, @Body() createMemberDto: CreateCompanyMemberDto) {
    return this.companiesService.addCompanyMember(req.user.companyId, createMemberDto)
  }

  @Put('members/:id')
  @Roles('company')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Update company member' })
  async updateMember(@Request() req, @Param('id') id: number, @Body() data: any) {
    return this.companiesService.updateCompanyMember(req.user.companyId, id, data)
  }

  @Delete('members/:id')
  @Roles('company')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Remove company member' })
  async removeMember(@Request() req, @Param('id') id: number) {
    return this.companiesService.removeCompanyMember(req.user.companyId, id)
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get public company profile' })
  async getPublicProfile(@Param('slug') slug: string) {
    return this.companiesService.getPublicCompanyProfile(slug)
  }

  @Get(':slug/jobs')
  @ApiOperation({ summary: 'Get company jobs' })
  async getCompanyJobs(@Param('slug') slug: string) {
    return this.companiesService.getCompanyJobs(slug)
  }
}
