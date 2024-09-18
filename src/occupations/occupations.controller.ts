import { Controller, Get, Param, Query} from '@nestjs/common';
import { OccupationsService } from './occupations.service';


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

  @Get('by-occupation')
  async getTasksByOccupation(@Query('occupation') occupationName: string) {
    return this.occupationsService.getTasksByOccupation(occupationName);
  }

}
