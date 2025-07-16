import { fetchServerAction } from "@/app/actions/fetch-proxy";
import ConferenceList from "@/components/conference/ConferenceList";
import { Conference } from "@/types/conference";

export default async function HomePage() {
  const { data, error } = await fetchServerAction<Conference[]>("/conferences");

  if (error) {
    console.error("Erreur de chargement :", error);
    return <div className="text-red-500">Erreur lors du chargement des conférences</div>;
  }

  return <main className="max-w-3xl mx-auto p-6 space-y-6">
    <h1 className="text-3xl font-bold">Toutes les conférences</h1>


    <ConferenceList initialConferences={data || []} />
  </main>

}
