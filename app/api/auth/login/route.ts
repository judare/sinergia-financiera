import { z } from "zod";
import db from "@/db/conn";
import {
  isValidSchema,
  sendDataValidationError,
  sendData,
  setInputError,
} from "@/lib/response";
import { NextRequest } from "next/server";
import { signJWT } from "@/lib/withUser";
import { RateLimiter } from "@/lib/rate-limit";

const { User } = db;

const rateLimiter = new RateLimiter({
  limitByMinute: 5,
  limitByHour: 30,
  limitByDay: 100,
});

const CredentialsProvider = async (req: NextRequest, body: any) => {
  let ipAddressArray = (req.headers.get("x-forwarded-for") || "").split(",");
  const ipAddress = ipAddressArray[ipAddressArray.length - 1].trim() || "";

  try {
    await rateLimiter.check(ipAddress);
  } catch (err: any) {
    return setInputError({ password: err.message });
  }

  const schemaCredentials = z.object({
    email: z.string().email(),
    password: z.string().min(5).max(30),
  });

  const { success, errors } = await isValidSchema(schemaCredentials, body.data);
  if (!success) return sendDataValidationError(errors);

  try {
    await rateLimiter.check(body.data.email);
  } catch (err: any) {
    return setInputError({ email: err.message });
  }

  const user = await User.findByEmail(body.data.email);
  if (!user) {
    return setInputError({ password: "Usuario o contraseña incorrecto" });
  }
  const isMatch = await user.matchPassword(body.data.password);
  if (!isMatch) {
    return setInputError({ password: "Usuario o contraseña incorrecto" });
  }

  const jwtToken = signJWT(await user.getCookieSession());

  const response = sendData({
    redirect: body.data.redirect || "/dashboard",
  });

  if (body.data.redirect) {
    response.cookies.set(
      "talkia.redirect",
      body.data.redirect,
      User.getCookieSessionOptions()
    );
  }

  response.cookies.set(
    "talkia.session",
    jwtToken,
    User.getCookieSessionOptions()
  );

  return response;
};

const GoogleProvider = async (_: NextRequest, body: any) => {
  let url = `https://accounts.google.com/o/oauth2/auth?client_id=${
    process.env.GOOGLE_ID
  }&redirect_uri=${encodeURIComponent(
    process.env.NEXTAUTH_URL + "api/auth/callback/google"
  )}&response_type=code&scope=email%20profile&access_type=offline`;

  const response = sendData({
    redirect: url,
  });
  if (body.data.redirect) {
    response.cookies.set(
      "talkia.redirect",
      body.data.redirect,
      User.getCookieSessionOptions()
    );
  }

  return response;
};

const GithubProvider = async (_: NextRequest, body: any) => {
  let url = `https://github.com/login/oauth/authorize?client_id=${
    process.env.GITHUB_ID
  }&redirect_uri=${encodeURIComponent(
    process.env.NEXTAUTH_URL + "api/auth/callback/github"
  )}&scope=user%20repo&state=ESTADO_RANDOM`;
  const response = sendData({
    redirect: url,
  });
  if (body.data.redirect) {
    response.cookies.set(
      "talkia.redirect",
      body.data.redirect,
      User.getCookieSessionOptions()
    );
  }

  return response;
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { service } = body.data;

    if (service == "credentials") {
      return CredentialsProvider(req, body);
    } else if (service == "google") {
      return GoogleProvider(req, body);
    } else if (service == "github") {
      return GithubProvider(req, body);
    }

    return sendData({
      redirect: "/login",
    });
  } catch (error) {
    console.log(error);
    return sendData({
      redirect: "/login",
    });
  }
}
