import { IsString, IsOptional, IsNumber, IsObject } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateActivityLogDto {
  @ApiProperty()
  @IsNumber()
  userId: number

  @ApiProperty()
  @IsString()
  action: string

  @ApiProperty()
  @IsString()
  entity: string

  @ApiProperty()
  @IsNumber()
  entityId: number

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  payload?: any

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  ipAddress?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  userAgent?: string
}
