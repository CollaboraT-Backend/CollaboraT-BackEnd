import { Module } from '@nestjs/common';
import { OccupationsService } from './occupations.service';
import { OccupationsController } from './occupations.controller';

@Module({
  controllers: [OccupationsController],
  providers: [OccupationsService],
})
export class OccupationsModule {}
