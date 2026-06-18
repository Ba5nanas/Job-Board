import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { RequirePermission } from '../rbac/rbac.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @RequirePermission('users:view')
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @RequirePermission('users:view')
  findOne(@Param('id') id: number) {
    return this.usersService.findOne(id);
  }

  @Post()
  @RequirePermission('users:create')
  create(@Body() data: any) {
    return this.usersService.create(data);
  }

  @Put(':id')
  @RequirePermission('users:edit')
  update(@Param('id') id: number, @Body() data: any) {
    return this.usersService.update(id, data);
  }

  @Delete(':id')
  @RequirePermission('users:delete')
  remove(@Param('id') id: number) {
    return this.usersService.remove(id);
  }

  @Get(':id/permissions')
  @RequirePermission('users:view')
  getUserPermissions(@Param('id') id: number) {
    return this.usersService.getUserPermissions(id);
  }
}
