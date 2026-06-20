import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type ActivityLogDocument = ActivityLog & Document

@Schema()
export class ActivityLog {
  @Prop({ required: true })
  userId: number

  @Prop({ required: true })
  action: string

  @Prop({ required: true })
  entity: string

  @Prop({ required: true })
  entityId: number

  @Prop({ type: Object })
  payload: any

  @Prop()
  ipAddress: string

  @Prop()
  userAgent: string

  @Prop({ required: true })
  createdAt: Date
}

export const ActivityLogSchema = SchemaFactory.createForClass(ActivityLog)
