import { IsString, IsOptional, IsNumber, IsEnum, IsArray, IsBoolean } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateJobDto {
  @ApiProperty()
  @IsString()
  title: string

  @ApiProperty()
  @IsString()
  description: string

  @ApiProperty()
  @IsString()
  location: string

  @ApiProperty()
  @IsString()
  jobType: string

  @ApiProperty()
  @IsString()
  salaryRange: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  requirements?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  benefits?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  categoryId?: number

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isRemote?: boolean

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  experienceLevel?: number

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  applicationDeadline?: string
}

export class UpdateJobDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  title?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  location?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  jobType?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  salaryRange?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  requirements?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  benefits?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  categoryId?: number

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isRemote?: boolean

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  experienceLevel?: number

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  applicationDeadline?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  status?: string
}
