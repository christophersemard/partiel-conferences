import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class SponsorService {
    constructor(private readonly prismaService: PrismaService) {}

    async getConferencesForSponsor(sponsorId: number) {
        console.log("Fetching conferences for sponsor ID:", sponsorId);

        const conferences = await this.prismaService.conference.findMany({
            where: { sponsorId },
            include: {
                room: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                speaker: {
                    select: {
                        firstName: true,
                        lastName: true,
                        photoUrl: true,
                    },
                },
            },
        });

        return conferences.map((conference) => ({
            ...conference,
            roomName: conference.room.name,
        }));
    }
}
