import { NextRequest, NextResponse } from "next/server";
import db from "@/db/conn";
const { Key } = db;

export function decodeJWT(token: string) {
  return JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
}

export const withJWT = (cb: any) => {
  return async function (req: NextRequest) {
    let body;
    let token;
    let publicKey;
    let session = null;
    if (req.headers.get("content-type")?.includes("application/json")) {
      body = await req.json();
      token = body._token;
      publicKey = body.publicKey;
    } else {
      body = await req.formData();
      token = body.get("_token");
      publicKey = body.get("publicKey");
    }

    if (token) {
      let {
        publicKey: publicKeyJWT,
        data: { ...sessionData },
      } = decodeJWT(token);

      if (publicKeyJWT) {
        publicKey = publicKeyJWT;
      }
      session = sessionData;
    }

    if (!publicKey) {
      return NextResponse.json(
        {
          data: {
            message: "You must be loggin",
          },
        },
        { status: 401 }
      );
    }

    let key = await Key.useKey(body.publicKey || publicKey, token);
    if (!key) {
      return NextResponse.json(
        {
          data: {
            message: "Invalid key",
          },
        },
        { status: 401 }
      );
    }

    return await cb({
      business: key.Business,
      body,
      session,
      key,
      token,
      publicKey,
      req,
    });
  };
};
