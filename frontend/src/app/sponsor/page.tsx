// app/admin/rooms/[id]/page.tsx
import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { fetchServerAction } from "@/app/actions/fetch-proxy";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";
import { DeleteConferenceButton } from "@/components/admin/DeleteConferenceButton";


type Conference = {
    id: number;
    title: string;
    startTime: string;
    endTime: string;
    speaker: {
        firstName: string;
        lastName: string;
        photoUrl: string | null;
    };
    sponsor: {
        id: number;
        email: string;
        firstName?: string;
        lastName?: string;
    } | null;
    room: {
        id: number;
        name: string;
    };
};




export default async function AdminRoomDetailPage() {
    const { data: conferences, error } = await fetchServerAction<Conference[]>(
        `/sponsor/conferences`
    );

    console.log("Conferences:", conferences);
    console.log("Error:", error);

    if (error || !conferences) return notFound();


    return (
        <main className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Mes conférences</h1>
            </div>

            {conferences.length === 0 ? (
                <p>Aucune conférence programmée pour vous.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm border rounded-md bg-white">
                        <thead className="bg-muted border-b">
                            <tr>
                                <th className="text-left px-4 py-2">Titre</th>
                                <th className="text-left px-4 py-2">Intervenant</th>
                                <th className="text-left px-4 py-2">Salle</th>
                                <th className="text-left px-4 py-2">Date</th>
                                <th className="text-left px-4 py-2">Heure</th>
                                <th className="text-right px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {conferences.map((conf) => {
                                const start = new Date(conf.startTime);
                                const end = new Date(conf.endTime);
                                return (
                                    <tr
                                        key={conf.id}
                                        className="border-b hover:bg-accent transition-colors"
                                    >
                                        <td className="px-4 py-2 font-medium">{conf.title}</td>
                                        <td className="px-4 py-2">
                                            {conf.speaker.firstName} {conf.speaker.lastName}
                                        </td>
                                        <td className="px-4 py-2">
                                            {conf.room.name}</td>
                                        <td className="px-4 py-2">
                                            {format(start, "EEEE d MMMM yyyy", { locale: fr })}
                                        </td>

                                        <td className="px-4 py-2">
                                            {format(start, "HH:mm")} → {format(end, "HH:mm")}
                                        </td>
                                        <td className="px-4 py-2 text-right whitespace-nowrap">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/sponsor/conferences/${conf.id}/edit`}>
                                                    <Button variant="outline" size="sm">
                                                        Modifier
                                                    </Button>
                                                </Link>

                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

        </main>
    );
}
