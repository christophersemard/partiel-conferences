import {
    ConflictException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateConferenceDto } from "../dto/create-conference.dto";
import { UpdateConferenceDto } from "../dto/update-conference.dto";
import { User } from "@prisma/client";

@Injectable()
export class ConferenceService {
    constructor(private prisma: PrismaService) {}

    async findAll() {
        return this.prisma.conference.findMany({
            include: {
                room: true,
                speaker: true,
                sponsor: {
                    select: { id: true, email: true },
                },
            },
            orderBy: { startTime: "asc" },
        });
    }

    async findOne(id: number) {
        const conf = await this.prisma.conference.findUnique({
            where: { id },
            include: {
                room: true,
                speaker: true,
                sponsor: {
                    select: { id: true, email: true },
                },
            },
        });

        if (!conf) throw new NotFoundException("Conférence introuvable");
        return conf;
    }

    private async checkRoomConflict(
        roomId: number,
        date: Date,
        startTime: Date,
        endTime: Date,
        excludeId?: number
    ) {
        const conflict = await this.prisma.conference.findFirst({
            where: {
                roomId,
                date,
                NOT: {
                    endTime: { lte: startTime },
                },
                startTime: { lt: endTime },
                ...(excludeId ? { id: { not: excludeId } } : {}),
            },
        });

        if (conflict) {
            throw new ConflictException("Conflit horaire dans cette salle.");
        }
    }

    async create(dto: CreateConferenceDto) {
        const date = new Date(dto.date);
        const startTime = new Date(dto.startTime);
        const endTime = new Date(dto.endTime);

        await this.checkRoomConflict(dto.roomId, date, startTime, endTime);

        const conf = await this.prisma.conference.create({
            data: {
                title: dto.title,
                description: dto.description,
                date,
                startTime,
                endTime,
                roomId: dto.roomId,
                sponsorId: dto.sponsorId,
            },
        });

        await this.prisma.speaker.create({
            data: {
                ...dto.speaker,
                conferenceId: conf.id,
            },
        });

        return this.findOne(conf.id);
    }

    async update(id: number, dto: UpdateConferenceDto, user: User) {
        const existing = await this.prisma.conference.findUnique({
            where: { id },
        });
        if (!existing) throw new NotFoundException("Conférence introuvable");

        if (user.role === "SPONSOR" && existing.sponsorId !== user.id) {
            throw new ForbiddenException(
                "Vous ne pouvez modifier que vos conférences."
            );
        }

        const date = dto.date ? new Date(dto.date) : existing.date;
        const startTime = dto.startTime
            ? new Date(dto.startTime)
            : existing.startTime;
        const endTime = dto.endTime ? new Date(dto.endTime) : existing.endTime;

        await this.checkRoomConflict(
            dto.roomId ?? existing.roomId,
            date,
            startTime,
            endTime,
            id
        );

        await this.prisma.conference.update({
            where: { id },
            data: {
                title: dto.title,
                description: dto.description,
                date,
                startTime,
                endTime,
                roomId: dto.roomId,
            },
        });

        if (dto.speaker) {
            await this.prisma.speaker.updateMany({
                where: { conferenceId: id },
                data: dto.speaker,
            });
        }

        return this.findOne(id);
    }

    async delete(id: number) {
        await this.prisma.speaker.deleteMany({ where: { conferenceId: id } });
        await this.prisma.conference.delete({ where: { id } });
        return { success: true };
    }
}
