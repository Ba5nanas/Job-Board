import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Tag } from '../entities/tag.entity'

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private tagsRepository: Repository<Tag>,
  ) {}

  async findAll(): Promise<Tag[]> {
    return this.tagsRepository.find({ order: { usageCount: 'DESC' } })
  }

  async findOne(id: number): Promise<Tag | undefined> {
    return this.tagsRepository.findOne({ where: { id } })
  }

  async create(createTagDto: Partial<Tag>): Promise<Tag> {
    const tag = this.tagsRepository.create(createTagDto)
    return this.tagsRepository.save(tag)
  }

  async update(id: number, updateTagDto: Partial<Tag>): Promise<Tag | undefined> {
    await this.tagsRepository.update(id, updateTagDto)
    return this.findOne(id)
  }

  async remove(id: number): Promise<void> {
    await this.tagsRepository.delete(id)
  }
}
