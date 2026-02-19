import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export const getServerSession = async () => {
  const cookieStore = await cookies();
  let session = cookieStore.get("talkia.session")?.value;

  if (!session) {
    return null;
  }

  let decoded: any = null;
  try {
    decoded = jwt.verify(session, process.env.ENCRYPTION_KEY || "");
  } catch (err) {
    return null;
  }

  return decoded;
};
