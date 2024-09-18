import { Module } from '@nestjs/common';
import { CollaboratorsService } from './collaborators.service';
import { CollaboratorsController } from './collaborators.controller';
import { FilesModule } from 'src/files/files.module';
import { OccupationsModule } from 'src/occupations/occupations.module';

@Module({
  imports: [FilesModule, OccupationsModule],
  controllers: [CollaboratorsController],
  providers: [CollaboratorsService],
  exports: [CollaboratorsService],
})
export class CollaboratorsModule {}
