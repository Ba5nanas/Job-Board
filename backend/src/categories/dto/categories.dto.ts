import { IsString, IsOptional, IsBoolean } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateCategoryDto {
  @ApiProperty()
  @IsString()
  name: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  icon?: string
}

export class UpdateCategoryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  icon?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean
}
