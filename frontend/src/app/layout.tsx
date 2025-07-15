// src/app/layout.tsx
import "./globals.css";
import { ReactNode } from "react";
import { getServerUser } from "@/lib/auth/getServerUser";
import { UserProvider } from "@/hooks/useUser";
import { VisitorLayout } from "@/components/layouts/VisitorLayout";
import { SponsorLayout } from "@/components/layouts/SponsorLayout";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Event App",
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const user = await getServerUser();
  console.log("User in RootLayout:", user);

  let LayoutComponent;
  if (user?.role === "SPONSOR") LayoutComponent = SponsorLayout;
  else if (user?.role === "ADMIN") LayoutComponent = AdminLayout;
  else LayoutComponent = VisitorLayout;

  return (
    <html lang="fr">
      <body>
        <UserProvider initialUser={user}>
          <LayoutComponent user={user!}>{children}</LayoutComponent>
        </UserProvider>
      </body>
    </html>
  );
}
