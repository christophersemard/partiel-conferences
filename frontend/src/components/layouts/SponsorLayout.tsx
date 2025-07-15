// components/layouts/SponsorLayout.tsx
import { ReactNode } from "react";
import { Sidebar } from "@/components/common/Sidebar";
import { User } from "@/types/user";

export function SponsorLayout({
    children,
    user,
}: {
    children: ReactNode;
    user: User;
}) {
    return (
        <div className="flex min-h-screen">
            <Sidebar user={user} />
            <main className="flex-1 p-6">{children}</main>
        </div>
    );
}
