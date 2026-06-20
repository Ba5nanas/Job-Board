import { IsString, IsOptional, IsNumber, IsEnum, IsArray, IsObject } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateCompanyDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  about?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  industry?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  location?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  website?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  logo?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  coverImage?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  socialLinks?: {
    linkedin?: string
    facebook?: string
    twitter?: string
    instagram?: string
  }
}

export class CreateCompanyMemberDto {
  @ApiProperty()
  @IsNumber()
  userId: number

  @ApiProperty()
  @IsString()
  role: string
}
