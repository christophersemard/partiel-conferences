import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AdminService {
    constructor(private prisma: PrismaService) {}

    async getRoomsOccupancy() {
        const rooms = await this.prisma.room.findMany({
            include: {
                conferences: {
                    include: {
                        attendees: true,
                    },
                },
            },
        });

        return rooms.map((room) => {
            const totalAttendees = room.conferences.reduce(
                (acc, conf) => acc + conf.attendees.length,
                0
            );
            const capacity = room.capacity ?? 0;
            return {
                id: room.id,
                name: room.name,
                numberOfConferences: room.conferences.length,
                capacity,
                totalAttendees,
                fillRate:
                    capacity > 0
                        ? totalAttendees / capacity / room.conferences.length
                        : 0,
            };
        });
    }

    async getRoomPlanning(roomId: number) {
        const room = await this.prisma.room.findUnique({
            where: { id: roomId },
            include: {
                conferences: {
                    orderBy: { startTime: "asc" },
                    include: {
                        speaker: {
                            select: {
                                firstName: true,
                                lastName: true,
                                photoUrl: true,
                            },
                        },
                        sponsor: {
                            select: {
                                id: true,
                                email: true,
                            },
                        },
                    },
                },
            },
        });

        if (!room) throw new NotFoundException("Salle introuvable");

        return {
            id: room.id,
            name: room.name,
            conferences: room.conferences.map((conf) => ({
                id: conf.id,
                title: conf.title,
                startTime: conf.startTime.toISOString(),
                endTime: conf.endTime.toISOString(),
                speaker: conf.speaker,
                sponsor: conf.sponsor,
            })),
        };
    }

    async getSponsors() {
        return this.prisma.user.findMany({
            where: { role: "SPONSOR" },
            select: {
                id: true,
                email: true,
            },
            orderBy: { email: "asc" },
        });
    }
}
