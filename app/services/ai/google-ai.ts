import { GoogleGenAI } from "@google/genai";

const ai: GoogleGenAI = new GoogleGenAI({ apiKey: process.env.GEMINI_TOKEN });

export class GoogleAI {
  static fixJson(result: string) {
    try {
      return JSON.parse(result);
    } catch (error) {}
    console.log("try to fix json", result);
    try {
      result = result.replace(/:\s*"([^"]*\n[^"]*)"/g, function (match) {
        return match.replace(/(?<="[^"]*)\n/g, "\\n");
      });
      let json = JSON.parse(result);
      return json;
    } catch (error) {
      // Limpieza básica
      let fixed = result;
      // quitar caracteres de control innecesarios
      fixed = fixed.replace(/\n/g, " ");
      fixed = fixed.replace(/\r/g, " ");

      // eliminar comas colgantes
      fixed = fixed.replace(/,\s*}/g, "}");
      fixed = fixed.replace(/,\s*]/g, "]");

      // asegurar comillas correctas para claves
      fixed = fixed.replace(/([{,]\s*)([a-zA-Z0-9_]+)(\s*:)/g, '$1"$2"$3');

      try {
        return JSON.parse(fixed);
      } catch (err2: any) {
        console.log(fixed);
        throw new Error("No se pudo corregir el JSON: ");
      }
    }
  }

  private async generate(
    model: string = "gemini-2.5-pro",
    systemInstruction: string,
    responseSchema: any,
  ) {
    let response = await ai.models.generateContent({
      model,
      config: {
        temperature: 0.5,
        maxOutputTokens: 100000,
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema,
      },
      contents: [
        {
          role: "user",
          parts: [{ text: "Completa por favor la tarea" }],
        },
      ],
    });
    let text = response.text || "";
    return GoogleAI.fixJson(text);
  }

  async coursesSuggestions(contentWebsite: string) {
    if (contentWebsite.trim().length < 5) {
      return {
        name: "",
        context: "",
        suggestedAgents: [],
      };
    }
    let promptIa = ` # Website content
${contentWebsite}`;

    let json = await this.generate("gemini-2.5-pro", promptIa, {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Nombre de la empresa",
        },
        context: {
          type: "string",
          description: "Sugerir cursos segun rol y posicion",
        },
        suggestedCourses: {
          type: "array",
          items: {
            type: "string",
          },
          minItems: 3,
          maxItems: 6,
          description:
            "Agentes telefonicos sugeridos en base al contexto del negocio que puedan ser super útiles para la empresa",
        },
      },
      required: ["name", "context", "suggestedCourses"],
    });

    return {
      name: json.name,
      context: json.context,
      suggestedCourses: json.suggestedCourses || [],
    } as const;
  }
}
