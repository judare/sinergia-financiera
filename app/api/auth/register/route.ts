import { z } from "zod";
import db from "@/db/conn";
import {
  isValidSchema,
  sendDataValidationError,
  sendData,
  setInputError,
} from "@/lib/response";
import Email from "@/app/services/mail";
import UserWelcome from "@/emails/UserWelcome";
import { RateLimiter } from "@/lib/rate-limit";

const { User } = db;

const schema = z.object({
  name: z.string().min(3).max(30),
  email: z
    .string()
    .email()
    .refine(async (e: string) => {
      const currentUser = await User.findByEmail(e);
      return !currentUser;
    }, "The user already exists."),
  password: z.string().min(5).max(30),
  companyName: z.string().min(3).max(50),
  companySize: z.string().max(30).optional(),
});

const rateLimiter = new RateLimiter({
  limitByMinute: 5,
  limitByHour: 30,
  limitByDay: 100,
});

export async function POST(req: any) {
  const body = await req.json();
  let ipAddressArray = (req.headers.get("x-forwarded-for") || "").split(",");
  const ipAddress = ipAddressArray[ipAddressArray.length - 1].trim() || "";

  try {
    await rateLimiter.check(ipAddress);
  } catch (err: any) {
    return setInputError({ password: err.message });
  }

  const { success, errors } = await isValidSchema(schema, body.data);
  if (!success) return sendDataValidationError(errors);

  let { email, password, companyName, companySize, name } = body.data;

  try {
    await rateLimiter.check(email);
  } catch (err: any) {
    return setInputError({ email: err.message });
  }

  const user = await User.createNew({
    email,
    password,
    name,
    image: null,
    companyName,
  });

  let emailSender = new Email();
  emailSender.send(
    user.email,
    "Welcome to Blokay - Developing faster is impossible.",
    UserWelcome,
    { name }
  );

  return sendData({});
}
