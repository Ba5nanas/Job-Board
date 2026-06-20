import { Controller, Post, Body, HttpCode, HttpStatus, UnauthorizedException } from '@nestjs/common'
import { AuthService } from './auth.service'
import { Public } from '../common/decorators/public.decorator'
import { LoginDto, RegisterJobSeekerDto, RegisterCompanyDto } from './dto/auth.dto'
import { ApiTags, ApiOperation } from '@nestjs/swagger'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login/job-seeker')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Job Seeker Login' })
  async jobSeekerLogin(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(loginDto.email, loginDto.password)
    if (!user) {
      throw new UnauthorizedException('Invalid credentials')
    }
    return this.authService.login(user)
  }

  @Public()
  @Post('login/company')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Company Login' })
  async companyLogin(@Body() loginDto: LoginDto) {
    const company = await this.authService.validateCompany(loginDto.email, loginDto.password)
    if (!company) {
      throw new UnauthorizedException('Invalid credentials')
    }
    return this.authService.loginCompany(company)
  }

  @Public()
  @Post('login/backoffice')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Backoffice Login' })
  async backofficeLogin(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateBackofficeUser(loginDto.email, loginDto.password)
    if (!user) {
      throw new UnauthorizedException('Invalid credentials')
    }
    return this.authService.loginBackoffice(user)
  }

  @Public()
  @Post('register/job-seeker')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register as Job Seeker' })
  async registerJobSeeker(@Body() registerDto: RegisterJobSeekerDto) {
    return this.authService.registerJobSeeker(registerDto)
  }

  @Public()
  @Post('register/company')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register as Company' })
  async registerCompany(@Body() registerDto: RegisterCompanyDto) {
    return this.authService.registerEmployer(registerDto)
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh Token' })
  async refresh(@Body('refresh_token') token: string) {
    return this.authService.refreshToken(token)
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout' })
  async logout(@Body('refresh_token') token: string) {
    return this.authService.logout(token)
  }
}
