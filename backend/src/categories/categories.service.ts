import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateCategoryDto, UpdateCategoryDto } from './dto/categories.dto'

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.category.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    })
  }

  async findOne(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    })

    if (!category) {
      throw new NotFoundException('Category not found')
    }

    return category
  }

  async create(createCategoryDto: CreateCategoryDto) {
    return this.prisma.category.create({
      data: {
        ...createCategoryDto,
        slug: createCategoryDto.name.toLowerCase().replace(/\s+/g, '-'),
      },
    })
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    })

    if (!category) {
      throw new NotFoundException('Category not found')
    }

    return this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
    })
  }

  async remove(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    })

    if (!category) {
      throw new NotFoundException('Category not found')
    }

    return this.prisma.category.update({
      where: { id },
      data: { isActive: false },
    })
  }
}
