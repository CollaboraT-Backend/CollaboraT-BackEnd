import { Global, Module } from '@nestjs/common';
import { PrismaService} from './prisma-service.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService], 
})
export class PrismaServiceModule {}
