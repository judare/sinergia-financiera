import { z } from "zod";
import { withAdmin } from "@/lib/withUser";
import { NextResponse } from "next/server";
import { isValidSchema, sendDataValidationError } from "@/lib/response";
import db from "@/db/conn";
import { GoogleAI } from "@/app/services/ai/google-ai";
import Scrapper from "@/app/services/ai/scrapper";

const schema = z.object({
  name: z.string().min(3).optional(),
  website: z.string().url().optional(),
  billEmail: z.string().email().optional(),
  address: z.string().min(3).optional(),
  country: z.string().length(2).optional(),
  city: z.string().min(3).max(255).optional(),
  vatNumber: z.string().min(3).optional(),
  vatType: z.string().min(3).optional(),
});

const { Business } = db;

export const POST = withAdmin(async function ({ user, body }: any) {
  const { success, errors } = await isValidSchema(schema, body.data);
  if (!success) return sendDataValidationError(errors);

  const business = await Business.findOne({ where: { id: user.businessId } });

  let edit: any = {
    meta: business.meta || {},
    context: body.data.context || "",
  };
  if (body.data.name) {
    edit.name = body.data.name;
  }
  if (body.data.city) {
    edit.city = body.data.city;
  }

  if (body.data.countryId) {
    edit.countryId = body.data.countryId;
  }
  if (body.data.address) {
    edit.address = body.data.address;
  }
  if (body.data.website) {
    edit.website = body.data.website;

    if (!edit.context) {
      let ia = new GoogleAI();
      let scrapper = new Scrapper();

      let contentScrapper = await scrapper.getBodyText(body.data.website);
      let businessContext = await ia.businessContext(contentScrapper);

      edit.context = businessContext.context;
      edit.name = businessContext.name;
      edit.meta.suggestedAgents = businessContext.suggestedAgents;
      edit.meta.edited = Date.now();
      edit.onboarding = "companyData";
    }
  }
  if (body.data.billEmail) {
    edit.billEmail = body.data.billEmail;
  }
  if (body.data.vatType) {
    edit.vatType = body.data.vatType;
  }
  if (body.data.vatNumber) {
    edit.vatNumber = body.data.vatNumber;
  }
  if (business.onboarding == "initial") {
    edit.onboarding = "companyData";
  }

  console.log("edit", edit);
  await business.update(edit);

  return NextResponse.json({
    data: {},
  });
});
