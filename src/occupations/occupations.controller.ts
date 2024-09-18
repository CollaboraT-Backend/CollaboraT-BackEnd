import { Controller, Get, Query} from '@nestjs/common';
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

  // @Get(':id')
  // async findOne(@Param('id') id: number) {
  //   return await this.occupationsService.findOne(id)
  // }

  @Get('tasks')
  async getTasksByOccupation(@Query('occupation') occupationName: string) {
    return this.occupationsService.getTasksByOccupation(occupationName);
  }

}
