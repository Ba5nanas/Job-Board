import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { UpdateCompanyDto, CreateCompanyMemberDto } from './dto/companies.dto'
import { JobStatus, ApplicationStatus, SubscriptionStatus, CompanyUserRole, PackageType } from '@prisma/client'

@Injectable()
export class CompaniesService {
  constructor(private prisma: PrismaService) {}

  async getCompanyProfile(companyId: number) {
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
      include: {
        owner: {
          include: {
            user: true,
          },
        },
        members: {
          include: {
            user: true,
          },
        },
        jobs: {
          where: {
            status: JobStatus.PUBLISHED,
          },
        },
      },
    })

    if (!company) {
      throw new NotFoundException('Company not found')
    }

    const { password, ...result } = company
    return result
  }

  async updateCompanyProfile(companyId: number, updateCompanyDto: UpdateCompanyDto) {
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
    })

    if (!company) {
      throw new NotFoundException('Company not found')
    }

    return this.prisma.company.update({
      where: { id: companyId },
      data: updateCompanyDto,
    })
  }

  async getCompanyPackage(companyId: number) {
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
      select: {
        id: true,
        name: true,
        packageType: true,
        maxJobs: true,
        currentJobs: true,
        subscriptionStatus: true,
      },
    })

    if (!company) {
      throw new NotFoundException('Company not found')
    }

    return {
      ...company,
      remainingJobs: Math.max(0, company.maxJobs - company.currentJobs),
    }
  }

  async updateCompanyPackage(companyId: number, packageType: string) {
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
    })

    if (!company) {
      throw new NotFoundException('Company not found')
    }

    const packageConfig = await this.prisma.package.findFirst({
      where: {
        type: packageType as PackageType,
        isActive: true,
      },
    })

    if (!packageConfig) {
      throw new BadRequestException('Invalid package type')
    }

    return this.prisma.company.update({
      where: { id: companyId },
      data: {
        packageType: packageType as PackageType,
        maxJobs: packageConfig.jobLimit,
        subscriptionStatus: SubscriptionStatus.ACTIVE,
      },
    })
  }

  async getCompanyStats(companyId: number) {
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
    })

    if (!company) {
      throw new NotFoundException('Company not found')
    }

    const [
      totalJobs,
      activeJobs,
      totalApplications,
      pendingApplications,
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
          status: ApplicationStatus.PENDING,
        },
      }),
    ])

    return {
      totalJobs,
      activeJobs,
      totalApplications,
      pendingApplications,
      remainingJobs: Math.max(0, company.maxJobs - company.currentJobs),
      packageType: company.packageType,
    }
  }

  async getCompanyUsage(companyId: number) {
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
      used: company.currentJobs,
      limit: company.maxJobs,
      remaining: Math.max(0, company.maxJobs - company.currentJobs),
      percentage: company.maxJobs > 0 ? (company.currentJobs / company.maxJobs) * 100 : 0,
    }
  }

  async getCompanyMembers(companyId: number) {
    return this.prisma.companyMember.findMany({
      where: { companyId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    })
  }

  async addCompanyMember(companyId: number, createMemberDto: CreateCompanyMemberDto) {
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
    })

    if (!company) {
      throw new NotFoundException('Company not found')
    }

    const existingMember = await this.prisma.companyMember.findFirst({
      where: {
        companyId,
        userId: createMemberDto.userId,
      },
    })

    if (existingMember) {
      throw new BadRequestException('User is already a member')
    }

    return this.prisma.companyMember.create({
      data: {
        companyId,
        userId: createMemberDto.userId,
        role: createMemberDto.role as CompanyUserRole,
      } as any,
    })
  }

  async updateCompanyMember(companyId: number, memberId: number, data: any) {
    const member = await this.prisma.companyMember.findUnique({
      where: { id: memberId },
    })

    if (!member || member.companyId !== companyId) {
      throw new NotFoundException('Member not found')
    }

    return this.prisma.companyMember.update({
      where: { id: memberId },
      data,
    })
  }

  async removeCompanyMember(companyId: number, memberId: number) {
    const member = await this.prisma.companyMember.findUnique({
      where: { id: memberId },
    })

    if (!member || member.companyId !== companyId) {
      throw new NotFoundException('Member not found')
    }

    if (member.role === CompanyUserRole.OWNER) {
      throw new BadRequestException('Cannot remove owner')
    }

    return this.prisma.companyMember.delete({
      where: { id: memberId },
    })
  }

  async getPublicCompanyProfile(slug: string) {
    const company = await this.prisma.company.findUnique({
      where: { slug },
      select: {
        id: true,
        name: true,
        slug: true,
        about: true,
        industry: true,
        location: true,
        logo: true,
        coverImage: true,
        website: true,
        socials: true,
        isVerified: true,
        jobs: {
          where: {
            status: JobStatus.PUBLISHED,
          },
          select: {
            id: true,
            title: true,
            location: true,
            salaryMin: true,
            salaryMax: true,
            salaryCurrency: true,
            jobType: true,
            createdAt: true,
          },
        },
      },
    })

    if (!company) {
      throw new NotFoundException('Company not found')
    }

    return company
  }

  async getCompanyJobs(slug: string) {
    const company = await this.prisma.company.findUnique({
      where: { slug },
    })

    if (!company) {
      throw new NotFoundException('Company not found')
    }

    return this.prisma.job.findMany({
      where: {
        companyId: company.id,
        status: JobStatus.PUBLISHED,
      },
      include: {
        category: true,
      },
    })
  }
}
