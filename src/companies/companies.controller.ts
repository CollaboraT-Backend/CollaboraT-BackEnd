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
import { UpdatePasswordDto } from '../common/dtos/update-password.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { PasswordComparisonPipe } from 'src/common/pipes/password-comparison.pipe';

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
  updateCompanyPassword(
    @Param('id') id: string,
    @Body(new PasswordComparisonPipe())
    updatePasswordCompanyDto: UpdatePasswordDto,
  ) {
    return this.companyService.updateCompanyPassword(
      id,
      updatePasswordCompanyDto,
      'company',
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.companyService.remove(id);
  }
}
