import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { FeaturedService } from './featured.service';

@Controller('featured')
export class FeaturedController {
  constructor(private readonly featuredService: FeaturedService) {}

  @Get()
  findAll() {
    return this.featuredService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.featuredService.findOne(id);
  }

  @Post()
  create(@Body() data: any) {
    return this.featuredService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() data: any) {
    return this.featuredService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.featuredService.remove(id);
  }
}
