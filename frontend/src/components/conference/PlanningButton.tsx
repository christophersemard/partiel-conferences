"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { fetchServerAction } from "@/app/actions/fetch-proxy";

type PlanningEntry = {
    id: number;
    title: string;
    startTime: string;
    endTime: string;
};

type Props = {
    confId: number;
    isConnected: boolean;
    isAlreadyPlanned: boolean | undefined;
    hasConflict: boolean | undefined;
    planning?: PlanningEntry[] | null;
    currentStart: string;
    currentEnd: string;
};

export function PlanningButton({
    confId,
    isConnected,
    isAlreadyPlanned: plannedInitially,
    planning = [],
    currentStart,
    currentEnd,
}: Props) {
    const [isPlanned, setIsPlanned] = useState(plannedInitially);
    const [localPlanning, setLocalPlanning] = useState(planning);
    const [loading, startTransition] = useTransition();

    const hasConflict = checkConflict(localPlanning!, currentStart, currentEnd);

    function checkConflict(planning: PlanningEntry[], start: string, end: string): boolean {
        const newStart = new Date(start).getTime();
        const newEnd = new Date(end).getTime();

        return planning.some(({ startTime, endTime }) => {
            const s = new Date(startTime).getTime();
            const e = new Date(endTime).getTime();
            return newStart < e && newEnd > s; // chevauchement
        });
    }

    async function handleAdd() {
        startTransition(async () => {
            const { error } = await fetchServerAction(`/planning/${confId}`, {
                method: "POST",
            });

            if (error) {
                toast.error("Erreur lors de l’ajout au planning");
                return;
            }

            setIsPlanned(true);
            toast.success("Conférence ajoutée à votre planning");
        });
    }

    async function handleRemove() {
        startTransition(async () => {
            const { error } = await fetchServerAction(`/planning/${confId}`, {
                method: "DELETE",
            });

            if (error) {
                toast.error("Erreur lors de la suppression");
                return;
            }

            setIsPlanned(false);
            toast.success("Conférence retirée du planning");
        });
    }

    if (!isConnected) {
        return (
            <Button disabled className="mt-4">
                Connectez-vous pour ajouter cette conférence
            </Button>
        );
    }

    if (isPlanned) {
        return (
            <Button variant="destructive" onClick={handleRemove} disabled={loading} className="mt-4">
                Retirer du planning
            </Button>
        );
    }

    return (
        <Button
            onClick={handleAdd}
            disabled={hasConflict || loading}
            className="mt-4"
        >
            {hasConflict ? "Conflit d’horaire" : "Ajouter à mon planning"}
        </Button>
    );
}
