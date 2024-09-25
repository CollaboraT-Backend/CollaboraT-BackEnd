import { Controller, Get, UseGuards } from '@nestjs/common';
import { OccupationsService } from './occupations.service';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';

@UseGuards(JwtAuthGuard)
@ApiTags('occupations')
@Controller('occupations')
export class OccupationsController {
  constructor(private readonly occupationsService: OccupationsService) {}

  @Get()
  findAll() {
    return this.occupationsService.findAll();
  }
}
