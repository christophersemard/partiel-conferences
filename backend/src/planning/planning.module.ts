import { Module } from "@nestjs/common";
import { PlanningController } from "./planning.controller";
import { PlanningService } from "./planning.service";
import { PrismaService } from "src/prisma/prisma.service";

@Module({
    controllers: [PlanningController],
    providers: [PlanningService, PrismaService],
})
export class PlanningModule {}
