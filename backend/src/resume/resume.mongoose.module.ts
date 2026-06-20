import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Resume, ResumeSchema } from './schemas/resume.schema'
import { ResumeService } from './resume.service'
import { ResumeController } from './resume.controller'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Resume.name, schema: ResumeSchema }]),
  ],
  controllers: [ResumeController],
  providers: [ResumeService],
  exports: [ResumeService],
})
export class ResumeMongooseModule {}
