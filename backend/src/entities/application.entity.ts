import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm'
import { Job } from './job.entity'

@Entity()
export class Application {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  jobId: number

  @Column()
  applicantName: string

  @Column()
  applicantEmail: string

  @Column({ nullable: true })
  phone: string

  @Column({ type: 'text', nullable: true })
  coverLetter: string

  @Column({ nullable: true })
  resumeUrl: string

  @Column({ default: 'pending' })
  status: 'pending' | 'reviewing' | 'shortlisted' | 'rejected' | 'accepted'

  @Column({ type: 'text', nullable: true })
  notes: string

  @CreateDateColumn()
  appliedAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
