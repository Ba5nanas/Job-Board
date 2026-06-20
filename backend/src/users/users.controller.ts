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
import { UsersService } from './users.service'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { RolesGuard } from '../common/guards/roles.guard'
import { Roles } from '../common/decorators/roles.decorator'
import { UpdateUserDto, CreateUserDto } from './dto/users.dto'
import { ApiTags, ApiOperation } from '@nestjs/swagger'

@ApiTags('Users')
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  async getProfile(@Request() req) {
    return this.usersService.getProfileById(req.user.userId)
  }

  @Put('me')
  @ApiOperation({ summary: 'Update current user profile' })
  async updateProfile(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateProfile(req.user.userId, updateUserDto)
  }

  @Get()
  @Roles('backoffice')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'List all users (Backoffice)' })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('search') search?: string,
    @Query('type') type?: string,
  ) {
    return this.usersService.findAll({
      page,
      limit,
      search,
      type,
    })
  }

  @Get(':id')
  @Roles('backoffice')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get user by ID (Backoffice)' })
  async findById(@Param('id') id: number) {
    return this.usersService.findById(id)
  }

  @Post()
  @Roles('backoffice')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Create user (Backoffice)' })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto)
  }

  @Put(':id')
  @Roles('backoffice')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Update user (Backoffice)' })
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto)
  }

  @Delete(':id')
  @Roles('backoffice')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Delete user (Backoffice)' })
  async remove(@Param('id') id: number) {
    return this.usersService.remove(id)
  }
}
