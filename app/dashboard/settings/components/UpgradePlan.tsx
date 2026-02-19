"use client";
import { useEffect, useState } from "react";
import DS from "design-system";
import {
  Check,
  ChevronUp,
  Database,
  File,
  PhoneCall,
  User,
  Code,
  MessageSquare,
  Headphones,
  DollarSign,
  Headset,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { fetchPlans } from "@/app/services/bill";
import { useApi } from "@/app/hooks/useApi";
import { useSession } from "@/app/hooks/useSession";
import Tabs from "@/app/components/UI/Tabs";
import { AudioWaveform, PersonStanding } from "lucide-react";
import CheckboxForm from "@/core/components/DS/Form/Checkbox";
import { motion, useMotionValue, animate } from "framer-motion";

const ItemFeature = ({ label, Icon }: any) => {
  return (
    <li className="flex gap-3 items-center md:text-sm text-xs">
      <Icon className="size-5" />
      <span>{label}</span>
    </li>
  );
};

// import { useEffect, useState } from "react";
// import { animate, useMotionValue } from "framer-motion";

export function PriceNumber({
  isYearly,
  annual,
  month,
}: {
  isYearly: boolean;
  annual: number;
  month: number;
}) {
  const [display, setDisplay] = useState(isYearly ? annual : month);
  const mv = useMotionValue(display);

  useEffect(() => {
    const target = isYearly ? month : annual;

    const controls = animate(mv, target, {
      duration: 0.4,
      onUpdate: (v) => setDisplay(Math.round(v)),
    });

    return () => controls.stop();
  }, [isYearly, annual, month]);

  return <span>${display}</span>;
}

export default function UpgradePlan({}: any) {
  const { data: session }: any = useSession();
  const [plans, setPlans] = useState([]);
  const { callApi } = useApi(fetchPlans);
  const router = useRouter();
  const [type, setType] = useState("ai");
  const [isYearly, setIsYearly] = useState(true);

  const currentPlan = session?.plan;

  useEffect(() => {
    callApi().then((result) => {
      setPlans(result);
    });
  }, []);

  const showingPlans = plans.filter((plan: any) => {
    return type == "ai" || plan.pricePerAgent;
  });

  const currentId = currentPlan?.id || 3;

  return (
    <div className="bg-white py-10 lg:py-10   md:bg-cover bg-no-repeat bg-bottm  h-full flex flex-col border-x border-neutral-200  ">
      <div className="mb-5 text-center flex gap-3 flex-col  mx-auto w-full">
        <h2 className="text-3xl lg:text-5xl md:text-4xl font-medium text-neutral-800  text-pretty mb-5 md:w-2/4  mx-auto">
          {!session?.user && <> Planes de Talkia</>}
          {session?.user && <>¿Quieres más para {session?.business?.name}?</>}
        </h2>
        {/* <p className="text-xl text-balance mt-5 mb-5">
          Puedes empezar gratis, no solicitamos tarjeta de crédito
        </p> */}

        <div className="grid grid-cols-1 md:grid-cols-12 px-5">
          <Tabs
            tabs={[
              {
                tab: "ai",
                name: "Agentes Voz",
                icon: () => (
                  <div className="text-white size-5 rounded-md bg-blue-500 flex items-center justify-center">
                    <AudioWaveform className="size-4" />
                  </div>
                ),
              },
              {
                tab: "humans",
                name: "Agentes humanos",
                icon: () => (
                  <div className="text-white size-5 rounded-md bg-indigo-500 flex items-center justify-center">
                    <PersonStanding className="size-4" />
                  </div>
                ),
              },
            ]}
            currentTab={type}
            onSelect={setType}
            className="justify-center rounded-xl  border border-neutral-200 shadow-sm  mx-auto col-span-8"
          />

          <div className="flex items-center gap-2 ml-auto col-span-4">
            <CheckboxForm
              label="Pago anual"
              value={isYearly}
              onChange={setIsYearly}
            />
            {/* {isYearly && ( */}
            <div
              className={`px-3 py-1 rounded-lg  text-sm select-none ${
                isYearly
                  ? "bg-lime-200 text-lime-800"
                  : "bg-neutral-200 text-neutral-800"
              }`}
            >
              {isYearly ? 2 : 0} meses gratis
            </div>
            {/* )} */}
          </div>
        </div>
      </div>

      <div className="flex items-center w-full py-5 divide-x divide-neutral-300 lg:flex-nowrap flex-wrap  ">
        {showingPlans.map((plan: any, index: number) => (
          <motion.div
            key={plan.id}
            className={`px-5 py-5 mx-auto text-black   border-y border-neutral-300 h-full to-40% ${
              plan.id == currentId ? "bg-gradient-to-b  to-white" : ""
            } ${type == "ai" ? " from-blue-100 " : "from-indigo-100"}
             ${plan.price <= currentPlan?.price ? "grayscalee" : ""}`}
            transition={{
              duration: 0.2,
              delay: 0.03 * index,
              ease: [0, 0.71, 0.2, 1.01],
            }}
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="border-b border-neutral-300 py-3">
              <div className="flex items-center gap-2 ">
                <h2 className="font-bold text-lg uppercase">{plan.label}</h2>
                {currentId == plan.id && (
                  <div
                    className={` rounded-md px-3 py-1 text-[0.5rem] uppercase ml-auto text-white ${
                      type == "ai" ? "bg-blue-500" : "bg-indigo-500"
                    }`}
                  >
                    {currentPlan?.id ? "Plan actual" : "Más popular"}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 ">
                <div className="font-bold text-2xl uppercase ">
                  <PriceNumber
                    isYearly={isYearly}
                    annual={plan.price}
                    month={Math.round(plan.priceYearly / 12)}
                  />
                  {/* ${isYearly ? Math.round(plan.priceYearly / 12) : plan.price} */}
                </div>
                <div className="font-light text-neutral-500">/ mes</div>
                {isYearly && (
                  <div className="font-light text-sm text-neutral-500 ml-auto">
                    Pago anual
                  </div>
                )}
              </div>
            </div>

            <div className="mb-5 font-light mt-5">
              <ul className="text-sm flex flex-col gap-3 font-light text-neutral-600">
                {type == "ai" && (
                  <ItemFeature
                    label={`${plan.includedMinutes} minutos`}
                    Icon={Check}
                  />
                )}
                {type == "humans" && (
                  <ItemFeature
                    label={`${plan.includedAgents} agentes incluidos`}
                    Icon={Headphones}
                  />
                )}
                {type == "humans" && (
                  <ItemFeature
                    label={`$${plan.pricePerAgent} por agente extra`}
                    Icon={DollarSign}
                  />
                )}

                <ItemFeature
                  label={`${plan.limitCustomers} clientes`}
                  Icon={User}
                />

                <ItemFeature
                  label={`${plan.limitDatasources} conectores`}
                  Icon={Database}
                />

                <ItemFeature
                  label={`${plan.retentionDays} días de retención`}
                  Icon={File}
                />
                {type == "ai" && (
                  <ItemFeature
                    label={
                      <span>
                        {plan.priceExtraMinute > 0 ? (
                          <span>
                            ${plan.priceExtraMinute} Precio por minuto extra
                          </span>
                        ) : (
                          " Sin minutos extra"
                        )}
                      </span>
                    }
                    Icon={PhoneCall}
                  />
                )}

                <ItemFeature
                  label="Transcripciones y grabaciones"
                  Icon={MessageSquare}
                />

                <ItemFeature
                  label="Resumen y calificación de llamadas"
                  Icon={Check}
                />

                <ItemFeature
                  label="Tu propio número de teléfono"
                  Icon={PhoneCall}
                />

                <ItemFeature label="Uso del API" Icon={Code} />
              </ul>
            </div>

            <DS.Button
              text={session?.user?.rol ? "Cambiar plan" : "Comenzar"}
              icon={ChevronUp}
              onClick={() => {
                if (session?.user?.rol) {
                  router.push("/dashboard/settings#invoice");
                } else {
                  router.push("/register");
                }
              }}
              disabled={plan.id == currentPlan?.id}
              variant={`${
                plan.price < currentPlan?.price ? "secondary" : "primary"
              }`}
              size="md"
              className="w-full"
            />

            <p className="text-xs md:text-sm font-light text-neutral-500 mt-5">
              Si actualizas tu plan, tu cotización de facturación se prorrateará
            </p>
          </motion.div>
        ))}
      </div>
      <div className="py-10 px-5 border-neutral-200 border-b flex flex-wrap items-center justify-between gap-5">
        <div>
          <h2 className="text-xl text-black font-bold mb-2">
            ¿NECESITAS UN PLAN A LA MEDIDA?
          </h2>
          <p className="font-light text-sm text-balance">
            Podemos adaptarnos exactamente a las necesidades de tu negocio. Si
            requieres más capacidad, integraciones especiales o un modelo
            flexible, nuestro equipo puede ayudarte a diseñar un plan
            personalizado que se ajuste a tu operación y presupuesto. Hablemos y
            construyamos la solución que realmente necesitas.
          </p>
        </div>
        <DS.Button
          text="Hablar con ventas"
          icon={Headset}
          href="https://wa.me/3222901435"
          target="_blank"
          variant="primary"
          className="lg:min-w-64"
        />
      </div>
    </div>
  );
}
