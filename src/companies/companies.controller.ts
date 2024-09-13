import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';

import { UpdatePasswordCompanyDto } from './dto/update-password-company.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('companies')
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companyService: CompaniesService ) {}

  @Post()
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companyService.create(createCompanyDto);
  }

  @Get()
  findAll() {
    return this.companyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companyService.findOne(id);
  }

  @Patch('password/:id')
  update(@Param('id') id: string, @Body() updatePasswordCompanyDto: UpdatePasswordCompanyDto) {
    return this.companyService.updatePassword(id, updatePasswordCompanyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.companyService.remove(id);
  }
}
