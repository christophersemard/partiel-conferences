// src/types/jwt-payload-user.ts

export type JwtPayloadUser = {
    id: number;
    email: string;
    role: "VISITOR" | "ADMIN" | "SPEAKER"; // adapte si besoin
};
