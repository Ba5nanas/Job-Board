import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { UpdateApplicationDto } from './dto/applications.dto'
import { ApplicationStatus } from '@prisma/client'

@Injectable()
export class ApplicationsService {
  constructor(private prisma: PrismaService) {}

  async getUserApplications(userId: number) {
    return this.prisma.application.findMany({
      where: { userId },
      include: {
        job: {
          include: {
            company: {
              select: {
                id: true,
                name: true,
                logo: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  async getCompanyApplications(companyId: number, jobId?: number, status?: string) {
    const where: any = {
      job: {
        companyId,
      },
    }

    if (jobId) {
      where.jobId = jobId
    }

    if (status) {
      where.status = status
    }

    return this.prisma.application.findMany({
      where,
      include: {
        user: {
          include: {
            jobSeekerProfile: {
              include: {
                experiences: true,
                educations: true,
                skills: true,
              },
            },
          },
        },
        job: {
          include: {
            company: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  async apply(userId: number, jobId: number, coverLetter?: string) {
    const job = await this.prisma.job.findUnique({
      where: { id: jobId },
    })

    if (!job) {
      throw new NotFoundException('Job not found')
    }

    const existing = await this.prisma.application.findFirst({
      where: {
        userId,
        jobId,
      },
    })

    if (existing) {
      throw new BadRequestException('Already applied to this job')
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user || user.userType !== 'job-seeker') {
      throw new BadRequestException('Only job seekers can apply')
    }

    return this.prisma.application.create({
      data: {
        userId,
        jobId,
        coverLetter,
        status: ApplicationStatus.PENDING,
      },
    })
  }

  async updateStatus(companyId: number, applicationId: number, updateApplicationDto: UpdateApplicationDto) {
    const application = await this.prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        job: true,
      },
    })

    if (!application || application.job.companyId !== companyId) {
      throw new NotFoundException('Application not found')
    }

    return this.prisma.application.update({
      where: { id: applicationId },
      data: {
        status: updateApplicationDto.status as ApplicationStatus,
        notes: updateApplicationDto.notes,
      },
    })
  }

  async reject(companyId: number, applicationId: number) {
    const application = await this.prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        job: true,
      },
    })

    if (!application || application.job.companyId !== companyId) {
      throw new NotFoundException('Application not found')
    }

    return this.prisma.application.update({
      where: { id: applicationId },
      data: {
        status: ApplicationStatus.REJECTED,
      },
    })
  }
}
