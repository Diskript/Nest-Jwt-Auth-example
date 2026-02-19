import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaModuleModule } from './prisma-module/prisma-module.module';

@Module({
  imports: [PrismaModule, PrismaModuleModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
