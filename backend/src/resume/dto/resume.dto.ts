import { IsString, IsOptional, IsArray, IsObject, IsNumber } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateResumeDto {
  @ApiProperty()
  @IsString()
  fullName: string

  @ApiProperty()
  @IsString()
  email: string

  @ApiProperty()
  @IsString()
  phone: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  location?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  summary?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  experiences?: any[]

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  educations?: any[]

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  skills?: any[]

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  projects?: any[]

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  certifications?: any[]

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  languages?: any[]

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  templateId?: string
}

export class UpdateResumeDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  fullName?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  email?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phone?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  location?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  summary?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  experiences?: any[]

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  educations?: any[]

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  skills?: any[]

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  projects?: any[]

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  certifications?: any[]

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  languages?: any[]

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  templateId?: string
}
