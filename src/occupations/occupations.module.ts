import { Module } from '@nestjs/common';
import { OccupationsService } from './occupations.service';
import { OccupationsController } from './occupations.controller';

@Module({
  controllers: [OccupationsController],
  providers: [OccupationsService],
  exports: [OccupationsService], // make the OccupationsService available to other modules
})
export class OccupationsModule {}
