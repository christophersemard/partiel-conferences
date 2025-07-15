// src/types/user.ts

export type Role = "ADMIN" | "SPONSOR" | "VISITOR";

export type User = {
    id: number;
    role: Role;
    email: string;
    firstName: string;
    lastName: string;
};
