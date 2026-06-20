import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type NotificationDocument = Notification & Document

@Schema()
export class Notification {
  @Prop({ required: true })
  userId: number

  @Prop({ required: true })
  type: string

  @Prop({ required: true })
  title: string

  @Prop({ required: true })
  message: string

  @Prop({ type: Object })
  data: any

  @Prop({ default: false })
  isRead: boolean

  @Prop()
  readAt: Date

  @Prop({ required: true })
  createdAt: Date
}

export const NotificationSchema = SchemaFactory.createForClass(Notification)
