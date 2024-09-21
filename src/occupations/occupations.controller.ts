import { Controller, Get, Param, Query} from '@nestjs/common';
import { OccupationsService } from './occupations.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('occupations')
@Controller('occupations')
export class OccupationsController {
  constructor(private readonly occupationsService: OccupationsService) {}

  @Get()
  findAll() {
    return this.occupationsService.findAll();
  }

  // @Get('tasks')
  // async getTasksByOccupation(@Query('occupation') occupationName: string) {
  //   return this.occupationsService.getTasksByOccupation(occupationName);
  // }
  @Get(':id/tasks')
  async getTasksByOccupation(@Param('id') occupationId: number) {
    return this.occupationsService.getAvailableTaskByOccupationId(occupationId);
  }
}
