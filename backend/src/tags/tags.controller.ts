import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common'
import { TagsService } from './tags.service'

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  findAll() {
    return this.tagsService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.tagsService.findOne(id)
  }

  @Post()
  create(@Body() createTagDto: any) {
    return this.tagsService.create(createTagDto)
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateTagDto: any) {
    return this.tagsService.update(id, updateTagDto)
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.tagsService.remove(id)
  }
}
