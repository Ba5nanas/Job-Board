import { Injectable, UnauthorizedException, NotFoundException, BadRequestException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import * as bcrypt from 'bcrypt'
import { PrismaService } from '../prisma/prisma.service'

export interface JwtPayload {
  sub: number
  email: string
  userType: string
  role?: string
  companyId?: number
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    })

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user
      return result
    }

    return null
  }

  async validateBackofficeUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.backofficeUser.findUnique({
      where: { email },
    })

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user
      return result
    }

    return null
  }

  async validateCompany(email: string, password: string): Promise<any> {
    const company = await this.prisma.company.findUnique({
      where: { email },
    })

    if (company && (await bcrypt.compare(password, company.password))) {
      const { password, ...result } = company
      return result
    }

    return null
  }

  async login(user: any) {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      userType: user.userType,
    }

    const refreshToken = await this.generateRefreshToken(payload)

    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        userType: user.userType,
        status: user.status,
        avatar: user.avatar,
      },
    }
  }

  async loginBackoffice(user: any) {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      userType: 'backoffice',
      role: user.role,
    }

    const refreshToken = await this.generateRefreshToken(payload)

    await this.prisma.backofficeUser.update({
      where: { id: user.id },
      data: {
        lastLogin: new Date(),
        loginCount: { increment: 1 },
      },
    })

    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: refreshToken,
      user: {
        id: user.id,
        displayName: user.displayName,
        email: user.email,
        role: user.role,
        status: user.status,
        avatar: user.avatar,
        permissions: user.permissions,
      },
    }
  }

  async loginCompany(company: any) {
    const payload: JwtPayload = {
      sub: company.id,
      email: company.email,
      userType: 'company',
      companyId: company.id,
    }

    const refreshToken = await this.generateRefreshToken(payload)

    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: refreshToken,
      company: {
        id: company.id,
        name: company.name,
        email: company.email,
        status: company.status,
        logo: company.logo,
        packageType: company.packageType,
        maxJobs: company.maxJobs,
        currentJobs: company.currentJobs,
      },
    }
  }

  async registerJobSeeker(data: { name: string; email: string; password: string }) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    })

    if (existingUser) {
      throw new BadRequestException('Email already registered')
    }

    const hashedPassword = await bcrypt.hash(data.password, 10)

    const user = await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        userType: 'job-seeker',
      },
    })

    await this.prisma.jobSeekerProfile.create({
      data: {
        userId: user.id,
      },
    })

    const { password, ...result } = user
    return result
  }

  async registerEmployer(data: {
    name: string
    email: string
    password: string
    companyName: string
    companyDescription: string
    companyIndustry: string
    companyLocation: string
  }) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    })

    if (existingUser) {
      throw new BadRequestException('Email already registered')
    }

    const hashedPassword = await bcrypt.hash(data.password, 10)
    const slug = data.companyName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

    const company = await this.prisma.company.create({
      data: {
        name: data.companyName,
        slug,
        email: data.email,
        password: hashedPassword,
        about: data.companyDescription,
        industry: data.companyIndustry,
        location: data.companyLocation,
        status: 'PENDING',
        isVerified: false,
        packageType: 'FREE',
        subscriptionStatus: 'INACTIVE',
        maxJobs: 3,
        currentJobs: 0,
      },
    })

    const user = await this.prisma.user.create({
      data: {
        name: data.name,
        email: `${data.email}`,
        password: hashedPassword,
        userType: 'employer',
      },
    })

    await this.prisma.companyOwner.create({
      data: {
        userId: user.id,
        companyId: company.id,
      },
    })

    const { password, ...result } = user
    return { user: result, company }
  }

  async refreshToken(token: string) {
    const storedToken = await this.prisma.refreshToken.findUnique({
      where: { token },
    })

    if (!storedToken || storedToken.revoked || storedToken.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token')
    }

    const payload = {
      sub: storedToken.userId,
      email: 'refresh',
    }

    return {
      access_token: this.jwtService.sign(payload),
    }
  }

  async logout(token: string) {
    await this.prisma.refreshToken.updateMany({
      where: { token },
      data: { revoked: true },
    })

    return { message: 'Logged out successfully' }
  }

  private async generateRefreshToken(payload: JwtPayload) {
    const refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET')
    const refreshToken = this.jwtService.sign(payload, {
      secret: refreshSecret,
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d'),
    })

    await this.prisma.refreshToken.create({
      data: {
        userId: payload.sub,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    })

    return refreshToken
  }
}
