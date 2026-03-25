import { NextResponse } from "next/server";

const PUBLIC_ROUTES = ["/login", "/register"];

export default function middleware(request) {
    const token = request.cookies.get("access_token")?.value;
    const { pathname } = request.nextUrl;

    const isPublic = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));

    // Sin token intentando entrar a ruta privada → redirige al login
    if (!token && !isPublic) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // Con token intentando entrar al login → redirige al dashboard
    if (token && isPublic) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};