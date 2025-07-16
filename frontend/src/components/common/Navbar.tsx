"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { User } from "@/types/user";
import { useRouter } from "next/navigation";
import { logout } from "@/app/actions/logout";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

type Props = {
    user: User | null;
};

export function Navbar({ user }: Props) {
    const pathname = usePathname();

    console.log("Navbar user:", user);

    return (
        <header className="w-full border-b bg-background px-6 py-3 flex items-center justify-between">
            <div className="flex gap-6 items-center">
                <Link href="/" className="font-bold text-lg">
                    Conférences 2025
                </Link>

                <nav className="flex gap-4 text-sm">
                    <Link
                        href="/"
                        className={cn(
                            "hover:text-foreground",
                            pathname.startsWith("/conferences") && "font-medium text-foreground"
                        )}
                    >
                        Conférences
                    </Link>
                    <Link
                        href="/planning"
                        className={cn(
                            "hover:text-foreground",
                            pathname.startsWith("/planning") && "font-medium text-foreground"
                        )}
                    >
                        Mon planning
                    </Link>
                </nav>
            </div>

            <div className="text-sm text-muted-foreground">
                {user ? (
                    <div className="flex items-center gap-2 font-semibold">
                        {user.firstName} {user.lastName}
                        <LogoutButton />
                    </div>
                ) : (
                    <Link href="/login" className="hover:underline">
                        Se connecter
                    </Link>
                )}
            </div>
        </header>
    );
}



export function LogoutButton() {
    const router = useRouter();

    async function handleLogout() {
        await logout();
        router.push("/login");
    }

    return (

        <Button variant="destructive" onClick={handleLogout}>
            <LogOut className="w-4 h-4" />
            Déconnexion
        </Button>
    );
}