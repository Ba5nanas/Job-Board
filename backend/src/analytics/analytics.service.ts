import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { JobStatus } from '@prisma/client'

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getCompanyDashboard(companyId: number, period: string = 'monthly') {
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
    })

    if (!company) {
      throw new NotFoundException('Company not found')
    }

    const now = new Date()
    let startDate: Date

    switch (period) {
      case 'weekly':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case 'monthly':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case 'yearly':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
        break
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    }

    const [
      totalJobs,
      activeJobs,
      totalApplications,
      newApplications,
      pendingApplications,
      acceptedApplications,
      rejectedApplications,
    ] = await Promise.all([
      this.prisma.job.count({
        where: { companyId: companyId },
      }),
      this.prisma.job.count({
        where: { companyId: companyId, status: JobStatus.PUBLISHED },
      }),
      this.prisma.application.count({
        where: {
          job: {
            companyId: companyId,
          },
        },
      }),
      this.prisma.application.count({
        where: {
          job: {
            companyId: companyId,
          },
          createdAt: {
            gte: startDate,
          },
        },
      }),
      this.prisma.application.count({
        where: {
          job: {
            companyId: companyId,
          },
          status: 'PENDING',
        },
      }),
      this.prisma.application.count({
        where: {
          job: {
            companyId: companyId,
          },
          status: 'ACCEPTED',
        },
      }),
      this.prisma.application.count({
        where: {
          job: {
            companyId: companyId,
          },
          status: 'REJECTED',
        },
      }),
    ])

    return {
      period,
      totalJobs,
      activeJobs,
      totalApplications,
      newApplications,
      pendingApplications,
      acceptedApplications,
      rejectedApplications,
    }
  }

  async getApplicationAnalytics(companyId: number, period: string = 'monthly') {
    const now = new Date()
    let startDate: Date

    switch (period) {
      case 'weekly':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case 'monthly':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case 'yearly':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
        break
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    }

    const applications = await this.prisma.application.findMany({
      where: {
        job: {
          companyId: companyId,
        },
        createdAt: {
          gte: startDate,
        },
      },
      select: {
        status: true,
        createdAt: true,
      },
    })

    const statusCounts = applications.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      period,
      total: applications.length,
      statusBreakdown: statusCounts,
    }
  }

  async getJobAnalytics(companyId: number, period: string = 'monthly') {
    const jobs = await this.prisma.job.findMany({
      where: {
        companyId: companyId,
      },
      select: {
        id: true,
        title: true,
        status: true,
        createdAt: true,
        applications: {
          select: {
            id: true,
            status: true,
          },
        },
      },
    })

    const jobAnalytics = jobs.map((job) => ({
      jobId: job.id,
      title: job.title,
      status: job.status,
      createdAt: job.createdAt,
      totalApplications: job.applications.length,
      applicationStatusBreakdown: job.applications.reduce((acc, app) => {
        acc[app.status] = (acc[app.status] || 0) + 1
        return acc
      }, {} as Record<string, number>),
    }))

    return {
      period,
      totalJobs: jobs.length,
      jobs: jobAnalytics,
    }
  }
}
