import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { PrismaService } from "./prisma/prisma.service";
import { ConferenceModule } from './conference/conference.module';

@Module({
    imports: [AuthModule, ConferenceModule],
    controllers: [AppController],
    providers: [AppService, PrismaService],
})
export class AppModule {}
