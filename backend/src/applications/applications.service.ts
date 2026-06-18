import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Application } from '../entities/application.entity'

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private applicationsRepository: Repository<Application>,
  ) {}

  async findAll(): Promise<Application[]> {
    return this.applicationsRepository.find({ order: { appliedAt: 'DESC' } })
  }

  async findOne(id: number): Promise<Application | undefined> {
    return this.applicationsRepository.findOne({ where: { id } })
  }

  async create(createApplicationDto: Partial<Application>): Promise<Application> {
    const application = this.applicationsRepository.create(createApplicationDto)
    return this.applicationsRepository.save(application)
  }

  async update(id: number, updateApplicationDto: Partial<Application>): Promise<Application | undefined> {
    await this.applicationsRepository.update(id, updateApplicationDto)
    return this.findOne(id)
  }

  async remove(id: number): Promise<void> {
    await this.applicationsRepository.delete(id)
  }

  async getStats(): Promise<{ total: number; pending: number; reviewing: number; shortlisted: number; rejected: number; accepted: number }> {
    const total = await this.applicationsRepository.count()
    const pending = await this.applicationsRepository.count({ where: { status: 'pending' } })
    const reviewing = await this.applicationsRepository.count({ where: { status: 'reviewing' } })
    const shortlisted = await this.applicationsRepository.count({ where: { status: 'shortlisted' } })
    const rejected = await this.applicationsRepository.count({ where: { status: 'rejected' } })
    const accepted = await this.applicationsRepository.count({ where: { status: 'accepted' } })
    return { total, pending, reviewing, shortlisted, rejected, accepted }
  }
}
