"use server";

import { cookies } from "next/headers";

export type ErrorApi = {
    statusCode: number;
    error: string;
    message: string;
};

type FetchResponse<T> =
    | { data: T; error: null }
    | { data: null; error: ErrorApi };

export async function fetchServerAction<T>(
    input: string,
    init: RequestInit = {},
    options?: { token?: string }
): Promise<FetchResponse<T>> {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    console.log("API_URL:", API_URL);
    console.log("fetchServerAction called with:", { input, init });

    // On récupère tous les cookies présents côté serveur
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();
    const cookieHeader = allCookies
        .map((c) => `${c.name}=${c.value}`)
        .join("; ");

    const headers: Record<string, string> = {
        ...(init.headers as Record<string, string>),
        ...(cookieHeader ? { cookie: cookieHeader } : {}),
    };

    const token =
        options?.token ?? cookieStore.get("token")?.value ?? undefined;

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    if (init.body && !headers["Content-Type"]) {
        headers["Content-Type"] = "application/json";
    }

    try {
        const res = await fetch(API_URL + input, {
            ...init,
            headers,
            cache: "no-store",
            credentials: "include", // important pour session côté API
        });

        if (!res.ok) {
            const text = await res.text();
            let error: ErrorApi;
            try {
                error = JSON.parse(text);
            } catch {
                error = {
                    statusCode: res.status,
                    error: "Unknown error",
                    message: text,
                };
            }
            return { data: null, error };
        }

        const result: T = await res.json();
        return { data: result, error: null };
    } catch (err) {
        console.error("Erreur fetchServerAction:", err);
        return {
            data: null,
            error: {
                statusCode: 500,
                error: "Fetch Error",
                message: err instanceof Error ? err.message : "Unknown error",
            },
        };
    }
}
