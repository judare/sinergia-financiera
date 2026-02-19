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

const { User } = db;

const CredentialsProvider = async (_: NextRequest, body: any) => {
  const schemaCredentials = z.object({
    email: z.string().email(),
    password: z.string().min(5).max(30),
  });

  const { success, errors } = await isValidSchema(schemaCredentials, body.data);
  if (!success) return sendDataValidationError(errors);

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
      User.getCookieSessionOptions(),
    );
  }

  response.cookies.set(
    "talkia.session",
    jwtToken,
    User.getCookieSessionOptions(),
  );

  return response;
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { service } = body.data;

    if (service == "credentials") {
      return CredentialsProvider(req, body);
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
