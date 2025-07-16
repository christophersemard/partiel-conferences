"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Conference } from "@/types/conference";
import { ConferenceCard } from "@/components/conference/ConferenceCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchServerAction } from "@/app/actions/fetch-proxy";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/useDebounce";

type Props = {
    initialConferences: Conference[];
};

export default function ConferenceList({ initialConferences }: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [conferences, setConferences] = useState<Conference[]>(initialConferences);
    const [loading, setLoading] = useState(false);


    const date = searchParams.get("date") || "";
    const roomId = searchParams.get("roomId") || "";
    const [speaker, setSpeaker] = useState(searchParams.get("speaker") ?? "");
    const debouncedSpeaker = useDebounce(speaker, 400);

    const rooms = useMemo(() => {
        const map = new Map<number, string>();
        initialConferences.forEach((c) => map.set(c.room.id, c.room.name));
        return Array.from(map.entries());
    }, [initialConferences]);

    function updateParam(name: string, value: string) {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(name, value);
        } else {
            params.delete(name);
        }
        router.push(`?${params.toString()}`);
    }


    useEffect(() => {
        updateParam("speaker", debouncedSpeaker);
    }, [debouncedSpeaker]);

    useEffect(() => {
        async function fetchFiltered() {
            setLoading(true);
            const params = new URLSearchParams();
            if (date) params.set("date", date);
            if (roomId) params.set("roomId", roomId);
            if (speaker) params.set("speaker", speaker);

            console.log("Fetching conferences with params:", params.toString());

            let paramsString = params.toString();

            if (params.toString() === "") {
                setConferences(initialConferences);
                setLoading(false);
                return;
            }
            else {
                // Add ? before params if not empty
                paramsString = `?${params.toString()}`;
            }

            try {
                const { data, error } = await fetchServerAction<Conference[]>(`/conferences${paramsString}`, { cache: "no-store" });
                if (error) {
                    toast.error("Erreur lors du chargement des conférences");
                }
                if (!data) {
                    setConferences([]);
                    return;
                }
                setConferences(data);
            } catch (err) {
                console.error(err);
                setConferences([]);
            } finally {
                setLoading(false);
            }
        }

        fetchFiltered();
    }, [date, roomId, speaker]);

    return (
        <>
            <div className="flex flex-wrap gap-4 items-end">
                <div className="flex flex-col gap-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                        id="date"
                        type="date"
                        value={date}
                        onChange={(e) => updateParam("date", e.target.value)}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="room">Salle</Label>
                    <Select
                        value={roomId || "all"}
                        onValueChange={(val) => updateParam("roomId", val === "all" ? "" : val)}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Toutes les salles" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Toutes</SelectItem>
                            {rooms.map(([id, name]) => (
                                <SelectItem key={id} value={id.toString()}>
                                    {name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="speaker">Conférencier</Label>
                    <Input
                        id="speaker"
                        placeholder="Nom ou prénom"
                        value={speaker}
                        onChange={(e) => setSpeaker(e.target.value)}
                    />
                </div>
            </div>

            <div className="space-y-4">
                {loading ? (
                    <p>Chargement en cours...</p>
                ) : conferences.length === 0 ? (
                    <p>Aucune conférence ne correspond à vos filtres.</p>
                ) : (
                    conferences.map((conf) => (
                        <ConferenceCard key={conf.id} conference={conf} />
                    ))
                )}
            </div></>
    );
}
