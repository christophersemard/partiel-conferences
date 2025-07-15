// app/login/page.tsx
import { LoginForm } from "@/components/auth/LoginForm";
import { redirect } from "next/navigation";
import { getServerUser } from "@/lib/auth/getServerUser";

export default async function LoginPage() {

    const user = await getServerUser();

    if (user) {
        if (user.role === "ADMIN") redirect("/admin");
        else if (user.role === "SPONSOR") redirect("/sponsor");
        else redirect("/conferences");
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-md border rounded-lg p-6 shadow-sm bg-background">
                <h1 className="text-xl font-semibold mb-4">Connexion</h1>
                <LoginForm />
            </div>
        </div>
    );
}
