import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateJobDto, UpdateJobDto } from './dto/jobs.dto'
import { JobStatus } from '@prisma/client'

@Injectable()
export class JobsService {
  constructor(private prisma: PrismaService) {}

  async findAll(params: {
    page?: number
    limit?: number
    search?: string
    location?: string
    type?: string
    remote?: boolean
  }) {
    const { page = 1, limit = 20, search, location, type, remote } = params
    const skip = (page - 1) * limit
    const take = limit

    const where: any = {
      status: JobStatus.PUBLISHED,
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (location) {
      where.location = {
        contains: location,
        mode: 'insensitive',
      }
    }

    if (type) {
      where.jobType = type
    }

    if (remote !== undefined) {
      where.isRemote = remote
    }

    const [jobs, total] = await Promise.all([
      this.prisma.job.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          company: {
            select: {
              id: true,
              name: true,
              slug: true,
              logo: true,
              location: true,
              isVerified: true,
            },
          },
          category: true,
        },
      }),
      this.prisma.job.count({ where }),
    ])

    return {
      data: jobs,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  async findOne(id: number) {
    const job = await this.prisma.job.findUnique({
      where: { id },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            slug: true,
            logo: true,
            about: true,
            industry: true,
            location: true,
            isVerified: true,
          },
        },
        category: true,
      },
    })

    if (!job) {
      throw new NotFoundException('Job not found')
    }

    return job
  }

  async create(companyId: number, createJobDto: CreateJobDto) {
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
    })

    if (!company) {
      throw new NotFoundException('Company not found')
    }

    if (company.currentJobs >= company.maxJobs) {
      throw new BadRequestException('Job limit reached. Please upgrade your plan.')
    }

    const job = await this.prisma.job.create({
      data: {
        ...createJobDto,
        companyId,
        status: JobStatus.DRAFT,
      } as any,
    })

    await this.prisma.company.update({
      where: { id: companyId },
      data: {
        currentJobs: {
          increment: 1,
        },
      },
    })

    return job
  }

  async update(companyId: number, jobId: number, updateJobDto: UpdateJobDto) {
    const job = await this.prisma.job.findUnique({
      where: { id: jobId },
    })

    if (!job || job.companyId !== companyId) {
      throw new NotFoundException('Job not found')
    }

    return this.prisma.job.update({
      where: { id: jobId },
      data: updateJobDto as any,
    })
  }

  async remove(companyId: number, jobId: number) {
    const job = await this.prisma.job.findUnique({
      where: { id: jobId },
    })

    if (!job || job.companyId !== companyId) {
      throw new NotFoundException('Job not found')
    }

    await this.prisma.job.update({
      where: { id: jobId },
      data: {
        deletedAt: new Date(),
        status: JobStatus.ARCHIVED,
      },
    })

    await this.prisma.company.update({
      where: { id: companyId },
      data: {
        currentJobs: {
          decrement: 1,
        },
      },
    })

    return { message: 'Job deleted successfully' }
  }

  async publish(companyId: number, jobId: number) {
    const job = await this.prisma.job.findUnique({
      where: { id: jobId },
    })

    if (!job || job.companyId !== companyId) {
      throw new NotFoundException('Job not found')
    }

    return this.prisma.job.update({
      where: { id: jobId },
      data: {
        status: JobStatus.PUBLISHED,
      },
    })
  }

  async draft(companyId: number, jobId: number) {
    const job = await this.prisma.job.findUnique({
      where: { id: jobId },
    })

    if (!job || job.companyId !== companyId) {
      throw new NotFoundException('Job not found')
    }

    return this.prisma.job.update({
      where: { id: jobId },
      data: {
        status: JobStatus.DRAFT,
      },
    })
  }

  async getCompanyJobs(companyId: number) {
    return this.prisma.job.findMany({
      where: { companyId },
      include: {
        category: true,
      },
    })
  }

  async checkJobLimit(companyId: number) {
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
      select: {
        id: true,
        name: true,
        packageType: true,
        maxJobs: true,
        currentJobs: true,
      },
    })

    if (!company) {
      throw new NotFoundException('Company not found')
    }

    return {
      canCreate: company.currentJobs < company.maxJobs,
      used: company.currentJobs,
      limit: company.maxJobs,
      remaining: Math.max(0, company.maxJobs - company.currentJobs),
      packageType: company.packageType,
    }
  }
}
