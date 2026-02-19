import { getServerSession } from "@/lib/sessionServer";
import { SessionProvider } from "../../providers/Session";
import { Header } from "../../components/Header";
import Footer from "../../components/Footer";
import Suggestion from "./components/Suggestion";

export default async function Asset() {
  const session = await getServerSession();

  const company = { name: "NU Bank", logo: "/c2.webp" };

  const score = {
    score: 72,
    description:
      "La pieza tiene una buena intención estratégica: conecta con cultura pop, usa una referencia visual reconocible y mantiene presencia clara de marca. Sin embargo, la relación entre el insight cultural (Bad Bunny / 'Debí tirar más fotos') y el servicio de Rappi no es completamente evidente para el buyer persona 4-5-6. Genera curiosidad, pero la recordación puede diluirse si el usuario no entiende rápidamente el mensaje. Falta un puente claro entre tendencia y propuesta de valor.",
    suggestions: [
      {
        title: "Claridad del mensaje",
        description:
          "El copy es fuerte culturalmente, pero no explica qué significa para el usuario. Agregar una línea secundaria que conecte con el beneficio (ej: simplificar, no perder oportunidades, pedir a tiempo).",
      },
      {
        title: "Vínculo más directo con el servicio",
        description:
          "La pieza no comunica explícitamente qué se está invitando a pedir. Podría incluir una categoría (supermercado, antojos, mercado premium) para aterrizar el mensaje.",
      },
      {
        title: "Mayor protagonismo emocional",
        description:
          "El buyer persona responde a comodidad y status. Elevar el tono aspiracional podría reforzar conexión con ese segmento.",
      },
      {
        title: "Refuerzo de branding",
        description:
          "El logo está presente, pero podría integrarse mejor al concepto visual para que la recordación no dependa solo de los objetos físicos.",
      },
      {
        title: "Call to action implícito",
        description:
          "Si el objetivo es recordación, igual conviene dejar una acción sugerida sutil (ej: 'Pídelo hoy') para convertir awareness en intención.",
      },
      {
        title: "Contexto cultural más evidente",
        description:
          "No todos asociarán inmediatamente la referencia al álbum. Un guiño más claro (sin infringir derechos) podría potenciar el reconocimiento.",
      },
      {
        title: "Optimización para Instagram",
        description:
          "Evaluar versión carrusel o reel corto para explicar la idea en 2-3 piezas. En feed estático puede perder fuerza narrativa.",
      },
      {
        title: "Jerarquía visual",
        description:
          "El texto compite con el fondo. Un mayor contraste o bloque de color podría mejorar legibilidad en scroll rápido.",
      },
      {
        title: "Insight más cercano al usuario",
        description:
          "El mensaje habla desde la tendencia, no desde el problema real del usuario (tiempo, tráfico, filas). Integrar ese dolor haría más poderosa la recordación.",
      },
      {
        title: "Test A/B cultural vs funcional",
        description:
          "Comparar esta versión cultural con una versión más funcional permitiría medir si realmente genera mayor recordación en el segmento.",
      },
    ],
  };

  return (
    <SessionProvider session={session}>
      <div className="bg-white text-neutral-600">
        <div className=" py-3 px-5 lg:px-10 xl:px-20 xl:w-[1280px] mx-auto">
          <div className="relative z-10 min-h-screen pb-10 flex flex-col  ">
            <Header />

            <div className=" fixed w-full h-screen bg-black/30 left-0 top-0 z-[70] backdrop-blur-md py-10 px-10">
              <div className="flex justify-center items-center gap-5 w-full h-full ">
                <div className="  bg-white rounded-3xl max-h-screen h-full   ">
                  <div className=" px-5  h-full flex flex-col ">
                    <div className="flex justify-start items-center w-full py-5 gap-3">
                      <img
                        src={company.logo}
                        className="w-8 h-8 rounded-xl"
                        alt={company.name}
                      />
                      <span className="text-lg text-black">{company.name}</span>
                    </div>
                    <div className="border border-neutral-200 rounded-3xl py-3 flex-1 overflow-hidden justify-center flex">
                      <img
                        src="/a1.jpg"
                        className="h-full max-h-full  object-contain"
                      />
                    </div>
                    <div className="py-5 flex justify-start items-center gap-3">
                      <div className="px-3 py-2 rounded-full bg-neutral-600 text-white">
                        Recordación
                      </div>

                      <div className="px-3 py-2 rounded-full bg-neutral-600 text-white">
                        Instagram
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-3xl min-w-[50%] max-h-full overflow-y-auto">
                  <div className="flex flex-col divide-y divide-neutral-200 pr-2">
                    {score.suggestions.map((suggestion, index) => (
                      <Suggestion key={index} suggestion={suggestion} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Footer />
        </div>
      </div>
    </SessionProvider>
  );
}
