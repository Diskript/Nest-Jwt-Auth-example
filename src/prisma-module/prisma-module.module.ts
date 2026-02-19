import { Module } from "@nestjs/common";
import { PrismaModuleService } from "./prisma-module.service";

@Module({
  providers: [PrismaModuleService],
  exports: [PrismaModuleService],
})
export class PrismaModuleModule {}
