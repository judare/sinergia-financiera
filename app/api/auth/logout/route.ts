import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "@/lib/sessionServer";
import { cookies } from "next/headers";
import db from "@/db/conn";

const { User } = db;

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const session = await getServerSession();

  const response = NextResponse.redirect(
    searchParams.get("redirect")
      ? new URL(searchParams.get("redirect") || "")
      : new URL("/login", process.env.NEXTAUTH_URL)
  );

  if (session) {
    const cookieStore = await cookies();
    cookieStore.delete("talkia.session");

    response.cookies.set("talkia.session", "", User.getCookieSessionOptions());
  }

  (await cookies()).set("talkia.session", "", { expires: new Date(0) });

  req.cookies.set("talkia.session", "");
  return response;
}
