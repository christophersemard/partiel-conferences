// app/planning/page.tsx
import { fetchServerAction } from "@/app/actions/fetch-proxy";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type Conference = {
    id: number;
    title: string;
    startTime: string;
    endTime: string;
    date: string;
};

function groupByDate(confs: Conference[]) {
    const map = new Map<string, Conference[]>();
    confs.forEach((conf) => {
        const date = conf.date;
        if (!map.has(date)) map.set(date, []);
        map.get(date)?.push(conf);
    });
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
}

export default async function PlanningPage() {
    const { data, error } = await fetchServerAction<Conference[]>("/me/planning");

    if (error || !data) {
        return <div className="p-4 text-red-500">Erreur lors du chargement du planning</div>;
    }

    const grouped = groupByDate(data);

    return (
        <main className="p-6">
            <h1 className="text-2xl font-bold">Mon planning personnalisé</h1>
            <p className=" mb-6 text-muted-foreground">
                Voici les conférences que vous avez ajoutées à votre planning. Cliquez sur une conférence pour voir
                les détails ou pour la retirer de votre planning.
            </p>

            {
                grouped.length === 0 ? (
                    <Alert className="mb-6">
                        <AlertTitle>Aucune conférence planifiée</AlertTitle>
                        <AlertDescription className="">
                            <div>Vous n'avez pas encore ajouté de conférences à votre planning. Consultez la{" "}
                                <Link href="/conferences" className="text-primary  hover:underline">
                                    liste des conférences
                                </Link>{" "}
                                pour commencer.</div>
                        </AlertDescription>
                    </Alert>
                ) : null
            }
            {
                grouped.length > 0 && (
                    <div className="overflow-x-auto">
                        <div className="flex gap-4 min-w-max">
                            {grouped.map(([date, confs]) => (
                                <div
                                    key={date}
                                    className="w-[350px] flex-shrink-0 border rounded-md bg-white"
                                >
                                    <div className="bg-muted px-3 py-2 font-semibold text-sm border-b">
                                        {format(parseISO(date), "EEEE d MMMM", { locale: fr })}
                                    </div>

                                    <div className="relative h-[800px] border-l">
                                        {[...Array(13)].map((_, i) => (
                                            <div
                                                key={i}
                                                className="absolute top-0 left-0 right-0 h-[60px] border-b text-xs text-muted-foreground pl-2"
                                                style={{ top: `${i * 60}px` }}
                                            >
                                                {`${8 + i}h`}
                                            </div>
                                        ))}

                                        {confs.map((conf) => {
                                            const start = new Date(conf.startTime);
                                            const end = new Date(conf.endTime);
                                            const startHour = start.getHours() + start.getMinutes() / 60;
                                            const endHour = end.getHours() + end.getMinutes() / 60;
                                            const top = (startHour - 8) * 60;
                                            const height = (endHour - startHour) * 60;

                                            return (
                                                <Link
                                                    key={conf.id} href={`/conferences/${conf.id}`}
                                                    className={cn(
                                                        "absolute block w-full left-1 right-1 bg-primary text-white text-sm rounded-md p-2 shadow",
                                                        "hover:brightness-110 transition-all"
                                                    )}

                                                    style={{ top, height }}
                                                >
                                                    <div className="font-semibold">{conf.title}</div>
                                                    <div className="text-xs">
                                                        {format(start, "HH:mm")} - {format(end, "HH:mm")}
                                                    </div>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>)
            }
        </main >
    );
}
