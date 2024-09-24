import { Module, forwardRef } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';
import { AuthModule } from 'src/auth/auth.module';
import { CollaboratorsModule } from 'src/collaborators/collaborators.module';

@Module({
  imports: [forwardRef(() => AuthModule), CollaboratorsModule],
  controllers: [CompaniesController],
  providers: [CompaniesService],
  exports: [CompaniesService], // make the CompaniesService available to other modules
})
export class CompaniesModule {}
