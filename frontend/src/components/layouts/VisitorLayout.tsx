// components/layouts/VisitorLayout.tsx
import { ReactNode } from "react";
import { User } from "@/types/user";
import { Navbar } from "@/components/common/Navbar";

type Props = {
    children: ReactNode;
    user: User | null;
};

export function VisitorLayout({ children, user }: Props) {
    return (
        <>
            <Navbar user={user} />
            <main className="p-4">{children}</main>
        </>
    );
}
