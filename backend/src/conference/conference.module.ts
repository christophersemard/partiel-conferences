import { Module } from "@nestjs/common";
import { ConferenceService } from "./conference.service";
import { ConferenceController } from "./conference.controller";
import { PrismaService } from "src/prisma/prisma.service";

@Module({
    providers: [ConferenceService, PrismaService],
    controllers: [ConferenceController],
})
export class ConferenceModule {}
