import { IsString, IsOptional, IsEnum } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateApplicationDto {
  @ApiProperty()
  @IsString()
  status: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string
}
