"use client";

import Link from "next/link";
import { Conference } from "@/types/conference";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";

export function ConferenceCard({ conference }: { conference: Conference }) {
    const date = format(new Date(conference.date), "EEEE dd MMMM yyyy", { locale: fr });
    const start = format(new Date(conference.startTime), "HH:mm");
    const end = format(new Date(conference.endTime), "HH:mm");

    return (
        <div className="border-b py-6 space-y-1">
            <Link href={`/conferences/${conference.id}`}>
                <h2 className="text-lg font-bold mb-2 hover:underline cursor-pointer">{conference.title}</h2>
            </Link>
            <p className="font-semibold text-sm">
                🧑‍🏫 {conference.speaker.firstName} {conference.speaker.lastName}
            </p>
            <p className="text-sm">
                🗓️ {date} • {start} → {end} • 📍 {conference.room.name}
            </p>
            <Link
                href={`/conferences/${conference.id}`}
                className={cn(
                    "text-sm text-primary hover:underline font-medium inline-block mt-1"
                )}
            >
                Voir les détails →
            </Link>
        </div>
    );
}
