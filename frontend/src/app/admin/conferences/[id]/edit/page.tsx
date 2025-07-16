import { fetchServerAction } from "@/app/actions/fetch-proxy";
import { ConferenceForm } from "@/components/admin/ConferenceForm";
import { notFound } from "next/navigation";

type Params = { params: { id: string } };

export default async function EditConferencePage({ params }: Params) {
    const id = Number(params.id);
    const { data: conf } = await fetchServerAction<any>(`/conferences/${id}`);
    if (!conf) return notFound();

    const { data: sponsors } = await fetchServerAction<{ id: string; email: string }[]>("/admin/sponsors");
    const { data: speakers } = await fetchServerAction<{ id: string; name: string }[]>("/speakers");
    const { data: rooms } = await fetchServerAction<{ id: string; name: string }[]>("/admin/rooms-occupancy");


    return (
        <main className="p-6">
            <h1 className="text-2xl font-bold mb-6">Modifier la conférence</h1>
            <ConferenceForm
                conferenceId={conf.id}
                initialValues={{
                    ...conf,
                    date: conf.startTime.split("T")[0],
                    startTime: conf.startTime.split("T")[1].slice(0, 5),
                    endTime: conf.endTime.split("T")[1].slice(0, 5),
                    sponsorId: conf.sponsor?.id ? String(conf.sponsor?.id) : undefined,
                    roomId: String(conf.room?.id),
                }}
                sponsors={sponsors ?? []}
                rooms={rooms ?? []}
            />
        </main>
    );
}
