// app/actions/set-session-cookie.ts
"use server";

import { cookies } from "next/headers";

export async function setSessionCookie(token: string) {
    const cookieStore = await cookies();

    cookieStore.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 jours
    });
}
