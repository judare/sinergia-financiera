"use client";

import { useEffect, useRef, useState } from "react";
import { useApi } from "@/app/hooks/useApi";
import { saveAssetsDelivery } from "@/app/services/onboarding";
import DS from "@/ds";
import ConfirmToast from "@/app/components/UI/ConfirmToast";

export type AssetType = "software" | "uniform" | "equipment" | "stationery";

type AssetItem = {
  itemName: string;
  serialNumber: string;
  licenseKey: string;
  size: string;
  quantity: string;
  isDelivered: boolean;
};

const CONFIG: Record<
  AssetType,
  { label: string; itemLabel: string; fields: (keyof AssetItem)[] }
> = {
  software: {
    label: "Licencias de software",
    itemLabel: "Licencia",
    fields: ["itemName", "licenseKey", "isDelivered"],
  },
  uniform: {
    label: "Uniformes",
    itemLabel: "Uniforme",
    fields: ["itemName", "size", "isDelivered"],
  },
  equipment: {
    label: "Equipos y hardware",
    itemLabel: "Equipo",
    fields: ["itemName", "serialNumber", "isDelivered"],
  },
  stationery: {
    label: "Papelería y mobiliario",
    itemLabel: "Artículo",
    fields: ["itemName", "quantity", "isDelivered"],
  },
};

const emptyItem = (): AssetItem => ({
  itemName: "",
  serialNumber: "",
  licenseKey: "",
  size: "",
  quantity: "",
  isDelivered: false,
});

export default function AssetsDelivery({
  onboardingId,
  assetType,
  initialAssets,
}: {
  onboardingId: number;
  assetType: AssetType;
  initialAssets: any[];
}) {
  const toastRef = useRef<any>(null);
  const { callApi: save, loading } = useApi(saveAssetsDelivery);
  const [items, setItems] = useState<AssetItem[]>([]);

  const config = CONFIG[assetType];

  useEffect(() => {
    const filtered = initialAssets?.filter((a) => a.assetType === assetType) ?? [];
    if (filtered.length) {
      setItems(
        filtered.map((a: any) => ({
          itemName: a.itemName ?? "",
          serialNumber: a.serialNumber ?? "",
          licenseKey: a.licenseKey ?? "",
          size: a.size ?? "",
          quantity: a.quantity != null ? String(a.quantity) : "",
          isDelivered: a.isDelivered ?? false,
        }))
      );
    }
  }, [initialAssets, assetType]);

  const addItem = () => setItems([...items, emptyItem()]);

  const removeItem = (index: number) =>
    setItems(items.filter((_, i) => i !== index));

  const updateItem = (index: number, field: keyof AssetItem, value: string | boolean) => {
    setItems(items.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  };

  const handleSave = async () => {
    const invalid = items.find((i) => !i.itemName.trim());
    if (invalid) {
      toastRef.current?.show("Todos los elementos deben tener nombre", "error");
      return;
    }
    const payload = items.map((item) => ({
      itemName: item.itemName,
      serialNumber: item.serialNumber || null,
      licenseKey: item.licenseKey || null,
      size: item.size || null,
      quantity: item.quantity ? Number(item.quantity) : null,
      isDelivered: item.isDelivered,
    }));
    const result = await save({ id: onboardingId, assetType, assetsDelivery: payload });
    if (result !== undefined) {
      toastRef.current?.show("Guardado correctamente", "success");
    }
  };

  const hasField = (field: keyof AssetItem) => config.fields.includes(field);

  return (
    <div className="flex flex-col gap-4">
      <ConfirmToast ref={toastRef} />
      <div className="flex flex-col gap-3">
        {items.length === 0 && (
          <p className="text-sm text-neutral-400 text-center py-4">
            No hay {config.label.toLowerCase()} registrados. Agrega uno con el botón de abajo.
          </p>
        )}
        {items.map((item, index) => (
          <div
            key={index}
            className="flex flex-col gap-3 px-4 py-4 bg-neutral-100 rounded-lg"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-neutral-600">
                {config.itemLabel} #{index + 1}
              </span>
              <button
                onClick={() => removeItem(index)}
                className="text-xs text-red-500 hover:text-red-700"
              >
                Eliminar
              </button>
            </div>

            <DS.Input
              label="Nombre"
              value={item.itemName}
              onChange={(v: string) => updateItem(index, "itemName", v)}
            />

            {hasField("licenseKey") && (
              <DS.Input
                label="Clave de licencia"
                value={item.licenseKey}
                onChange={(v: string) => updateItem(index, "licenseKey", v)}
              />
            )}

            {hasField("serialNumber") && (
              <DS.Input
                label="Número de serie"
                value={item.serialNumber}
                onChange={(v: string) => updateItem(index, "serialNumber", v)}
              />
            )}

            {hasField("size") && (
              <DS.Input
                label="Talla"
                value={item.size}
                onChange={(v: string) => updateItem(index, "size", v)}
              />
            )}

            {hasField("quantity") && (
              <DS.Input
                label="Cantidad"
                value={item.quantity}
                type="number"
                onChange={(v: string) => updateItem(index, "quantity", v)}
              />
            )}

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
          text={`+ Agregar ${config.itemLabel.toLowerCase()}`}
          variant="secondary"
          size="md"
          onClick={addItem}
        />
        <DS.Button
          text="Guardar"
          variant="primary"
          size="md"
          loading={loading}
          onClick={handleSave}
        />
      </div>
    </div>
  );
}
