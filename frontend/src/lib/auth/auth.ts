import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const PUBLIC_ROUTES = ["/", "/login"];

export async function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value;

    if (!token && !PUBLIC_ROUTES.includes(req.nextUrl.pathname)) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
}
