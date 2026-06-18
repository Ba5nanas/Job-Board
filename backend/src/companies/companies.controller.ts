import { Controller, Get, Post, Body, Delete, Param } from '@nestjs/common';
import { CompaniesService } from './companies.service';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get()
  findAll() {
    return this.companiesService.findAll();
  }

  @Post()
  create(@Body() companyData: any) {
    return this.companiesService.create(companyData);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.companiesService.remove(id);
  }
}
