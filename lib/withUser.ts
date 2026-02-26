import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/sessionServer";
import jwt from "jsonwebtoken";

export const withUser = (cb: any) => {
  return async function (req: NextRequest) {
    const { user }: any = await getServerSession();
    let body;
    if (req.headers.get("content-type")?.includes("application/json")) {
      body = await req.json();
    } else {
      body = await req.formData();
    }

    if (!user) {
      return NextResponse.json(
        {
          data: {
            message: "You must be loggin",
          },
        },
        { status: 401 },
      );
    }

    return await cb({ req, user: user, body });
  };
};

export const withAdmin = (cb: any) => {
  return withUser(async function ({ req, body, user }: any) {
    if (user.rol != "admin") {
      return NextResponse.json(
        {
          data: {
            message: "Incorrect rol",
          },
        },
        { status: 401 },
      );
    }

    return await cb({ req, user, body });
  });
};

export const signJWT = function (data: any) {
  return jwt.sign(data, process.env.ENCRYPTION_KEY || "", {});
};
