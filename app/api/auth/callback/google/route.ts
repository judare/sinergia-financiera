import { NextResponse, NextRequest } from "next/server";
import db from "@/db/conn";
import { cookies } from "next/headers";
import { signJWT } from "@/lib/withUser";
const { User, Business } = db;

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.nextUrl);
    const token = searchParams.get("code");
    const cookieStore = await cookies();
    let redirect = cookieStore.get("talkia.redirect")?.value;

    if (!token) {
      console.log("no token", token);
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    const request = {
      client_id: process.env.GOOGLE_ID || "",
      client_secret: process.env.GOOGLE_SECRET || "",
      code: token,
      grant_type: "authorization_code",
      redirect_uri: `${process.env.NEXTAUTH_URL}api/auth/callback/google`,
    };

    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });

    const data = await response.json();

    if (!data.access_token) {
      console.log("no access token", data);
      return NextResponse.redirect(new URL("/login", process.env.NEXTAUTH_URL));
    }

    const responseProfile = await fetch(
      "https://www.googleapis.com/oauth2/v1/userinfo?alt=json",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.access_token}`,
        },
      }
    );
    const profile = await responseProfile.json();

    if (!profile || !profile.email) {
      console.log("no profile", profile);
      return NextResponse.redirect(new URL("/login", process.env.NEXTAUTH_URL));
    }

    let userModel = await User.findByEmail(profile.email, {
      include: [
        {
          model: Business,
          required: true,
        },
      ],
    });

    if (!userModel) {
      userModel = await User.createNew({
        name: profile.name,
        companyName: "",
        email: profile.email,
        image: profile.picture,
        emailVerified: true,
      });
      redirect = "/dashboard/onboarding";
    }

    const jwtString = signJWT(await userModel.getCookieSession());

    const res = NextResponse.redirect(
      new URL(
        redirect || "/dashboard",
        redirect && redirect.includes("http")
          ? undefined
          : process.env.NEXTAUTH_URL
      )
    );

    res.cookies.set(
      "talkia.session",
      jwtString,
      User.getCookieSessionOptions()
    );
    cookieStore.set(
      "talkia.session",
      jwtString,
      User.getCookieSessionOptions()
    );

    return res;
  } catch (error) {
    console.log("exception", error);
    return NextResponse.redirect(new URL("/login", process.env.NEXTAUTH_URL));
  }
}
