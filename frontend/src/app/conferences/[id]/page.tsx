// app/conferences/[id]/page.tsx
import { notFound } from "next/navigation";
import { getServerUser } from "@/lib/auth/getServerUser";
import { fetchServerAction } from "@/app/actions/fetch-proxy";
import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Conference } from "@/types/conference";
import { PlanningButton } from "@/components/conference/PlanningButton";

type Params = { params: { id: string } };

export default async function ConferenceDetailPage({ params }: Params) {
    const user = await getServerUser();
    const id = Number(params.id);

    console.log("Fetching conference with user:", user);

    const [{ data: conf, error: errorConf }, { data: planning, error: errorPlanning }] = await Promise.all([
        fetchServerAction<
            Conference | null
        >(`/conferences/${id}`),

        user
            ? fetchServerAction<
                {
                    id: number;
                    title: string;
                    startTime: string;
                    endTime: string;
                }[]
            >(`/me/planning`)
            : Promise.resolve({ data: [], error: null }),
    ]);

    if (!conf) return notFound();

    console.log("Fetched Planning:", errorPlanning);
    console.log("Planning data:", planning);

    const isConnected = !!user;

    const isAlreadyPlanned = planning?.some((p) => p.id === conf.id);

    const hasConflict = planning?.some((p) => {
        const start1 = new Date(p.startTime).getTime();
        const end1 = new Date(p.endTime).getTime();
        const start2 = new Date(conf.startTime).getTime();
        const end2 = new Date(conf.endTime).getTime();
        return start1 < end2 && start2 < end1;
    });


    console.log("isConnected:", isConnected);
    console.log("isAlreadyPlanned:", isAlreadyPlanned);
    console.log("hasConflict:", hasConflict);

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold">{conf.title}</h1>
                <p className="text-sm text-muted-foreground">{conf.description}</p>
            </div>

            <div className="space-y-1 text-sm">
                <p>
                    🗓️ <strong>Date</strong> : {new Date(conf.date).toLocaleDateString()}
                </p>
                <p>
                    🕒 <strong>Heure</strong> :{" "}
                    {new Date(conf.startTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    })}{" "}
                    –{" "}
                    {new Date(conf.endTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                </p>
                <p>📍 <strong>Salle</strong> : {conf.room.name}</p>

            </div>

            <div>
                <h2 className="text-lg font-semibold mb-2">🎤 Intervenant</h2>
                <p>
                    <strong>
                        {conf.speaker.firstName} {conf.speaker.lastName}
                    </strong>
                </p>
                <p className="text-sm text-muted-foreground">{conf.speaker.bio}</p>
            </div>

            <PlanningButton
                confId={conf.id}
                isConnected={isConnected}
                isAlreadyPlanned={isAlreadyPlanned}
                hasConflict={hasConflict}
                planning={planning}
                currentEnd={conf.endTime}
                currentStart={conf.startTime}
            />

            {!isConnected && (
                <p className="text-sm text-muted-foreground">
                    <Link href="/login" className="underline">
                        Connectez-vous
                    </Link>{" "}
                    pour pouvoir enregistrer cette conférence dans votre planning.
                </p>
            )}

            {hasConflict && !isAlreadyPlanned && (
                <p className="text-sm text-muted-foreground">
                    ⚠️ Cette conférence chevauche une autre que vous avez déjà planifiée.
                </p>
            )}
        </div>
    );
}
