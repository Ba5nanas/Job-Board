import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Resume, ResumeDocument } from './schemas/resume.schema'
import { CreateResumeDto, UpdateResumeDto } from './dto/resume.dto'

@Injectable()
export class ResumeService {
  constructor(
    @InjectModel(Resume.name) private resumeModel: Model<ResumeDocument>,
  ) {}

  async getResume(userId: number) {
    return this.resumeModel.findOne({ userId })
  }

  async createResume(userId: number, createResumeDto: CreateResumeDto) {
    const existing = await this.resumeModel.findOne({ userId })

    if (existing) {
      throw new BadRequestException('Resume already exists. Use update instead.')
    }

    const resume = new this.resumeModel({
      userId,
      ...createResumeDto,
    })

    return resume.save()
  }

  async updateResume(userId: number, updateResumeDto: UpdateResumeDto) {
    const resume = await this.resumeModel.findOne({ userId })

    if (!resume) {
      throw new NotFoundException('Resume not found')
    }

    Object.assign(resume, updateResumeDto)
    return resume.save()
  }

  async deleteResume(userId: number) {
    const resume = await this.resumeModel.findOne({ userId })

    if (!resume) {
      throw new NotFoundException('Resume not found')
    }

    return this.resumeModel.deleteOne({ userId })
  }

  async exportResume(userId: number, templateId: string) {
    const resume = await this.resumeModel.findOne({ userId })

    if (!resume) {
      throw new NotFoundException('Resume not found')
    }

    return {
      message: 'Resume exported successfully',
      templateId,
      data: resume,
    }
  }

  async getTemplates() {
    return [
      {
        id: 'modern',
        name: 'Modern',
        description: 'Clean and modern design',
        preview: '/templates/modern.png',
      },
      {
        id: 'classic',
        name: 'Classic',
        description: 'Traditional professional layout',
        preview: '/templates/classic.png',
      },
      {
        id: 'creative',
        name: 'Creative',
        description: 'Eye-catching creative design',
        preview: '/templates/creative.png',
      },
      {
        id: 'minimal',
        name: 'Minimal',
        description: 'Simple and minimal style',
        preview: '/templates/minimal.png',
      },
    ]
  }
}
