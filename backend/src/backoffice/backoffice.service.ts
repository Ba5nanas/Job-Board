import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CompanyStatus, JobStatus, ApplicationStatus, UserStatus, PackageType } from '@prisma/client'

@Injectable()
export class BackofficeService {
  constructor(private prisma: PrismaService) {}

  async getDashboard() {
    const [
      totalUsers,
      totalCompanies,
      totalJobs,
      totalApplications,
      activeJobs,
      pendingCompanies,
      revenue,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.company.count(),
      this.prisma.job.count(),
      this.prisma.application.count(),
      this.prisma.job.count({ where: { status: JobStatus.PUBLISHED } }),
      this.prisma.company.count({ where: { status: CompanyStatus.PENDING } }),
      this.prisma.package.aggregate({
        _sum: {
          pricePerMonth: true,
        },
      }),
    ])

    return {
      totalUsers,
      totalCompanies,
      totalJobs,
      totalApplications,
      activeJobs,
      pendingCompanies,
      totalRevenue: revenue._sum.pricePerMonth || 0,
    }
  }

  async getUsers(params: {
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

  async getUser(id: number) {
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
        applications: true,
      },
    })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    const { password, ...result } = user
    return result
  }

  async updateUser(id: number, data: any) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    return this.prisma.user.update({
      where: { id },
      data,
    })
  }

  async deleteUser(id: number) {
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
        status: UserStatus.INACTIVE,
      },
    })
  }

  async getCompanies(params: {
    page?: number
    limit?: number
    search?: string
    status?: string
  }) {
    const { page = 1, limit = 20, search, status } = params
    const skip = (page - 1) * limit
    const take = limit

    const where: any = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { industry: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (status) {
      where.status = status
    }

    const [companies, total] = await Promise.all([
      this.prisma.company.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          status: true,
          isVerified: true,
          packageType: true,
          maxJobs: true,
          currentJobs: true,
          industry: true,
          location: true,
          createdAt: true,
        },
      }),
      this.prisma.company.count({ where }),
    ])

    return {
      data: companies,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  async getCompany(id: number) {
    const company = await this.prisma.company.findUnique({
      where: { id },
      include: {
        owner: {
          include: {
            user: true,
          },
        },
        members: true,
        jobs: true,
      },
    })

    if (!company) {
      throw new NotFoundException('Company not found')
    }

    const { password, ...result } = company
    return result
  }

  async approveCompany(id: number) {
    const company = await this.prisma.company.findUnique({
      where: { id },
    })

    if (!company) {
      throw new NotFoundException('Company not found')
    }

    return this.prisma.company.update({
      where: { id },
      data: {
        status: CompanyStatus.ACTIVE,
        isVerified: true,
      },
    })
  }

  async rejectCompany(id: number, reason: string) {
    const company = await this.prisma.company.findUnique({
      where: { id },
    })

    if (!company) {
      throw new NotFoundException('Company not found')
    }

    return this.prisma.company.update({
      where: { id },
      data: {
        status: CompanyStatus.REJECTED,
        isVerified: false,
      },
    })
  }

  async updateCompanyPackage(id: number, packageType: string, maxJobs: number) {
    const company = await this.prisma.company.findUnique({
      where: { id },
    })

    if (!company) {
      throw new NotFoundException('Company not found')
    }

    return this.prisma.company.update({
      where: { id },
      data: {
        packageType: packageType as PackageType,
        maxJobs,
      },
    })
  }

  async getJobs(params: {
    page?: number
    limit?: number
    search?: string
    status?: string
    companyId?: number
  }) {
    const { page = 1, limit = 20, search, status, companyId } = params
    const skip = (page - 1) * limit
    const take = limit

    const where: any = {}

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (status) {
      where.status = status
    }

    if (companyId) {
      where.companyId = companyId
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
              status: true,
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

  async approveJob(id: number) {
    const job = await this.prisma.job.findUnique({
      where: { id },
    })

    if (!job) {
      throw new NotFoundException('Job not found')
    }

    return this.prisma.job.update({
      where: { id },
      data: {
        status: JobStatus.PUBLISHED,
      },
    })
  }

  async rejectJob(id: number, reason: string) {
    const job = await this.prisma.job.findUnique({
      where: { id },
    })

    if (!job) {
      throw new NotFoundException('Job not found')
    }

    return this.prisma.job.update({
      where: { id },
      data: {
        status: JobStatus.CLOSED,
      },
    })
  }

  async getApplications(params: {
    page?: number
    limit?: number
    status?: string
    companyId?: number
  }) {
    const { page = 1, limit = 20, status, companyId } = params
    const skip = (page - 1) * limit
    const take = limit

    const where: any = {}

    if (status) {
      where.status = status
    }

    if (companyId) {
      where.job = {
        companyId,
      }
    }

    const [applications, total] = await Promise.all([
      this.prisma.application.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          user: true,
          job: {
            include: {
              company: true,
            },
          },
        },
      }),
      this.prisma.application.count({ where }),
    ])

    return {
      data: applications,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  async getPackages() {
    return this.prisma.package.findMany({
      orderBy: { createdAt: 'desc' },
    })
  }

  async createPackage(data: any) {
    return this.prisma.package.create({
      data,
    })
  }

  async updatePackage(id: number, data: any) {
    const pkg = await this.prisma.package.findUnique({
      where: { id },
    })

    if (!pkg) {
      throw new NotFoundException('Package not found')
    }

    return this.prisma.package.update({
      where: { id },
      data,
    })
  }

  async deletePackage(id: number) {
    const pkg = await this.prisma.package.findUnique({
      where: { id },
    })

    if (!pkg) {
      throw new NotFoundException('Package not found')
    }

    return this.prisma.package.update({
      where: { id },
      data: {
        isActive: false,
      },
    })
  }

  async getAnalytics(period: string) {
    const days = period === '7d' ? 7 : period === '30d' ? 30 : 90
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const [
      userGrowth,
      companyGrowth,
      jobGrowth,
      applicationGrowth,
      revenueByPackage,
    ] = await Promise.all([
      this.prisma.user.count({
        where: {
          createdAt: {
            gte: startDate,
          },
        },
      }),
      this.prisma.company.count({
        where: {
          createdAt: {
            gte: startDate,
          },
        },
      }),
      this.prisma.job.count({
        where: {
          createdAt: {
            gte: startDate,
          },
        },
      }),
      this.prisma.application.count({
        where: {
          createdAt: {
            gte: startDate,
          },
        },
      }),
      this.prisma.package.findMany({
        where: {
          isActive: true,
        },
        select: {
          id: true,
          name: true,
          type: true,
          pricePerMonth: true,
          jobLimit: true,
        },
      }),
    ])

    return {
      period,
      userGrowth,
      companyGrowth,
      jobGrowth,
      applicationGrowth,
      packages: revenueByPackage,
    }
  }

  async getLogs(params: {
    page?: number
    limit?: number
    action?: string
    entity?: string
  }) {
    const { page = 1, limit = 20, action, entity } = params
    const skip = (page - 1) * limit
    const take = limit

    const where: any = {}

    if (action) {
      where.action = action
    }

    if (entity) {
      where.entity = entity
    }

    const [logs, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.auditLog.count({ where }),
    ])

    return {
      data: logs,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    }
  }
}
