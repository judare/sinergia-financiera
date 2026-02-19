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
    responseSchema: any
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

  async businessContext(contentWebsite: string) {
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
          description:
            "Breve resumen del la empresa, toda la información necesaria para que se entienda muy bien a que se dedica la empresa, solo informacion relevante del negocio no de la web",
        },
        suggestedAgents: {
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
      required: ["name", "context", "suggestedAgents"],
    });

    return {
      name: json.name,
      context: json.context,
      suggestedAgents: json.suggestedAgents || [],
    } as const;
  }

  public async createAgent(
    instructions: string,
    business: any
  ): Promise<{
    label: string;
    firstMessage: string;
    systemPrompt: string;
    purpose: string;
  }> {
    let promptIa = `
# Nombre del negocio 
${business.name}

# Website del negocio
${business.website}

# Contexto del negocio
${business.context}


Debes incluir instrucciones para cada uno de estos aspectos
Identidad del agente 
Objetivos del agente:
Objetivo principal
Objetivo secundario
Contexto de la empresa
información de la empresa 
Detalle del producto o servicio
Escenarios comunes
Preguntas Frecuentes
Perfil y tono del agente 
Lenguaje y tono 
personalidad del agente
palabras o frases que debe usar frecuente o debe omitir
Normas de pronunciación 
Pausas
Manejo de puntuación
como confirmar los números y correos
Conversión de horas y anos 
Instrucción relevantes 
Cierre
Casos comunes para finalizar la llamada
Debe sonar super humano y amistoso
Nunca puede relevar que es un aistente virtual bajo ninguna circunstancia

El agente sera un agente de voz para atención telefónica
Genera la instrucciones necesarias para que todo lo que un agende de voz de IA pueda pronunciar mal el LLM lo genere como texto, por ejemplo, numeros, correos, direcciones, etc

# Variables

Puedes usar las siguientes variables para construir el firstMessage o el systemPrompt
- {{ current_time }} para la hora actual
- {{ customer_id }} para el id del cliente a conectar
- {{ customer_phone }} para el número de teléfono del cliente
- {{ customer_name }} para el nombre del cliente
- {{ short_name }} para el nombre corto del cliente
- {{ customer_meta }} para toda la información del cliente adicional
- {{ customer_email }} para el email del cliente
- {{ customer_address }} para la dirección del cliente
- {{ customer_website }} para el website del cliente
- {{ customer_created_at }} para la fecha de creación del cliente


# Instrucciones para el agente
${instructions}
    `;

    return this.generate("gemini-2.5-pro", promptIa, {
      type: "object",
      properties: {
        label: {
          type: "string",
          description: "Etiqueta del agente",
        },
        firstMessage: {
          type: "string",
          description:
            "ejemplo: Hola, soy Jessica de Coca Cola, ¿Hablo con {{ short_name }}?",
        },
        systemPrompt: {
          type: "string",
          description:
            "El contexto con el que el agente atenderá cada llamada de voz, super detallado, puede ser largo, cada instrucción debe estar incluida en formato markdown",
        },
        purpose: {
          type: "string",
          description:
            "El propósito del agente, cual es el objetivo del agente para cada llamada",
        },
      },
      required: ["label", "firstMessage", "systemPrompt", "purpose"],
    });
  }
}
