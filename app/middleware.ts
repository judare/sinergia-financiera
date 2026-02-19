import { NextResponse, NextRequest } from "next/server";
import { NextFetchEvent } from "next/server";

export function middleware(req: NextRequest, ev: NextFetchEvent) {
  let hostname =
    req.headers.get("X-Forwarded-Host") || req.nextUrl.hostname || "";
  hostname = hostname.split(":")?.[0];

  const pathname = req.nextUrl.pathname;

  if (
    pathname.startsWith("/_next") ||
    /\.(png|jpg|jpeg|gif|webp|svg|js|css|woff|woff2|ttf|otf|ico|html)$/.test(
      pathname
    )
  ) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/dashboard")) {
    let tok = req.cookies.get("talkia.session")?.value;
    if (!tok) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }
}
