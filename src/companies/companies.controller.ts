import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';

import { UpdatePasswordCompanyDto } from './dto/update-password-company.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';

@ApiTags('companies')
@UseGuards(JwtAuthGuard)
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companyService: CompaniesService) {}
  @Get('/:id')
  findAll(@Param('id') id: string) {
    return this.companyService.findOne(id);
  }

  @Patch('password/:id')
  update(
    @Param('id') id: string,
    @Body() updatePasswordCompanyDto: UpdatePasswordCompanyDto,
  ) {
    return this.companyService.updatePassword(id, updatePasswordCompanyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.companyService.remove(id);
    
  }
}
