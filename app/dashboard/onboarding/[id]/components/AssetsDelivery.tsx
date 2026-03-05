"use client";

import { useEffect, useRef, useState } from "react";
import { useApi } from "@/app/hooks/useApi";
import { updateOnboardingApi } from "@/app/services/onboarding";
import DS from "@/ds";
import ConfirmToast from "@/app/components/UI/ConfirmToast";

type AssetItem = {
  itemName: string;
  serialNumber: string;
  isDelivered: boolean;
};

const emptyItem = (): AssetItem => ({
  itemName: "",
  serialNumber: "",
  isDelivered: false,
});

export default function AssetsDelivery({
  onboardingId,
  initialAssets,
}: {
  onboardingId: number;
  initialAssets: any[];
}) {
  const toastRef = useRef<any>(null);
  const { callApi: save, loading } = useApi(updateOnboardingApi);
  const [items, setItems] = useState<AssetItem[]>([]);

  useEffect(() => {
    if (initialAssets?.length) {
      setItems(
        initialAssets.map((a: any) => ({
          itemName: a.itemName,
          serialNumber: a.serialNumber || "",
          isDelivered: a.isDelivered ?? false,
        }))
      );
    }
  }, [initialAssets]);

  const addItem = () => setItems([...items, emptyItem()]);

  const removeItem = (index: number) =>
    setItems(items.filter((_, i) => i !== index));

  const updateItem = (index: number, field: keyof AssetItem, value: any) => {
    setItems(items.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  };

  const handleSave = async () => {
    const invalid = items.find((i) => !i.itemName.trim());
    if (invalid) {
      toastRef.current?.show("Todos los activos deben tener nombre", "error");
      return;
    }
    const result = await save({ id: onboardingId, assetsDelivery: items });
    if (result !== undefined) {
      toastRef.current?.show("Activos guardados correctamente", "success");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <ConfirmToast ref={toastRef} />
      <div className="flex flex-col gap-3">
        {items.length === 0 && (
          <p className="text-sm text-neutral-400 text-center py-4">
            No hay activos registrados. Agrega uno con el botón de abajo.
          </p>
        )}
        {items.map((item, index) => (
          <div
            key={index}
            className="flex flex-col gap-3 px-4 py-4 bg-neutral-100 rounded-lg"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-neutral-600">
                Activo #{index + 1}
              </span>
              <button
                onClick={() => removeItem(index)}
                className="text-xs text-red-500 hover:text-red-700"
              >
                Eliminar
              </button>
            </div>
            <DS.Input
              label="Nombre del activo"
              value={item.itemName}
              onChange={(v: string) => updateItem(index, "itemName", v)}
            />
            <DS.Input
              label="Número de serie (opcional)"
              value={item.serialNumber}
              onChange={(v: string) => updateItem(index, "serialNumber", v)}
            />
            <div className="flex items-center gap-2">
              <DS.Checkbox
                value={item.isDelivered}
                onChange={() => updateItem(index, "isDelivered", !item.isDelivered)}
              />
              <span className="text-sm text-neutral-700">Entregado</span>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-3">
        <DS.Button
          text="+ Agregar activo"
          variant="secondary"
          size="md"
          onClick={addItem}
        />
        <DS.Button
          text="Guardar activos"
          variant="primary"
          size="md"
          loading={loading}
          onClick={handleSave}
        />
      </div>
    </div>
  );
}
