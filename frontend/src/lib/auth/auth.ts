import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const PUBLIC_ROUTES = [
    /^\/$/,
    /^\/login$/,
    /^\/signup$/,
    /^\/conferences$/,
    /^\/conferences\/.+$/,
];

const VISITOR_ROUTES = [/^\/planning(\/.*)?$/];
const SPONSOR_ROUTES = [/^\/sponsor(\/.*)?$/];
const ADMIN_ROUTES = [/^\/admin(\/.*)?$/];

async function getUserFromToken(token: string) {
    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        return payload;
    } catch {
        return null;
    }
}

export async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;
    const token = req.cookies.get("token")?.value;

    const isPublic = PUBLIC_ROUTES.some((r) => r.test(path));
    if (!token && !isPublic) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    if (!token) return NextResponse.next();

    const user = await getUserFromToken(token);
    if (!user) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    const isVisitorRoute = VISITOR_ROUTES.some((r) => r.test(path));
    const isSponsorRoute = SPONSOR_ROUTES.some((r) => r.test(path));
    const isAdminRoute = ADMIN_ROUTES.some((r) => r.test(path));

    if (isVisitorRoute && user.role !== "VISITOR") {
        return NextResponse.redirect(new URL("/", req.url));
    }

    if (isSponsorRoute && user.role !== "SPONSOR") {
        return NextResponse.redirect(new URL("/", req.url));
    }

    if (isAdminRoute && user.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
}
