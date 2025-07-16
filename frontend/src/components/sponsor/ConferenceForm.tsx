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
    speaker: z.object({
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
            speaker: {
                firstName: initialValues.speaker?.firstName ?? "",
                lastName: initialValues.speaker?.lastName ?? "",
                bio: initialValues.speaker?.bio ?? "",
                photoUrl: initialValues.speaker?.photoUrl ?? "",
            },
        },
    });

    async function onSubmit(values: FormValues) {

        const payload = {
            ...values,
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
                router.push("/sponsor");
            }
        });
    }


    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-2xl">



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




            <Button type="submit" disabled={isPending}>
                {conferenceId ? "Modifier" : "Créer"} la conférence
            </Button>
        </form>
    );
}
