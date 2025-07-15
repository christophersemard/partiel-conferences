"use client";

import { createContext, useContext } from "react";
import { User } from "@/types/user";

const UserContext = createContext<User | null>(null);

export function useUser() {
    return useContext(UserContext);
}

export function UserProvider({
    children,
    initialUser,
}: {
    children: React.ReactNode;
    initialUser: User | null;
}) {
    return (
        <UserContext.Provider value={initialUser}>
            {children}
        </UserContext.Provider>
    );
}
