import { NextRequest } from "next/server";
import { z } from "zod";
import db from "@/db/conn";
import {
  isValidSchema,
  sendDataValidationError,
  sendData,
  setInputError,
} from "@/lib/response";
import Email from "@/app/services/mail";
import ForgotPassword from "@/emails/ForgotPassword";
import jwt from "jsonwebtoken";
import { RateLimiter } from "@/lib/rate-limit";

const { User } = db;

const schema = z.object({
  email: z.string().email().max(100),
});

const rateLimiter = new RateLimiter({
  limitByMinute: 5,
  limitByHour: 30,
  limitByDay: 100,
});
export async function POST(req: NextRequest) {
  let ipAddressArray = (req.headers.get("x-forwarded-for") || "").split(",");
  const ipAddress = ipAddressArray[ipAddressArray.length - 1].trim() || "";

  try {
    await rateLimiter.check(ipAddress);
  } catch (err: any) {
    return setInputError({ password: err.message });
  }
  const body = await req.json();

  const { success, errors } = await isValidSchema(schema, body.data);
  if (!success) return sendDataValidationError(errors);

  let { email } = body.data;

  try {
    await rateLimiter.check(email);
  } catch (err: any) {
    return setInputError({ email: err.message });
  }

  const user = await User.findOne({
    where: {
      email,
    },
  });
  if (!user) return sendData({});

  let token = jwt.sign(
    {
      email: user.email,
    },
    process.env.ENCRYPTION_KEY || "",
    { expiresIn: "3h" }
  );

  let emailSender = new Email();
  emailSender.send(user.email, "Blokay - Reset your password", ForgotPassword, {
    name: user.name,
    token,
  });

  return sendData({});
}
