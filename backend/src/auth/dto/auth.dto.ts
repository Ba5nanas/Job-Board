import { IsEmail, IsString, IsOptional, IsEnum } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class LoginDto {
  @ApiProperty()
  @IsEmail()
  email: string

  @ApiProperty()
  @IsString()
  password: string
}

export class RegisterJobSeekerDto {
  @ApiProperty()
  @IsString()
  name: string

  @ApiProperty()
  @IsEmail()
  email: string

  @ApiProperty()
  @IsString()
  password: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phone?: string
}

export class RegisterCompanyDto {
  @ApiProperty()
  @IsString()
  name: string

  @ApiProperty()
  @IsEmail()
  email: string

  @ApiProperty()
  @IsString()
  password: string

  @ApiProperty()
  @IsString()
  companyName: string

  @ApiProperty()
  @IsString()
  companyDescription: string

  @ApiProperty()
  @IsString()
  companyIndustry: string

  @ApiProperty()
  @IsString()
  companyLocation: string
}
