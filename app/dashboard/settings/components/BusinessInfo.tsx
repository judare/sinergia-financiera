"use client";
import { useState, useEffect } from "react";
import { useContext, useContextSelector } from "use-context-selector";
import DS from "design-system";
import { useApi } from "@/app/hooks/useApi";
import { updateBusiness, fetchCountries } from "@/app/services/users";
import { Save } from "lucide-react";
import Card from "./Card";
import FloatBox from "@/app/components/UI/FloatBox";
import { Context } from "@/app/providers/Session";

export default function BusinessInfo({}: any) {
  const { loading, errors, callApi: callSave } = useApi(updateBusiness);
  const { callApi: callCountries } = useApi(fetchCountries);
  const [form, setForm]: any = useState({ hasChanges: false });
  const { business, getBusiness }: any = useContext(Context);
  const [countries, setCountries]: any = useState([]);
  const showToastConfirm = useContextSelector(
    Context,
    (a) => a.showToastConfirm,
  );

  useEffect(() => {
    setForm({
      ...business,
      hasChanges: false,
    });
  }, [business]);

  const handleSave = () => {
    callSave(form)
      .then(() => {
        getBusiness();
        showToastConfirm("Cambios guardados");
        setForm({ ...form, hasChanges: false });
      })
      .catch((e) => {
        showToastConfirm(e?.message, "error");
      });
  };

  const setFormWrapper = (data: any) => {
    setForm({
      ...form,
      ...data,
      hasChanges: true,
    });
  };

  useEffect(() => {
    setForm({
      ...business,
      hasChanges: false,
    });
  }, [business]);

  useEffect(() => {
    callCountries().then((result) => {
      setCountries(result.Countries || []);
    });
  }, []);

  return (
    <>
      <FloatBox showing={form.hasChanges}>
        <div className="py-3 px-3 flex items-center gap-2 justify-between text-neutral-600 font-light">
          <div className="shrink-0">Cambios sin guardar</div>

          <DS.Button
            onClick={() => handleSave()}
            loading={loading}
            text="Guardar"
            variant="primary"
            size="md"
            icon={Save}
          />
        </div>
      </FloatBox>

      <Card
        title="Información para la facturación"
        subtitle="Edita tu información de la empresa"
        body={
          <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-3 gap-3 mt-5">
            <DS.Input
              type="text"
              value={form.name}
              label="Nombre"
              error={errors?.name}
              onChange={(val: string) => {
                setFormWrapper({ ...form, name: val });
              }}
            />
            <DS.Input
              type="email"
              value={form.billEmail}
              error={errors?.billEmail}
              label="Email"
              onChange={(billEmail: string) => {
                setFormWrapper({ ...form, billEmail });
              }}
            />

            <DS.Select
              value={form.countryId}
              error={errors?.countryId}
              label="País"
              onChange={(countryId: string) => {
                setFormWrapper({ ...form, countryId });
              }}
            >
              <option value="NA">Seleccionar país</option>
              {countries.map((country: any, index: number) => (
                <option key={index} value={country.id}>
                  {country.name}
                </option>
              ))}
            </DS.Select>

            <DS.Input
              type="text"
              value={form.city}
              error={errors?.city}
              label="Ciudad"
              onChange={(city: string) => {
                setFormWrapper({ ...form, city });
              }}
            />

            <DS.Input
              type="text"
              value={form.address}
              label="Dirección"
              error={errors?.address}
              onChange={(val: string) => {
                setFormWrapper({ ...form, address: val });
              }}
            />

            <DS.Input
              type="text"
              value={form.website}
              error={errors?.website}
              label="Website"
              onChange={(website: string) => {
                setFormWrapper({ ...form, website });
              }}
            />

            <DS.Select
              value={form.vatType}
              error={errors?.vatType}
              label="VAT Type"
              onChange={(vatType: string) => {
                setFormWrapper({ ...form, vatType });
              }}
            >
              <option value="">Seleccione una opción</option>
              <option value="usa-ein">EIN Number (USA)</option>
              <option value="colombian-nit">NIT Number (Colombian)</option>
            </DS.Select>

            <DS.Input
              type="text"
              value={form.vatNumber}
              label="VAT Number"
              placeholder=""
              error={errors?.vatNumber}
              onChange={(vatNumber: string) => {
                setFormWrapper({ ...form, vatNumber });
              }}
            />
          </div>
        }
      />
    </>
  );
}
