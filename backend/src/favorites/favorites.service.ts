import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Favorite } from '../entities/favorite.entity'

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private favoritesRepository: Repository<Favorite>,
  ) {}

  async findAll(): Promise<Favorite[]> {
    return this.favoritesRepository.find({ order: { createdAt: 'DESC' } })
  }

  async findOne(id: number): Promise<Favorite | undefined> {
    return this.favoritesRepository.findOne({ where: { id } })
  }

  async create(createFavoriteDto: Partial<Favorite>): Promise<Favorite> {
    const favorite = this.favoritesRepository.create(createFavoriteDto)
    return this.favoritesRepository.save(favorite)
  }

  async update(id: number, updateFavoriteDto: Partial<Favorite>): Promise<Favorite | undefined> {
    await this.favoritesRepository.update(id, updateFavoriteDto)
    return this.findOne(id)
  }

  async remove(id: number): Promise<void> {
    await this.favoritesRepository.delete(id)
  }

  async getStats(): Promise<{ total: number; active: number }> {
    const total = await this.favoritesRepository.count()
    const active = await this.favoritesRepository.count({ where: { active: true } })
    return { total, active }
  }
}
