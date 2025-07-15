// components/layouts/AdminLayout.tsx
"use client";

import { ReactNode } from "react";
import { Sidebar } from "@/components/common/Sidebar";
import { User } from "@/types/user";

type Props = {
    children: ReactNode;
    user: User 
};

export function AdminLayout({ children, user }: Props) {
    return (
        <div className="flex min-h-screen">
            <Sidebar user={user} />
            <main className="flex-1 p-6">
                {children}
            </main>
        </div>
    );
}
