import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { PrismaService } from "./prisma/prisma.service";
import { ConferenceModule } from "./conference/conference.module";
import { PlanningModule } from "./planning/planning.module";
import { AdminModule } from "./admin/admin.module";
import { SponsorService } from './sponsor/sponsor.service';
import { SponsorModule } from './sponsor/sponsor.module';

@Module({
    imports: [AuthModule, ConferenceModule, PlanningModule, AdminModule, SponsorModule],
    controllers: [],
    providers: [PrismaService, SponsorService],
})
export class AppModule {}
