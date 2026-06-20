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
} from '@nestjs/common'
import { CategoriesService } from './categories.service'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { RolesGuard } from '../common/guards/roles.guard'
import { Roles } from '../common/decorators/roles.decorator'
import { CreateCategoryDto, UpdateCategoryDto } from './dto/categories.dto'
import { ApiTags, ApiOperation } from '@nestjs/swagger'

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'List all categories' })
  async findAll() {
    return this.categoriesService.findAll()
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category by ID' })
  async findOne(@Param('id') id: number) {
    return this.categoriesService.findOne(id)
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles('admin', 'super-admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Create category' })
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto)
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @Roles('admin', 'super-admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Update category' })
  async update(@Param('id') id: number, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(id, updateCategoryDto)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @Roles('admin', 'super-admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Delete category' })
  async remove(@Param('id') id: number) {
    return this.categoriesService.remove(id)
  }
}
