// backend/prisma/seed.ts

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE "UserConference" CASCADE`);
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE "Speaker" CASCADE`);
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE "Conference" CASCADE`);
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE "User" CASCADE`);
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE "Room" CASCADE`);

    await prisma.$executeRawUnsafe(
        `ALTER SEQUENCE "User_id_seq" RESTART WITH 1`
    );
    await prisma.$executeRawUnsafe(
        `ALTER SEQUENCE "Room_id_seq" RESTART WITH 1`
    );
    await prisma.$executeRawUnsafe(
        `ALTER SEQUENCE "Conference_id_seq" RESTART WITH 1`
    );
    await prisma.$executeRawUnsafe(
        `ALTER SEQUENCE "Speaker_id_seq" RESTART WITH 1`
    );

    // ROOMS
    await prisma.room.createMany({
        data: [
            { name: "Salle Alpha", capacity: 10 },
            { name: "Salle Beta", capacity: 10 },
            { name: "Salle Gamma", capacity: 10 },
        ],
    });

    const rooms = await prisma.room.findMany();

    // USERS
    const [admin, sponsor, visitor1, visitor2] = await Promise.all([
        prisma.user.create({
            data: {
                firstName: "Admin",
                lastName: "User",
                email: "admin@example.com",
                passwordHash:
                    "$2b$10$Gbl5JlDXX7HfAmvheUX0VutijljZpyLJ49dotOJ44xPqN/0TlN81u",
                role: "ADMIN",
            },
        }),
        prisma.user.create({
            data: {
                firstName: "Sponsor",
                lastName: "User",
                email: "sponsor@example.com",
                passwordHash:
                    "$2b$10$Gbl5JlDXX7HfAmvheUX0VutijljZpyLJ49dotOJ44xPqN/0TlN81u",
                role: "SPONSOR",
            },
        }),
        prisma.user.create({
            data: {
                firstName: "John",
                lastName: "Doe",
                email: "john@doe.com",
                passwordHash:
                    "$2b$10$Gbl5JlDXX7HfAmvheUX0VutijljZpyLJ49dotOJ44xPqN/0TlN81u",
                role: "VISITOR",
            },
        }),
        prisma.user.create({
            data: {
                firstName: "Jane",
                lastName: "Doe",
                email: "jane@doe.com",
                passwordHash:
                    "$2b$10$Gbl5JlDXX7HfAmvheUX0VutijljZpyLJ49dotOJ44xPqN/0TlN81u",
                role: "VISITOR",
            },
        }),
    ]);

    // CONFERENCES avec SPEAKERS
    const conf1 = await prisma.conference.create({
        data: {
            title: "Innover dans le numérique",
            description: "Retour d’expérience sur la digitalisation post-Covid",
            date: new Date("2025-09-25"),
            startTime: new Date("2025-09-25T10:00:00"),
            endTime: new Date("2025-09-25T11:00:00"),
            roomId: rooms[0].id,
            sponsorId: sponsor.id,
        },
    });

    const conf2 = await prisma.conference.create({
        data: {
            title: "Sécurité des données en entreprise",
            description: "Bonnes pratiques pour protéger ses infrastructures",
            date: new Date("2025-09-25"),
            startTime: new Date("2025-09-25T14:00:00"),
            endTime: new Date("2025-09-25T17:00:00"),
            roomId: rooms[1].id,
        },
    });

    const conf3 = await prisma.conference.create({
        data: {
            title: "Leadership et gestion d'équipe",
            description: "Les clés d’un management efficace à l’ère hybride",
            date: new Date("2025-09-25"),
            startTime: new Date("2025-09-25T16:00:00"),
            endTime: new Date("2025-09-25T17:00:00"),
            roomId: rooms[2].id,
        },
    });

    const conf4 = await prisma.conference.create({
        data: {
            title: "IA générative : applications concrètes",
            description: "Utiliser l’IA dans les PME dès aujourd’hui",
            date: new Date("2025-09-26"),
            startTime: new Date("2025-09-26T11:00:00"),
            endTime: new Date("2025-09-26T12:00:00"),
            roomId: rooms[0].id,
        },
    });

    const conf5 = await prisma.conference.create({
        data: {
            title: "Recruter autrement : le rôle des soft skills",
            description: "Focus RH : au-delà du CV",
            date: new Date("2025-09-26"),
            startTime: new Date("2025-09-26T15:00:00"),
            endTime: new Date("2025-09-26T16:00:00"),
            roomId: rooms[1].id,
        },
    });

    await Promise.all([
        prisma.speaker.create({
            data: {
                firstName: "Alice",
                lastName: "Dupont",
                photoUrl: "https://via.placeholder.com/150",
                bio:
                    "Experte en transformation digitale et conférencière TEDx.",
                conferenceId: conf1.id,
            },
        }),
        prisma.speaker.create({
            data: {
                firstName: "Bob",
                lastName: "Martin",
                photoUrl: "https://via.placeholder.com/150",
                bio: "Consultant en cybersécurité depuis 10 ans.",
                conferenceId: conf2.id,
            },
        }),
        prisma.speaker.create({
            data: {
                firstName: "Claire",
                lastName: "Durant",
                photoUrl: "https://via.placeholder.com/150",
                bio: "Coach en leadership et ancienne DRH chez Capgemini.",
                conferenceId: conf3.id,
            },
        }),
        prisma.speaker.create({
            data: {
                firstName: "David",
                lastName: "Lefebvre",
                photoUrl: "https://via.placeholder.com/150",
                bio: "Experte en IA dans les PME.",
                conferenceId: conf4.id,
            },
        }),
        prisma.speaker.create({
            data: {
                firstName: "Eva",
                lastName: "Moreau",
                photoUrl: "https://via.placeholder.com/150",
                bio: "Experte RH et recrutement innovant.",
                conferenceId: conf5.id,
            },
        }),
    ]);

    // PLANNING
    await prisma.userConference.createMany({
        data: [
            { userId: visitor1.id, conferenceId: conf1.id },
            { userId: visitor1.id, conferenceId: conf3.id },
            { userId: visitor2.id, conferenceId: conf2.id },
        ],
    });

    console.log("✅ Seed terminé avec confs & speakers uniques.");
}

main()
    .then(() => prisma.$disconnect())
    .catch((e) => {
        console.error(e);
        prisma.$disconnect();
        process.exit(1);
    });
