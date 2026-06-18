import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common'
import { FavoritesService } from './favorites.service'

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  findAll() {
    return this.favoritesService.findAll()
  }

  @Get('stats')
  getStats() {
    return this.favoritesService.getStats()
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.favoritesService.findOne(id)
  }

  @Post()
  create(@Body() createFavoriteDto: any) {
    return this.favoritesService.create(createFavoriteDto)
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateFavoriteDto: any) {
    return this.favoritesService.update(id, updateFavoriteDto)
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.favoritesService.remove(id)
  }
}
