import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { UpdateUserDto, CreateUserDto } from './dto/users.dto'

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfileById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        jobSeekerProfile: {
          include: {
            experiences: true,
            educations: true,
            skills: true,
            portfolios: true,
          },
        },
        companyOwner: {
          include: {
            company: true,
          },
        },
      },
    })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    const { password, ...result } = user
    return result
  }

  async updateProfile(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    })
  }

  async findAll(params: {
    page?: number
    limit?: number
    search?: string
    type?: string
  }) {
    const { page = 1, limit = 20, search, type } = params
    const skip = (page - 1) * limit
    const take = limit

    const where: any = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (type) {
      where.userType = type
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          userType: true,
          status: true,
          avatar: true,
          createdAt: true,
        },
      }),
      this.prisma.user.count({ where }),
    ])

    return {
      data: users,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  async findById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        jobSeekerProfile: true,
        companyOwner: true,
        applications: true,
      },
    })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    const { password, ...result } = user
    return result
  }

  async create(createUserDto: CreateUserDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    })

    if (existing) {
      throw new BadRequestException('Email already exists')
    }

    const user = await this.prisma.user.create({
      data: createUserDto,
    })

    const { password, ...result } = user
    return result
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    })
  }

  async remove(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    return this.prisma.user.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        status: 'INACTIVE',
      },
    })
  }
}
