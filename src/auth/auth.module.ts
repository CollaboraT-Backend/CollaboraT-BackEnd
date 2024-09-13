import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { CompaniesModule } from 'src/companies/companies.module';

@Global()
@Module({
  imports: [CompaniesModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
