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
    const [
        admin,
        sponsor1,
        sponsor2,
        sponsor3,
        ...visitors
    ] = await Promise.all([
        prisma.user.create({
            data: {
                firstName: "Admin",
                lastName: "User",
                email: "admin@example.com",
                passwordHash:
                    "$2b$10$SeNRqmJncN3H0WQVv/UlAOWj/nYwHyjLQyMT2D2CjGHLOF/NxvqY6",
                role: "ADMIN",
            },
        }),
        prisma.user.create({
            data: {
                firstName: "Sponsor",
                lastName: "One",
                email: "sponsor1@example.com",
                passwordHash:
                    "$2b$10$SeNRqmJncN3H0WQVv/UlAOWj/nYwHyjLQyMT2D2CjGHLOF/NxvqY6",
                role: "SPONSOR",
            },
        }),
        prisma.user.create({
            data: {
                firstName: "Sponsor",
                lastName: "Two",
                email: "sponsor2@example.com",
                passwordHash:
                    "$2b$10$SeNRqmJncN3H0WQVv/UlAOWj/nYwHyjLQyMT2D2CjGHLOF/NxvqY6",
                role: "SPONSOR",
            },
        }),
        prisma.user.create({
            data: {
                firstName: "Sponsor",
                lastName: "Three",
                email: "sponsor3@example.com",
                passwordHash:
                    "$2b$10$SeNRqmJncN3H0WQVv/UlAOWj/nYwHyjLQyMT2D2CjGHLOF/NxvqY6",
                role: "SPONSOR",
            },
        }),
        ...Array.from({ length: 8 }, (_, i) =>
            prisma.user.create({
                data: {
                    firstName: `Visiteur${i + 1}`,
                    lastName: "Test",
                    email: `visitor${i + 1}@example.com`,
                    passwordHash:
                        "$2b$10$SeNRqmJncN3H0WQVv/UlAOWj/nYwHyjLQyMT2D2CjGHLOF/NxvqY6",
                    role: "VISITOR",
                },
            })
        ),
    ]);

    // CONFERENCES
    const conferences = await Promise.all([
        prisma.conference.create({
            data: {
                title: "Innover dans le numérique",
                description: "Digitalisation post-Covid",
                date: new Date("2025-09-25"),
                startTime: new Date("2025-09-25T10:00:00"),
                endTime: new Date("2025-09-25T11:00:00"),
                roomId: rooms[0].id,
                sponsorId: sponsor1.id,
            },
        }),
        prisma.conference.create({
            data: {
                title: "Sécurité des données",
                description: "Cybersécurité & infra",
                date: new Date("2025-09-25"),
                startTime: new Date("2025-09-25T14:00:00"),
                endTime: new Date("2025-09-25T17:00:00"),
                roomId: rooms[1].id,
            },
        }),
        prisma.conference.create({
            data: {
                title: "Leadership moderne",
                description: "Management hybride",
                date: new Date("2025-09-25"),
                startTime: new Date("2025-09-25T16:00:00"),
                endTime: new Date("2025-09-25T17:00:00"),
                roomId: rooms[2].id,
                sponsorId: sponsor2.id,
            },
        }),
        prisma.conference.create({
            data: {
                title: "IA générative",
                description: "Applications concrètes",
                date: new Date("2025-09-26"),
                startTime: new Date("2025-09-26T11:00:00"),
                endTime: new Date("2025-09-26T12:00:00"),
                roomId: rooms[0].id,
            },
        }),
        prisma.conference.create({
            data: {
                title: "Recrutement et soft skills",
                description: "RH & innovation",
                date: new Date("2025-09-26"),
                startTime: new Date("2025-09-26T15:00:00"),
                endTime: new Date("2025-09-26T16:00:00"),
                roomId: rooms[1].id,
                sponsorId: sponsor3.id,
            },
        }),
        prisma.conference.create({
            data: {
                title: "Open source & entreprises",
                description: "Modèles collaboratifs",
                date: new Date("2025-09-26"),
                startTime: new Date("2025-09-26T16:00:00"),
                endTime: new Date("2025-09-26T17:00:00"),
                roomId: rooms[2].id,
            },
        }),
    ]);

    // SPEAKERS
    await Promise.all(
        conferences.map((conf, i) =>
            prisma.speaker.create({
                data: {
                    firstName: [
                        "Alice",
                        "Bob",
                        "Claire",
                        "David",
                        "Eva",
                        "Frank",
                    ][i],
                    lastName: [
                        "Durand",
                        "Martin",
                        "Moreau",
                        "Lefevre",
                        "Lopez",
                        "Petit",
                    ][i],
                    bio: `Bio de l'intervenant ${i + 1}`,
                    photoUrl: "https://via.placeholder.com/150",
                    conferenceId: conf.id,
                },
            })
        )
    );

    // PLANNING : chaque conférence a entre 2 et 8 visiteurs
    for (const conf of conferences) {
        const shuffled = visitors.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, Math.floor(Math.random() * 7) + 2); // 2 à 8
        await prisma.userConference.createMany({
            data: selected.map((v) => ({
                userId: v.id,
                conferenceId: conf.id,
            })),
        });
    }

    console.log(
        "✅ Seed enrichi terminé avec visiteurs, sponsors, speakers et conférences réalistes."
    );
}

main()
    .then(() => prisma.$disconnect())
    .catch((e) => {
        console.error(e);
        prisma.$disconnect();
        process.exit(1);
    });
