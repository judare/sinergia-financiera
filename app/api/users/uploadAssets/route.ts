import { NextResponse } from "next/server";
import { uploadFile } from "@/lib/aws";
import { withUser } from "@/lib/withUser";

export const POST = withUser(async function ({ body }: any) {
  const file: any = body.get("file");
  if (!file) {
    return NextResponse.json({ error: "No files received." }, { status: 400 });
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  let filename = file.name.replaceAll(" ", "_");
  filename = `${Math.random().toString(36).substring(2, 15)}-${filename}`;

  let response = await uploadFile(filename, buffer);

  return NextResponse.json(
    {
      data: {
        Resource: {
          publicUrl: process.env.AWS_PUBLIC_URL,
          url: process.env.AWS_PUBLIC_URL + "/" + response,
          Key: response,
          preview: process.env.AWS_PUBLIC_URL + "/" + response,
        },
      },
    },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    }
  );
});
