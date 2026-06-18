import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { TestimonialsService } from './testimonials.service';

@Controller('testimonials')
export class TestimonialsController {
  constructor(private readonly testimonialsService: TestimonialsService) {}

  @Get()
  findAll() {
    return this.testimonialsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.testimonialsService.findOne(id);
  }

  @Post()
  create(@Body() data: any) {
    return this.testimonialsService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() data: any) {
    return this.testimonialsService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.testimonialsService.remove(id);
  }
}
