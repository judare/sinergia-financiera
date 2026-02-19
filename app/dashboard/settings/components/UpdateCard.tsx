"use client";
import { useEffect, useRef, useState } from "react";
import DS from "design-system";
import { Check, Ellipsis, Landmark } from "lucide-react";
import {
  addCard,
  listPaymentMethods,
  removePaymentMethods,
  makeDefaultPaymentMethods,
} from "@/app/services/users";
import { CircleUser } from "lucide-react";
import Card from "./Card";
import { useApi } from "@/app/hooks/useApi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/app/components/UI/Dropdown";
import IconTools from "@/core/components/DS/IconTools";

export default function UpdateCard() {
  const [form, setForm]: any = useState({
    creditCardExpiryMonth: "01",
    creditCardExpiryYear: "30",
  });
  const [paymentMethods, setPaymentMethods]: any = useState([]);
  const [error, setError]: any = useState(null);
  const [loading, setLoading] = useState(false);
  const modalRef: any = useRef(null);
  const { callApi: callList } = useApi(listPaymentMethods);
  const { callApi: callRemove } = useApi(removePaymentMethods);
  const { callApi: callMakeDefault } = useApi(makeDefaultPaymentMethods);

  const range = (start: number, finish: number) => {
    let arr = [];
    for (let i = start; i < finish; i++) {
      arr.push(i);
    }
    return arr;
  };

  const getPaymentMethods = () => {
    callList().then((result: any) => {
      setPaymentMethods(result.data.PaymentMethods);
    });
  };

  useEffect(() => {
    getPaymentMethods();
  }, []);
  /*
    We don't save your credit cards in our database. Instead, we tokenize your cards using an external service, and we only send the token.
  */
  const formAction = async () => {
    setLoading(true);
    setError(null);
    try {
      let result: any = await fetch(
        process.env.NEXT_PUBLIC_WOMPI_TOKENIZE_URL || "",
        {
          headers: {
            Authorization: "Bearer " + process.env.NEXT_PUBLIC_WOMPI_PUB_KEY,
          },
          method: "POST",
          body: JSON.stringify({
            number: form.creditCardNumber,
            cvc: form.creditCardCVC,
            exp_month: form.creditCardExpiryMonth,
            exp_year: form.creditCardExpiryYear,
            card_holder: form.creditCardPlaceHolder,
          }),
        },
      );
      result = await result.json();
      if (result.error) {
        throw { message: "Invalid fields " };
      }

      // we only save the card token and last_four digits
      await addCard({
        token: result.data.id,
        lastFour: result.data.last_four,
        expiryMonth: form.creditCardExpiryMonth,
        expiryYear: form.creditCardExpiryYear,
        brand: result.data.brand,
      });
      getPaymentMethods();
      modalRef.current.hideModal();
      setForm({});
    } catch (err: any) {
      console.log(err);
      setError(err.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  const removePaymentMethod = (paymentMethodId: any) => {
    callRemove({ paymentMethodId }).then(() => {
      getPaymentMethods();
    });
  };

  const makeDefault = (paymentMethodId: any) => {
    callMakeDefault({ paymentMethodId }).then(() => {
      getPaymentMethods();
    });
  };

  return (
    <>
      <Card
        title="Editar tarjeta de crédito"
        subtitle={
          <div className="flex gap-5 justify-between items-center w-full">
            <p className=" text-sm font-light text-neutral-500">
              Puedes editar los detalles de tu tarjeta de crédito aquí.
            </p>
            <div>
              <DS.Button
                text="Añadir tarjeta"
                onClick={() => {
                  modalRef.current.showModal();
                }}
                variant="primary"
                size="sm"
                className="w-full"
                icon={Landmark}
              />
            </div>
          </div>
        }
        body={
          paymentMethods?.length > 0 && (
            <div className="mt-5 flex flex-col gap-3 divide-y divide-white/10">
              {paymentMethods.map((pm: any) => (
                <div
                  key={pm.id}
                  className="grid grid-cols-12 gap-3 text-black text-sm font-light py-2"
                >
                  <div className="flex gap-2 items-center col-span-6">
                    <IconTools
                      icon={pm.brand?.toLowerCase()}
                      className="size-6 shrink-0"
                    />
                    <div>
                      {pm.brand}{" "}
                      <span className="text-neutral-400">{pm.name}</span>
                      {pm.isDefault && (
                        <div className="inline-block mt-1">
                          <div className="bg-black text-white px-3 py-0.5 rounded-lg text-xs flex items-center gap-2">
                            <Check className="w-4 h-4" />
                            <div>Predeterminada</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-neutral-400 col-span-5">
                    <div>
                      Valida hasta{" "}
                      <span className="text-black">
                        {pm.expiryMonth}/{pm.expiryYear}
                      </span>
                    </div>
                    <div>
                      Último uso{" "}
                      <span className="text-black">{pm.lastUseAt}</span>
                    </div>
                  </div>

                  <div className="col-span-1">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="h-full outline-none">
                        <Ellipsis
                          className="size-6 text-neutral-400 hover:text-neutral-500"
                          onClick={() => {
                            // setMenu(pm.id);/
                          }}
                        />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent sideOffset={0} className=" mb-3  ">
                        <DropdownMenuItem
                          onClick={() => {
                            removePaymentMethod(pm.id);
                          }}
                          className="items-center flex gap-2"
                        >
                          Eliminar tarjeta
                        </DropdownMenuItem>
                        {!pm.isDefault && (
                          <DropdownMenuItem
                            onClick={() => {
                              makeDefault(pm.id);
                            }}
                            className="items-center flex gap-2"
                          >
                            Hacer predeterminada
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )
        }
      />

      <DS.Modal
        title="Añadir tarjeta"
        darkMode={true}
        footer={
          <DS.Button
            disabled={
              !form.creditCardNumber ||
              !form.creditCardPlaceHolder ||
              !form.creditCardExpiryYear ||
              !form.creditCardExpiryMonth
            }
            text="Guardar"
            icon={CircleUser}
            type="submit"
            variant="primary"
            className="w-full"
            size="lg"
            loading={loading}
            onClick={formAction}
          />
        }
        size="sm"
        ref={modalRef}
      >
        <div className="0">
          <div className="flex flex-col gap-5">
            {error && <div className="text-red-400">{error}</div>}
            <DS.Input
              type="text"
              value={form.creditCardNumber}
              label="Número de tarjeta"
              onChange={(val: string) => {
                setForm({ ...form, creditCardNumber: val });
              }}
            />

            <DS.Input
              type="text"
              value={form.creditCardPlaceHolder}
              label="Nombre en la tarjeta"
              onChange={(val: string) => {
                setForm({ ...form, creditCardPlaceHolder: val });
              }}
            />

            <div className="grid grid-cols-12 gap-3">
              <div className="col-span-4">
                <DS.Select
                  value={form.creditCardExpiryMonth}
                  label="Mes"
                  onChange={(val: string) => {
                    setForm({ ...form, creditCardExpiryMonth: val });
                  }}
                >
                  <option value={undefined} disabled>
                    00
                  </option>
                  {[
                    "01",
                    "02",
                    "03",
                    "04",
                    "05",
                    "06",
                    "07",
                    "08",
                    "09",
                    "10",
                    "11",
                    "12",
                  ].map((month) => (
                    <option value={month} key={month}>
                      {month}
                    </option>
                  ))}
                </DS.Select>
              </div>
              <div className="col-span-4">
                <DS.Select
                  value={form.creditCardExpiryYear}
                  label="Año"
                  onChange={(val: string) => {
                    setForm({ ...form, creditCardExpiryYear: val });
                  }}
                >
                  <option value={undefined} disabled>
                    00
                  </option>
                  {range(25, 50).map((year) => (
                    <option value={year} key={year}>
                      {year}
                    </option>
                  ))}
                </DS.Select>
              </div>
              <div className="col-span-4">
                <DS.Input
                  type="text"
                  value={form.creditCardCVC}
                  label="CVV"
                  onChange={(val: string) => {
                    setForm({ ...form, creditCardCVC: val });
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </DS.Modal>
    </>
  );
}
