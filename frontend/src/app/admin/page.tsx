// app/admin/rooms/page.tsx
import { fetchServerAction } from "@/app/actions/fetch-proxy";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Room = {
    id: number;
    name: string;
    capacity: number;
    totalAttendees: number;
    fillRate: number;
    numberOfConferences: number;
};

export default async function AdminRoomsPage() {
    const { data, error } = await fetchServerAction<Room[]>("/admin/rooms-occupancy");

    if (error || !data) {
        console.error("Error fetching rooms:", error);
        return (
            <div className="p-4 text-red-500">
                Erreur lors du chargement des salles.
            </div>
        );
    }

    return (
        <main className="p-6 space-y-6">
            <h1 className="text-2xl font-bold">Salles de conférence</h1>

            <div className="space-y-4">
                {data.map((room) => (
                    <div
                        key={room.id}
                        className="border rounded-md p-4 bg-white flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                    >
                        <div className="flex-1">
                            <h2 className="font-semibold text-lg">{room.name}</h2>
                            <p className="text-sm text-muted-foreground">
                                Capacité : {room.capacity} — Participants : {room.totalAttendees} - Nombre de conférences : {room.numberOfConferences}
                            </p>
                            <div className="mt-2">
                                <Progress value={Math.round(room.fillRate * 100)} />
                                <p className="text-xs text-muted-foreground mt-1">
                                    Taux de remplissage : {Math.round(room.fillRate * 100)}%
                                </p>
                            </div>
                        </div>

                        <div>
                            <Link href={`/admin/rooms/${room.id}`}>
                                <Button variant="outline">Gérer</Button>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}
