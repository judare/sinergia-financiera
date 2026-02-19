"use client";
import { useRef, useState } from "react";
import DS from "design-system";
import { KeyIcon } from "lucide-react";
import { rollKey } from "@/app/services/keys";
import { useApi } from "@/app/hooks/useApi";

function CreateKey() {
  const ref = useRef<any>(null);
  const { callApi, responded } = useApi(rollKey);
  const [form, setForm] = useState<any>({
    name: "",
  });

  const rollKeyApi = () => {
    callApi(form).then((result) => {
      ref.current.hideModal();
    });
  };

  const handleClick = () => {
    ref.current.showModal();
  };

  return (
    <div>
      <DS.Button
        variant="primary"
        text="Crear nuevo"
        icon={KeyIcon}
        onClick={handleClick}
      />

      <DS.Modal
        title="Crear nuevo API Key"
        open={false}
        onClose={() => {}}
        className="w-full"
        ref={ref}
        size="sm"
        footer={
          <DS.Button
            variant="primary"
            text="Crear"
            className="w-full"
            icon={KeyIcon}
            onClick={rollKeyApi}
          />
        }
      >
        <DS.Input
          label="Etiqueta"
          placeholder="Etiqueta del API Key"
          className="w-full"
          value={form.label}
          onChange={(e) => setForm({ ...form, label: e })}
        />
      </DS.Modal>
    </div>
  );
}

export default CreateKey;
