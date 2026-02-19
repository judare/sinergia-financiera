import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { signJWT } from "@/lib/withUser";
import db from "@/db/conn";
const { User, Business } = db;

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const redirectLogin = () => {
    return NextResponse.redirect(new URL("/login", process.env.NEXTAUTH_URL));
  };
  try {
    const { searchParams } = new URL(req.nextUrl);
    const token = searchParams.get("code");

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    const request = {
      client_id: process.env.GITHUB_ID || "",
      client_secret: process.env.GITHUB_SECRET || "",
      code: token,
    };

    const response = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      }
    );

    const data = Object.fromEntries(new URLSearchParams(await response.text()));

    if (!data.access_token) {
      return redirectLogin();
    }

    const responseProfile = await fetch("https://api.github.com/user", {
      method: "GET",
      headers: {
        "User-Agent": "blokay",
        "Content-Type": "application/json",
        Authorization: `Bearer ${data.access_token}`,
      },
    });
    const profile = await responseProfile.json();

    if (!profile || !profile.email) {
      return redirectLogin();
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
    }

    const jwtString = signJWT(await userModel.getCookieSession());
    const cookieStore = await cookies();
    const redirect = cookieStore.get("talkia.redirect")?.value;
    const res = NextResponse.redirect(
      new URL(
        redirect || "/login",
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
    // error
    console.log(error);
    return redirectLogin();
  }
}
