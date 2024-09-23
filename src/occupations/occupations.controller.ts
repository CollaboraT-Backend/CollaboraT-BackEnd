import { Body, Controller, Get, Param, Post, Query} from '@nestjs/common';
import { OccupationsService } from './occupations.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateOccupationDto } from './dto/create-occupation.dto';

@ApiTags('occupations')
@Controller('occupations')
export class OccupationsController {
  constructor(private readonly occupationsService: OccupationsService) {}
  
  @Post()
  async create(@Body() createOccupationDto: CreateOccupationDto) {
    return await this.occupationsService.create(createOccupationDto);
  }
  
  @Get()
  findAll() {
    return this.occupationsService.findAll();
  }

  @Get('tasks')
  async getTasksByOccupation(
    @Query('occupation') occupationId: number,
    @Query('projectId') projectId: string) {
    return this.occupationsService.getAvailableTaskByOccupationId(occupationId,projectId);
  }

  // @Get(':id/tasks')
  // async getTasksByOccupation(@Param('id') occupationId: number) {
  //   return this.occupationsService.getAvailableTaskByOccupationId(occupationId);
  // }
}
