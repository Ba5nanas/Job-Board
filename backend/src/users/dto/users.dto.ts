import { IsString, IsEmail, IsOptional, IsEnum } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateUserDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phone?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  avatar?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  bio?: string

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
  linkedin?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  twitter?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  github?: string
}

export class CreateUserDto {
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
  userType: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phone?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  avatar?: string
}
