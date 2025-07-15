// src/types/jwt-payload-user.ts

export type JwtPayloadUser = {
    id: number;
    email: string;
    role: "VISITOR" | "ADMIN" | "SPEAKER"; // adapte si besoin
    firstName?: string; // Optionnel, si tu veux inclure le prénom
    lastName?: string; // Optionnel, si tu veux inclure le nom de famille
};
