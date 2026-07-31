import { NextResponse } from "next/server";

const PUBLIC_ROUTES = ["/login", "/register"];

export default function middleware(request) {
    const token = request.cookies.get("access_token")?.value;
    const { pathname } = request.nextUrl;

    const isPublic = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));

    // Sin token intentando entrar a ruta privada → redirige al login
    if (!token && !isPublic) {
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        return NextResponse.redirect(url);
    }

    // Con token intentando entrar al login → redirige al dashboard
    if (token && isPublic) {
        const url = request.nextUrl.clone();
        url.pathname = "/dashboard";
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};