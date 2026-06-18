import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm'

@Entity()
export class Favorite {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  userId: number

  @Column()
  jobId: number

  @Column({ default: true })
  active: boolean

  @CreateDateColumn()
  createdAt: Date
}
