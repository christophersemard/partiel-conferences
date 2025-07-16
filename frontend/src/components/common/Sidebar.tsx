"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { User } from "@/types/user";
import { LogOut, Calendar, Home, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { logout } from "@/app/actions/logout";
import { Button } from "@/components/ui/button";

type Props = {
    user: User;
};

const adminLinks = [
    {
        href: "/admin",
        label: "Salles",
        icon: Home,
    },
];

const sponsorLinks = [
    {
        href: "/sponsor",
        label: "Mes conférences",
        icon: Calendar,
    }
];

export function Sidebar({ user }: Props) {
    const pathname = usePathname();

    console.log("Sidebar user:", user);
    return (
        <aside className="w-64 bg-muted border-r h-screen p-4 flex flex-col justify-between">
            <div>
                <div className="mb-6 text-sm text-muted-foreground">
                    Connecté en tant que :<br />
                    <span className="font-medium text-foreground">{user.firstName} {user.lastName}</span>
                </div>

                <nav className="space-y-1">
                    {user.role == "ADMIN" && adminLinks.map(({ href, label, icon: Icon }) => (
                        <Link
                            key={href}
                            href={href}
                            className={cn(
                                "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground transition",
                                pathname.startsWith(href) && "bg-accent text-accent-foreground"
                            )}
                        >
                            <Icon className="w-4 h-4" />
                            {label}
                        </Link>
                    ))}

                    {user.role == "SPONSOR" && sponsorLinks.map(({ href, label, icon: Icon }) => (
                        <Link
                            key={href}
                            href={href}
                            className={cn(
                                "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground transition",
                                pathname.startsWith(href) && "bg-accent text-accent-foreground"
                            )}
                        >
                            <Icon className="w-4 h-4" />
                            {label}
                        </Link>
                    ))}
                </nav>
            </div>

            <LogoutButton />
        </aside>
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