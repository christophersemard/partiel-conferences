"use client";

import { redirect } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { fetchServerAction } from "@/app/actions/fetch-proxy";
import { setSessionCookie } from "@/app/actions/set-session-cookie";
import { getServerUser } from "@/lib/auth/getServerUser";



export function LoginForm() {
    const [email, setEmail] = useState("admin@example.com");
    const [password, setPassword] = useState("password");
    const [loading, setLoading] = useState(false);


    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        try {
            const { data, error } = await fetchServerAction<{ token: string, user: { id: number; role: string; firstName: string; lastName: string } }>(
                "/auth/login",
                {
                    method: "POST",
                    body: JSON.stringify({ email, password }),
                }
            );

            if (error) {
                throw new Error(error.message || "Erreur lors de la connexion");
            }

            toast.success("Connecté avec succès");


            await setSessionCookie(data.token);

            // Redirection selon le rôle
            if (data.user.role === "ADMIN") {
                redirect("/admin");
            }
            else if (data.user.role === "VISITOR") {
                redirect("/");
            }
            else if (data.user.role === "SPONSOR") {
                redirect("/sponsor");
            } else {
                redirect("/");
            }
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }


    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>

            <div>
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Connexion..." : "Se connecter"}
            </Button>
        </form>
    );
}
