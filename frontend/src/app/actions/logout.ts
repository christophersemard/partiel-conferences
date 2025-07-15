// app/actions/logout.ts
"use server";

import { cookies } from "next/headers";

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.set("token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 0, // supprime le cookie
    });
}
