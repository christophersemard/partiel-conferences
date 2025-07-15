import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { User } from "@/types/user";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function getServerUser(): Promise<User | null> {
    const cookieStore = await cookies(); // pas besoin de await ici, cookies() est synchrone
    const token = cookieStore.get("token")?.value;

    if (!token) return null;

    try {
        const res = await fetch(
            `${
                process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
            }/auth/me`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                cache: "no-store",
            }
        );
        if (!res.ok) return null;

        const user = (await res.json()) as User;
        console.log("User fetched from API:", user);
        return user;
    } catch (e) {
        console.error("Erreur getServerUser:", e);
        return null;
    }
}
