import {
    Injectable,
    ConflictException,
    NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class PlanningService {
    constructor(private prisma: PrismaService) {}

    async getUserPlanning(userId: number) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                conferences: {
                    include: {
                        conference: {
                            include: {
                                room: true,
                                speaker: true,
                                sponsor: {
                                    select: { id: true, email: true },
                                },
                            },
                        },
                    },
                },
            },
        });

        return user?.conferences.map((uc) => uc.conference) ?? [];
    }

    async addToPlanning(userId: number, conferenceId: number) {
        const conference = await this.prisma.conference.findUnique({
            where: { id: conferenceId },
            include: { room: true },
        });

        if (!conference) {
            throw new NotFoundException("Conférence introuvable");
        }

        const existing = await this.prisma.userConference.findUnique({
            where: {
                userId_conferenceId: {
                    userId,
                    conferenceId,
                },
            },
        });

        if (existing) {
            throw new ConflictException("Déjà dans le planning");
        }

        // Vérifier les conflits horaires
        const overlapping = await this.prisma.userConference.findFirst({
            where: {
                userId,
                conference: {
                    date: conference.date,
                    AND: [
                        { startTime: { lt: conference.endTime } },
                        { endTime: { gt: conference.startTime } },
                    ],
                },
            },
            include: {
                conference: true,
            },
        });

        if (overlapping) {
            throw new ConflictException(
                `Conflit avec "${
                    overlapping.conference.title
                }" (${overlapping.conference.startTime.toLocaleTimeString()} - ${overlapping.conference.endTime.toLocaleTimeString()})`
            );
        }

        // Vérifier la capacité de la salle
        const nbParticipants = await this.prisma.userConference.count({
            where: { conferenceId },
        });

        if (nbParticipants >= conference.room.capacity) {
            throw new ConflictException(
                `La salle "${conference.room.name}" est complète (${conference.room.capacity} places)`
            );
        }

        return this.prisma.userConference.create({
            data: {
                userId,
                conferenceId,
            },
        });
    }

    async removeFromPlanning(userId: number, conferenceId: number) {
        const existing = await this.prisma.userConference.findUnique({
            where: {
                userId_conferenceId: {
                    userId,
                    conferenceId,
                },
            },
        });
        if (!existing) {
            throw new NotFoundException("Pas dans le planning");
        }

        return this.prisma.userConference.delete({
            where: {
                userId_conferenceId: {
                    userId,
                    conferenceId,
                },
            },
        });
    }
}
