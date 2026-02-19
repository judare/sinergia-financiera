import { Header } from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import Hero from "./components/Hero";
import { SessionProvider } from "../providers/Session";
import { getServerSession } from "@/lib/sessionServer";

export const Feature = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <div className="w-full">
      <div className="rounded-2xl bg-neutral-100 w-full h-[300px]"></div>
      <div className="text-center text-xl font-bold text-neutral-900 mt-5">
        {title}
      </div>
      <p className="text-center text-neutral-600">{description}</p>
    </div>
  );
};
export default async function Landing() {
  const session = await getServerSession();

  return (
    <SessionProvider session={session}>
      <div className="bg-white text-neutral-600">
        <div className=" py-3 mx-auto">
          <div className="relative z-10 min-h-screen pb-10 flex flex-col  ">
            <Header className="md:h-0" />

            <Hero />
          </div>

          <div className="flex items-center gap-10 mt-20 mb-20 mx-20 ">
            <Feature
              title="Mejora tus anuncios"
              description="Crear tu propio anuncio"
            />
            <Feature
              title="Mejora tus anuncios"
              description="Crear tu propio anuncio"
            />
            <Feature
              title="Mejora tus anuncios"
              description="Crear tu propio anuncio"
            />
          </div>

          <div className="">
            <Footer />
          </div>
        </div>
      </div>
    </SessionProvider>
  );
}
