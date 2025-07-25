// src/auth/auth.module.ts

import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./jwt.strategy";
import { PrismaService } from "../prisma/prisma.service";

@Module({
    imports: [
        JwtModule.register({
            secret: process.env.JWT_SECRET || "un-secret-solide",
            signOptions: { expiresIn: "7d" },
        }),
    ],
    providers: [AuthService, PrismaService, JwtStrategy],
    controllers: [AuthController],
})
export class AuthModule {}
