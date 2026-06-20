import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type ResumeDocument = Resume & Document

@Schema()
export class Resume {
  @Prop({ required: true })
  userId: number

  @Prop({ required: true })
  fullName: string

  @Prop({ required: true })
  email: string

  @Prop({ required: true })
  phone: string

  @Prop()
  location: string

  @Prop()
  summary: string

  @Prop({ type: [Object] })
  experiences: any[]

  @Prop({ type: [Object] })
  educations: any[]

  @Prop({ type: [Object] })
  skills: any[]

  @Prop({ type: [Object] })
  projects: any[]

  @Prop({ type: [Object] })
  certifications: any[]

  @Prop({ type: [Object] })
  languages: any[]

  @Prop()
  templateId: string

  @Prop()
  createdAt: Date

  @Prop()
  updatedAt: Date
}

export const ResumeSchema = SchemaFactory.createForClass(Resume)
