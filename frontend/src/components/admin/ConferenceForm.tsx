"use client";

import { useState, useTransition } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { fetchServerAction } from "@/app/actions/fetch-proxy";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

const schema = z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    date: z.string(),
    startTime: z.string(),
    endTime: z.string(), speaker: z.object({
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        bio: z.string().min(1),
        photoUrl: z
            .string()
            .optional()
            .refine((val) => !val || val === "" || z.string().url().safeParse(val).success, {
                message: "URL invalide",
            })

    }),
    sponsorId: z.string().optional(),
    roomId: z.string().min(1),
});

type FormValues = z.infer<typeof schema>;

type Props = {
    initialValues?: Partial<FormValues>;
    sponsors: { id: string; email: string }[];
    rooms: { id: string; name: string }[];
    conferenceId?: number;
};

export function ConferenceForm({ initialValues = {}, sponsors, rooms, conferenceId }: Props) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
        watch
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            title: initialValues.title ?? "",
            description: initialValues.description ?? "",
            date: initialValues.date ?? "",
            startTime: initialValues.startTime ?? "",
            endTime: initialValues.endTime ?? "",
            speaker: {
                firstName: initialValues.speaker?.firstName ?? "",
                lastName: initialValues.speaker?.lastName ?? "",
                bio: initialValues.speaker?.bio ?? "",
                photoUrl: initialValues.speaker?.photoUrl ?? "",
            },
            sponsorId: initialValues.sponsorId ?? undefined,
            roomId: initialValues.roomId ?? "",
        },
    });

    async function onSubmit(values: FormValues) {
        const start = new Date(`${values.date}T${values.startTime}`);
        const end = new Date(`${values.date}T${values.endTime}`);

        const payload = {
            ...values,
            startTime: start.toISOString(),
            endTime: end.toISOString(),
            roomId: parseInt(values.roomId, 10),
            sponsorId: values.sponsorId ? parseInt(values.sponsorId, 10) : undefined,
            speaker: {
                firstName: values.speaker.firstName,
                lastName: values.speaker.lastName,
                bio: values.speaker.bio,
                photoUrl: values.speaker.photoUrl,
            },
        };

        startTransition(async () => {
            const { error } = await fetchServerAction(
                conferenceId ? `/conferences/${conferenceId}` : "/conferences",
                {
                    method: conferenceId ? "PATCH" : "POST",
                    body: JSON.stringify(payload),
                }
            );

            if (error) {
                console.error("Error saving conference:", error);
                if (error.statusCode === 409) {
                    toast.error("Conflit horaire : une autre conférence est déjà prévue dans cette salle à cette heure.");
                } else {
                    toast.error("Erreur lors de l'enregistrement");
                }
            }
            else {
                toast.success("Conférence enregistrée");
                router.push("/admin");
            }
        });
    }


    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-2xl">


            <div className="flex gap-4">
                <div className="flex flex-col gap-2">
                    <Label>Date</Label>
                    <Input type="date" {...register("date")} />
                </div>
                <div className="flex flex-col gap-2">
                    <Label>Début</Label>
                    <Input type="time" {...register("startTime")} />
                </div>
                <div className="flex flex-col gap-2">
                    <Label>Fin</Label>
                    <Input type="time" {...register("endTime")} />
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <Label>Salle</Label>
                <Select
                    value={watch("roomId")}
                    onValueChange={(val) => setValue("roomId", val)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Choisir une salle" />
                    </SelectTrigger>
                    <SelectContent>
                        {rooms.map((r) => (
                            <SelectItem key={r.id} value={String(r.id)}>
                                {r.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>


            </div>
            <hr />

            <div className="flex flex-col gap-2">
                <Label>Titre</Label>
                <Input {...register("title")} />
                {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
            </div>

            <div className="flex flex-col gap-2">
                <Label>Description</Label>
                <Textarea {...register("description")} />
                {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
            </div>

            <hr />


            <div className="flex flex-col gap-2">
                <Label>Prénom de l’intervenant</Label>
                <Input {...register("speaker.firstName")} />
                {errors.speaker?.firstName && (
                    <p className="text-red-500 text-sm">{errors.speaker.firstName.message}</p>
                )}
            </div>

            <div className="flex flex-col gap-2">
                <Label>Nom de l’intervenant</Label>
                <Input {...register("speaker.lastName")} />
                {errors.speaker?.lastName && (
                    <p className="text-red-500 text-sm">{errors.speaker.lastName.message}</p>
                )}
            </div>

            <div className="flex flex-col gap-2">
                <Label>Bio de l’intervenant</Label>
                <Textarea {...register("speaker.bio")} />
                {errors.speaker?.bio && (
                    <p className="text-red-500 text-sm">{errors.speaker.bio.message}</p>
                )}
            </div>

            <div className="flex flex-col gap-2">
                <Label>Photo (URL)</Label>
                <Input {...register("speaker.photoUrl")} />
                {errors.speaker?.photoUrl && (
                    <p className="text-red-500 text-sm">{errors.speaker.photoUrl.message}</p>
                )}
            </div>


            <hr />

            <div className="flex flex-col gap-2">
                <Label>Sponsor (facultatif)</Label>
                <Select value={watch("sponsorId") || "none"}
                    onValueChange={(val) => setValue("sponsorId", val === "none" ? undefined : val)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Aucun sponsor" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="none">Aucun</SelectItem>

                        {sponsors.map((s) => (
                            <SelectItem key={s.id} value={String(s.id)}>{s.email}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>


            <Button type="submit" disabled={isPending}>
                {conferenceId ? "Modifier" : "Créer"} la conférence
            </Button>
        </form>
    );
}
