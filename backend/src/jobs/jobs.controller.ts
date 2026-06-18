import { Controller, Get, Post, Body, Delete, Param } from '@nestjs/common';
import { JobsService } from './jobs.service';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get()
  findAll() {
    return this.jobsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.jobsService.findOne(id);
  }

  @Post()
  create(@Body() jobData: any) {
    return this.jobsService.create(jobData);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.jobsService.remove(id);
  }
}
