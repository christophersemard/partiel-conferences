import { fetchServerAction } from "@/app/actions/fetch-proxy";
import { ConferenceForm } from "@/components/admin/ConferenceForm";

export default async function NewConferencePage() {
    const { data: sponsors } = await fetchServerAction<{ id: string; email: string }[]>("/admin/sponsors");
    const { data: rooms } = await fetchServerAction<{ id: string; name: string }[]>("/admin/rooms-occupancy");

    return (
        <main className="p-6">
            <h1 className="text-2xl font-bold mb-6">Nouvelle conférence</h1>
            <ConferenceForm sponsors={sponsors ?? []} rooms={rooms ?? []} />
        </main>
    );
}
