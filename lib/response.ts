import { NextResponse } from "next/server";

export const isValidSchema = async (schema: any, data: any) => {
  const response = await schema.safeParseAsync(data);
  return { success: response.success, errors: response.error };
};

export const sendDataValidationError = (errors: any) => {
  console.log(errors);
  return NextResponse.json(
    { message: "Petición inválida", errors },
    { status: 400 }
  );
};

export const setInputError = (inputError: any) => {
  let issues = [];
  let message = "";
  for (let index in inputError) {
    message = inputError[index];
    issues.push({
      message,
      path: [index],
    });
  }

  return NextResponse.json(
    {
      message: message || "Error inesperado",
      errors: {
        issues,
      },
    },
    { status: 400 }
  );
};

export const sendError = (error: any) => {
  return NextResponse.json(
    {
      error,
      message: typeof error === "string" ? error : "Error inesperado",
      data: {
        type: "exception",
        content: {
          name: "Function Error",
          message: "Unexpected Error",
          key: null,
          description: "",
        },
      },
    },
    { status: 400 }
  );
};

export const sendData = (data: any) => {
  return NextResponse.json({ data }, { status: 200 });
};
