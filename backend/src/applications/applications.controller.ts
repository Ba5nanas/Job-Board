import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common'
import { ApplicationsService } from './applications.service'

@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Get()
  findAll() {
    return this.applicationsService.findAll()
  }

  @Get('stats')
  getStats() {
    return this.applicationsService.getStats()
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.applicationsService.findOne(id)
  }

  @Post()
  create(@Body() createApplicationDto: any) {
    return this.applicationsService.create(createApplicationDto)
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateApplicationDto: any) {
    return this.applicationsService.update(id, updateApplicationDto)
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.applicationsService.remove(id)
  }
}
