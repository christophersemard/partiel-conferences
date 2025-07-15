// src/auth/auth.service.ts

import {
    Injectable,
    UnauthorizedException,
    ConflictException,
} from "@nestjs/common";
import { RegisterDto } from "../dto/register.dto";
import { LoginDto } from "../dto/login.dto";
import * as bcrypt from "bcryptjs";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService
    ) {}

    async signup(dto: RegisterDto) {
        const existing = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (existing) throw new ConflictException("Email déjà utilisé");

        const hashed = await bcrypt.hash(dto.password, 10);
        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                passwordHash: hashed,
            },
        });

        const token = this.generateToken(user.id, user.role);
        return {
            token,
            user: { id: user.id, email: user.email, role: user.role },
        };
    }

    async login(dto: LoginDto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (!user) throw new UnauthorizedException("Identifiants invalides");

        const valid = await bcrypt.compare(dto.password, user.passwordHash);
        if (!valid) throw new UnauthorizedException("Identifiants invalides");

        const token = this.generateToken(user.id, user.role);
        return {
            token,
            user: { id: user.id, email: user.email, role: user.role },
        };
    }

    private generateToken(userId: number, role: string): string {
        return this.jwtService.sign({
            sub: userId,
            role,
        });
    }
}
