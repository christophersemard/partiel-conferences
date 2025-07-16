import { Module } from "@nestjs/common";
import { SponsorService } from "./sponsor.service";
import { SponsorController } from "./sponsor.controller";
import { PrismaService } from "src/prisma/prisma.service";

@Module({
    providers: [SponsorService, PrismaService],
    controllers: [SponsorController],
})
export class SponsorModule {}
