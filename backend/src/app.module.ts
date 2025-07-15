import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { PrismaService } from "./prisma/prisma.service";
import { ConferenceModule } from "./conference/conference.module";
import { PlanningModule } from "./planning/planning.module";
import { AdminModule } from "./admin/admin.module";

@Module({
    imports: [AuthModule, ConferenceModule, PlanningModule, AdminModule],
    controllers: [],
    providers: [PrismaService],
})
export class AppModule {}
